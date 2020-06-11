

from module daedalus import {DomElement}

from module resources import {svg}
import module router

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
        text-shadow: "-2px -2px 2px #FFFFFF",
        font-size: "2em",
    }),

    mediumText: StyleSheet({
        text-shadow: "-2px -2px 2px #FFFFFF",
        font-size: "2.5em",
    }),

    largeText: StyleSheet({
        text-shadow: "-2px -2px 2px #FFFFFF",
        font-size: "5em",
        margin-top: "-.1em",
        margin-bottom: "-.2em"
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
        'flex-direction': 'column',
        padding: "1em",
        margin-bottom: '.5em',
        border: {style: "solid", width: "1px"},
        width: 'calc(100% - 2em - 2px)', // minus border width * 2
        background-color: "white",
        'box-shadow': '.25em .25em .3em 0 rgba(0,0,0,0.50)',
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

    map: StyleSheet({
        height: "70vh",
        width: "calc(100% - 2px)",
        margin-top: "-1em",
        border: {style: "solid", width: "1px"},
    }),

    trackBar: StyleSheet({
        position: "relative",
        height: "1em",
        max-height: "1em",
        min-height: "1em",
        width:"calc(100% - 2em)",
        "margin-top": "1em",
        "padding": "1em"
    }),

    trackBar_bar: StyleSheet({
        position: "absolute",
        height: ".3em",
        max-height: ".3em",
        min-height: ".3em",
        //width:"100%",
        top: "1.35em",
        left: "1em",
        right: "1em",
        background-color: "black",
        border-radius: "1em",
        border-width: "1px",
        border-style: "solid",
        border-color: "black",
        user-select: "none",
    }),

    trackBar_button: StyleSheet({
        position: "absolute",
        height: ".5em",
        max-height: ".5em",
        min-height: ".5em",
        width:"1em",
        top: "1.25em",
        border-width: "2px",
        border-style: "solid",
    }),

    trackBar_button1: StyleSheet({
        border-radius: "0 10px 10px 0",
        background-color: "blue",
        border-color: "blue",
    }),
    trackBar_button2: StyleSheet({
        border-radius: "10px 0 0 10px",
        background-color: "red",
        border-color: "red",
    })
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
    if (h > 0) {
        m = pad(m, 2);
        return `${h}:${m}:${s}`
    } else {
        return `${m}:${s}`
    }
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
        super("div", {className: style.app}, [])

        this.attrs.header = this.appendChild(new NavHeader())

        this.attrs.header.addAction(resources.svg.gear, ()=>{
            router.navigate(router.routes.settings())
        })
        this.attrs.header.addElement(new HSpacer("1em"));
        this.attrs.header.addAction(resources.svg.whiteshoe, ()=>{
            router.navigate(router.routes.log())
        })
        this.attrs.header.addElement(new HSpacer("1em"));
        this.attrs.txt_samples = this.attrs.header.addElement(new Text("0/0", style.headerText));

        //this.attrs.txt_pos = this.appendChild(new Text("0.00/0.00", style.smallText));

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
            let t1 = daedalus.util.perf_timer()
            console.log(`perf timer begin`)
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
            let t2 = daedalus.util.perf_timer()
            console.log(`perf timer: ${t2 - t1}`)

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
        pace = payload.current_pace_spm * spm_to_mpk;
        this.attrs.txt_pace_cur.setText(fmtTime(pace*60*1000))
        pace = payload.average_pace_spm * spm_to_mpk;
        this.attrs.txt_pace_avg.setText(fmtTime(pace*60*1000))

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
    }
}

class LogListItem extends daedalus.DomElement {
    constructor(parent, item) {
        super("div", {className: style.logItem}, [])

        this.attrs.parent = parent;
        this.attrs.item = item;

        let dt = new Date(0);
        dt.setUTCSeconds(item.start_date)

        let date = pad(dt.getFullYear(), 2) + "/" + pad(1+dt.getMonth(), 2) + "/" + pad(dt.getDate(), 2)
        let time = dt.getHours() + ":" + pad(dt.getMinutes(), 2)
        let pace = fmtTime(60 * 1000 * item.average_pace_spm * spm_to_mpk)
        let dist = (item.distance/1000.0).toFixed(3) + " k"

        this.attrs.row1 = this.appendChild(new daedalus.DomElement("div", {className: style.logItemRowTitle}, []))
        this.attrs.row1.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`${date}  ${time}`)]))

        this.attrs.row2 = this.appendChild(new daedalus.DomElement("div", {className: style.logItemRowInfo}, []))
        this.attrs.row2.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`Distance:`)]))
        this.attrs.row2.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`${dist}`)]))

        this.attrs.row3 = this.appendChild(new daedalus.DomElement("div", {className: style.logItemRowInfo}, []))
        this.attrs.row3.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`Elapsed Time:`)]))
        this.attrs.row3.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`${fmtTime(item.elapsed_time_ms)}`)]))

        this.attrs.row4 = this.appendChild(new daedalus.DomElement("div", {className: style.logItemRowInfo}, []))
        this.attrs.row4.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`Average Pace:`)]))
        this.attrs.row4.appendChild(new daedalus.DomElement("div", {}, [new daedalus.TextElement(`${pace}`)]))

        this.attrs.row5 = this.appendChild(new daedalus.DomElement("div", {className: style.logItemActions}, []))
        this.attrs.row5.appendChild(new daedalus.DomElement("div"))
        this.attrs.row5.appendChild(new daedalus.ButtonElement("Delete", this.handleDeleteClicked.bind(this)))
        this.attrs.row5.appendChild(new daedalus.DomElement("div"))
        this.attrs.row5.appendChild(new daedalus.ButtonElement("Details", this.handleDetailsClicked.bind(this)))
        this.attrs.row5.appendChild(new daedalus.DomElement("div"))
    }

    handleDeleteClicked() {
        if (daedalus.platform.isAndroid && !!Client) {
            Client.deleteLogEntry(this.attrs.item.spk)
        }
        this.attrs.parent.removeChild(this)
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
        console.log(records)

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
        console.log(bounds)
        this.attrs.map = L.map(this.props.id)//.setView(pt, 15)
        //this.attrs.map = L.map(this.props.id).setView([40.14083943, -74.19391519], 13)

        // .setView(point, zoom);

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
        /*
        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            maxZoom: 17,
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }).addTo(this.attrs.map);
        */

        /*
        this.attrs.route = L.polyline(points, {color: 'red'}).addTo(this.attrs.map);
        */
        //try {
            for (let i=0; i < segments.length; i++) {
                let s = segments[i]

                s = s.map(t => {return t.map(p=>{ return [p[0], p[1]] })})

                if (s.length > 0) {

                    let route = L.polyline(s, {color: spm_color_map[i], weight: 4}).addTo(this.attrs.map);
                    this.attrs.routes.push(route)
                    //console.log(route.getBounds())
                }
            }
        //} catch (err) {
        //    console.error("" + err);
        //}

        //this.attrs.map.fitBounds(this.attrs.route.getBounds());



    }
}

class TrackBarTrack extends DomElement {
    constructor() {
        super("div", {className: style.trackBar_bar}, [])
    }
}

class TrackBarButton extends DomElement {
    constructor(extra_style) {
        super("div", {className: [style.trackBar_button, extra_style]}, [])
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
            btnMin: this.appendChild(new TrackBarButton(style.trackBar_button1)),
            btnMax: this.appendChild(new TrackBarButton(style.trackBar_button2)),
            active_btn: -1,
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

        let offset = parseFloat(getComputedStyle(ele).fontSize)
        let m2 = ele.clientWidth
        let m1 = offset;

        let x = m1 + tpos * m2

        if (x > m2) {
            x = m2;
        } else if (x < m1) {
            x = m1
        }

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
        let x = event.pageX - rect.left

        if (this.attrs.active_btn == -1) {
            let x1 = parseInt(btnMin.style.left, 10);
            let x2 = parseInt(btnMax.style.left, 10);
            let d1 = Math.abs(x - x1)
            let d2 = Math.abs(x - x2)

            if (d1 < d2) {
                this.attrs.active_btn = 0
            } else {
                this.attrs.active_btn = 1
            }
        }

        let btn;
        if (this.attrs.active_btn===0) {
            btn = btnMin;
        } else {
            btn = btnMax;
        }

        let offset = parseFloat(getComputedStyle(ele).fontSize)

        let m2 = ele.clientWidth
        let m1 = offset;

        if (x > m2) {
            x = m2;
        } else if (x < m1) {
            x = m1
        }

        let tpos = (m2 > 0 && x >= 0) ? (x - m1) / m2 : 0.0;
        let pos = tpos * this.attrs.maximum

        if (this.attrs.active_btn === 0) {

            if (pos > this.attrs.posB) {
                tpos = this.attrs.posB/this.attrs.maximum;
            }
            this.attrs.tposA = tpos
        } else {
            if (pos < this.attrs.posA) {
                tpos = this.attrs.posA/this.attrs.maximum;

            }
            this.attrs.tposB = tpos
        }

        x = m1 + tpos * m2

        btn.style.left = Math.floor(x) + "px";
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
    for (let i=0; i < N_SEGMENTS + 1; i++) {
        segments.push([])
    }

    let point = null
    let prev_point = null
    let prev_index = -1
    let current_segment = null

    let distance = 0.0
    let delta_t = 0

    let i;
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

class LogEntryPage extends daedalus.DomElement {
    constructor() {
        super("div", {className: style.app}, [])

        this.attrs.header = this.appendChild(new NavHeader())

        this.attrs.header.addAction(resources.svg.back, ()=>{
            router.navigate(router.routes.log())
        })

        this.attrs.map = this.appendChild( new Map() );

        this.attrs.lst = this.appendChild(new daedalus.DomElement("div", {className: style.logView}, []))

        this.attrs.track = this.attrs.lst.appendChild( new TrackBar(this.handleUpdateData.bind(this)) );

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
        console.log(this.state)
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
                points: [
                    [40.14083943, -74.19391519, -1, 2.0, 2000],
                    [40.14086841, -74.19383053,  2, 2.0, 2000],
                    [40.1408948,  -74.19376247,  2, 2.0, 2000],
                    [40.14090807, -74.19365078,  2, 2.0, 2000],
                    [40.14092978, -74.19356402,  2, 2.0, 2000],
                    [40.14096706, -74.19350611,  2, 2.0, 2000],
                    [40.1410176,  -74.19346999,  2, 2.0, 2000],
                    [40.14103311, -74.19339975,  3, 2.0, 2000],
                    [40.1410394,  -74.19333502,  3, 2.0, 2000],
                    [40.14105688, -74.19323857,  3, 2.0, 2000],
                    [40.14107417, -74.19315472,  3, 2.0, 2000],
                    [40.14110913, -74.19310623,  3, 2.0, 2000],
                    [40.14112376, -74.19300117,  4, 2.0, 2000],
                    [40.1411457,  -74.19292589,  4, 2.0, 2000],
                    [40.14120261, -74.19282628,  4, 2.0, 2000],
                    [40.14121468, -74.19274848,  4, 2.0, 2000],
                    [40.14122987, -74.19268078,  4, 2.0, 2000],
                    [40.14124932, -74.19260141,  4, 2.0, 2000],
                    [40.14127192, -74.19253866,  6, 2.0, 2000],
                    [40.14130083, -74.19247110,  6, 2.0, 2000],
                    [40.1413298,  -74.19241849,  6, 2.0, 2000],
                    [40.14137673, -74.19235618,  6, 2.0, 2000],
                    [40.14142254, -74.19232219,  6, 2.0, 2000],
                    [40.14148118, -74.19223102,  6, 2.0, 2000],
                    [40.1415285,  -74.19216943,  6, 2.0, 2000],
                ],
            }

            this.setData(sample)
        }
    }

    setData(data) {
        if (data?.points?.length > 0) {
            this.attrs.data = data
            const [distance, delta_t, segments] = points2segments(data.points)
            const bounds = L.latLngBounds(data.points.map(p => [p[0], p[1]]));

            this.attrs.map.displayMap(bounds)
            this.attrs.map.displayRoute(segments)
            this.attrs.track.setPosition(0, data.points.length, data.points.length)

            let pace = fmtTime(60 * (delta_t / distance) * spm_to_mpk)
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
        console.log("update", start, end, this.attrs.data.points.length)
        let [distance, delta_t, segments] = points2segments(this.attrs.data.points, start, end)
        this.attrs.map.displayRoute(segments)

        let pace = fmtTime(60 * (delta_t / distance) * spm_to_mpk)
        let time = fmtTime(delta_t)
        let dist = (distance/1000.0).toFixed(3) + " k"

        this.attrs.txt_distance.setText(dist)
        this.attrs.txt_elapsed.setText(time)
        this.attrs.txt_avg_pace.setText(pace)
    }
}

function buildRouter(parent, container) {

    const u = router.route_urls;

    let rt = new router.AppRouter(container)

    rt.addRoute(u.logEntry, (cbk)=>{parent.handleRoute(cbk, LogEntryPage)});
    rt.addRoute(u.log,      (cbk)=>{parent.handleRoute(cbk, LogPage)});
    rt.addRoute(u.settings, (cbk)=>{parent.handleRoute(cbk, SettingsPage)});
    //rt.addRoute(u.wildCard, (cbk)=>{parent.handleRoute(cbk, TrackerPage)});
    rt.setDefaultRoute(     (cbk)=>{
        parent.handleRoute(cbk, TrackerPage)
    })

    return rt

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

        this.attrs.router = buildRouter(this, this.attrs.container)

        this.handleLocationChanged()

        this.connect(history.locationChanged, this.handleLocationChanged.bind(this))
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