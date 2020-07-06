package com.github.nicksetzer.daedalus.runtracker;

import android.content.Context;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class LocationTracker {

    private static final double R = 6371e3;
    private static final double PI = Math.PI;
    private static final double DEG2RAD = PI/180.0;
    private static final double MIN_DELTA_M = 2.0;

    private final double epsilon = 1e-6;
    private final double pace_maximum_spm = 4.0;

    private double m_current_lat = 0;
    private double m_current_lon = 0;
    private long m_time_previous_sample = 0;
    private double m_total_distance_meters = 0;
    private boolean m_first_event = true;
    private long m_event_counter = 0;
    private long m_dropped_event_counter = 0;

    private long m_time_start = 0;
    private long m_end_time = 0;
    private long m_time_elapsed = 0;

    private long m_current_split = 0;

    private long m_uid = 0;
    private boolean m_paused = false;
    private boolean m_isAccurate = false;

    LocationLogger m_logger;

    private CurrentPaceTracker m_paceTracker;

    private Database m_database;

    public LocationTracker(Context ctxt, Database database, long uid) {
        m_uid = uid;
        m_paceTracker = new CurrentPaceTracker();
        m_database = database;

        m_logger = new LocationLogger(ctxt, database);
    }

    public void enableLogging(boolean enabled) {
        Log.info("set logging enabled: " + enabled);
        m_logger.setEnabled(enabled);
    }

    public void setAccurate(boolean isAccurate) {
        // true when GPS is used for location updates
        m_isAccurate = isAccurate;
    }

    public boolean isPaused() {
        // true when the user has paused location tracking
        return m_paused;
    }

    public void pause() {
        if (!m_paused) {
            m_paused = true;
            m_time_elapsed += (System.currentTimeMillis() - m_time_start);
            m_time_start = 0;
            m_paceTracker.clear();
        }
    }

    public void resume() {
        if (m_paused) {
            m_paused = false;
            m_first_event = true;
            m_time_start = System.currentTimeMillis();
        }
    }

    public void reset() {
        m_current_lat = 0;
        m_current_lon = 0;
        m_time_previous_sample = 0;
        m_total_distance_meters = 0;

        m_first_event = true;
        m_dropped_event_counter = 0;

        m_time_start = 0;
        m_time_elapsed = 0;
        m_paused = false;

        m_current_split = 0;

        m_paceTracker.reset();
        Log.info("reset tracker");
    }

    public void begin() {
        m_logger.begin();
    }

    public void end() {

        JSONObject status = jsonStatus();



        //m_database.m_runsTable.insert(status);
        m_logger.end(status);

        reset();
    }

    /**
     *
     * @param lat
     * @param lon
     * @param alt
     * @param spd
     * @param acc  speed accuracy: 1 indicates 68% accuracy that the true speed is spd+/-1
     */
    public void push(double lat, double lon, double alt, float spd, float acc) {

        double distance = 0.0;
        long delta_t = 0;
        long current_time = System.currentTimeMillis();

        if (!m_first_event) {
            distance = calculateDistanceMeters(m_current_lat, m_current_lon, lat, lon);
            delta_t = current_time - m_time_previous_sample;
        }

        m_current_lat = lat;
        m_current_lon = lon;
        m_time_previous_sample = current_time;

        boolean drop = false;

        if (!m_paused && !m_first_event && distance < MIN_DELTA_M) {
            drop = true;
            m_dropped_event_counter += 1;
        }

        //if (m_loggingEnabled) {
        m_logger.push(lat, lon, alt, current_time, delta_t, distance, spd, acc, m_current_split, m_paused, m_paused || drop);
        //}

        m_paceTracker.push(distance, delta_t);

        if (m_paused || drop) {
            return;
        }

        m_event_counter += 1;

        if (m_first_event) {
            m_first_event = false;
            m_time_start = current_time;

        } else {

            m_total_distance_meters += distance;
        }

        return;
    }

    public long getTotalElapsedTime() {
        long elapsed = m_time_elapsed;

        if (m_time_start > 0) {
            elapsed = ((m_end_time > 0)?m_end_time:System.currentTimeMillis()) - m_time_start;
        }

        if (elapsed < 0) {
            elapsed = 0;
        }

        return elapsed;
    }

    public JSONObject jsonStatus() {
        JSONObject obj = new JSONObject();
        try {
            long elapsed = getTotalElapsedTime();

            obj.put("uid", m_uid);
            obj.put("paused", m_paused);
            obj.put("lat", m_current_lat);
            obj.put("lon", m_current_lon);
            obj.put("distance", m_total_distance_meters);
            obj.put("samples", m_event_counter);
            obj.put("dropped_samples", m_dropped_event_counter);
            obj.put("accurate", m_isAccurate);
            obj.put("current_pace_spm", m_paceTracker.current_pace());
            obj.put("num_splits", 1 + m_current_split);

            if (m_total_distance_meters > epsilon) {
                double spm = (elapsed / 1000.0) / m_total_distance_meters;
                if (spm > pace_maximum_spm) {
                    spm = pace_maximum_spm;
                }
                obj.put("average_pace_spm", spm);
            } else {
                obj.put("average_pace_spm", 0.0);
            }

            obj.put("elapsed_time_ms", elapsed);
        } catch (JSONException e) {
            Log.error("json format error", e);
        }

        return obj;
    }

    public String status() {
        return jsonStatus().toString();
    }

    public double calculateDistanceMeters(double lat1, double lon1, double lat2, double lon2) {

        final double phi1 = lat1 * DEG2RAD;
        final double phi2 = lat2 * DEG2RAD;

        final double deltaphi = (lat2 - lat1) * DEG2RAD;
        final double deltalambda = (lon2 - lon1) * DEG2RAD;

        final double a = Math.sin(deltaphi/2) * Math.sin(deltaphi/2) +
                         Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltalambda/2) *
                         Math.sin(deltalambda/2);

        final double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        final double d = R * c; // in metres

        return d;
    }

    public static class CurrentPaceTracker {

        private final double epsilon = 1e-6;
        private final double pace_maximum_spm = 4.0;

        // take the average pace over the last few samples
        // weight the most recent data point higher
        final double[] scale = {0.5, 0.5, 1.0, 1.0, 2.0};
        final double scale_magnitude = 5.0; //sum of scale


        List<Double> m_points;
        double m_current_pace_spm; // pace in seconds per meter

        public CurrentPaceTracker() {
            m_points = new ArrayList<>();
            m_current_pace_spm = 0.0;
        }

        public void reset() {
            m_points.clear();
            m_current_pace_spm = 0.0;
        }

        public void clear() {
            m_points.clear();
        }

        public void push(double distance, double delta_t) {

            if (distance < epsilon) {
                return;
            }

            double spm = (delta_t / 1000)/distance;

            if (spm > pace_maximum_spm) {
                spm = pace_maximum_spm;
            }

            m_points.add(spm);

            while (m_points.size() > 5) {
                m_points.remove(0);
            }

            if (m_points.size() >= 5) {
                double pace = 0.0;
                for (int i=0; i < m_points.size(); i++) {
                    pace += scale[i] * m_points.get(i);
                }

                m_current_pace_spm = pace / scale_magnitude;
            }

            return;

        }

        public double current_pace() {
            return m_current_pace_spm;
        }



    }


}
