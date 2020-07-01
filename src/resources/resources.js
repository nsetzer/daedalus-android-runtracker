
import module daedalus

const platform_prefix = daedalus.platform.isAndroid ? "file:///android_asset/site/static/icon/" : "/static/icon/";

const svg_icon_names = [
    "button_play",
    "button_pause",
    "button_stop",
    "button_split",
    "gear",
    "shoe",
    "whiteshoe",
    "back",
    "marker_R",
    "marker_L",
    "trash",
    "share",
    "map",
    "map_add",
    "map_remove",
    "map_split",
    "map_close",
];

const png_icon_names = [
    "map_end",
    "map_point",
    "map_start",
];


export const svg = {};
export const png = {};

svg_icon_names.forEach(name => {svg[name] = platform_prefix + name + ".svg"})
png_icon_names.forEach(name => {png[name] = platform_prefix + name + ".png"})
