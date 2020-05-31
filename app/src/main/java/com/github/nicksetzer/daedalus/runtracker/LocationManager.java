package com.github.nicksetzer.daedalus.runtracker;

// https://github.com/obaro/SimpleLocationApp/blob/master/app/src/main/java/com/sample/foo/simplelocationapp/MainActivity.java
// https://leafletjs.com/examples/quick-start/
// https://github.com/saleguas/context_menu

import android.content.Context;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.os.Bundle;

import org.json.JSONException;
import org.json.JSONObject;

public class LocationManager {

    static final double[][] test_data = {
            {40.14083943, -74.19391519},
            {40.14085347, -74.19387772},
            {40.14086841, -74.19383053},
            {40.1408821,  -74.19379443},
            {40.1408948,  -74.19376247},
            {40.14089817, -74.1937115},
            {40.14090807, -74.19365078},
            {40.14091576, -74.19361503},
            {40.14092978, -74.19356402},
            {40.14094941, -74.19352606},
            {40.14096706, -74.19350611},
            {40.14098769, -74.19349242},
            {40.1410176,  -74.19346999},
            {40.1410301,  -74.19342996},
            {40.14103311, -74.19339975},
            {40.14103848, -74.1933687},
            {40.1410394,  -74.19333502},
            {40.14104715, -74.19328947},
            {40.14105688, -74.19323857},
            {40.14106685, -74.1931852},
            {40.14107417, -74.19315472},
            {40.14109035, -74.19312812},
            {40.14110913, -74.19310623},
            {40.14111503, -74.19305613},
            {40.14112376, -74.19300117},
            {40.1411352,  -74.19296105},
            {40.1411457,  -74.19292589},
            {40.14117068, -74.19290059},
            {40.14119142, -74.19285538},
            {40.14120261, -74.19282628},
            {40.14120971, -74.19279446},
            {40.14121468, -74.19274848},
            {40.14122179, -74.19270943},
            {40.14122987, -74.19268078},
            {40.1412352,  -74.19264299},
            {40.14124932, -74.19260141},
            {40.14126303, -74.19257092},
            {40.14127192, -74.19253866},
            {40.14128844, -74.19249899},
            {40.14130083, -74.1924711},
            {40.1413134,  -74.19244456},
            {40.1413298,  -74.19241849},
            {40.14134752, -74.19239021},
            {40.14137673, -74.19235618},
            {40.14140343, -74.19234698},
            {40.14142254, -74.19232219},
            {40.14144725, -74.19228011},
            {40.14148118, -74.19223102},
            {40.14149882, -74.19220575},
            {40.1415285,  -74.19216943},
    };

    android.location.LocationManager locationManager;
    WebService m_service;

    private long minTimeMs = 2000;
    private float minDistanceMeters = 0.0F;


    //private LocationListener locationListenerGPS;
    //private LocationListener locationListenerNetwork;
    private LocationListener locationListenerBest;

    //LocationTracker m_trackerGps;
    //LocationTracker m_trackerNetwork;
    LocationTracker m_trackerBest;

    Thread m_test_thread;
    boolean m_test_thread_alive = false;

    public LocationManager(WebService service) {
        m_service = service;

        locationManager = (android.location.LocationManager) service.getSystemService(Context.LOCATION_SERVICE);
        //m_trackerGps = new LocationTracker(1);
        //m_trackerNetwork = new LocationTracker(2);
        m_trackerBest = new LocationTracker(m_service,3);

        //locationListenerGPS = new WebLocationListener(service, m_trackerGps);
        //locationListenerNetwork = new WebLocationListener(service, m_trackerNetwork);
        locationListenerBest = new WebLocationListener(service, m_trackerBest);

    }

    public void close() {

    }

    public boolean isTrackingPaused() {
        return m_trackerBest.isPaused();
    }

    public void pauseTracking() {
        Log.info("pausing location updates");
        //m_trackerGps.pause();
        //m_trackerNetwork.pause();
        m_trackerBest.pause();
    }

    public void resumeTracking() {
        Log.info("resuming location updates");
        //m_trackerGps.resume();
        //m_trackerNetwork.resume();
        m_trackerBest.resume();
    }

    private boolean checkLocation() {
        //if(!isLocationEnabled())
        //    requestLocationPermission();
        return isLocationEnabled();
    }

    public boolean isLocationEnabled() {
        return locationManager.isProviderEnabled(android.location.LocationManager.GPS_PROVIDER) ||
                locationManager.isProviderEnabled(android.location.LocationManager.NETWORK_PROVIDER);
    }

    public boolean enableLocationTracking(boolean enable)
    {
        if (enable) {

            //m_trackerGps.reset();
            //m_trackerNetwork.reset();

            //_enableGps();
            //_enableNetwork();

            m_trackerBest.reset();

            m_trackerBest.enableLogging(!WebActivity.isDebug);

            m_trackerBest.begin();

            // send an empty update to reset
            m_service.sendEvent("onlocationupdate", m_trackerBest.status());

            if (WebActivity.isDebug) {
                return _enableTest();
            } else {
                return _enableBest();
            }

        } else {
            //locationManager.removeUpdates(locationListenerGPS);
            //locationManager.removeUpdates(locationListenerNetwork);
            m_trackerBest.end();

            if (WebActivity.isDebug) {
                _disableTest();
            } else {
                locationManager.removeUpdates(locationListenerBest);
            }
            return false;
        }


    }

    /*
    private void _enableGps() {

        try {

            m_trackerGps.setAccurate(true);

            locationManager.requestLocationUpdates(
                    android.location.LocationManager.GPS_PROVIDER,
                    minTimeMs,
                    minDistanceMeters,
                    locationListenerGPS);

        } catch (SecurityException e) {
            Log.error("security error", e);
        }
    }
    */

    /*
    private void _enableNetwork() {

        try {

            m_trackerNetwork.setAccurate(false);

            locationManager.requestLocationUpdates(
                    android.location.LocationManager.NETWORK_PROVIDER,
                    minTimeMs,
                    minDistanceMeters,
                    locationListenerNetwork);

        } catch (SecurityException e) {
            Log.error("security error", e);
        }
    }
    */

    private boolean _enableTest() {

        Log.info("starting new runnable");
        Runnable busyLoop = new Runnable() {
            public void run() {
                Log.info("runnable is running");

                int index = 0;
                while (true) {

                    // reply all samples going forward, then in reverse
                    int n = ((test_data.length-1)*2);
                    int j = index % n;
                    double[] sample = test_data[(j<test_data.length)?j:(n-j)];

                    if(!m_test_thread_alive) {
                        Log.info("runnable exit");
                        return;
                    }

                    m_trackerBest.push(sample[0], sample[1]);

                    if (!m_trackerBest.isPaused()) {
                        m_service.sendEvent("onlocationupdate", m_trackerBest.status());
                    }

                    try {
                        for (int i=0; i < 10; i++) {
                            Thread.sleep(200);
                        }
                    } catch (Exception ex) {
                        ;
                    }

                    index += 1;
                }
            }
        };

        m_test_thread_alive = true;
        m_test_thread = new Thread(busyLoop);
        m_test_thread.start();

        return true;
    }

    private void _disableTest() {
        m_test_thread_alive = false;

        while (m_test_thread.isAlive()) {
            try {
                m_test_thread.join(100);
            } catch (Exception e) {
                break;
            }
        }
    }

    private boolean _enableBest() {

        try {

            Criteria criteria = new Criteria();
            criteria.setAccuracy(Criteria.ACCURACY_FINE);
            criteria.setAltitudeRequired(false);
            criteria.setBearingRequired(false);
            criteria.setCostAllowed(true);
            criteria.setPowerRequirement(Criteria.POWER_LOW);
            String provider = locationManager.getBestProvider(criteria, true);

            if(provider != null) {

                m_trackerBest.setAccurate(android.location.LocationManager.GPS_PROVIDER.equals(provider));

                locationManager.requestLocationUpdates(
                        provider,
                        minTimeMs,
                        minDistanceMeters,
                        locationListenerBest);

                return true;
            }

        } catch (SecurityException e) {
            Log.error("security error", e);
        }

        return false;
    }


}
