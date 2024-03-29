from module daedalus import { Router, patternCompile }

import module api

let current_match = null;

export class AppRouter extends Router {

}

export function navigate(location) {
    history.pushState({}, "", location)
}

export function back(location) {
    history.back()
}

export const route_urls = {
    logEntry: "/log/:entry",
    log: "/log",
    settings: "/settings",
    plan: "/plan",
    weather_location: "/weather/forecast/:lat/:lon/hourly",
    weather_radar: "/weather/radar",
    weather_wildcard: "/weather/:path",
    weather: "/weather",
    roundtimer: "/roundtimer",
    wildCard: "/:path*",
    landing: "/",
}

// construct an object with the same properties as route_urls
// which map to functions which build valid urls
export const routes = {};
Object.keys(route_urls).map(key => {
    routes[key] = patternCompile(route_urls[key])
})
