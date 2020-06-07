
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
];

export const svg = {};

svg_icon_names.forEach(name => {svg[name] = platform_prefix + name + ".svg"})

