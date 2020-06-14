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

        String sql = "SELECT * from runs ORDER BY start_date DESC";
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

    public String getRecordPath(long spk) {
        String sql = "SELECT log_path FROM runs WHERE";
        List<String> params = new ArrayList<>();

        Cursor cursor = find(spk);
        try {
            JSONObject obj = getFirstObject(cursor);

            return obj.getString("log_path");
        } catch (JSONException e) {
            Log.error("json format error", e);
        }
        return null;
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
            //loadSegments(obj, path);
        } catch (JSONException e) {
            Log.error("json format error", e);
        }

        Log.info("success");

        return obj;
    }

    public static void loadPoints(JSONObject obj, String log_path) throws JSONException {

        final int N_SEGMENTS = 10;
        final int SPM_SCALE_FACTOR = 10;

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

                long split = Long.parseLong(parts[1].trim());
                double lat = Double.parseDouble(parts[2].trim());
                double lon = Double.parseDouble(parts[3].trim());
                double distance = Double.parseDouble(parts[4].trim());
                long delta_t = Long.parseLong(parts[5].trim());
                long dropped = Long.parseLong(parts[7].trim());
                int index = -1;
                if (dropped==1) {
                    index = 0;
                } else if (distance > 1e-6) {
                    double spm = delta_t / 1000 / distance;
                    index = (int) (spm * SPM_SCALE_FACTOR);
                    if (index >= N_SEGMENTS) {
                        index = N_SEGMENTS - 1;
                    }
                    index += 1;
                }

                JSONArray pt = new JSONArray();

                pt.put(lat);
                pt.put(lon);
                pt.put(index);
                pt.put(distance);
                pt.put(delta_t);

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

    public static void loadSegments(JSONObject obj, String log_path) throws JSONException {

        final int N_SEGMENTS = 10;
        final int N_BINS = N_SEGMENTS + 1;
        final int SPM_SCALE_FACTOR = 10;

        JSONArray pt;
        JSONArray prev_pt = null;

        int prev_index = -1;
        double prev_lat;
        double prev_lon;
        int point_count = 0;
        int segment_count = 0;

        List<JSONArray> current_segment = null;

        JSONArray[] segments = new JSONArray[N_BINS];
        for (int i=0; i < N_BINS; i++) {
            segments[i] = new JSONArray();
        }

        FileInputStream stream = null;
        try {
            stream = new FileInputStream(log_path);
        } catch (FileNotFoundException e) {
            Log.error(System.getProperty("user.dir"));
            Log.error("file not found", log_path);
            return;
        }

        if (stream == null) {
            Log.error(System.getProperty("user.dir"));
            Log.error("file not found", log_path);
            return;
        }

        Log.info("reading file: " +log_path);

        InputStreamReader streamReader = new InputStreamReader(stream);
        BufferedReader reader = new BufferedReader(streamReader);

        try {
            String line = reader.readLine();

            while (line != null && !line.equals("")) {


                String[] parts = line.split(",");

                if (parts.length < 4) {
                    continue;
                }

                long split = Long.parseLong(parts[1].trim());
                double lat = Double.parseDouble(parts[2].trim());
                double lon = Double.parseDouble(parts[3].trim());
                double distance = Double.parseDouble(parts[4].trim());
                long delta_t = Long.parseLong(parts[5].trim());
                long paused = Long.parseLong(parts[6].trim());
                long dropped = Long.parseLong(parts[7].trim());
                double spm = 0.0;
                int index = -1;
                if (distance > 1e-5) {
                    spm = delta_t / 1000.0 / distance;

                    index = ((int) (spm * SPM_SCALE_FACTOR));
                    if (index >= N_SEGMENTS) {
                        index = N_SEGMENTS - 1;
                    }
                    // index 0 is reserved for paused/dropped points
                    index += 1;

                }
                //int index = (dropped!=0)?0:(1 + ((int) spm * SPM_SCALE_FACTOR));

                pt = new JSONArray();
                pt.put(lat);
                pt.put(lon);
                pt.put(split);
                pt.put(point_count);
                point_count+=1;
                //Log.info("cnt" + point_count + " lat " + lat + " lon " + lon + " distance " + distance + " spm " + spm + " idx " + index);

                if (prev_index != index) {

                    if (distance > 1e-6) {
                        if (current_segment != null && prev_index >= 0) {
                            //Log.info("adding segment with " + current_segment.size() + " points to " + prev_index);
                            segments[prev_index].put(new JSONArray(current_segment));
                        }

                        Log.info("new segment " + index + " spm:" + spm);
                        current_segment = new ArrayList<>();
                        segment_count += 1;
                        if (prev_pt != null) {
                            current_segment.add(prev_pt);
                        }

                        current_segment.add(pt);
                    }
                    // push a point onto a new segment
                } else if (current_segment != null) {
                    current_segment.add(pt);
                    // create a new segment
                    // push (prev_lat, prev_lon, segment_count++)
                    // push (lat, lon, segment_count++)
                }

                prev_index = index;
                prev_pt = pt;

                line = reader.readLine();
            }
        } catch (IOException e) {
            Log.error("ioerror", e);
        }

        if (current_segment != null && current_segment.size() > 1) {
            Log.info("adding segment with " + current_segment.size() + " points to " + prev_index);
            segments[prev_index].put(new JSONArray(current_segment));
        }
        JSONArray js_segments = new JSONArray();

        for (int i=0; i < N_BINS; i++) {
            js_segments.put(segments[i]);
        }

        obj.put("segments", js_segments);
        obj.put("lat", prev_pt.get(0));
        obj.put("lon", prev_pt.get(1));

        Log.info("loaded " + point_count + " points, " + segment_count + " segments.");
    }


}
