

from module daedalus import {DomElement, StyleSheet}

from module resources import {svg}
import module router
import module components
import module api

const meters_per_mile = 1609.34
const spm_to_mpk = 1000.0 / 60.0 // minutes per kilomter
const spm_to_mpm = meters_per_mile / 60.0  // minutes per mile

const spm_color_map_blue_green = [
    "#A0A0A0",  // -: ---
    "#000080",  // 0: 0.1
    "#002060",  // 1: 0.2
    "#004040",  // 2: 0.3
    "#006020",  // 3: 0.4
    "#008000",  // 4: 0.5
    "#006600",  // 5: 0.6
    "#004D00",  // 6: 0.7
    "#003300",  // 7: 0.8
    "#001A00",  // 8: 0.9
    "#000000",  // 9: 1.0
]

const spm_color_map_autumn = [
    "#A0A0A0",  // -: ---
    "#FFFF00",  // 0: 0.1
    "#FFDF00",  // 1: 0.2
    "#FFC000",  // 2: 0.3
    "#FFA000",  // 3: 0.4
    "#EF7800",  // 4: 0.5
    "#E05000",  // 5: 0.6
    "#D02800",  // 6: 0.7
    "#C00000",  // 7: 0.8
    "#600000",  // 8: 0.9
    "#000000",  // 9: 1.0
]

const spm_color_map = spm_color_map_autumn;

function spm_get_color(spm) {
    const v = Math.floor(spm * 10)
    if (v >= spm_color_map.length) {
        return "#000000"
    }
    return spm_color_map[v]
}

const style = {
    body: StyleSheet({
        margin:0,
        padding:0,
        'overflow-y': 'scroll',
        //background: {color: '#CCCCCC'},
    }),

    header: StyleSheet({
        'text-align': 'center',
        'position': 'sticky',
        'background': '#000',
        top:0,
        //left:0,
        //right:0,
        width: "100%",
        margin-bottom: ".5em",
        padding-top: ".5em",
        padding-bottom: ".5em",
        min-height:"16px",
        'box-shadow': '0 .25em .3em 0 rgba(0,0,0,0.50)',
        z-index: 10000
    }),

    headerDiv: StyleSheet({
        display: 'flex',
        'flex-direction': 'column',
        'justify-content': 'flex-start',
        'align-items': 'center',
    }),

    toolbar: StyleSheet({
        display: 'flex',
        'flex-direction': 'row',
        'justify-content': 'flex-start',
        'align-items': 'center',
        width: '100%',
    }),

    toolbarInner: StyleSheet({
        display: 'flex',
        'flex-direction': 'row',
        'padding-left': '1em',
        'padding-right': '1em',
        'align-items': 'center',
        'justify-content': 'center',
    }),

    app: StyleSheet({
        display: "flex",
        flex-direction: "column",
        justify-content: "flex-begin",
        align-items: "center",
        margin: '0',
        width: '100%',
        height: '100%',
        min-height: '100vh',
        //background-image: "linear-gradient(90deg, rgba(62, 68, 74, 0.5), rgba(192, 192, 192, 0.4), rgba(91, 96, 105, 0.5)), repeating-linear-gradient(0deg, rgba(1, 5, 8, 0.26), rgba(189, 189, 189, 0.4) 2.5px), repeating-linear-gradient(0deg, rgba(2, 23, 38, 0.32), rgba(192, 192, 192, 0.4) 2.7px), repeating-linear-gradient(0deg, rgba(58, 65, 71, 0.60), rgba(224, 226, 227, 0.3) 3.0px), repeating-linear-gradient(0deg, rgba(91, 95,  98, 0.5), rgba(55, 170, 233, 0.26) 4.5px)",
        background-image: "linear-gradient(90deg, rgba(93, 102, 111, 0.5), rgba(192, 192, 192, 0.4), rgba(91, 96, 105, 0.5)), repeating-linear-gradient(0deg, rgba(40, 45, 48, 0.26), rgba(189, 189, 189, 0.4) 2.5px), repeating-linear-gradient(0deg, rgba(20, 43, 88, 0.32), rgba(192, 192, 192, 0.4) 2.7px), repeating-linear-gradient(0deg, rgba(58, 65, 71, 0.60), rgba(224, 226, 227, 0.3) 3.0px), repeating-linear-gradient(0deg, rgba(91, 95,  98, 0.5), rgba(55, 170, 233, 0.26) 4.5px)",
    }),

    appTracker: StyleSheet({
        height: "calc(100% - 1em - 96px)",
        min-height: "calc(100vh - 1em - 96px)",
        justify-content: "space-between",
    }),

    paceRow: StyleSheet({
        display: "flex",
        flex-direction: "row",
        justify-content: "space-between",
        align-items: "center",
        width: "100%"
    }),

    paceCol: StyleSheet({
        display: "flex",
        flex-direction: "column",
        justify-content: "center",
        align-items: "center",
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
        padding-top: ".5em",
        padding-bottom: ".5em",
        padding-left: "1em",
        padding-right: "1em",
        'box-shadow': '0 -.25em .3em 0 rgba(0,0,0,0.50)',
    }),

    svgButton: StyleSheet({
    }),

    hide: StyleSheet({
        display: "none",
    }),

    invisible: StyleSheet({
        visibility: "hidden",
    }),

    headerText: StyleSheet({
        font-size: "1em",
        font-weight: "bold",
        color: "white",
    }),

    titleText: StyleSheet({
        font-size: "1em",
        font-weight: "bold",
    }),

    smallText: StyleSheet({
        //text-shadow: "-2px -2px 2px #FFFFFF",
        font-family: "roboto",
        font-weight: "600",
        font-size: "2em",
    }),

    mediumText: StyleSheet({
        //text-shadow: "-2px -2px 2px #FFFFFF",
        font-family: "roboto",
        font-weight: "600",
        font-size: "3.5em",
    }),

    largeText: StyleSheet({
        //text-shadow: "-2px -2px 2px #FFFFFF",
        font-family: "roboto",
        font-weight: "900",
        font-size: "5em",
        margin-top: "-.1em",
        margin-bottom: "-.2em"
    }),

    dateText: StyleSheet({
        font-size: "2em",
        font-weight: "bold",
    }),

    flex_center: StyleSheet({
        justify-content: "center",
    }),

    flex_spread: StyleSheet({
        justify-content: "space-between",
    }),

    logView: StyleSheet({
        'padding-left': '1em',
        'padding-right': '1em',
        'width': 'calc(100% - 2em)'
    }),

    logItem: StyleSheet({
        display: 'flex',
        'flex-direction': 'row',
        padding: "1em",
        margin-bottom: '.5em',
        border: {style: "solid", width: "1px"},
        width: 'calc(100% - 2em - 2px)', // minus border width * 2
        background-color: "white",
        'box-shadow': '.25em .25em .3em 0 rgba(0,0,0,0.50)',
    }),

    logItemCol1: StyleSheet({
        display: 'flex',
        'flex-direction': 'column',
        justify-content: "space-between",
        width: "4em",
    }),

    logItemCol2: StyleSheet({
        display: 'flex',
        'flex-direction': 'column',
        'flex-grow': '1',
        padding: ".5em",
    }),

    logItemRowTitle: StyleSheet({
        display: 'flex',
        'flex-direction': 'row',
        justify-content: "center",
        align-items: "center",
    }),

    logItemRowInfo: StyleSheet({
        display: 'flex',
        'flex-direction': 'row',
        justify-content: "space-between",
        align-items: "center",
    }),

    logItemActions: StyleSheet({
        display: 'flex',
        'flex-direction': 'row',
        justify-content: "space-between",
        align-items: "center",
        padding-top: "1em"
    }),

    logEntryView: StyleSheet({
        'padding-left': '1em',
        'padding-right': '1em',
        'padding-top': '1em',
        'padding-bottom': '1em',
        'width': 'calc(100% - 2em - 2px)',
        background-color: "white",
        border: {style: "solid", width: "1px"},
        'box-shadow': '.25em .25em .3em 0 rgba(0,0,0,0.50)',
    }),

    map: StyleSheet({
        height: "calc(70vh - 3em)",
        width: "calc(100% - 2px)",
        margin-top: "-1em",
        border: {style: "solid", width: "1px"},
    }),

    map2: StyleSheet({
        height: "calc(100vh - 4em)",
        width: "calc(100% - 2px)",
        margin-top: "-1em",
        border: {style: "solid", width: "1px"},
    }),


    chart: StyleSheet({
        height: "50vh",
        max-height: "50vh",
        width: "50vw",
        width: "100vw",
        margin-top: "-1em",
        //border: {style: "solid", width: "1px"},
        background-color: "white"
    }),

    trackBar: StyleSheet({
        position: "relative",
        height: "1em",
        max-height: "1em",
        min-height: "1em",
        width:"calc(100% - 2em)",
        "margin-top": "1em",
        "padding": "1em",
        user-select: "none",
    }),

    trackBar_bar: StyleSheet({
        position: "absolute",
        height: ".75em",
        max-height: ".75em",
        min-height: ".75em",
        top: "1.25em",
        left: "10vw",
        right: "10vw",

        //background: "black",
        //border-radius: "1em",
        //border-width: "1px",
        //border-style: "solid",
        //border-color: "black",
        user-select: "none",
    }),

    trackBar_button: StyleSheet({
        position: "absolute",
        height: "1.5em",
        max-height: "1.5em",
        min-height: "1.5em",
        width:"1.5em",
        top: ".5em",
        user-select: 'none',
        //background-color: "#FF000077"
    }),

    switchMain: StyleSheet({
        position: 'relative',
        width: '3em',
        height: '1em',
        background-color: '#777777',
        cursor: 'pointer',
        border-style: "solid",
        border-color: "#777777",
        border-size: "2px",
        border-radius: "1em",
        transition: '.4s',
        user-select: 'none',
    }),

    switchMainActive: StyleSheet({
        background-color: '#008000',
        border-color: "#008000",
    }),
    switchButton: StyleSheet({
        position: 'absolute',
        top: '0',
        left: '0',
        width: "1em",
        height: "1em",
        border-radius: "1em",
        background-color: '#DDDDDD',
        transition: '.4s',
        user-select: 'none',
    }),
    switchButtonActive: StyleSheet({
        left: '2em',
        background-color: '#AAAAAA',
    }),

    settingsRow: StyleSheet({
        display: "flex",
        flex-direction: "row",
        justify-content: "space-between",
        align-items: "center",
        width: "calc(100% - 4em)",
        padding-left: "2em",
        padding-right: "2em",
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
    let h = Math.floor(m / 60)
    m = m % 60
    if (h > 0) {
        m = pad(m, 2);
        return `${h}:${m}:${s}`
    } else {
        return `${m}:${s}`
    }
}

function fmtPace(s) {
    s = s * 60
    let m = Math.floor(s / 60)
    s = pad(Math.floor(s % 60), 2);
    return `${m}:${s}`
}

class Div extends daedalus.DomElement {
    constructor(className, children) {
        super("div", {className}, children)
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

class SwitchElement extends Div {

    constructor() {
        super(style.switchMain)
        this.attrs.btn = this.appendChild(new Div(style.switchButton))
    }

    onClick() {
        if (this.attrs.btn.hasClassName(style.switchButtonActive)) {
            this.attrs.btn.removeClassName(style.switchButtonActive)
            this.removeClassName(style.switchMainActive)
        } else {
            this.attrs.btn.addClassName(style.switchButtonActive)
            this.addClassName(style.switchMainActive)
        }
    }

    isChecked() {
        return this.attrs.btn.hasClassName(style.switchButtonActive)
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
    constructor(url, callback, size=96) {
        super(url, {width: size, height: size, className: style.svgButton});
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

class NavHeader extends DomElement {

    constructor() {
        super("div", {className: style.header}, []);

        this.attrs = {
            div: new DomElement("div", {className: style.headerDiv}, []),
            toolbar: new DomElement("div", {className: style.toolbar}, []),
            toolbarInner: new DomElement("div", {className: style.toolbarInner}, []),
        }

        this.appendChild(this.attrs.div)
        this.attrs.div.appendChild(this.attrs.toolbar)
        this.attrs.toolbar.appendChild(this.attrs.toolbarInner)

    }

    addAction(icon, callback) {
        this.attrs.toolbarInner.appendChild(
            new SvgButtonElement(icon, callback, 32))
        this.attrs.toolbarInner.appendChild(new components.HSpacer("1em"))
    }

    addElement(element) {
        this.attrs.toolbarInner.appendChild(element)
        return element
    }

    hideIcons(bHide) {
        if (!!bHide) {
            this.attrs.toolbarInner.addClassName(style.invisible)
        } else {
            this.attrs.toolbarInner.removeClassName(style.invisible)
        }
    }
}

class TrackerPage extends daedalus.DomElement {

    constructor() {
        super("div", {className: [style.app, style.appTracker]}, [])

        this.attrs.header = this.appendChild(new NavHeader())

        this.attrs.header.addAction(resources.svg.gear, ()=>{
            router.navigate(router.routes.settings())
        })
        this.attrs.header.addElement(new components.HSpacer("1em"));
        this.attrs.header.addAction(resources.svg.whiteshoe, ()=>{
            router.navigate(router.routes.log())
        })
        this.attrs.header.addElement(new components.HSpacer("1em"));
        this.attrs.header.addAction(resources.svg.map, ()=>{
            router.navigate(router.routes.plan())
        })
        this.attrs.header.addElement(new components.HSpacer("1em"));

        //this.attrs.txt_samples = this.attrs.header.addElement(new Text("0/0", style.headerText));

        //this.attrs.txt_pos = this.appendChild(new Text("0.00/0.00", style.smallText));

        this.attrs.distRow = this.appendChild(new Div(style.paceCol))

        this.attrs.distRow.appendChild(new Text("Distance:", style.titleText));
        this.attrs.txt_dist1 = this.attrs.distRow.appendChild(new Text("0", style.largeText));
        this.attrs.txt_dist2 = this.attrs.distRow.appendChild(new Text("0", style.mediumText));

        this.attrs.timeRow = this.appendChild(new Div(style.paceCol))
        this.attrs.timeRow.appendChild(new Text("Time:", style.titleText));
        this.attrs.txt_time = this.attrs.timeRow.appendChild(new Text("00:00", style.largeText));

        this.attrs.paceRow = this.appendChild(new Div(style.paceRow))
        this.attrs.paceRow.appendChild(new Div(null))
        this.attrs.paceCol1 = this.attrs.paceRow.appendChild(new Div(style.paceCol))
        this.attrs.paceRow.appendChild(new Div(null))
        this.attrs.paceCol2 = this.attrs.paceRow.appendChild(new Div(style.paceCol))
        this.attrs.paceRow.appendChild(new Div(null))

        this.attrs.paceCol1.appendChild(new Text("Current Pace: (min./km)", style.titleText));
        this.attrs.txt_pace_cur = this.attrs.paceCol1.appendChild(new Text("0", style.mediumText));
        this.attrs.paceCol2.appendChild(new Text("Average Pace: (min./km)", style.titleText));
        this.attrs.txt_pace_avg = this.attrs.paceCol2.appendChild(new Text("0", style.mediumText));

        this.appendChild(new Div(null))

        this.attrs.dashboard = this.appendChild(new DomElement("div", {className: style.appButtons}))

        let row = this.attrs.dashboard

        this.attrs.btn_stop = row.appendChild(new SvgButtonElement(svg.button_stop, () => {
            if (daedalus.platform.isAndroid && !!Client) {
                Client.enableTracking(false);
            } else {
                this.handleTrackingChanged({state: "stopped"})
            }

            if (this.attrs.timer != null) {
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
                distance: 333*1000,
                samples: 1234,
                dropped_samples: 123,
                accurate: true,
                elapsed_time_ms: 12 * 60 * 60 * 1000 + 34 * 60 * 1000 + 56 * 1000,
                current_pace_spm: 4.0,
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
        //this.attrs.txt_samples.setText(payload.samples + "/" + payload.dropped_samples + ":" + payload.accurate)

        this.attrs.txt_pace_cur.setText(fmtPace(payload.current_pace_spm * spm_to_mpk))
        this.attrs.txt_pace_avg.setText(fmtPace(payload.average_pace_spm * spm_to_mpk))

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

        this.attrs.header.hideIcons(payload.state !== "stopped")

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

        if (this.attrs.current_state == "paused" && this.attrs.timer != null) {
            clearInterval(this.attrs.timer);
            this.attrs.timer = null;
        }

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

class SettingsPage extends daedalus.DomElement {
    constructor() {
        super("div", {className: style.app}, [])

        this.attrs.header = this.appendChild(new NavHeader())

        this.attrs.header.addAction(resources.svg.back, ()=>{
            router.navigate(router.routes.landing())
        })


        let row;
        this.appendChild(new components.VSpacer("1em"))
        row = this.appendChild(new Text("Distance Settings", style.smallText))
        this.appendChild(new components.VSpacer("1em"))

        row = this.appendChild(new Div(style.settingsRow))
        row.appendChild(new Text("Display Kilometers", style.smallText))
        row.appendChild(new SwitchElement())

        row = this.appendChild(new Div(style.settingsRow))
        row.appendChild(new Text("Display Miles", style.smallText))
        row.appendChild(new SwitchElement())

        this.appendChild(new components.VSpacer("1em"))
        row = this.appendChild(new Text("Pace Settings", style.smallText))
        this.appendChild(new components.VSpacer("1em"))

        row = this.appendChild(new Div(style.settingsRow))
        row.appendChild(new Text("Min. per Km", style.smallText))
        row.appendChild(new SwitchElement())

        row = this.appendChild(new Div(style.settingsRow))
        row.appendChild(new Text("Min. per Mile", style.smallText))
        row.appendChild(new SwitchElement())

    }
}

const month_short_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

class LogListItem extends daedalus.DomElement {
    constructor(parent, item) {
        super("div", {className: style.logItem}, [])

        this.attrs.parent = parent;
        this.attrs.item = item;

        let dt = new Date(0);
        dt.setUTCSeconds(item.start_date)

        let col1 = this.appendChild(new daedalus.DomElement("div", {className: style.logItemCol1}))
        let col2 = this.appendChild(new daedalus.DomElement("div", {className: style.logItemCol2}))

        let date = pad(dt.getFullYear(), 2) + "/" + pad(1+dt.getMonth(), 2) + "/" + pad(dt.getDate(), 2)
        let time = dt.getHours() + ":" + pad(dt.getMinutes(), 2)
        let pace = fmtPace(item.average_pace_spm * spm_to_mpk)
        let dist = (item.distance/1000.0).toFixed(3) + " k"


        let tmp
        tmp = col1.appendChild(new daedalus.DomElement("div", {className: style.logItemRowTitle}, []))
        tmp.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`${month_short_names[dt.getMonth()]}`)]))

        tmp = col1.appendChild(new daedalus.DomElement("div", {className: [style.logItemRowTitle, style.dateText]}, []))
        tmp.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`${pad(dt.getDate(), 2)}`)]))

        tmp = col1.appendChild(new daedalus.DomElement("div", {className: style.logItemRowTitle}, []))
        tmp.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`${dt.getFullYear()}`)]))

        tmp = col1.appendChild(new daedalus.DomElement("div", {className: style.logItemRowTitle}, []))
        tmp.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(time)]))

        this.attrs.row2 = col2.appendChild(new daedalus.DomElement("div", {className: style.logItemRowInfo}, []))
        this.attrs.row2.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`Distance:`)]))
        this.attrs.row2.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`${dist}`)]))

        this.attrs.row3 = col2.appendChild(new daedalus.DomElement("div", {className: style.logItemRowInfo}, []))
        this.attrs.row3.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`Elapsed Time:`)]))
        this.attrs.row3.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`${fmtTime(item.elapsed_time_ms)}`)]))

        this.attrs.row4 = col2.appendChild(new daedalus.DomElement("div", {className: style.logItemRowInfo}, []))
        this.attrs.row4.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`Average Pace:`)]))
        this.attrs.row4.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`${pace}`)]))

        this.attrs.row5 = col2.appendChild(new daedalus.DomElement("div", {className: style.logItemActions}, []))
        this.attrs.row5.appendChild(new daedalus.DomElement("div"))
        this.attrs.row5.appendChild(new daedalus.ButtonElement("Details", this.handleDetailsClicked.bind(this)))
        this.attrs.row5.appendChild(new daedalus.DomElement("div"))
    }

    handleDetailsClicked() {
        router.navigate(router.routes.logEntry({entry:this.attrs.item.spk}))
    }
}

class LogListView extends daedalus.DomElement {
    constructor() {
        super("div", {className: style.logView}, [])
    }


    clear() {
        this.removeChildren();
    }

    addItem(item) {
        this.appendChild(new LogListItem(this, item))
    }
}

class LogPage extends daedalus.DomElement {
    constructor() {
        super("div", {className: style.app}, [])

        this.attrs.header = this.appendChild(new NavHeader())

        this.attrs.header.addAction(resources.svg.back, ()=>{
            router.navigate(router.routes.landing())
        })

        this.attrs.view = this.appendChild(new LogListView())

    }

    elementMounted() {

        if (daedalus.platform.isAndroid && !!Client) {
            new Promise((accept, reject) => {
                try {
                    let srecords = Client.getRecords()
                    accept(JSON.parse(srecords))
                } catch (e) {
                    reject("" + e)
                }
            }).then(this.receiveRecords.bind(this))
              .catch(console.error)
        } else {
            const sample  = {
                "spk": 0,
                "start_date": 0,
                "num_splits": 1,
                "elapsed_time_ms": 1234000,
                "distance": 3200.18888,
                "average_pace_spm": .5,
                "log_path": ""
            }

            this.attrs.view.clear()
            this.attrs.view.addItem(sample)
            this.attrs.view.addItem(sample)
            this.attrs.view.addItem(sample)
            this.attrs.view.addItem(sample)
            this.attrs.view.addItem(sample)
            this.attrs.view.addItem(sample)
            this.attrs.view.addItem(sample)
        }
    }

    receiveRecords(records) {

        this.attrs.view.clear()
        records.forEach(item => {
            this.attrs.view.addItem(item)
        })
    }
}

class Map extends daedalus.DomElement {

    constructor() {
        super("div", {className: style.map}, [])
        this.attrs.routes = []

    }

    displayMap(bounds) {
        this.attrs.map = L.map(this.props.id)//.setView(pt, 15)
        //this.attrs.map = L.map(this.props.id).setView([40.14083943, -74.19391519], 13)

        // .setView(point, zoom);

        /*
        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            maxZoom: 17,
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }).addTo(this.attrs.map);
        */

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.attrs.map);

        this.attrs.map.fitBounds(bounds);
    }

    displayRoute(segments) {

        while (this.attrs.routes.length > 0) {
            let route = this.attrs.routes.pop()
            this.attrs.map.removeLayer(route)
        }

        this.attrs.routes = []


        try {
            // layers overlap with newest layer on top
            // display in reverse so that when zoomed out
            // it is easier to see faster paces.
            this._displaySegment(segments[0], spm_color_map[0])
            for (let i=segments.length - 1; i > 0; i--) {
                this._displaySegment(segments[i], spm_color_map[i])
            }
        } catch (err) {
            console.error("" + err);
        }


    }

    _displaySegment(segment, color) {

        if (segment.length > 0) {

            segment = segment.map(t=>{return t.map(p=>{return [p[0], p[1]]})})


            let route = L.polyline(segment, {color: color, weight: 4})
                .addTo(this.attrs.map);
            this.attrs.routes.push(route)
        }
    }
}

function pt(x,y) {
    return {x, y}
}

class LineChart extends daedalus.DomElement {
    constructor() {
        super("canvas", {className: style.chart}, [])

        this.attrs.chart = null;
        this.attrs.data = null;
    }

    getSettings() {
        return {
            type: ["line"],
            data: {
                datasets: [{
                    label: "average pace",
                    data: [],
                    backgroundColor: "#000000",
                    borderColor: "#000000",
                    pointRadius: 0,
                    borderWidth: 2,
                    fill: false
                }, {
                    label: "current pace",
                    data: [],
                    backgroundColor: "#008000",
                    borderColor: "#008000",
                    pointRadius: 0,
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom',
                        ticks: {
                            beginAtZero: false,
                            callback: (value, index, values) => fmtTime(value*1000);
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        }
                    }]
                }
            }
        }
    }

    elementMounted() {
        if (this.attrs.chart === null) {
            let ctxt = this.getDomNode().getContext('2d');
            console.log("construct new chart")
            this.attrs.chart = new Chart(ctxt, this.getSettings())

            if (this.attrs.data !== null) {
                this.setData(this.attrs.data)
            }
        }
    }

    elementUnmounted() {

        if (this.attrs.chart !== null) {
            this.attrs.chart.destroy()
            this.attrs.chart = null
        }
    }

    setData(data) {

        if (this.attrs.chart !== null) {
            let ds = this.attrs.chart.data.datasets;
            ds[0].data = data[0]
            ds[1].data = data[1]
            this.attrs.chart.update();
        }

        this.attrs.data = data
    }
}

class TrackBarTrack extends DomElement {
    constructor() {
        super("div", {className: style.trackBar_bar}, [])
    }
}

class TrackBarButton extends DomElement {
    constructor(img) {
        super("div", {className: [style.trackBar_button]}, [])
        this.attrs.img = img;
    }

    elementMounted() {
        let nd = this.getDomNode()
        nd.style['background-image'] = "url(" + this.attrs.img + ")";
        nd.style['background-size'] = "contain";
    }
}

class TrackBar extends DomElement {
    constructor(callback) {
        super("div", {className: style.trackBar}, [])

        this.attrs = {
            callback,
            pressed: false,
            posA: 0,
            posB: 0,
            maximum: 1.0,
            tposA: 0,
            tposB: 0,
            startx: [0,0],
            track: this.appendChild(new TrackBarTrack()),
            btnMin: this.appendChild(new TrackBarButton(resources.svg.marker_L)),
            btnMax: this.appendChild(new TrackBarButton(resources.svg.marker_R)),
            active_btn: -1,
        }
    }

    setTrackColor(color) {
        let nd = this.attrs.track.getDomNode()
        if (!!nd) {
            nd.style.background = color;
        }
    }

    setPosition(start, end, maximum=1.0) {
        let posA = 0;
        let posB = 0;

        if (maximum > 0) {
            posA = start;
            posB = end;
        }

        if ( posA > posB) {
            posA = posB
        }

        this.attrs.posA = posA;
        this.attrs.posB = posB;
        this.attrs.tposA = posA / maximum;
        this.attrs.tposB = posB / maximum;
        this.attrs.maximum = maximum;

        const btnMin = this.attrs.btnMin.getDomNode();
        const btnMax = this.attrs.btnMax.getDomNode();
        const ele = this.attrs.track.getDomNode();

        if (btnMin && ele) {
            this._setPosition(btnMin, ele, this.attrs.tposA, 0)
        }

        if (btnMax && ele) {
            this._setPosition(btnMax, ele, this.attrs.tposB, 1)
        }
    }

    _setPosition(btn, ele, tpos, align) {

        let m2 = ele.clientWidth;
        let m1 = 0;

        let x = m1 + tpos * m2

        if (x > m2) {
            x = m2;
        } else if (x < m1) {
            x = m1
        }

        x += ele.offsetLeft - btn.clientWidth / 2

        this.attrs.startx[align] = Math.floor(x) + "px";

        if (!this.attrs.pressed) {
            btn.style.left = this.attrs.startx[align]
        }
    }

    onMouseDown(event) {
        this.trackingStart(event);
        this.trackingMove(event);
    }

    onMouseMove(event) {
        if (!this.attrs.pressed) {
            return;
        }
        this.trackingMove(event);
    }

    onMouseLeave(event) {
        if (!this.attrs.pressed) {
            return;
        }
        this.trackingEnd(false);
    }

    onMouseUp(event) {
        if (!this.attrs.pressed) {
            return;
        }
        this.trackingMove(event);
        this.trackingEnd(true);
    }

    onTouchStart(event) {
        this.trackingStart(event);
        this.trackingMove(event);
    }

    onTouchMove(event) {
        if (!this.attrs.pressed) {
            return;
        }

        this.trackingMove(event);
    }

    onTouchCancel(event) {
        if (!this.attrs.pressed) {
            return;
        }
        this.trackingEnd(false);
    }

    onTouchEnd(event) {
        if (!this.attrs.pressed) {
            return;
        }
        this.trackingMove(event);
        this.trackingEnd(true);
    }

    trackingStart() {

        const btnMin = this.attrs.btnMin.getDomNode();
        const btnMax = this.attrs.btnMax.getDomNode();
        this.attrs.startx[0] = btnMin.style.left
        this.attrs.startx[1] = btnMax.style.left
        this.attrs.pressed = true
        this.attrs.active_btn = -1
    }

    trackingEnd(accept) {
        const btnMin = this.attrs.btnMin.getDomNode();
        const btnMax = this.attrs.btnMax.getDomNode();
        const ele = this.attrs.track.getDomNode();
        this.attrs.pressed = false
        if (accept) {
            let p1 = Math.floor(this.attrs.tposA * this.attrs.maximum)
            let p2 = Math.floor(this.attrs.tposB * this.attrs.maximum)

            this.attrs.posA = p1
            this.attrs.posB = p2

            //console.log(`assign a: ${this.attrs.tposA * ele.clientWidth} b: ${this.attrs.tposB * ele.clientWidth}`)

            //console.log(`assign w: ${ele.clientWidth} a: ${btnMin.style.left} b: ${btnMax.style.left}`)

            if (this.attrs.callback) {
                this.attrs.callback(p1, p2)
            }
        } else {
            btnMin.style.left = this.attrs.startx[0];
            btnMax.style.left = this.attrs.startx[1];
        }
        this.attrs.active_btn = -1
    }

    trackingMove(event) {
        let org_event = event;

        let evt = (event?.touches || event?.originalEvent?.touches)
        if (evt) {
            event = evt[0]
        }

        if (!event) {
            return
        }

        const btnMin = this.attrs.btnMin.getDomNode();
        const btnMax = this.attrs.btnMax.getDomNode();
        const ele = this.attrs.track.getDomNode();
        const rect = ele.getBoundingClientRect();
        let x = event.pageX - rect.left;

        if (this.attrs.active_btn == -1) {
            let x1 = parseInt(btnMin.style.left, 10);
            let x2 = parseInt(btnMax.style.left, 10);
            let d1 = Math.abs(x - x1);
            let d2 = Math.abs(x - x2);

            if (x > x2) {
                this.attrs.active_btn = 1;
            } else if (x < x1) {
                this.attrs.active_btn = 0;
            } else if (d1 < d2 ) {
                this.attrs.active_btn = 0;
            } else {
                this.attrs.active_btn = 1;
            }
        }

        let btn;
        if (this.attrs.active_btn===0) {
            btn = btnMin;
        } else {
            btn = btnMax;
        }

        //let offset = parseFloat(getComputedStyle(ele).fontSize)
        let offset = ele.offsetLeft

        let m2 = ele.clientWidth
        let m1 = 0;

        if (x > m2) {
            x = m2;
        } else if (x < m1) {
            x = m1
        }

        let tpos = (m2 > 0 && x >= 0) ? (x - m1) / m2 : 0.0;

        if (this.attrs.active_btn === 0) {

            if (tpos > this.attrs.tposB) {
                tpos = this.attrs.tposB;
            }
            this.attrs.tposA = tpos
        } else {
            if (tpos < this.attrs.tposA) {
                tpos = this.attrs.tposA;

            }
            this.attrs.tposB = tpos
        }


        let xpos = m1 + tpos * m2

        if (xpos > m2) {
            xpos = m2;
        } else if (xpos < m1) {
            xpos = m1
        }

        // the position of the marker needs to be offset
        // relative to the offset of the track, and also
        // centered on the svg
        xpos += ele.offsetLeft - btn.clientWidth / 2

        btn.style.left = Math.floor(xpos) + "px";
    }
}

function points2segments(points, start, end) {
    const N_SEGMENTS = 10;
    if (start === undefined || start < 0) {
        start = 0
    }
    if (end === undefined || end > points.length) {
        end = points.length
    }

    const segments = []
    for (let j=0; j < N_SEGMENTS + 1; j++) {
        segments.push([])
    }

    let point = null
    let prev_point = null
    let prev_index = -1
    let current_segment = null

    let distance = 0.0
    let delta_t = 0

    let i=0;
    for (i=start; i < end; i++) {
        let [lat, lon, index, d, t] = points[i]

        point = [lat, lon]

        if (index > 0) {
            distance += d;
            delta_t += t;
        }

        if (prev_index !== index) {
            if (prev_point!==null) {
                if (current_segment !== null && current_segment.length > 0) {
                    segments[prev_index].push(current_segment)
                }
                current_segment = []
                current_segment.push(prev_point)
                current_segment.push(point)
                prev_index = index;
            }
        } else if (current_segment !== null) {
            current_segment.push(point)
            prev_index = index;
        }

        prev_point = point;

    }

    if (current_segment !== null && current_segment.length > 0) {
        segments[prev_index].push(current_segment)
    }


    return [distance, delta_t, segments]
}

function points2gradient(points, start, end) {
    const N_MAX_SEGMENTS = 50;
    if (start === undefined || start < 0) {
        start = 0
    }
    if (end === undefined || end > points.length) {
        end = points.length
    }

    const gradient = []


    if (end - start < N_MAX_SEGMENTS) {
        for (let i=start; i < end; i++) {
            let [lat, lon, index, d, t] = points[i]

            if (index >= 0) {
                gradient.push(spm_color_map[index])
            }
        }

    } else {
        let N = Math.floor((end - start) / N_MAX_SEGMENTS);
        for (let i=start; i < end; i += N) {

            let data = points
                .slice(i, i+N)
                .map(item => item[2])
                .filter(v => v >= 0)

            let index = Math.floor(data.reduce((a, b) => a + b, 0) / data.length)

            gradient.push(spm_color_map[index])

        }
    }
    //background: linear-gradient(90deg, #F00, #0F0, #00F);
    return `linear-gradient(90deg, ${gradient.join(",")})`
}

function filt(b) {
    const values = [];
    let mapfn = (v, i) => v * b[i];
    let redfn = (v1, v2) => v1+ v2;
    return (p) => {

        values.push(p)

        if (values.length > b.length) {
            values.shift()
        }

        if (b.length == values.length) {
            return values.map(mapfn).reduce(redfn, 0.0)
        } else {
            return 0.0
        }

    }
}

function points2pace(points, start, end) {
    if (start === undefined || start < 0) {
        start = 0
    }
    if (end === undefined || end > points.length) {
        end = points.length
    }

    const dataset0 = []
    const dataset1 = []

    let distance = 0.0
    let elapsed_time = 0

    let i;
    for (i=0; i < start; i++) {
        let [lat, lon, index, d, t] = points[i]

        if (index < 1) {
            continue;
        }

        distance += d
        elapsed_time += t
    }

    let filter = filt([0.1, 0.1, 0.2, 0.2, 0.4])

    for (i=start; i < end; i++) {
        let [lat, lon, index, d, t] = points[i]

        if (index < 1) {
            continue;
        }

        distance += d
        elapsed_time += t

        let y1 = (distance > 1e-6)?(elapsed_time / 1000.0 / distance):0.0
        dataset0.push(pt(elapsed_time / 1000.0, y1 * spm_to_mpk ))
        let y2 = (d > 1e-6)?(t / 1000.0 / d):0.0


        dataset1.push(pt(elapsed_time / 1000.0, filter(y2) * spm_to_mpk ))
    }

    return [dataset0, dataset1]
}

function points2pace2(points, start, end) {
    if (start === undefined || start < 0) {
        start = 0
    }
    if (end === undefined || end > points.length) {
        end = points.length
    }

    const dataset0 = []
    const dataset1 = []

    let distance = 0.0
    let elapsed_time = 0

    let filter = filt([0.1, 0.1, 0.2, 0.2, 0.4])

    let i;
    for (i=0; i < start; i++) {
        let [lat, lon, index, d, t] = points[i]

        if (index < 1) {
            continue;
        }

        distance += d
        elapsed_time += t

        filter((d > 1e-6)?(t/1000.0/d):0.0)
    }

    let N_POINTS = 200
    let N = end - start
    let step = Math.floor(N / N_POINTS)
    if (step < 1) {
        step = 1;
    }


    for (i=start; i < end; i += step) {

        let ad = 0.0
        let at = 0
        let ap = 0
        let n = 0

        for (let j = i; j < end && j < i + step; j++) {
            let [lat, lon, index, d, t] = points[i]

            if (index < 1) {
                continue;
            }

            ad += d;
            at += t;
            ap += filter((d > 1e-6)?(t/1000.0/d):0.0)
            n += 1;
        }

        distance += ad
        elapsed_time += at

        if  (n > 0) {
            let x = elapsed_time / 1000.0
            let y1 = (distance > 1e-6)?((elapsed_time / 1000.0) / distance):0.0
            let y2 = ap/n

            dataset0.push(pt(x, y1 * spm_to_mpk ))
            dataset1.push(pt(x, y2 * spm_to_mpk ))


        }

    }

    return [dataset0, dataset1]
}

class LogEntryPage extends daedalus.DomElement {
    constructor() {
        super("div", {className: style.app}, [])

        this.attrs.menu = new components.MoreMenu(this.handleMenuClose.bind(this))

        this.attrs.menu.addAction("Delete", ()=>{

            if (daedalus.platform.isAndroid && !!Client) {
                Client.deleteLogEntry(this.state.match.entry)
            }

            router.navigate(router.routes.log())
        }, "danger")

        this.attrs.menu.addAction("Cancel", ()=>{})
        this.appendChild(this.attrs.menu)

        this.attrs.header = this.appendChild(new NavHeader())

        this.attrs.header.addAction(resources.svg.back, ()=>{
            router.navigate(router.routes.log())
        })

        this.attrs.header.addAction(resources.svg.share, ()=>{
            if (daedalus.platform.isAndroid && !!Client) {
                Client.shareLogEntry(this.state.match.entry)
            }
        })

        this.attrs.header.addAction(resources.svg.trash, ()=>{
            this.attrs.menu.show()
        })

        this.attrs.map = this.appendChild( new Map() );


        this.attrs.track = this.appendChild( new TrackBar(this.handleUpdateData.bind(this)) );

        this.attrs.lst = this.appendChild(new daedalus.DomElement("div", {className: style.logEntryView}, []))

        this.appendChild( new components.VSpacer("2em") );
        this.attrs.linechart = this.appendChild( new LineChart() );
        this.appendChild( new components.VSpacer("2em") );

        this.attrs.txt_distance = new daedalus.TextElement('----')
        this.attrs.txt_elapsed = new daedalus.TextElement('----')
        this.attrs.txt_avg_pace = new daedalus.TextElement('----')

        this.attrs.row2 = this.attrs.lst.appendChild(new daedalus.DomElement("div", {className: style.logItemRowInfo}, []))
        this.attrs.row2.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`Distance:`)]))
        this.attrs.row2.appendChild(new daedalus.DomElement("div", {}, [this.attrs.txt_distance]))

        this.attrs.row3 = this.attrs.lst.appendChild(new daedalus.DomElement("div", {className: style.logItemRowInfo}, []))
        this.attrs.row3.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`Elapsed Time:`)]))
        this.attrs.row3.appendChild(new daedalus.DomElement("div", {}, [this.attrs.txt_elapsed]))

        this.attrs.row4 = this.attrs.lst.appendChild(new daedalus.DomElement("div", {className: style.logItemRowInfo}, []))
        this.attrs.row4.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`Average Pace:`)]))
        this.attrs.row4.appendChild(new daedalus.DomElement("div", {}, [this.attrs.txt_avg_pace]))

    }

    elementMounted() {
        if (daedalus.platform.isAndroid && !!Client) {
            new Promise((accept, reject) => {
                try {
                    let srecords = Client.getLogEntry(this.state.match.entry)
                    accept(JSON.parse(srecords))
                } catch (e) {
                    reject("" + e)
                }
            }).then(this.setData.bind(this))
              .catch(console.error)
        } else {

            const sample = {
                "spk": 0,
                "start_date": 0,
                "num_splits": 1,
                "elapsed_time_ms": 1234000,
                "distance": 3200.18888,
                "average_pace_spm": .5,
                "log_path": "",
                points: [],
            }

            let N = 1800
            let lat = 40
            let lon = -75
            sample.points.push([40, -75, -1, 0.0, 0])
            for (let i=0; i < N; i++) {
                let index = 1 + Math.floor(10*i/N)

                lat += 1e-5 * (Math.random() * 10) * ((i>N/2)?-1:1)
                lon -= 1e-5 * (Math.random() * 10)

                sample.points.push([lat, lon, index, 8 - 2 * i / N + Math.random() * .5, 2000])

            }

            this.setData(sample)
        }
    }

    setData(data) {
        if (data?.points?.length > 0) {
            this.attrs.data = data
            const [distance, delta_t, segments] = points2segments(data.points)
            const gradient = points2gradient(data.points);
            const point_data = points2pace2(data.points);

            const bounds = L.latLngBounds(data.points.map(p => [p[0], p[1]]));

            this.attrs.track.setTrackColor(gradient)

            this.attrs.map.displayMap(bounds)
            this.attrs.map.displayRoute(segments)
            this.attrs.linechart.setData(point_data)
            this.attrs.track.setPosition(0, data.points.length, data.points.length)

            let pace = "";
            if (distance > 1e-6) {
                pace = fmtPace((delta_t / 1000 / distance) * spm_to_mpk)
            }
            let time = fmtTime(delta_t)
            let dist = (distance/1000.0).toFixed(3) + " k"

            this.attrs.txt_distance.setText(dist)
            this.attrs.txt_elapsed.setText(time)
            this.attrs.txt_avg_pace.setText(pace)
        }
        else {
            console.error("no data")
        }
    }

    handleUpdateData(start, end) {
        let [distance, delta_t, segments] = points2segments(this.attrs.data.points, start, end)
        const point_data = points2pace2(this.attrs.data.points, start, end);

        this.attrs.map.displayRoute(segments)
        this.attrs.linechart.setData(point_data)

        let pace = "";
        if (distance > 1e-6) {
            pace = fmtPace((delta_t / 1000 / distance) * spm_to_mpk)
        }
        let time = fmtTime(delta_t)
        let dist = (distance/1000.0).toFixed(3) + " k"

        this.attrs.txt_distance.setText(dist)
        this.attrs.txt_elapsed.setText(time)
        this.attrs.txt_avg_pace.setText(pace)
    }

    handleMenuClose() {

    }
}

let DistanceCtrl = L.Control.extend({
  onAdd: function(map) {
    var el = L.DomUtil.create('div', 'leaflet-bar my-control');

    el.innerHTML = 'Distance: 0.000k';
    el.style['font-size']="1.5em"
    el.style.padding=".5em"
    el.style['background-color'] = "white"

    return el;
  },

  onRemove: function(map) {
    // Nothing to do here
  },

  setDistance: function(distance) {
    this.getContainer().innerHTML = "" + distance
  }
});

class DistanceMap extends daedalus.DomElement {

    constructor() {
        super("div", {className: style.map2}, [])
        this.attrs = {
            markers: [],
            segments: [],
            icon: {
                start: L.icon({
                    iconUrl: resources.png.map_start,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12],
                }),
                midpoint: L.icon({
                    iconUrl: resources.png.map_point,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12],
                }),
                end: L.icon({
                    iconUrl: resources.png.map_end,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12],
                }),
            }
        }

        this.attrs.ptopt_add = true;
        this.attrs.ptopt_remove = true;
        this.attrs.ptopt_split = true;
        this.attrs.ptopt_close = false;

    }

    displayMap() {

        const pt = api.getLastKnownLocation()

        this.attrs.map = L.map(this.props.id).setView([pt.lat, pt.lon], 14)

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.attrs.map);

        this.attrs.ptnd_add = this.addControl(resources.svg.map_add, "Add Markers", this.handlePtAddClicked.bind(this));
        this.attrs.ptnd_remove = this.addControl(resources.svg.map_remove, "Remove Markers", this.handlePtRemoveClicked.bind(this));
        this.attrs.ptnd_split = this.addControl(resources.svg.map_split, "Split Lines", this.handlePtSplitClicked.bind(this));
        this.attrs.ptnd_close = this.addControl(resources.svg.map_close, "Close Loop", this.handlePtCloseClicked.bind(this));

        this.attrs.map.on('click', this.handleMapClick.bind(this))

        this.attrs.distance_ctrl = new DistanceCtrl({position: 'topright'})
        this.attrs.distance_ctrl.addTo(this.attrs.map);

        this.attrs.ptnd_add.style['background'] = this.attrs.ptopt_add?'#999999':'#FFFFFF'
        this.attrs.ptnd_remove.style['background'] = this.attrs.ptopt_remove?'#999999':'#FFFFFF'
        this.attrs.ptnd_split.style['background'] = (this.attrs.ptopt_add||this.attrs.ptopt_remove)?'#FFFFFF':'#999999'

        new L.marker(pt,{}).addTo(this.attrs.map);
    }

    handleMapClick(e) {

        if (!this.attrs.ptopt_add) { return }

        this.attrs.markers.push(this.createMarker(e.latlng));

        this.updateMarkerIcons()
        this.repaintSegments()
    }

    handleMarkerMove(marker, e) {

        this.repaintSegments()
    }

    handleMarkerClick(marker, e) {

        if (!this.attrs.ptopt_remove) { return }

        this.removeMarker(marker)

        L.DomEvent.stopPropagation(e);
    }

    handleSegmentClick(index, e) {
        this.attrs.markers.splice(index, 0, this.createMarker(e.latlng))
        this.updateMarkerIcons()
        this.repaintSegments()


        L.DomEvent.stopPropagation(e);
    }

    createMarker(pt) {
        let newMarker = new L.marker(pt,{
            draggable: true,
            autoPan: true,
            icon: this.attrs.icon.end,
        }).addTo(this.attrs.map);

        newMarker.on('click', (e)=>{this.handleMarkerClick(newMarker, e)})
        newMarker.on('move', (e)=>{this.handleMarkerMove(newMarker, e)})
        return newMarker
    }

    removeMarker(marker) {
        this.attrs.markers = this.attrs.markers.filter(m => m._leaflet_id != marker._leaflet_id);
        this.attrs.map.removeLayer(marker);
        this.updateMarkerIcons()
        this.repaintSegments()
    }

    updateMarkerIcons() {

        if (this.attrs.markers.length > 0) {
            this.attrs.markers[0].setIcon(this.attrs.icon.start)
        }

        if (this.attrs.markers.length > 1) {
            this.attrs.markers[0].setIcon(this.attrs.icon.start)
            for (let i=1; i < this.attrs.markers.length - 1; i++) {
                this.attrs.markers[i].setIcon(this.attrs.icon.midpoint)
            }

        }

        if (this.attrs.markers.length > 2) {
            this.attrs.markers[this.attrs.markers.length - 1].setIcon(this.attrs.icon.end)
        }
    }

    repaintSegments() {
        while (this.attrs.segments.length > 0) {
            let segment = this.attrs.segments.pop()
            this.attrs.map.removeLayer(segment)
        }

        let d = 0;
        for (let i=1; i < this.attrs.markers.length; i++) {
            let p1 = this.attrs.markers[i-1].getLatLng()
            let p2 = this.attrs.markers[i].getLatLng()

            let newSegment = L.polyline([p1, p2], {color: '#000', weight: 7})
                .addTo(this.attrs.map);

            newSegment.on('click', (e)=>{this.handleSegmentClick(i, e)})

            this.attrs.segments.push(newSegment)

            d += api.geo_distance(p1.lat, p1.lng, p2.lat, p2.lng)
        }

        if (this.attrs.ptopt_close && this.attrs.markers.length > 1) {
            let p1 = this.attrs.markers[this.attrs.markers.length-1].getLatLng()
            let p2 = this.attrs.markers[0].getLatLng()

            let newSegment = L.polyline([p1, p2], {color: '#000', weight: 7})
                .addTo(this.attrs.map);

            newSegment.on('click', (e)=>{this.handleSegmentClick(i, e)})

            this.attrs.segments.push(newSegment)

            d += api.geo_distance(p1.lat, p1.lng, p2.lat, p2.lng)
        }


        this.attrs.distance_ctrl.setDistance("Distance: " + d.toFixed(3) + "k")
    }

    addControl(icon, title, fn) {

        /*
            this works by setting the inner html of a link <a href=...>

        */
        let html = '<img src="' + icon + '" style="margin-top: 3px;" width="24" height="24">'
        let className = "leaflet-control-zoom-out"
        let node = this.attrs.map.zoomControl._createButton(
            html, title, className,
            this.attrs.map.zoomControl._container, fn);

        return node;
    }

    handlePtAddClicked() {
        this.attrs.ptopt_add = !this.attrs.ptopt_add;

        this.attrs.ptnd_add.style['background'] = this.attrs.ptopt_add?'#999999':'#FFFFFF'
        this.attrs.ptnd_split.style['background'] = (this.attrs.ptopt_add||this.attrs.ptopt_remove)?'#FFFFFF':'#999999'
    }

    handlePtRemoveClicked() {
        this.attrs.ptopt_remove = !this.attrs.ptopt_remove;
        this.attrs.ptnd_remove.style['background'] = this.attrs.ptopt_remove?'#999999':'#FFFFFF'
        this.attrs.ptnd_split.style['background'] = (this.attrs.ptopt_add||this.attrs.ptopt_remove)?'#FFFFFF':'#999999'
    }

    handlePtSplitClicked() {

        this.attrs.ptopt_add = false;
        this.attrs.ptopt_remove = false;


        this.attrs.ptnd_add.style['background'] = this.attrs.ptopt_add?'#999999':'#FFFFFF'
        this.attrs.ptnd_remove.style['background'] = this.attrs.ptopt_remove?'#999999':'#FFFFFF'
        this.attrs.ptnd_split.style['background'] = (this.attrs.ptopt_add||this.attrs.ptopt_remove)?'#FFFFFF':'#999999'
    }

    handlePtCloseClicked() {
        this.attrs.ptopt_close = !this.attrs.ptopt_close;
        this.attrs.ptnd_close.style['background'] = this.attrs.ptopt_close?'#999999':'#FFFFFF'

        this.repaintSegments();
    }
}

class RoutePlanPage extends daedalus.DomElement {

    /*
    buttons:
        add points: click map to add points
        rem points: click point to remove
        split line: click line to insert point
        loop toggle: auto connect last to first node
    */
    constructor() {
        super("div", {className: style.app}, [])

        this.attrs.header = this.appendChild(new NavHeader())
        this.attrs.header.addAction(resources.svg.back, ()=>{
            router.navigate(router.routes.landing())
        })

        this.attrs.map = this.appendChild( new DistanceMap() );

    }

    elementMounted() {
        this.attrs.map.displayMap()
    }
}

export class App extends daedalus.DomElement {

    constructor() {
        super("div", {}, [])

        this.attrs = {
            page_cache: {},
            container: new DomElement("div", {id:"app_container"}, []),
        }

        this.appendChild(this.attrs.container)

        const body = document.getElementsByTagName("BODY")[0];
        body.className = style.body

        this.attrs.router = this.buildRouter(this, this.attrs.container)

        this.handleLocationChanged()

        this.connect(history.locationChanged, this.handleLocationChanged.bind(this))
    }

    buildRouter(container) {

        const u = router.route_urls;

        let rt = new router.AppRouter(container)

        rt.addRoute(u.logEntry, (cbk)=>{this.handleRoute(cbk, LogEntryPage)});
        rt.addRoute(u.log,      (cbk)=>{this.handleRoute(cbk, LogPage)});
        rt.addRoute(u.settings, (cbk)=>{this.handleRoute(cbk, SettingsPage)});
        rt.addRoute(u.plan,     (cbk)=>{this.handleRoute(cbk, RoutePlanPage)});
        //rt.addRoute(u.wildCard, (cbk)=>{this.handleRoute(cbk, TrackerPage)});
        rt.setDefaultRoute(     (cbk)=>{
            this.handleRoute(cbk, TrackerPage)
        })

        return rt
    }

    handleLocationChanged() {

        this.attrs.router.handleLocationChanged(window.location.pathname)
    }

    handleRoute(fn, page) {
        if (this.attrs.page_cache[page] === undefined) {
            this.attrs.page_cache[page] = new page()
        }
        fn(this.attrs.page_cache[page])
    }
}