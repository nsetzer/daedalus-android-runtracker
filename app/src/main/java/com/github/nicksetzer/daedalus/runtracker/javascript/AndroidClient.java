package com.github.nicksetzer.daedalus.runtracker.javascript;

import android.app.Activity;
import android.content.Intent;
import android.webkit.JavascriptInterface;

import com.github.nicksetzer.daedalus.runtracker.Log;
import com.github.nicksetzer.daedalus.runtracker.WebActivity;
import com.github.nicksetzer.daedalus.runtracker.WebService;

import androidx.core.content.res.ComplexColorCompat;

public class AndroidClient {
    private WebActivity m_activity;

    public AndroidClient(WebActivity activity) {
        this.m_activity = activity;
    }

    @JavascriptInterface
    public void enableTracking(boolean enable) {

        Intent intent = new Intent(m_activity, WebService.class);
        intent.setAction((enable)? WebService.ACTION_START_TRACKING:WebService.ACTION_STOP_TRACKING);
        m_activity.startForegroundService(intent);
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
    public String getRecords() {
        try {
            WebService service = m_activity.getBoundService();
            if (service != null) {
                String result = m_activity.getBoundService().getRecords();
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
}
