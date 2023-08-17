
import module daedalus

const platform_prefix = daedalus.platform.isAndroid ? "file:///android_asset/site/static/icon/" : "/static/icon/";
const platform_effect_prefix = daedalus.platform.isAndroid ? "file:///android_asset/site/static/effects/" : "/static/effects/";

const svg_icon_names = [
    "back",
    "button_pause",
    "button_play",
    "button_split",
    "button_stop",
    "clock",
    "cloud",
    "gear",
    "map",
    "map_add",
    "map_close",
    "map_dec",
    "map_inc",
    "map_pause",
    "map_play",
    "map_remove",
    "map_split",
    "marker_L",
    "marker_R",
    "radar",
    "share",
    "shoe",
    "trash",
    "whiteshoe",
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


const effect_names = {

    "snd_round_30s": "smw_coin.normalized.wav",
    "snd_round_10s": "smw_power-up.normalized.wav",
    "snd_round_start": "bell_2.normalized.wav",
    "snd_round_end": "bell_1.normalized.wav",
    "snd_rest_3s": "004B_000F.normalized.wav",
}

export const effects = {};
Object.keys(effect_names).forEach(key => {effects[key] = platform_effect_prefix + effect_names[key]})
