

function geo_distance(lat1, lon1, lat2, lon2)
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
    const phi1 = lat1 * pi/180; // phi, lambda in radians
    const phi2 = lat2 * pi/180;
    const deltaphi = (lat2-lat1) * pi/180;
    const deltalambda = (lon2-lon1) * pi/180;

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
