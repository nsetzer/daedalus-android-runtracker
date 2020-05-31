package com.github.nicksetzer.daedalus.runtracker;

/**
 * To access the run logs:
 *
 * adb shell
 * adb cd /storage/emulated/0/Android/data/com.github.nicksetzer.runtracker/files/runlog
 */

import android.app.PendingIntent;
import android.content.Context;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LocationLogger {

    String m_base_dir;
    File m_log;
    OutputStream m_ostream;

    public LocationLogger(Context ctxt) {

        m_base_dir = ctxt.getExternalFilesDir(null)+ "/runlog";

        File folder = new File(m_base_dir);
        if(!folder.exists()) {
            folder.mkdir();
        }

    }

    public void begin() {

        if (m_ostream != null) {
            end();
        }

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd-HH-mm");
        LocalDateTime now = LocalDateTime.now();
        System.out.println();

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

    public void push(double lat, double lon, long abstime, long delta_t, double distance, boolean paused, boolean dropped) {

        if (m_ostream == null) {
            return;
        }

        StringBuilder sb = new StringBuilder();
        sb.append(lat);
        sb.append(", ");
        sb.append(lon);
        sb.append(", ");
        sb.append(distance);
        sb.append(", ");
        sb.append(abstime);
        sb.append(", ");
        sb.append(delta_t);
        sb.append(", ");
        sb.append(paused?1:0);
        sb.append(", ");
        sb.append(dropped?1:0);
        sb.append("\n");

        try {
            m_ostream.write(sb.toString().getBytes());
            m_ostream.flush();
        } catch (IOException e) {
            Log.error("unable to write line", e);
        }

    }

    public void end() {
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
