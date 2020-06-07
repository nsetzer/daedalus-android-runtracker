package com.github.nicksetzer.daedalus.runtracker;

import android.location.Location;
import android.location.LocationListener;
import android.os.Bundle;

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
        m_tracker.push(lat, lon);
        //if (!m_tracker.isPaused()) {
        m_service.sendEvent("onlocationupdate", m_tracker.status());
        //}
    }

    @Override
    public void onStatusChanged(String s, int i, Bundle bundle) {

    }

    @Override
    public void onProviderEnabled(String s) {

    }

    @Override
    public void onProviderDisabled(String s) {

    }
}
