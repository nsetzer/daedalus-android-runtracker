package com.github.nicksetzer.daedalus.runtracker;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class LocationTrackerTest {

    private final double epsilon = 1e-6;
    @Test
    public void paceTrackerTest() {

        LocationTracker.CurrentPaceTracker pt = new LocationTracker.CurrentPaceTracker();

        pt.push(2.0, 2000); // 1 m/s
        assertEquals(0.0, pt.current_pace(), epsilon);
        pt.push(2.0, 2000); // 1 m/s
        assertEquals(0.0, pt.current_pace(), epsilon);
        pt.push(2.0, 2000); // 1 m/s
        assertEquals(0.0, pt.current_pace(), epsilon);
        pt.push(2.0, 2000); // 1 m/s
        assertEquals(0.0, pt.current_pace(), epsilon);
        pt.push(2.0, 2000); // 1 m/s
        assertEquals(1.0, pt.current_pace(), epsilon);

    }

    @Test
    public void paceTrackerTest2() {

        LocationTracker.CurrentPaceTracker pt = new LocationTracker.CurrentPaceTracker();

        pt.push(1.0, 2000);
        assertEquals(0.0, pt.current_pace(), epsilon);
        pt.push(2.0, 2000);
        assertEquals(0.0, pt.current_pace(), epsilon);
        pt.push(3.0, 2000);
        assertEquals(0.0, pt.current_pace(), epsilon);
        pt.push(4.0, 2000);
        assertEquals(0.0, pt.current_pace(), epsilon);
        pt.push(5.0, 2000);
        assertEquals(0.693333, pt.current_pace(), epsilon);


    }
}
