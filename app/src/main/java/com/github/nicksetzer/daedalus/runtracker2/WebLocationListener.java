package com.github.nicksetzer.daedalus.runtracker2;

import android.location.Location;
import android.location.LocationListener;

public class WebLocationListener implements LocationListener {
    LocationTracker m_tracker;
    WebService m_service;

    public WebLocationListener(WebService service, LocationTracker tracker) {
        super();
        m_tracker = tracker;
        m_service = service;
    }

    public void onLocationChanged(Location location) {
        double lat = location.getLatitude();
        double lon = location.getLongitude();
        double alt = location.getAltitude();

        float spd = 0.0F;
        if (location.hasSpeed()) {
            spd = location.getSpeed(); // meters per second
        }

        float acc = 0.0F;
        if (location.hasSpeedAccuracy()) {
            acc = location.getSpeedAccuracyMetersPerSecond();
        }

        m_tracker.push(lat, lon, alt, spd, acc);
        //if (!m_tracker.isPaused()) {
        m_service.sendEvent("onlocationupdate", m_tracker.status());
        //}
    }

    @Override
    public void onProviderEnabled(String s) {

    }

    @Override
    public void onProviderDisabled(String s) {

    }
}
