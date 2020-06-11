package com.github.nicksetzer.daedalus.runtracker;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class RunsTableTest {

    @Test
    public void loadSegmentTest() {

        JSONObject obj = new JSONObject();

        try {
            RunsTable.loadSegments(obj, "./src/test/res/logdata.csv");

            String[] lines = obj.toString(2).split("\n");
            for (String line : lines) {
                System.out.println(line);
            }
        } catch (JSONException e) {
            e.printStackTrace();
            Log.error("json format error", e);
        }
    }
}
