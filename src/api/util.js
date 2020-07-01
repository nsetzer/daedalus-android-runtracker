

const RAD2DEG = 180 / Math.PI;
const DEG2RAD = Math.PI / 180;

function findLatLonCenter(points) {
    let avgX = 0;
    let avgY = 0;
    let avgZ = 0;

    // convert lat/lon into vectors in 3d space
    for (var i=0; i<points.length; i++) {
        var lat = points[i][0] * DEG2RAD;
        var lon = points[i][1] * DEG2RAD;
        avgX += Math.cos(lat) * Math.cos(lon);
        avgY += Math.cos(lat) * Math.sin(lon);
        avgZ += Math.sin(lat);
    }

    // find average of all points
    avgX = avgX / points.length;
    avgY = avgY / points.length;
    avgZ = avgZ / points.length;

    var hyp = Math.sqrt(avgX * avgX + avgY * avgY);

    var lon = Math.atan2(avgY, avgX) * RAD2DEG;
    var lat = Math.atan2(avgZ, hyp) * RAD2DEG;

    return [lat, lon];
}

export function geo_distance(lat1, lon1, lat2, lon2)
{
    const pi = Math.PI;
    const R = 6371e3; // earth's radius (mean), metres
    // phi is latitude
    // lambda is longitude

    /*
    haversine:
    a = sin^2(deltaphi/2) + cos(phi1) * cos(phi2) * sin(deltalambda/2)
    c = 2* atan2* (sqrt(a), sqrt(1-a))
    d = R * c
    */

    // π rad = 180 degrees, convert lat,lon degrees into radians
    const phi1 = lat1 * DEG2RAD; // phi, lambda in radians
    const phi2 = lat2 * DEG2RAD;
    const deltaphi = (lat2-lat1) * DEG2RAD;
    const deltalambda = (lon2-lon1) * DEG2RAD;

    const a = Math.sin(deltaphi/2) * Math.sin(deltaphi/2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltalambda/2) * Math.sin(deltalambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres



    return d;
}

function meters_to_feet(distance)
{
    return distance * 3.28083333
}

function feet_to_miles(distance)
{
    return distance / 528
}
