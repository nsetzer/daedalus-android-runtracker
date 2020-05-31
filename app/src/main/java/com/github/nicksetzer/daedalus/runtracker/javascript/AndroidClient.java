package com.github.nicksetzer.daedalus.runtracker.javascript;

import android.app.Activity;
import android.content.Intent;
import android.webkit.JavascriptInterface;

import com.github.nicksetzer.daedalus.runtracker.WebService;

public class AndroidClient {
    private Activity m_activity;

    public AndroidClient(Activity activity) {
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

}
