
include './util.js'



export function getLastKnownLocation() {
    if (daedalus.platform.isAndroid && !!Client) {
        let s = Client.getLastKnownLocation();
        return JSON.parse(s)
    } else {
        return {lat: 40, lon: -75}
    }
}