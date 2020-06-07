from module daedalus import { Router, patternCompile }

import module api

let current_match = null;

export class AppRouter extends Router {

    setMatch(match) {
        current_match = match;
    }
}

AppRouter.match = () => {
    return current_match;
}

export function navigate(location) {
    history.pushState({}, "", location)
}

export const route_urls = {
    logEntry: "/log/:entry",
    log: "/log",
    settings: "/settings",
    wildCard: "/:path*",
    landing: "/",
}

// construct an object with the same properties as route_urls
// which map to functions which build valid urls
export const routes = {};
Object.keys(route_urls).map(key => {
    routes[key] = patternCompile(route_urls[key])
})
