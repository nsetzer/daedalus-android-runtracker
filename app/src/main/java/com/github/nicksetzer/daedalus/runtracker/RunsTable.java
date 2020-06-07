package com.github.nicksetzer.daedalus.runtracker;

import android.database.Cursor;

import com.github.nicksetzer.metallurgy.orm.DatabaseConnection;
import com.github.nicksetzer.metallurgy.orm.EntityTable;
import com.github.nicksetzer.metallurgy.orm.TableSchema;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

public class RunsTable extends EntityTable {

    public RunsTable(DatabaseConnection db, TableSchema schema) {
        super(db, schema);
    }

    public JSONArray getAllRecords() {

        String sql = "SELECT * from runs ORDER BY start_date";
        List<String> params = new ArrayList<>();

        Cursor cursor = m_db.query(sql, params.toArray(new String[]{}));

        JSONArray results = new JSONArray();

        if (cursor != null && cursor.moveToFirst()) {
            while (!cursor.isAfterLast()) {

                try {
                    JSONObject track = getObject(cursor);

                    results.put(track);

                } catch (JSONException e) {
                    Log.error("json format error", e);
                }

                cursor.moveToNext();
            }
        }

        return results;
    }

    public void deleteRecord(long spk) {
        Cursor cursor = find(spk);
        JSONObject obj = null;

        try {
            obj = getFirstObject(cursor);
        } catch (JSONException e) {
            Log.error("json format error", e);
        }

        cursor.close();

        if (obj == null) {
            Log.error("object not found");
            return;
        }

        try {
            String path = obj.getString("log_path");
            File file = new File(path);
            if (file.exists()) {
                if (!file.delete()) {
                    Log.error("unable to delete file " + spk + " " + path);
                    return;
                };
            }
        } catch (JSONException e) {
            Log.error("json format error", e);
        }

        // finally delete the database entry
        delete(spk);
    }

    public JSONObject getRecord(long spk) {
        Cursor cursor = find(spk);
        JSONObject obj = null;

        try {
             obj = getFirstObject(cursor);
        } catch (JSONException e) {
            Log.error("json format error", e);
        }

        cursor.close();

        if (obj == null) {
            Log.error("object not found");
            return null;
        }

        try {
            String path = obj.getString("log_path");
            loadPoints(obj, path);
        } catch (JSONException e) {
            Log.error("json format error", e);
        }

        Log.info("success");

        return obj;
    }

    private void loadPoints(JSONObject obj, String log_path) throws JSONException {

        List<JSONArray> points = new ArrayList<>();
        List<JSONArray> distances = new ArrayList<>();
        List<JSONArray> times = new ArrayList<>();

        FileInputStream stream = null;
        try {
            stream = new FileInputStream(log_path);
        } catch (FileNotFoundException e) {
            Log.error("file not found", log_path);
            return;
        }

        if (stream == null) {
            Log.error("file not found", log_path);
            return;
        }

        Log.info("reading file: " +log_path);

        InputStreamReader streamReader = new InputStreamReader(stream);
        BufferedReader reader = new BufferedReader(streamReader);

        long count=0;
        try {
            String line = reader.readLine();

            while (line != null && !line.equals("")) {


                String[] parts = line.split(",");

                if (parts.length < 4) {
                    continue;
                }

                double lat = Double.parseDouble(parts[2].trim());
                double lon = Double.parseDouble(parts[3].trim());
                double distance = Double.parseDouble(parts[4].trim());
                double delta_t = Long.parseLong(parts[5].trim());


                JSONArray pt = new JSONArray();

                pt.put(lat);
                pt.put(lon);

                points.add(pt);

                count += 1;
                line = reader.readLine();
            }
        } catch (IOException e) {
            Log.error("ioerror", e);
        }

        obj.put("points", new JSONArray(points));
        //obj.put("distances", distances);
        //obj.put("times", times);

        Log.info("loaded " + count + " points");
    }
}
