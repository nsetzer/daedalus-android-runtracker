package com.github.nicksetzer.daedalus.runtracker2;

import android.Manifest;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.IBinder;
import android.view.WindowManager;
import android.widget.Toast;

import com.github.nicksetzer.daedalus.runtracker2.javascript.AndroidClient;
import com.github.nicksetzer.daedalus.runtracker2.javascript.LocalStorage;
import com.github.nicksetzer.daedalus.runtracker2.view.DaedalusWebChromeClient;
import com.github.nicksetzer.daedalus.runtracker2.view.DaedalusWebViewClient;

public class WebActivity extends Activity {

    //This is a project wide setting, when  true debug mode is enable
    //fake data is fed through the tracker, debug logging is enable
    public static final boolean isDebug = false;

    LocalStorage m_storage;
    ServiceEventReceiver m_receiver;
    private WebService m_webService;
    private boolean m_serviceBound = false;
    private static int LOCATION_PERMISSION_CODE = 1001;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_web);

        DaedalusWebView view = findViewById(R.id.DaedalusView);

        Log.setLogLevel(WebActivity.isDebug?Log.DEBUG:Log.INFO);

        view.setWebContentsDebuggingEnabled(true);

        view.getSettings().setJavaScriptEnabled(true);

        view.setWebChromeClient(new DaedalusWebChromeClient());
        view.setWebViewClient(new DaedalusWebViewClient(this, false));
        m_storage = new LocalStorage(this);
        view.addJavascriptInterface(m_storage, "LocalStorage");
        view.addJavascriptInterface(new AndroidClient(this), "Client");

        //view.getSettings().setAllowUniversalAccessFromFileURLs(true);

        view.loadUrl("file:///android_asset/site/index.html");

        Log.debug("successfully launch on create");
        Log.info("successfully launch on create");
        Log.warn("successfully launch on create");
        Log.error("successfully launch on create");

        launchService();

        requestLocationPermission();

        m_receiver = new ServiceEventReceiver();
    }

    public void enableShowWhenLocked(boolean enable) {
        if (enable) {
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        } else {
            getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        }
        setShowWhenLocked(enable);
    }
    private void requestLocationPermission(){

        if (this.shouldShowRequestPermissionRationale(Manifest.permission.ACCESS_FINE_LOCATION)){
            //If the user has denied the permission previously your code will come to this block
            //Here you can explain why you need this permission
            //Explain here why you need this permission
            Log.error("error denied...");
        }

        //And finally ask for the permission
        this.requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, LOCATION_PERMISSION_CODE);
    }

    //This method will be called when the user will tap on allow or deny
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {

        if(requestCode == LOCATION_PERMISSION_CODE){

            //If permission is granted
            if(grantResults.length >0 && grantResults[0] == PackageManager.PERMISSION_GRANTED){

                //Displaying a toast
                //Toast.makeText(this,"Permission granted now you can access location",Toast.LENGTH_LONG).show();
            }else{
                //Displaying another toast if permission is not granted
                Toast.makeText(this,"Location permission was denied",Toast.LENGTH_LONG).show();
            }
        }
    }

    @Override
    protected void onStart() {
        super.onStart();

        registerReceiver(m_receiver, new IntentFilter(WebService.ACTION_EVENT));

        Intent intent = new Intent(this, WebService.class);
        bindService(intent, m_serviceConnection, Context.BIND_AUTO_CREATE);

    }

    @Override
    protected void onStop() {
        super.onStop();
        try {
            unregisterReceiver(m_receiver);
        } catch(IllegalArgumentException e) {
            // api issue on android
            android.util.Log.e("daedalus-js", "Receiver not registered: " + e.toString());
        }
        if (m_serviceBound) {
            unbindService(m_serviceConnection);
        }
    }

    public void launchService() {

        try {
            Intent intent = new Intent(this, WebService.class);
            startService(intent);
            Log.debug("launching web service");
        } catch (RuntimeException e) {
            Log.error("error starting service", e);
        }
    }

    private ServiceConnection m_serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceDisconnected(ComponentName name) {
            m_webService = null;
            m_serviceBound = false;
            Log.debug("daedalus-js", "unbound service");
        }
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            WebService.WebBinder myBinder = (WebService.WebBinder) service;
            m_webService = myBinder.getService();
            m_serviceBound = true;
            Log.debug("daedalus-js", "binding to service");

        }
    };

    public WebService getBoundService() {
        return m_webService;
    }

    public void invokeJavascriptCallback(String name, String payload) {
        DaedalusWebView view = findViewById(R.id.DaedalusView);
        view.loadUrl("javascript:invokeAndroidEvent('" + name + "', '" + payload.replace("\'", "\\\'") + "')");
    }

    class ServiceEventReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {

            if(intent.getAction().equals(WebService.ACTION_EVENT))
            {
                final String name = intent.getExtras().getString("name");
                final String payload = intent.getExtras().getString("payload");
                invokeJavascriptCallback(name, payload);

            }
        }



    }
}
