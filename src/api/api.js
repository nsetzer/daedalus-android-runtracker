
include './util.js'

import module api.requests

export function getLastKnownLocation() {
    if (daedalus.platform.isAndroid && !!Client) {
        let s = Client.getLastKnownLocation();
        return JSON.parse(s)
    } else {
        return {lat: 42.357902, lon: -71.06408}
    }
}

const weather_base = "https://api.weather.gov"

/**
 * returns a json structure containing:
 *  .properties.forecastHourly : endpoint for hourly forecast
 *  .properties.gridId
 *  .properties.gridX
 *  .properties.gridY
 */
export function nwsGetEndpoints(lat, lon) {
    const url = weather_base + `/points/${lat},${lon}`;
    console.log(url)
    return api.requests.get_json(url);
}

export function nwsGetHourlyForecast(id, x ,y) {
    const url = weather_base + `/gridpoints/${id}/${x},${y}/forecast/hourly`;
    console.log(url)
    return api.requests.get_json(url);
}


const geo_base = "http://api.geonames.org"
const geo_username = "daedalus_android_run"

/**
 * returns a json object containing information about a single postal code
 *
 *  .postalCodes                :
 *  .postalCodes[i].postalCode  :
 *  .postalCodes[i].lat         :
 *  .postalCodes[i].lng         :
 *  .postalCodes[i].placeNAme   : city
 *  .postalCodes[i].adminName1  : state
 *  .postalCodes[i].adminName1  : county
 *  .postalCodes[i].adminCode1  : state abbreviation
 *  .postalCodes[i].countryCode :
 */
export function geoGetPostalCode(lat, lng) {
    const url = geo_base + `/findNearbyPostalCodesJSON?lat=${lat}&lng=${lng}&maxRows=1&username=${geo_username}`
    console.log(url)
    return api.requests.get_json(url);
}

/**
 * returns a json object containing information about a single postal code
 *
 *  .postalCodes                :
 *  .postalCodes[i].postalCode  :
 *  .postalCodes[i].lat         :
 *  .postalCodes[i].lng         :
 *  .postalCodes[i].placeNAme   : city
 *  .postalCodes[i].adminName1  : state
 *  .postalCodes[i].adminName1  : county
 *  .postalCodes[i].adminCode1  : state abbreviation
 *  .postalCodes[i].countryCode :
 */
export function geoGetPostalCodeInfo(postal_code) {
    const url = geo_base + `/postalCodeSearchJSON?postalcode=${postal_code}&maxRows=1&username=${geo_username}`
    console.log(url)
    return api.requests.get_json(url);
}


function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))
}

export function zipGetPostalCode(lat, lng) {
    let d =  Number.MAX_SAFE_INTEGER;
    let p = null;
    for (let i=0; i < zipcode_dat.length; i++) {

        let t = distance(zipcode_dat[i][zipcode_lat], zipcode_dat[i][zipcode_lon], lat, lng)
        if (t < d) {
            d = t;
            p = zipcode_dat[i][zipcode_zip];
        }
    }

    return p;
}

export function zipGetPostalCodeInfo(postal_code) {

    console.log(postal_code)
    if (!postal_code || postal_code.length != 5) {
        return null;
    }

    for (let i=0; i < zipcode_dat.length; i++) {
        if (zipcode_dat[i][zipcode_zip] == postal_code) {
            return {lat: zipcode_dat[i][zipcode_lat], lon: zipcode_dat[i][zipcode_lon]};
        }
    }

    return null;
}