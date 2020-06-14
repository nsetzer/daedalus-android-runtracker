package com.github.nicksetzer.daedalus.runtracker;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Binder;
import android.os.IBinder;

import androidx.core.app.NotificationCompat;

public class WebService extends Service {

    public static final String NOTIFICATION_CHANNEL_ID = "com.github.nicksetzer.daedalus.runtracker";
    public static final String ACTION_EVENT = "com.github.nicksetzer.daedalus.runtracker.ACTION_EVENT";
    public static final String ACTION_START_TRACKING = "com.github.nicksetzer.daedalus.runtracker.ACTION_START_TRACKING";
    public static final String ACTION_PAUSE_TRACKING = "com.github.nicksetzer.daedalus.runtracker.ACTION_PAUSE_TRACKING";
    public static final String ACTION_STOP_TRACKING = "com.github.nicksetzer.daedalus.runtracker.ACTION_STOP_TRACKING";

    NotificationManager m_notificationManager;

    LocationManager m_location = null;

    public Database m_database;

    private IBinder m_binder = new WebBinder();

    public WebService() {
        super();
    }

    @Override
    public void onCreate() {
        super.onCreate();

        m_database = new Database(this);
        m_database.connect();
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        super.onTaskRemoved(rootIntent);
        stopSelf();
    }

    private void startForeground() {


        String channelName = "My Background Service";
        NotificationChannel chan = new NotificationChannel(NOTIFICATION_CHANNEL_ID, channelName, NotificationManager.IMPORTANCE_NONE);
        chan.setLightColor(Color.BLUE);
        chan.setLockscreenVisibility(Notification.VISIBILITY_PRIVATE);
        m_notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        assert m_notificationManager != null;
        m_notificationManager.createNotificationChannel(chan);

        updateNotification();

    }

    public void updateNotification() {

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID);

        builder.setContentTitle("App is running in background");

        Context context = getApplicationContext();
        String packageName = context.getPackageName();
        Intent openApp = context.getPackageManager().getLaunchIntentForPackage(packageName);

        openApp.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);

        // Add the Uri data so apps can identify that it was a notification click
        openApp.setAction(Intent.ACTION_VIEW);
        openApp.setData(Uri.parse("daedalus://notification.click"));

        Notification notification = builder.setOngoing(true)
                .setSmallIcon(R.drawable.ic_shoe)
                .setPriority(NotificationManager.IMPORTANCE_MIN)
                .setCategory(Notification.CATEGORY_SERVICE)
                .setContentIntent(PendingIntent.getActivity(context, 0, openApp, PendingIntent.FLAG_CANCEL_CURRENT))
                .build();

        startForeground(1, notification);

    }

    static final String state_running = "{\"state\": \"running\"}";
    static final String state_stopped = "{\"state\": \"stopped\"}";
    static final String state_paused = "{\"state\": \"paused\"}";
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        if (m_location == null) {
            m_location = new LocationManager(this, m_database);
        }

        startForeground();

        if (m_location != null && intent != null) {
            String action = intent.getAction();
            boolean enabled;

            if (action != null) {
                switch (action) {
                    case ACTION_START_TRACKING:

                        if (m_location.isTrackingPaused()) {
                            m_location.resumeTracking();
                            enabled = m_location.isLocationEnabled();
                        } else {
                            enabled = m_location.enableLocationTracking(true);
                        }

                        sendEvent("ontrackingchanged", (enabled)?state_running:state_stopped);
                        break;
                    case ACTION_STOP_TRACKING:
                        enabled = m_location.enableLocationTracking(false);
                        sendEvent("ontrackingchanged", (enabled)?state_running:state_stopped);
                        break;
                    case ACTION_PAUSE_TRACKING:
                        m_location.pauseTracking();
                        sendEvent("ontrackingchanged", state_paused);
                        break;
                    default:
                        Log.error("unknown action", action);
                        break;
                }
            }
        }
        return START_NOT_STICKY;
    }

    @Override
    public void onDestroy() {


        if (m_location != null) {
            m_location.close();
        }

        if (m_database != null) {
            m_database.close();
        }

        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return m_binder;
    }

    @Override
    public void onRebind(Intent intent) {
        super.onRebind(intent);
    }

    @Override
    public boolean onUnbind(Intent intent) {
        return true;
    }

    public void sendEvent(String name, String payload) {

        //Log.info("sending event", name);

        Intent intent = new Intent();
        intent.setAction(ACTION_EVENT);
        intent.putExtra( "name",name);
        intent.putExtra( "payload",payload);
        sendBroadcast(intent);
    }

    public class WebBinder extends Binder {
        public WebService getService() {
            return WebService.this;
        }
    }

    public String getRecords() {
        return m_database.m_runsTable.getAllRecords().toString();
    }

    public void deleteRecord(long spk) {
        m_database.m_runsTable.delete(spk);
        return;
    }

    public String getRecord(long spk) {
        return m_database.m_runsTable.getRecord(spk).toString();
    }

    public String getRecordPath(long spk) {
        return m_database.m_runsTable.getRecordPath(spk);

    }
}
