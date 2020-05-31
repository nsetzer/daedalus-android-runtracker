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
    private static final double MIN_DELTA_M = 2.5;

    private double m_current_lat = 0;
    private double m_current_lon = 0;
    private long m_time_previous_sample = 0;
    private double m_total_distance_meters = 0;
    private boolean m_first_event = true;
    private long m_event_counter = 0;
    private long m_dropped_event_counter = 0;

    private long m_time_start = 0;
    private long m_time_elapsed = 0;

    private long m_uid = 0;
    private boolean m_paused = false;
    private boolean m_isAccurate = false;
    private boolean m_loggingEnabled = false;

    LocationLogger m_logger;

    private CurrentPaceTracker m_paceTracker;

    public LocationTracker(Context ctxt, long uid) {
        m_uid = uid;
        m_paceTracker = new CurrentPaceTracker();

        m_logger = new LocationLogger(ctxt);
    }

    public void enableLogging(boolean enabled) {
        Log.info("set logging enabled: " + enabled);
        m_loggingEnabled = enabled;
    }

    public void setAccurate(boolean isAccurate) {
        m_isAccurate = isAccurate;
    }

    public boolean isPaused() {
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

        m_paceTracker.reset();
        Log.info("reset tracker");
    }

    public void begin() {
        if (m_loggingEnabled) {
            m_logger.begin();
        }
    }
    public void end() {
        reset();
        if (m_loggingEnabled) {
            m_logger.end();
        }
    }

    public void push(double lat, double lon) {

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

        if (m_loggingEnabled) {
            m_logger.push(lat, lon, current_time, delta_t, distance, m_paused, m_paused || drop);
        }

        if (m_paused || drop) {
            return;
        }

        m_event_counter += 1;

        if (m_first_event) {
            m_first_event = false;
            m_time_start = current_time;

        } else {
            m_paceTracker.push(distance, delta_t);
            m_total_distance_meters += distance;
        }

        return;
    }

    public String status() {
        JSONObject obj = new JSONObject();
        try {
            long elapsed = 0;

            if (m_time_start > 0) {
                elapsed = m_time_elapsed + (System.currentTimeMillis() - m_time_start);
            }

            if (elapsed < 0) {
                elapsed = 0;
            }

            obj.put("uid", m_uid);
            obj.put("paused", m_paused);
            obj.put("lat", m_current_lat);
            obj.put("lon", m_current_lon);
            obj.put("distance", m_total_distance_meters);
            obj.put("samples", m_event_counter);
            obj.put("dropped_samples", m_dropped_event_counter);
            obj.put("accurate", m_isAccurate);
            obj.put("current_pace_spm", m_paceTracker.current_pace());

            if (m_total_distance_meters > 0) {
                obj.put("average_pace_spm", (elapsed / 1000.0) / m_total_distance_meters);
            } else {
                obj.put("average_pace_spm", 0.0);
            }

            obj.put("elapsed_time_ms", elapsed);
        } catch (JSONException e) {
            Log.error("json format error", e);
        }
        return obj.toString();
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

    private class CurrentPaceTracker {

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

            m_points.add((delta_t / 1000)/distance);

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
