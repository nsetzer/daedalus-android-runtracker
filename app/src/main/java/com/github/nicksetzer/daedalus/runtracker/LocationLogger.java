package com.github.nicksetzer.daedalus.runtracker;

/**
 * To access the run logs:
 *
 * adb shell
 * adb cd /storage/emulated/0/Android/data/com.github.nicksetzer.daedalus.runtracker/files/runlog
 *        /storage/emulated/0/Android/data/com.github.nicksetzer.daedalus.runtracker/files/runlog
 * adb pull /storage/emulated/0/Android/data/com.github.nicksetzer.daedalus.runtracker/files/runlog/2020-06-01-*
 *  2020-06-01-06-27-runlog.csv
 */

import android.app.PendingIntent;
import android.content.Context;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

public class LocationLogger {

    String m_base_dir;
    File m_log;
    OutputStream m_ostream;
    Database m_database;
    long m_startTime;
    boolean m_enabled = true;
    int m_year;
    int m_month;
    int m_day;

    public LocationLogger(Context ctxt, Database database) {

        m_database = database;

        m_base_dir = ctxt.getExternalFilesDir(null)+ "/runlog";

        File folder = new File(m_base_dir);
        if(!folder.exists()) {
            folder.mkdir();
        }

    }

    public long getStartTime() {
        return m_startTime;
    }

    public String getPath() {
        if (m_log != null) {
            return m_log.getPath();
        }
        return "";
    }

    public void setEnabled(boolean enabled)
    {
        m_enabled = enabled;
    }

    public void begin() {

        if (m_ostream != null) {
            end();
        }

        LocalDateTime now = LocalDateTime.now();
        //m_startTime = now.toEpochSecond(ZoneOffset.UTC);
        m_startTime = System.currentTimeMillis() / 1000;

        if (!m_enabled) {
            return;
        }

        m_year = now.getYear();
        m_month = now.getMonth().ordinal();
        m_day = now.getDayOfMonth();

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm");

        String path = m_base_dir + "/" + dtf.format(now) + "-runlog.csv";
        Log.info("opening log file:", path);

        m_log = new File(path);
        try {
            m_ostream = new FileOutputStream(m_log);
        } catch (FileNotFoundException e) {
            m_ostream = null;
            Log.error("file not found", e);
            return;
        }

    }

    public void push(double lat, double lon, double alt, long abstime, long delta_t, double distance, float spd, float acc, long split, boolean paused, boolean dropped) {

        if (!m_enabled) {
            end();
        }

        if (m_ostream == null) {
            return;
        }

        StringBuilder sb = new StringBuilder();
        sb.append(abstime);     sb.append(", "); // 0
        sb.append(split);       sb.append(", "); // 1
        sb.append(lat);         sb.append(", "); // 2
        sb.append(lon);         sb.append(", "); // 3
        sb.append(alt);         sb.append(", "); // 4
        sb.append(distance);    sb.append(", "); // 5
        sb.append(delta_t);     sb.append(", "); // 6
        sb.append(spd);         sb.append(", "); // 7
        sb.append(acc);         sb.append(", "); // 8
        sb.append(paused?1:0);  sb.append(", "); // 9
        sb.append(dropped?1:0); sb.append(", "); //10
        sb.append("\n");

        try {
            m_ostream.write(sb.toString().getBytes());
            m_ostream.flush();
        } catch (IOException e) {
            Log.error("unable to write line", e);
        }

    }

    public void end(JSONObject status) {

        double distance_m = 0;

        try {
            status.put("start_date", m_startTime);
            status.put("end_date", System.currentTimeMillis() / 1000);
            status.put("year", m_year);
            status.put("month", m_month);
            status.put("day", m_day);
            status.put("log_path", getPath());
            status.put("accurate", status.getBoolean("accurate")?1:0);

            distance_m = status.getDouble("distance");

        } catch (JSONException e) {
            Log.error("json error", e);
        }

        Log.error(status.toString());

        if (distance_m < 500.0) {
            Log.error("weak");
        }

        if (m_enabled) {
            Log.error("inserting record");
            m_database.m_runsTable.insert(status);
        }

        end();
    }

    private void end() {

        if (m_ostream != null) {
            try {
                Log.info("closing log file:", m_log.getPath());
                m_ostream.close();
            } catch (IOException e) {
                Log.error("unable to close file", e);
            }
        }
        m_log = null;
        m_ostream = null;
    }



}
