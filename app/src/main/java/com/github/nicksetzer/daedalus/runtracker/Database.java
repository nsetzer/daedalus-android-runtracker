package com.github.nicksetzer.daedalus.runtracker;

/*
adb pull /storage/emulated/0/Android/data/com.github.nicksetzer.daedalus.runtracker/files/app-v2.sqlite
adb pull /storage/emulated/0/Android/data/com.github.nicksetzer.daedalus.runtracker/files/runlog

 */
import android.content.Context;

import com.github.nicksetzer.metallurgy.orm.DatabaseConnection;
import com.github.nicksetzer.metallurgy.orm.EntityTable;
import com.github.nicksetzer.metallurgy.orm.TableSchema;

public class Database {

    public final int m_schema_version = 2;

    private Context m_context;
    private String m_path;

    private DatabaseConnection m_db;
    private TableSchema[] m_schema;

    public RunsTable m_runsTable;

    public Database(Context context) {
        m_context = context;

        TableSchema runs = _initRunsSchema();

        m_path = m_context.getExternalFilesDir(null)+ "/app-v" + m_schema_version + ".sqlite";
        m_schema = new TableSchema[]{runs};
        m_db = new DatabaseConnection(m_path, m_schema);

        m_runsTable = new RunsTable(m_db, runs);


    }
    private TableSchema _initRunsSchema() {

        TableSchema tests = new TableSchema("runs");
        tests.addColumn("spk", "INTEGER PRIMARY KEY AUTOINCREMENT");
        tests.addColumn("start_date", "INTEGER");
        tests.addColumn("end_date", "INTEGER");
        tests.addColumn("year", "INTEGER");
        tests.addColumn("month", "INTEGER");
        tests.addColumn("day", "INTEGER");
        tests.addColumn("num_splits", "INTEGER");
        tests.addColumn("elapsed_time_ms", "INTEGER");
        tests.addColumn("distance", "DOUBLE");
        tests.addColumn("average_pace_spm", "DOUBLE");
        tests.addColumn("accurate", "INTEGER");
        tests.addColumn("log_path", "VARCHAR");
        return tests;
    }

    public void connect() {
        m_db.connect();
    }

    public void close() {
        m_db.close();
    }

    public void beginTransaction() {
        m_db.beginTransaction();
    }

    public void beginTransaction(boolean exclusive) {
        m_db.beginTransaction(exclusive);
    }

    public void endTransaction(boolean success) {
        m_db.endTransaction(success);
    }
}
