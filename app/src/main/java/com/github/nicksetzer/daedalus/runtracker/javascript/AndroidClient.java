package com.github.nicksetzer.daedalus.runtracker.javascript;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.webkit.JavascriptInterface;

import com.github.nicksetzer.daedalus.runtracker.BuildConfig;
import com.github.nicksetzer.daedalus.runtracker.Log;
import com.github.nicksetzer.daedalus.runtracker.WebActivity;
import com.github.nicksetzer.daedalus.runtracker.WebService;

import java.io.File;
import java.util.ArrayList;

import androidx.core.content.FileProvider;

public class AndroidClient {
    private WebActivity m_activity;

    public AndroidClient(WebActivity activity) {
        this.m_activity = activity;
    }

    @JavascriptInterface
    public void enableTracking(final boolean enable) {

        Intent intent = new Intent(m_activity, WebService.class);
        intent.setAction((enable)? WebService.ACTION_START_TRACKING:WebService.ACTION_STOP_TRACKING);
        m_activity.startForegroundService(intent);

        Handler mainHandler = new Handler(m_activity.getMainLooper());
        mainHandler.post(new Runnable() {
            @Override
            public void run() {m_activity.enableShowWhenLocked(enable);}
        });

        return;
    }

    @JavascriptInterface
    public void pauseTracking() {

        Intent intent = new Intent(m_activity, WebService.class);
        intent.setAction(WebService.ACTION_PAUSE_TRACKING);
        m_activity.startForegroundService(intent);
        return;
    }

    @JavascriptInterface
    public String getLastKnownLocation() {
        try {
            WebService service = m_activity.getBoundService();
            if (service != null) {
                String result = service.getLastKnownLocation();
                return result;
            }
        } catch (Exception e) {
            Log.error("unhandled exception", e);
        }
        return "{}";
    }

    @JavascriptInterface
    public String getRecords() {
        try {
            WebService service = m_activity.getBoundService();
            if (service != null) {
                String result = service.getRecords();
                return result;
            }
        } catch (Exception e) {
            Log.error("unhandled exception", e);
        }
        return "{}";
    }

    @JavascriptInterface
    public void deleteLogEntry(String spk) {
        try {
            WebService service = m_activity.getBoundService();
            if (service != null) {
                 m_activity.getBoundService().deleteRecord(Long.parseLong(spk));
                ;
            }
        } catch (Exception e) {
            Log.error("unhandled exception", e);
        }
        return;
    }

    @JavascriptInterface
    public String getLogEntry(String spk) {
        try {
            Log.info(" SPK:" + spk);
            WebService service = m_activity.getBoundService();
            if (service != null) {
                String result = m_activity.getBoundService().getRecord(Long.parseLong(spk));
                return result;
            }
        } catch (Exception e) {
            Log.error("unhandled exception", e);
        }
        return "{}";
    }

    @JavascriptInterface
    public void shareLogEntry(String spk) {
        try {
            Log.info(" SPK:" + spk);
            WebService service = m_activity.getBoundService();
            if (service != null) {
                String file_path = m_activity.getBoundService().getRecordPath(Long.parseLong(spk));

                if (file_path == null) {
                    Log.error("file not found for spk " + spk);
                    return;
                }

                final Intent intent = new Intent(Intent.ACTION_SEND);
                intent.setType("text/plain");

                StringBuilder sb = new StringBuilder();

                sb.append("Here is the log from my recent run.\n\n");
                sb.append("The columns for the csv file are:\n");
                sb.append("  UTC-time, split_number, latitude, longitude, distance (m), delta_t (ms), isPaused?, isDropped?\n");

                intent.putExtra(Intent.EXTRA_TEXT, sb.toString());
                intent.putExtra(Intent.EXTRA_SUBJECT, "YMMV Run Tracker Log");

                File file = new File(file_path);

                Uri uri;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    uri = FileProvider.getUriForFile(m_activity, BuildConfig.APPLICATION_ID + ".provider", file);
                } else {
                    uri = Uri.fromFile(file);
                }
                Log.info("uri", uri.toString());

                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                intent.putExtra(Intent.EXTRA_STREAM, uri);

                m_activity.startActivity(Intent.createChooser(intent, "Share Log File using..."));

            }
        } catch (android.content.ActivityNotFoundException ex) {
            Log.error("activity not found", ex);
        } catch (Exception e) {
            Log.error("unhandled exception", e);
        }
    }
}
