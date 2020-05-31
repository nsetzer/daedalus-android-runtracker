

from module daedalus import {DomElement}

from module resources import {svg}

const meters_per_mile = 1609.34
const spm_to_mpk = 1000.0 / 60.0 // minutes per kilomter
const spm_to_mpm = meters_per_mile / 60.0  // minutes per mile

const style = {
    body: StyleSheet({
        margin:0,
        padding:0,
        'overflow-y': 'scroll',
        //background: {color: '#CCCCCC'},
    }),

    app: StyleSheet({
        display: "flex",
        flex-direction: "column",
        justify-content: "flex-begin",
        align-items: "center",
        margin: '0',
        width: '100%',
        height: '100vh',
        background-image: "linear-gradient(90deg, rgba(62, 68, 74, 0.5), rgba(192, 192, 192, 0.4), rgba(91, 96, 105, 0.5)), repeating-linear-gradient(0deg, rgba(1, 5, 8, 0.26), rgba(189, 189, 189, 0.4) 2.5px), repeating-linear-gradient(0deg, rgba(2, 23, 38, 0.32), rgba(192, 192, 192, 0.4) 2.7px), repeating-linear-gradient(0deg, rgba(58, 65, 71, 0.60), rgba(224, 226, 227, 0.3) 3.0px), repeating-linear-gradient(0deg, rgba(91, 95,  98, 0.5), rgba(55, 170, 233, 0.26) 4.5px)",
    }),

    appButtons: StyleSheet({
        background-color: "black",
        display: "flex",
        position: "fixed",
        bottom: 0,
        right: 0,
        left: 0,
        flex-direction: "row",
        //justify-content: "center",
        align-items: "center",
        padding-top: "1em",
        padding-bottom: "1em",
        padding-left: "1em",
        padding-right: "1em",
    }),
    svgButton: StyleSheet({
    }),

    hide: StyleSheet({
        display: "none",
    }),

    titleText: StyleSheet({
        text-shadow: "-2px -2px 2px #FFFFFF",
        font-size: "1em",
    }),

    smallText: StyleSheet({
        text-shadow: "-2px -2px 2px #FFFFFF",
        font-size: "2em",
    }),

    mediumText: StyleSheet({
        text-shadow: "-2px -2px 2px #FFFFFF",
        font-size: "3em",
    }),

    largeText: StyleSheet({
        text-shadow: "-2px -2px 2px #FFFFFF",
        font-size: "5em",
    }),

    flex_center: StyleSheet({
        justify-content: "center",
    }),

    flex_spread: StyleSheet({
        justify-content: "space-between",
    }),

}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function fmtTime(t) {
    let s = t / 1000
    let m = Math.floor(s / 60)
    s = pad(Math.floor(s % 60), 2);
    let h = Math.floor(s / 60)
    m = pad(m, 2);

    return `${h}:${m}:${s}`
}

class HSpacer extends DomElement {

    constructor(width) {
        super("div", {}, [])
        this.attrs = {width}
    }

    elementMounted() {
        this._setWidth();
    }

    setWidth(width) {
        this.attrs.width = width
        this._setWidth();
    }

    _setWidth() {
        const node = this.getDomNode();

        if (!!node) {
            node.style['max-width'] = this.attrs.width
            node.style['min-width'] = this.attrs.width
            node.style['width'] = this.attrs.width
            node.style['max-height'] = "1px"
            node.style['min-height'] = "1px"
            node.style['height'] = "1px"
        }
    }
}

class Text extends daedalus.DomElement {
    constructor(text, cls) {
        super("div", {className: cls}, [])
        this.attrs.txt = this.appendChild(new daedalus.TextElement(text));
    }

    setText(text) {
        this.attrs.txt.setText(text)
    }
}

class SvgElement extends DomElement {
    constructor(url, props) {
        super("img", {src:url, ...props}, [])
    }

    onLoad(event) {
        console.warn("success loading: ", this.props.src)
    }

    onError(error) {
        console.warn("error loading: ", this.props.src, JSON.stringify(error))
    }
}

class SvgButtonElement extends SvgElement {
    constructor(url, callback) {
        super(url, {width: 96, height: 96, className: style.svgButton});
        this.attrs = {callback};
    }

    onClick(event) {
        if (this.attrs.callback) {
            this.attrs.callback()
        }
    }

    setUrl(url) {
        this.props.src = url;
        this.update()
    }
}

export class App extends daedalus.DomElement {

    constructor() {
        super("div", {className: style.app}, [])

        const body = document.getElementsByTagName("BODY")[0];
        body.className = style.body

        //this.attrs.txt_pos = this.appendChild(new Text("0.00/0.00", style.smallText));
        this.attrs.txt_samples = this.appendChild(new Text("0/0", style.titleText));
        this.appendChild(new Text("distance:", style.titleText));
        this.attrs.txt_dist1 = this.appendChild(new Text("0", style.largeText));
        this.attrs.txt_dist2 = this.appendChild(new Text("0", style.mediumText));
        this.appendChild(new Text("time:", style.titleText));
        this.attrs.txt_time = this.appendChild(new Text("00:00", style.largeText));
        this.appendChild(new Text("current pace: (min./km)", style.titleText));
        this.attrs.txt_pace_cur = this.appendChild(new Text("0", style.mediumText));
        this.appendChild(new Text("average pace: (min./km)", style.titleText));
        this.attrs.txt_pace_avg = this.appendChild(new Text("0", style.smallText));

        this.attrs.dashboard = this.appendChild(new DomElement("div", {className: style.appButtons}))

        let row = this.attrs.dashboard

        this.attrs.btn_stop = row.appendChild(new SvgButtonElement(svg.button_stop, () => {
            if (daedalus.platform.isAndroid && !!Client) {
                Client.enableTracking(false);
            } else {
                this.handleTrackingChanged({state: "stopped"})
            }

            if (this.attrs.timer != null) {
                console.log("clear timer")
                clearInterval(this.attrs.timer);
                this.attrs.timer = null;
            }

        }));

        //this.attrs.spacer_btns = row.appendChild(new HSpacer('128px'));

        this.attrs.btn_play = row.appendChild(new SvgButtonElement(svg.button_play, () => {
            if (daedalus.platform.isAndroid && !!Client) {
                Client.enableTracking(true);
            } else {
                this.handleTrackingChanged({state: "running"})
            }

        }));

        this.attrs.btn_pause = row.appendChild(new SvgButtonElement(svg.button_pause, () => {
            if (daedalus.platform.isAndroid && !!Client) {
                Client.pauseTracking();
            } else {
                console.error("backend not enabled")
                this.handleTrackingChanged({state: "paused"})
            }

        }));

        this.attrs.dashboard.addClassName(style.flex_center)
        this.attrs.btn_stop.addClassName(style.hide)
        //this.attrs.spacer_btns.addClassName(style.hide)
        this.attrs.btn_pause.addClassName(style.hide)

        this.attrs.elapsed_time_ms = 0;
        this.attrs.time_delta = 0;
        this.attrs.timer = null;
        this.attrs.distances1 = 0.0;
        this.attrs.distances2 = 0.0;

        if (!daedalus.platform.isAndroid) {
            const payload = {
                uid: 3,
                lat: 42,
                lon: -71,
                distance: 5000,
                samples: 1234,
                dropped_samples: 123,
                accurate: true,
                elapsed_time_ms: 123456,
                current_pace_spm: .45,
                average_pace_spm: .3,
            }
            this.handleLocationUpdate(payload)
        }

    }

    elementMounted() {
        registerAndroidEvent('onlocationupdate', this.handleLocationUpdate.bind(this))
        registerAndroidEvent('ontrackingchanged', this.handleTrackingChanged.bind(this))

        //this.attr.timer = setInterval(this.handleTimeout.bind(this), 500)
    }

    elementUnmounted() {

        if (this.attrs.timer != null) {
            clearInterval(this.attrs.timer);
            this.attrs.timer = null;
        }
    }

    handleLocationUpdate(payload) {



        // 1: gps
        // 2: network
        // 3: best
        if (payload.uid != 3) {
            //console.log("dropping " + payload.uid)
            return;
        }

        // \xa0/\xa0
        this.attrs.distances1 = (payload.distance/1000).toFixed(3)
        this.attrs.distances2 = (payload.distance*0.000621371).toFixed(2)
        this.attrs.txt_dist1.setText(""+this.attrs.distances1 + "k")
        this.attrs.txt_dist2.setText(""+this.attrs.distances2 + "m")

        //this.attrs.txt_pos.setText(payload.lat.toFixed(3) + "/" + payload.lon.toFixed(3))
        this.attrs.txt_samples.setText(payload.samples + "/" + payload.dropped_samples + ":" + payload.accurate)

        let pace;
        pace = payload.current_pace_spm * 1000 / 60;
        this.attrs.txt_pace_cur.setText(""+pace.toFixed(2))
        pace = payload.average_pace_spm * 1000 / 60;
        this.attrs.txt_pace_avg.setText(""+pace.toFixed(2))

        this.attrs.elapsed_time_ms = payload.elapsed_time_ms
        this.attrs.time_delta = 0

        this.updateDisplayTime();

        if (this.attrs.timer != null) {
            clearInterval(this.attrs.timer);
            this.attrs.timer = null;
        }
        this.attrs.timer = setInterval(this.handleTimeout.bind(this), 500)
    }

    handleTrackingChanged(payload) {

        this.attrs.btn_stop.removeClassName(style.hide)
        //this.attrs.spacer_btns.removeClassName(style.hide)
        this.attrs.btn_play.removeClassName(style.hide)
        this.attrs.btn_pause.removeClassName(style.hide)
        this.attrs.dashboard.removeClassName(style.flex_center)
        this.attrs.dashboard.removeClassName(style.flex_spread)

        this.attrs.current_state = payload.state

        if (payload.state === "running") {
            this.attrs.dashboard.addClassName(style.flex_center)
            this.attrs.btn_stop.addClassName(style.hide)
            //this.attrs.spacer_btns.addClassName(style.hide)
            this.attrs.btn_play.addClassName(style.hide)
        } else if (payload.state === "paused") {
            this.attrs.dashboard.addClassName(style.flex_spread)
            this.attrs.btn_pause.addClassName(style.hide)
            if (this.attrs.timer != null) {
                clearInterval(this.attrs.timer);
                this.attrs.timer = null;
            }
        } else if (payload.state === "stopped") {
            this.attrs.dashboard.addClassName(style.flex_center)
            this.attrs.btn_stop.addClassName(style.hide)
            //this.attrs.spacer_btns.addClassName(style.hide)
            this.attrs.btn_pause.addClassName(style.hide)
        }
    }

    handleTimeout() {

        this.attrs.time_delta += 500
        this.updateDisplayTime();

    }

    updateDisplayTime() {
        if (this.attrs.current_state == "paused") {
            return
        }

        let t = fmtTime(this.attrs.elapsed_time_ms + this.attrs.time_delta)
        this.attrs.txt_time.setText(t)
    }
}
