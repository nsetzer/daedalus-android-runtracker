

from module daedalus import {DomElement}

from module resources import {svg}
import module router

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
        height: "75vh",
        width: "calc(100% - 2px)",
        margin-top: "-1em",
        border: {style: "solid", width: "1px"},
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

    }

    displayMap(points) {

        this.attrs.map = L.map(this.props.id)

        // .setView(point, zoom);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.attrs.map);


        this.attrs.route = L.polyline(points, {color: 'red'}).addTo(this.attrs.map);

        this.attrs.map.fitBounds(this.attrs.route.getBounds());


        /*
        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            maxZoom: 17,
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }).addTo(this.attrs.map);
        */
    }

}

class LogEntryPage extends daedalus.DomElement {
    constructor() {
        super("div", {className: style.app}, [])

        this.attrs.header = this.appendChild(new NavHeader())

        this.attrs.header.addAction(resources.svg.back, ()=>{
            router.navigate(router.routes.log())
        })

        this.attrs.map = this.appendChild( new Map() );

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
                    [40.14083943, -74.19391519],
                    [40.14086841, -74.19383053],
                    [40.1408948,  -74.19376247],
                    [40.14090807, -74.19365078],
                    [40.14092978, -74.19356402],
                    [40.14096706, -74.19350611],
                    [40.1410176,  -74.19346999],
                    [40.14103311, -74.19339975],
                    [40.1410394,  -74.19333502],
                    [40.14105688, -74.19323857],
                    [40.14107417, -74.19315472],
                    [40.14110913, -74.19310623],
                    [40.14112376, -74.19300117],
                    [40.1411457,  -74.19292589],
                    [40.14120261, -74.19282628],
                    [40.14121468, -74.19274848],
                    [40.14122987, -74.19268078],
                    [40.14124932, -74.19260141],
                    [40.14127192, -74.19253866],
                    [40.14130083, -74.19247110],
                    [40.1413298,  -74.19241849],
                    [40.14137673, -74.19235618],
                    [40.14142254, -74.19232219],
                    [40.14148118, -74.19223102],
                    [40.1415285,  -74.19216943],
                ]
            }

            this.setData(sample)
        }
    }

    setData(data) {
        if (data?.points?.length > 0) {
            this.attrs.data = data
            this.attrs.map.displayMap(data.points)
        } else {
            // display an error, no data for entry
        }
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