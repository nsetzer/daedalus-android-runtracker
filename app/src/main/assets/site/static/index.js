daedalus=(function(){
    "use strict";
    const env={};
    const build_platform="android";
    const[StyleSheet,getStyleSheet,parseParameters,util]=(function(){
        function array_move(arr,p1,p2){
          let s1=p1;
          let s2=p2;
          if(p1<0){
            p1=0;
          }
          if(p2<0){
            p2=0;
          }
          if(p1>arr.length){
            p1=arr.length;
          }
          if(p2>arr.length){
            p2=arr.length;
          }
          if(p1==p2){
            return;
          }
          arr.splice(p2,0,arr.splice(p1,1)[0]);
          return;
        }
        function randomFloat(min,max){
          return Math.random()*(max-min)+min;
        }
        function randomInt(min,max){
          min=Math.ceil(min);
          max=Math.floor(max);
          return Math.floor(Math.random()*(max-min+1))+min;
        }
        function object2style_helper(prefix,obj){
          const items=Object.keys(obj).map(key=>{
              const type=typeof(obj[key]);
              if(type==="object"){
                return object2style_helper(prefix+key+"-",obj[key]);
              }else{
                return[prefix+key+": "+obj[key]];
              }
            });
          return[].concat.apply([],items);
        }
        function object2style(obj){
          const arr=object2style_helper("",obj);
          return[].concat.apply([],arr).join(';');
        }
        function serializeParameters(obj){
          if(Object.keys(obj).length==0){
            return"";
          }
          const strings=Object.keys(obj).reduce(function(a,k){
              if(obj[k]===null||obj[k]===undefined){

              }else if(Array.isArray(obj[k])){
                for(let i=0;i<obj[k].length;i++)
                  {
                    a.push(encodeURIComponent(k)+'='+encodeURIComponent(obj[k][i]));
                    
                  }
              }else{
                a.push(encodeURIComponent(k)+'='+encodeURIComponent(obj[k]));
              }
              return a;
            },[]);
          return'?'+strings.join('&');
        }
        function parseParameters(text=undefined){
          let match,search=/([^&=]+)=?([^&]*)/g,decode=s=>decodeURIComponent(s.replace(
                          /\+/g," ")),query=(text===undefined)?window.location.search.substring(
                      1):text;
          let urlParams={};
          while(match=search.exec(query)){
            let value=decode(match[2]);
            let key=decode(match[1]);
            if(urlParams[key]===undefined){
              urlParams[key]=[value];
            }else{
              urlParams[key].push(value);
            }
          }
          return urlParams;
        }
        function isFunction(x){
          return(x instanceof Function);
        }
        function joinpath(...parts){
          let str="";
          for(let i=0;i<parts.length;i++)
            {
              if(!str.endsWith("/")&&!parts[i].startsWith("/")){
                str+="/";
              }
              str+=parts[i];
            }
          return str;
        }
        function splitpath(path){
          const parts=path.split('/');
          if(parts.length>0&&parts[parts.length-1].length===0){
            parts.pop();
          }
          return parts;
        }
        function dirname(path){
          const parts=path.split('/');
          while(parts.length>0&&parts[parts.length-1].length===0){
            parts.pop();
          }
          return joinpath(...parts.slice(0,-1));
        }
        function splitext(name){
          const index=name.lastIndexOf('.');
          if(index<=0||name[index-1]=='/'){
            return[name,''];
          }else{
            return[name.slice(0,index),name.slice(index)];
          }
        }
        let css_sheet=null;
        let selector_names={};
        function generateStyleSheetName(){
          const chars='abcdefghijklmnopqrstuvwxyz';
          let name;
          do {
            name="css-";
            for(let i=0;i<6;i++)
              {
                let c=chars[randomInt(0,chars.length-1)];
                name+=c;
              }
          } while (selector_names[name]!==undefined)
          return name;
        }
        function shuffle(array){
          let currentIndex=array.length,temporaryValue,randomIndex;
          while(0!==currentIndex){
            randomIndex=Math.floor(Math.random()*currentIndex);
            currentIndex-=1;
            temporaryValue=array[currentIndex];
            array[currentIndex]=array[randomIndex];
            array[randomIndex]=temporaryValue;
          }
          return array;
        }
        function StyleSheet(...args){
          let name;
          let style;
          let selector;
          if(args.length===1){
            name=generateStyleSheetName();
            selector="."+name;
            style=args[0];
          }else if(args.length===2){
            selector=args[0];
            style=args[1];
            name=selector;
          }
          if(css_sheet===null){
            css_sheet=document.createElement('style');
            css_sheet.type='text/css';
            document.head.appendChild(css_sheet);
          }
          const text=object2style(style);
          selector_names[name]=style;
          if(!(css_sheet.sheet||{}).insertRule){
            (css_sheet.styleSheet||css_sheet.sheet).addRule(selector,text);
          }else{
            css_sheet.sheet.insertRule(selector+"{"+text+"}",css_sheet.sheet.rules.length);
            
          }
          return name;
        }
        function getStyleSheet(name){
          return selector_names[name];
        }
        function perf_timer(){
          return performance.now();
        }
        const util={array_move,randomInt,randomFloat,object2style,serializeParameters,
                  parseParameters,isFunction,joinpath,splitpath,dirname,splitext,shuffle,
                  perf_timer};
        return[StyleSheet,getStyleSheet,parseParameters,util];
      })();
    const[ButtonElement,DomElement,DraggableList,HeaderElement,LinkElement,ListElement,
          ListItemElement,NumberInputElement,Signal,TextElement,TextInputElement]=(function(
            ){
        let sigal_counter=0;
        function Signal(element,name){
          const event_name="onSignal_"+(sigal_counter++)+"_"+name;
          const signal={};
          signal._event_name=event_name;
          signal._slots=[];
          signal.emit=(obj=null)=>{
            signal._slots.map(item=>{
                requestIdleCallback(()=>{
                    item.callback(obj);
                  });
              });
          };
          console.log("signal create:"+event_name);
          if(!!element){
            element.signals.push(signal);
          }
          return signal;
        }
        let element_uid=0;
        function generateElementId(){
          const chars='abcdefghijklmnopqrstuvwxyz';
          let name;
          name="-";
          for(let i=0;i<6;i++)
            {
              let c=chars[util.randomInt(0,chars.length-1)];
              name+=c;
            }
          return name+"-"+(element_uid++);
        }
        class DomElement{
          constructor(type="div",props=undefined,children=undefined){
            if(type===undefined){
              throw`DomElement type is undefined. super called with ${arguments.length} arguments`;
              
            }
            this.type=type;
            if(props===undefined){
              this.props={};
            }else{
              this.props=props;
            }
            if(this.props.id===undefined){
              this.props.id=this.constructor.name+generateElementId();
            }
            if(children===undefined){
              this.children=[];
            }else{
              this.children=children;
            }
            this.signals=[];
            this.slots=[];
            this.dirty=true;
            this.state={};
            this.attrs={};
            this._fiber=null;
            Object.getOwnPropertyNames(this.__proto__).filter(key=>key.startsWith(
                              "on")).forEach(key=>{
                this.props[key]=this[key].bind(this);
              });
          }
          _update(element){

          }
          update(){
            this._update(this);
          }
          updateState(state,doUpdate){
            const newState={...this.state,...state};
            if(doUpdate!==false){
              if((doUpdate===true)||(this.elementUpdateState===undefined)||(this.elementUpdateState(
                                      this.state,newState)!==false)){
                this.update();
              }
            }
            this.state=newState;
          }
          updateProps(props,doUpdate){
            const newProps={...this.props,...props};
            if(doUpdate!==false){
              if((doUpdate===true)||(this.elementUpdateProps===undefined)||(this.elementUpdateProps(
                                      this.props,newProps)!==false)){
                this.update();
              }
            }
            this.props=newProps;
          }
          appendChild(childElement){
            if(!childElement||!childElement.type){
              throw"invalid child";
            }
            if(typeof this.children==="string"){
              this.children=[this.children];
            }else if(typeof this.children==="undefined"){
              this.children=[];
            }
            this.children.push(childElement);
            this.update();
            return childElement;
          }
          insertChild(index,childElement){
            if(!childElement||!childElement.type){
              throw"invalid child";
            }
            if(index<0){
              index+=this.children.length+1;
            }
            if(index<0||index>this.children.length){
              console.error("invalid index: "+index);
              return;
            }
            if(typeof this.children==="string"){
              this.children=[this.children];
            }else if(typeof this.children==="undefined"){
              this.children=[];
            }
            this.children.splice(index,0,childElement);
            this.update();
            return childElement;
          }
          removeChild(childElement){
            if(!childElement||!childElement.type){
              throw"invalid child";
            }
            const index=this.children.indexOf(childElement);
            if(index>=0){
              this.children.splice(index,1);
              this.update();
            }else{
              console.error("child not in list");
            }
          }
          removeChildren(){
            this.children.splice(0,this.children.length);
            this.update();
          }
          replaceChild(childElement,newChildElement){
            const index=this.children.indexOf(childElement);
            if(index>=0){
              this.children[index]=newChildElement;
              this.update();
            }
          }
          addClassName(cls){
            let props;
            if(!this.props.className){
              props={className:cls};
            }else if(Array.isArray(this.props.className)){
              props={className:[cls,...this.props.className]};
            }else{
              props={className:[cls,this.props.className]};
            }
            this.updateProps(props);
          }
          removeClassName(cls){
            let props;
            if(Array.isArray(this.props.className)){
              props={className:this.props.className.filter(x=>x!==cls)};
              if(props.className.length===this.props.className.length){
                return;
              }
              this.updateProps(props);
            }else if(this.props.className===cls){
              props={className:null};
              this.updateProps(props);
            }
          }
          hasClassName(cls){
            let props;
            if(Array.isArray(this.props.className)){
              return this.props.className.filter(x=>x===cls).length===1;
            }
            return this.props.className===cls;
          }
          connect(signal,callback){
            console.log("signal connect:"+signal._event_name,callback);
            const ref={element:this,signal:signal,callback:callback};
            signal._slots.push(ref);
            this.slots.push(ref);
          }
          disconnect(signal){
            console.log("signal disconnect:"+signal._event_name);
          }
          getDomNode(){
            return this._fiber&&this._fiber.dom;
          }
          isMounted(){
            return this._fiber!==null;
          }
        }
        class TextElement extends DomElement {
          constructor(text,props={}){
            super("TEXT_ELEMENT",{'nodeValue':text,...props},[]);
          }
          setText(text){
            this.props={'nodeValue':text};
            this.update();
          }
          getText(){
            return this.props.nodeValue;
          }
        }
        class LinkElement extends DomElement {
          constructor(text,url){
            super("div",{className:LinkElement.style.link,title:url},[new TextElement(
                                  text)]);
            this.state={url};
          }
          onClick(){
            if(this.state.url.startsWith('http')){
              window.open(this.state.url,'_blank');
            }else{
              history.pushState({},"",this.state.url);
            }
          }
        }
        LinkElement.style={link:'dcs-8415668d-0'};
        class ListElement extends DomElement {
          constructor(){
            super("ul",{},[]);
          }
        }
        class ListItemElement extends DomElement {
          constructor(item){
            super("li",{},[item]);
          }
        }
        class HeaderElement extends DomElement {
          constructor(text=""){
            super("h1",{},[]);
            this.node=this.appendChild(new TextElement(text));
          }
          setText(text){
            this.node.setText(text);
          }
        }
        class ButtonElement extends DomElement {
          constructor(text,onClick){
            super("button",{'onClick':onClick},[new TextElement(text)]);
          }
          setText(text){
            this.children[0].setText(text);
          }
          getText(){
            return this.children[0].props.nodeValue;
          }
        }
        class TextInputElement extends DomElement {
          constructor(text,_,submit_callback){
            super("input",{value:text},[]);
            this.textChanged=Signal(this,'textChanged');
            this.attrs={submit_callback};
          }
          setText(text){
            this.updateProps({value:text});
            this.textChanged.emit(this.props);
          }
          onChange(event){
            this.updateProps({value:event.target.value},false);
            this.textChanged.emit(this.props);
          }
          onPaste(event){
            this.updateProps({value:event.target.value},false);
            this.textChanged.emit(this.props);
          }
          onKeyUp(event){
            this.updateProps({value:event.target.value},false);
            this.textChanged.emit(this.props);
            if(event.key=="Enter"){
              if(this.attrs.submit_callback){
                this.attrs.submit_callback(this.props.value);
              }
            }
          }
        }
        class NumberInputElement extends DomElement {
          constructor(value){
            super("input",{value:value,type:"number"},[]);
            this.valueChanged=Signal(this,'valueChanged');
          }
          onChange(event){
            this.updateProps({value:parseInt(event.target.value,10)},false);
            this.valueChanged.emit(this.props);
          }
          onPaste(event){
            this.updateProps({value:parseInt(event.target.value,10)},false);
            this.valueChanged.emit(this.props);
          }
          onKeyUp(event){
            this.updateProps({value:parseInt(event.target.value,10)},false);
            this.valueChanged.emit(this.props);
          }
          onInput(event){
            this.updateProps({value:parseInt(event.target.value,10)},false);
            this.valueChanged.emit(this.props);
          }
        }
        function swap(nodeA,nodeB){
          if(!nodeA||!nodeB){
            return;
          }
          const parentA=nodeA.parentNode;
          const siblingA=nodeA.nextSibling===nodeB?nodeA:nodeA.nextSibling;
          nodeB.parentNode.insertBefore(nodeA,nodeB);
          parentA.insertBefore(nodeB,siblingA);
        }
        function isAbove(nodeA,nodeB){
          if(!nodeA||!nodeB){
            return false;
          }
          const rectA=nodeA.getBoundingClientRect();
          const rectB=nodeB.getBoundingClientRect();
          return(rectA.top+rectA.height/2<rectB.top+rectB.height/2);
        }
        function childIndex(node){
          let count=0;
          while((node=node.previousSibling)!=null){
            count++;
          }
          return count;
        }
        const placeholder='dcs-8415668d-1';
        class DraggableListItem extends DomElement {
          constructor(){
            super("div",{},[]);
          }
          onTouchStart(event){
            this.attrs.parent.handleChildDragBegin(this,event);
          }
          onTouchMove(event){
            this.attrs.parent.handleChildDragMove(this,event);
          }
          onTouchEnd(event){
            this.attrs.parent.handleChildDragEnd(this,{target:this.getDomNode()});
            
          }
          onTouchCancel(event){
            this.attrs.parent.handleChildDragEnd(this,{target:this.getDomNode()});
            
          }
          onMouseDown(event){
            this.attrs.parent.handleChildDragBegin(this,event);
          }
          onMouseMove(event){
            this.attrs.parent.handleChildDragMove(this,event);
          }
          onMouseLeave(event){
            this.attrs.parent.handleChildDragEnd(this,event);
          }
          onMouseUp(event){
            this.attrs.parent.handleChildDragEnd(this,event);
          }
        }
        class DraggableList extends DomElement {
          constructor(){
            super("div",{},[]);
            this.attrs={x:null,y:null,placeholder:null,placeholderClassName:placeholder,
                          draggingEle:null,isDraggingStarted:false,indexStart:-1,lockX:true};
            
          }
          setPlaceholderClassName(className){
            this.attrs.placeholderClassName=className;
          }
          handleChildDragBegin(child,event){
            event.preventDefault();
            if(!!this.attrs.draggingEle){
              this.handleChildDragCancel();
              return;
            }
            let evt=(((event)||{}).touches||((((event)||{}).originalEvent)||{}).touches);
            
            if(evt){
              event=evt[0];
            }
            this.attrs.draggingEle=child.getDomNode();
            this.attrs.indexStart=childIndex(this.attrs.draggingEle);
            const rect=this.attrs.draggingEle.getBoundingClientRect();
            this.attrs.x=event.clientX-rect.left;
            this.attrs.y=event.pageY-rect.top;
          }
          handleChildDragMove(child,event){
            if(!this.attrs.draggingEle||this.attrs.draggingEle!==child.getDomNode(
                            )){
              return;
            }
            event.preventDefault();
            let evt=(((event)||{}).touches||((((event)||{}).originalEvent)||{}).touches);
            
            if(evt){
              event=evt[0];
            }
            const draggingRect=this.attrs.draggingEle.getBoundingClientRect();
            if(!this.attrs.isDraggingStarted){
              this.attrs.isDraggingStarted=true;
              this.attrs.placeholder=document.createElement('div');
              this.attrs.placeholder.classList.add(this.attrs.placeholderClassName);
              
              this.attrs.draggingEle.parentNode.insertBefore(this.attrs.placeholder,
                              this.attrs.draggingEle.nextSibling);
              this.attrs.placeholder.style.height=`${draggingRect.height}px`;
            }
            this.attrs.draggingEle.style.position='absolute';
            let ypos=event.pageY-this.attrs.y+window.scrollY;
            this.attrs.draggingEle.style.top=`${ypos}px`;
            if(!this.attrs.lockX){
              this.attrs.draggingEle.style.left=`${event.pageX-this.attrs.x}px`;
            }
            const prevEle=this.attrs.draggingEle.previousElementSibling;
            const nextEle=this.attrs.placeholder.nextElementSibling;
            if(prevEle&&isAbove(this.attrs.draggingEle,prevEle)){
              swap(this.attrs.placeholder,this.attrs.draggingEle);
              swap(this.attrs.placeholder,prevEle);
              return;
            }
            if(nextEle&&isAbove(nextEle,this.attrs.draggingEle)){
              swap(nextEle,this.attrs.placeholder);
              swap(nextEle,this.attrs.draggingEle);
            }
          }
          handleChildDragEnd(child,event){
            if(!this.attrs.draggingEle||this.attrs.draggingEle!==child.getDomNode(
                            )){
              return;
            }
            this.handleChildDragCancel();
          }
          handleChildDragCancel(){
            this.attrs.placeholder&&this.attrs.placeholder.parentNode.removeChild(
                          this.attrs.placeholder);
            this.attrs.draggingEle.style.removeProperty('top');
            this.attrs.draggingEle.style.removeProperty('left');
            this.attrs.draggingEle.style.removeProperty('position');
            const indexEnd=childIndex(this.attrs.draggingEle);
            this.updateModel(this.attrs.indexStart,indexEnd);
            this.attrs.x=null;
            this.attrs.y=null;
            this.attrs.draggingEle=null;
            this.attrs.isDraggingStarted=false;
          }
          updateModel(indexStart,indexEnd){
            this.children.splice(indexEnd,0,this.children.splice(indexStart,1)[0]);
            
          }
        }
        return[ButtonElement,DomElement,DraggableList,HeaderElement,LinkElement,ListElement,
                  ListItemElement,NumberInputElement,Signal,TextElement,TextInputElement];
        
      })();
    const[]=(function(){
        history.locationChanged=Signal(null,"locationChanged");
        history.states=[{state:{},title:null,path:window.location.href}];
        history.forward_states=[];
        history._pushState=history.pushState;
        history.pushState=(state,title,path)=>{
          history._pushState(state,title,path);
          history.locationChanged.emit({path:location.pathname});
          history.forward_states=[];
          history.states.push({state,title,path});
        };
        history.goBack=()=>{
          if(history.states.length<2){
            return false;
          }
          const state=history.states.pop();
          history.forward_states.splice(0,0,state);
          const new_state=history.states[history.states.length-1];
          history._pushState(new_state.state,new_state.title,new_state.path);
          history.locationChanged.emit({path:location.pathname});
          return true;
        };
        window.addEventListener('popstate',(event)=>{
            history.locationChanged.emit({path:location.pathname});
          });
        return[];
      })();
    const[AuthenticatedRouter,Router,locationMatch,patternCompile,patternToRegexp]=(
          function(){
        function patternCompile(pattern){
          const arr=pattern.split('/');
          let tokens=[];
          for(let i=1;i<arr.length;i++)
            {
              let part=arr[i];
              if(part.startsWith(':')){
                if(part.endsWith('?')){
                  tokens.push({param:true,name:part.substr(1,part.length-2)});
                }else if(part.endsWith('+')){
                  tokens.push({param:true,name:part.substr(1,part.length-2)});
                }else if(part.endsWith('*')){
                  tokens.push({param:true,name:part.substr(1,part.length-2)});
                }else{
                  tokens.push({param:true,name:part.substr(1)});
                }
              }else{
                tokens.push({param:false,value:part});
              }
            }
          return(items,query_items)=>{
            let location='';
            for(let i=0;i<tokens.length;i++)
              {
                location+='/';
                if(tokens[i].param){
                  location+=items[tokens[i].name];
                }else{
                  location+=tokens[i].value;
                }
              }
            if(!!query_items){
              location+=util.serializeParameters(query_items);
            }
            return location;
          };
        }
        function patternToRegexp(pattern,exact=true){
          const arr=pattern.split('/');
          let re="^";
          let tokens=[];
          for(let i=exact?1:0;i<arr.length;i++)
            {
              let part=arr[i];
              if(i==0&&exact===false){

              }else{
                re+="\\/";
              }
              if(part.startsWith(':')){
                if(part.endsWith('?')){
                  tokens.push(part.substr(1,part.length-2));
                  re+="([^\\/]*)";
                }else if(part.endsWith('+')){
                  tokens.push(part.substr(1,part.length-2));
                  re+="?(.+)";
                }else if(part.endsWith('*')){
                  tokens.push(part.substr(1,part.length-2));
                  re+="?(.*)";
                }else{
                  tokens.push(part.substr(1));
                  re+="([^\\/]+)";
                }
              }else{
                re+=part;
              }
            }
          if(re!=="^\\/"){
            re+="\\/?";
          }
          re+="$";
          return{re:new RegExp(re,"i"),text:re,tokens};
        }
        function locationMatch(obj,location){
          obj.re.lastIndex=0;
          let arr=location.match(obj.re);
          if(arr==null){
            return null;
          }
          let result={};
          for(let i=1;i<arr.length;i++)
            {
              result[obj.tokens[i-1]]=arr[i];
            }
          return result;
        }
        function patternMatch(pattern,location){
          return locationMatch(patternToRegexp(pattern),location);
        }
        class Router{
          constructor(container,default_callback){
            if(!container){
              throw'invalid container';
            }
            this.container=container;
            this.default_callback=default_callback;
            this.routes=[];
            this.current_index=-2;
            this.current_location=null;
          }
          handleLocationChanged(location){
            let index=0;
            while(index<this.routes.length){
              const item=this.routes[index];
              const match=locationMatch(item.re,location);
              if(match!==null){
                let fn=(element)=>this.setElement(index,location,match,element);
                if(this.doRoute(item,fn,match)){
                  return;
                }
              }
              index+=1;
            }
            let fn=(element)=>this.setElement(-1,location,null,element);
            this.default_callback(fn);
            return;
          }
          doRoute(item,fn,match){
            item.callback(fn,match);
            return true;
          }
          setElement(index,location,match,element){
            if(!!element){
              if(index!=this.current_index){
                this.container.children=[element];
                this.container.update();
              }
              if(this.current_location!==location){
                this.setMatch(match);
                element.updateState({match:match});
              }
              this.current_index=index;
            }else{
              this.container.children=[];
              this.current_index=-1;
              this.container.update();
            }
            this.current_location=location;
          }
          addRoute(pattern,callback){
            const re=patternToRegexp(pattern);
            this.routes.push({pattern,callback,re});
          }
          setDefaultRoute(callback){
            this.default_callback=callback;
          }
          setMatch(match){

          }
        }
        class AuthenticatedRouter extends Router {
          constructor(container,route_list,default_callback){
            super(container,route_list,default_callback);
            this.authenticated=false;
          }
          doRoute(item,fn,match){
            let has_auth=this.isAuthenticated();
            if(item.auth===true&&item.noauth===undefined){
              if(!!has_auth){
                item.callback(fn,match);
                return true;
              }else if(item.fallback!==undefined){
                history.pushState({},"",item.fallback);
                return true;
              }
            }
            if(item.auth===undefined&&item.noauth===true){
              console.log(item,has_auth);
              if(!has_auth){
                item.callback(fn,match);
                return true;
              }else if(item.fallback!==undefined){
                history.pushState({},"",item.fallback);
                return true;
              }
            }
            if(item.auth===undefined&&item.noauth===undefined){
              item.callback(fn,match);
              return true;
            }
            return false;
          }
          isAuthenticated(){
            return this.authenticated;
          }
          setAuthenticated(value){
            this.authenticated=!!value;
          }
          addAuthRoute(pattern,callback,fallback){
            const re=patternToRegexp(pattern);
            this.routes.push({pattern,callback,auth:true,fallback,re});
          }
          addNoAuthRoute(pattern,callback,fallback){
            const re=patternToRegexp(pattern);
            this.routes.push({pattern,callback,noauth:true,fallback,re});
          }
        }
        return[AuthenticatedRouter,Router,locationMatch,patternCompile,patternToRegexp];
        
      })();
    const[downloadFile,uploadFile]=(function(){
        function saveBlob(blob,fileName){
          let a=document.createElement('a');
          a.href=window.URL.createObjectURL(blob);
          a.download=fileName;
          a.dispatchEvent(new MouseEvent('click'));
        }
        function downloadFile(url,headers={},params={},success=null,failure=null){
        
          const postData=new FormData();
          const queryString=util.serializeParameters(params);
          const xhr=new XMLHttpRequest();
          xhr.open('GET',url+queryString);
          for(let key in headers){
            xhr.setRequestHeader(key,headers[key]);
          }
          xhr.responseType='blob';
          xhr.onload=function(this_,event_){
            let blob=this_.target.response;
            if(!blob||this_.target.status!=200){
              if(failure!==null){
                failure({status:this_.target.status,blob});
              }
            }else{
              let contentDispo=xhr.getResponseHeader('Content-Disposition');
              console.log(xhr);
              let fileName;
              if(contentDispo!==null){
                fileName=contentDispo.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[
                                1];
              }
              if(!fileName){
                console.error("filename not found in xhr request header 'Content-Disposition'");
                
                let parts;
                parts=xhr.responseURL.split('/');
                parts=parts[parts.length-1].split('?');
                fileName=parts[0]||'resource.bin';
              }
              saveBlob(blob,fileName);
              if(success!==null){
                success({url,fileName,blob});
              }
            }
          };
          xhr.send(postData);
        }
        function _uploadFileImpl(elem,urlbase,headers={},params={},success=null,failure=null,
                  progress=null){
          let queryString=util.serializeParameters(params);
          let arrayLength=elem.files.length;
          for(let i=0;i<arrayLength;i++)
            {
              let file=elem.files[i];
              let bytesTransfered=0;
              let url;
              if(urlbase.endsWith('/')){
                url=urlbase+file.name;
              }else{
                url=urlbase+'/'+file.name;
              }
              url+=queryString;
              let xhr=new XMLHttpRequest();
              xhr.open('POST',url,true);
              for(let key in headers){
                xhr.setRequestHeader(key,headers[key]);
              }
              xhr.upload.onprogress=function(event){
                if(event.lengthComputable){
                  if(progress!==null){
                    bytesTransfered=event.loaded;
                    progress({bytesTransfered,fileSize:file.size,fileName:file.name,
                                              finished:false});
                  }
                }
              };
              xhr.onreadystatechange=function(){
                if(xhr.readyState==4&&xhr.status==200){
                  if(success!==null){
                    let params={fileName:file.name,url,lastModified:file.lastModified,
                                          size:file.size,type:file.type};
                    success(params);
                    if(progress!==null){
                      progress({bytesTransfered:file.size,fileSize:file.size,fileName:file.name,
                                                  finished:true});
                    }
                  }
                }else if(xhr.status>=400){
                  if(failure!==null){
                    let params={fileName:file.name,url,status:xhr.status};
                    failure(params);
                    if(progress!==null){
                      progress({bytesTransfered,fileSize:file.size,fileName:file.name,
                                                  finished:true});
                    }
                  }
                }else{
                  console.log("xhr status changed: "+xhr.status);
                }
              };
              if(progress!==null){
                progress({bytesTransfered,fileSize:file.size,fileName:file.name,finished:false,
                                      first:true});
              }
              let fd=new FormData();
              fd.append('upload',file);
              xhr.send(fd);
            }
        }
        function uploadFile(urlbase,headers={},params={},success=null,failure=null,
                  progress=null){
          let element=document.createElement('input');
          element.type='file';
          element.hidden=true;
          element.onchange=(event)=>{
            _uploadFileImpl(element,urlbase,headers,params,success,failure,progress);
            
          };
          element.dispatchEvent(new MouseEvent('click'));
        }
        return[downloadFile,uploadFile];
      })();
    const[OSName,platform]=(function(){
        let nVer=navigator.appVersion;
        let nAgt=navigator.userAgent;
        let browserName=navigator.appName;
        let fullVersion=''+parseFloat(navigator.appVersion);
        let majorVersion=parseInt(navigator.appVersion,10);
        let nameOffset,verOffset,ix;
        if((verOffset=nAgt.indexOf("Opera"))!=-1){
          browserName="Opera";
          fullVersion=nAgt.substring(verOffset+6);
          if((verOffset=nAgt.indexOf("Version"))!=-1){
            fullVersion=nAgt.substring(verOffset+8);
          }
        }else if((verOffset=nAgt.indexOf("MSIE"))!=-1){
          browserName="Microsoft Internet Explorer";
          fullVersion=nAgt.substring(verOffset+5);
        }else if((verOffset=nAgt.indexOf("Chrome"))!=-1){
          browserName="Chrome";
          fullVersion=nAgt.substring(verOffset+7);
        }else if((verOffset=nAgt.indexOf("Safari"))!=-1){
          browserName="Safari";
          fullVersion=nAgt.substring(verOffset+7);
          if((verOffset=nAgt.indexOf("Version"))!=-1){
            fullVersion=nAgt.substring(verOffset+8);
          }
        }else if((verOffset=nAgt.indexOf("Firefox"))!=-1){
          browserName="Firefox";
          fullVersion=nAgt.substring(verOffset+8);
        }else if((nameOffset=nAgt.lastIndexOf(' ')+1)<(verOffset=nAgt.lastIndexOf(
                          '/'))){
          browserName=nAgt.substring(nameOffset,verOffset);
          fullVersion=nAgt.substring(verOffset+1);
          if(browserName.toLowerCase()==browserName.toUpperCase()){
            browserName=navigator.appName;
          }
        }
        if((ix=fullVersion.indexOf(";"))!=-1){
          fullVersion=fullVersion.substring(0,ix);
        }
        if((ix=fullVersion.indexOf(" "))!=-1){
          fullVersion=fullVersion.substring(0,ix);
        }
        majorVersion=parseInt(''+fullVersion,10);
        if(isNaN(majorVersion)){
          fullVersion=''+parseFloat(navigator.appVersion);
          majorVersion=parseInt(navigator.appVersion,10);
        }
        let OSName="Unknown OS";
        if(navigator.appVersion.indexOf("Win")!=-1){
          OSName="Windows";
        }
        if(navigator.appVersion.indexOf("Mac")!=-1){
          OSName="MacOS";
        }
        if(navigator.appVersion.indexOf("X11")!=-1){
          OSName="UNIX";
        }
        if(navigator.appVersion.indexOf("Linux")!=-1){
          OSName="Linux";
        }
        function getDefaultFontSize(parentElement){
          parentElement=parentElement||document.body;
          let div=document.createElement('div');
          div.style.width="1000em";
          parentElement.appendChild(div);
          let pixels=div.offsetWidth/1000;
          parentElement.removeChild(div);
          return pixels;
        }
        const isMobile={Android:function(){
            return navigator.userAgent.match(/Android/i);
          },BlackBerry:function(){
            return navigator.userAgent.match(/BlackBerry/i);
          },iOS:function(){
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
          },Opera:function(){
            return navigator.userAgent.match(/Opera Mini/i);
          },Windows:function(){
            return navigator.userAgent.match(/IEMobile/i)||navigator.userAgent.match(
                          /WPDesktop/i);
          },any:function(){
            return(isMobile.Android()||isMobile.BlackBerry()||isMobile.iOS()||isMobile.Opera(
                            )||isMobile.Windows());
          }};
        const platform={OSName,browser:browserName,fullVersion,majorVersion,appName:navigator.appName,
                  userAgent:navigator.userAgent,platform:build_platform||'web',isAndroid:build_platform==='android',
                  isMobile:(!!isMobile.any())};
        console.log(platform);
        return[OSName,platform];
      })();
    const[render,render_update]=(function(){
        let workstack=[];
        let deletions=[];
        let deletions_removed=new Set();
        let updatequeue=[];
        let wipRoot=null;
        let currentRoot=null;
        let workLoopActive=false;
        let workCounter=0;
        function render(container,element){
          wipRoot={type:"ROOT",dom:container,props:{},children:[element],_fibers:[
                        ],alternate:currentRoot};
          workstack.push(wipRoot);
          if(!workLoopActive){
            workLoopActive=true;
            setTimeout(workLoop,0);
          }
        }
        function render_update(element){
          if(!element.dirty&&element._fiber!==null){
            element.dirty=true;
            const fiber={effect:'UPDATE',children:[element],_fibers:[],alternate:null,
                          partial:true};
            updatequeue.push(fiber);
          }
          if(!workLoopActive){
            workLoopActive=true;
            setTimeout(workLoop,0);
          }
        }
        DomElement.prototype._update=render_update;
        function workLoop(deadline=null){
          let shouldYield=false;
          const initialWorkLength=workstack.length;
          const initialUpdateLength=updatequeue.length;
          let friendly=deadline!=null;
          let initial_delay=0;
          try{
            if(!!friendly){
              initial_delay=deadline.timeRemaining();
              while(!shouldYield){
                while(workstack.length>0&&!shouldYield){
                  let unit=workstack.pop();
                  performUnitOfWork(unit);
                  shouldYield=deadline.timeRemaining()<1;
                }
                if(workstack.length==0&&wipRoot){
                  commitRoot();
                }
                if(workstack.length==0&&updatequeue.length>0&&!wipRoot){
                  wipRoot=updatequeue[0];
                  workstack.push(wipRoot);
                  updatequeue.shift();
                }
                shouldYield=deadline.timeRemaining()<1;
              }
            }else{
              while(1){
                while(workstack.length>0){
                  let unit=workstack.pop();
                  performUnitOfWork(unit);
                }
                if(wipRoot){
                  commitRoot();
                }
                if(updatequeue.length>0&&!wipRoot){
                  wipRoot=updatequeue[0];
                  workstack.push(wipRoot);
                  updatequeue.shift();
                }else{
                  break;
                }
              }
            }
          }catch(e){
            console.error("unhandled workloop exception: "+e.message);
          };
          let debug=workstack.length>1||updatequeue.length>1;
          if(!!debug){
            console.warn("workloop failed to finish",initial_delay,":",initialWorkLength,
                          '->',workstack.length,initialUpdateLength,'->',updatequeue.length);
            
            if(!friendly){
              setTimeout(workLoop,50);
            }else{
              requestIdleCallback(workLoop);
            }
          }else{
            workLoopActive=false;
          }
        }
        function performUnitOfWork(fiber){
          if(!fiber.dom&&fiber.effect=='CREATE'){
            fiber.dom=createDomNode(fiber);
          }
          reconcileChildren(fiber);
        }
        function reconcileChildren(parentFiber){
          workCounter+=1;
          const oldParentFiber=parentFiber.alternate;
          if(!!oldParentFiber){
            oldParentFiber.children.forEach(child=>{
                child._delete=true;
              });
          }
          let prev=parentFiber;
          while(prev.next){
            prev=prev.next;
          }
          parentFiber.children.forEach((element,index)=>{
              if(!element||!element.type){
                console.error(`${parentFiber.element.props.id}: undefined child element at index ${index} `);
                
                return;
              }
              const oldFiber=element._fiber;
              element._delete=false;
              const oldIndex=oldFiber?oldFiber.index:index;
              if(parentFiber.partial){
                index=oldIndex;
              }
              let effect;
              if(!!oldFiber){
                if(oldIndex==index&&element.dirty===false){
                  return;
                }else{
                  effect='UPDATE';
                }
              }else{
                effect='CREATE';
              }
              element.dirty=false;
              const newFiber={type:element.type,effect:effect,props:{...element.props},
                              children:element.children.slice(),_fibers:[],parent:(parentFiber.partial&&oldFiber)?oldFiber.parent:parentFiber,
                              alternate:oldFiber,dom:oldFiber?oldFiber.dom:null,signals:element.signals,
                              element:element,index:index,oldIndex:oldIndex};
              if(!newFiber.parent.dom){
                console.error(`element parent is not mounted id: ${element.props.id} effect: ${effect}`);
                
                return;
              }
              if(newFiber.props.style){
                console.warn("unsafe use of inline style: ",newFiber.type,element.props.id,
                                  newFiber.props.style);
              }
              if(typeof(newFiber.props.style)==='object'){
                newFiber.props.style=util.object2style(newFiber.props.style);
              }
              if(Array.isArray(newFiber.props.className)){
                newFiber.props.className=newFiber.props.className.join(' ');
              }
              element._fiber=newFiber;
              parentFiber._fibers.push(newFiber);
              prev.next=newFiber;
              prev=newFiber;
              workstack.push(newFiber);
            });
          if(!!oldParentFiber){
            oldParentFiber.children.forEach(child=>{
                if(child._delete){
                  deletions.push(child._fiber);
                }
              });
          }
        }
        function commitRoot(){
          deletions_removed=new Set();
          deletions.forEach(removeDomNode);
          if(deletions_removed.size>0){
            deletions_removed.forEach(elem=>{
                requestIdleCallback(elem.elementUnmounted.bind(elem));
              });
          }
          let unit=wipRoot.next;
          let next;
          while(unit){
            commitWork(unit);
            next=unit.next;
            unit.next=null;
            unit=next;
          }
          currentRoot=wipRoot;
          wipRoot=null;
          deletions=[];
        }
        function commitWork(fiber){
          const parentDom=fiber.parent.dom;
          if(!parentDom){
            console.warn(`element has no parent. effect: ${fiber.effect}`);
            return;
          }
          if(fiber.effect==='CREATE'){
            const length=parentDom.children.length;
            const position=fiber.index;
            if(length==position){
              parentDom.appendChild(fiber.dom);
            }else{
              parentDom.insertBefore(fiber.dom,parentDom.children[position]);
            }
            if(fiber.element.elementMounted){
              requestIdleCallback(fiber.element.elementMounted.bind(fiber.element));
              
            }
          }else if(fiber.effect==='UPDATE'){
            fiber.alternate.alternate=null;
            updateDomNode(fiber);
          }else if(fiber.effect==='DELETE'){
            fiber.alternate.alternate=null;
            removeDomNode(fiber);
          }
        }
        const isEvent=key=>key.startsWith("on");
        const isProp=key=>!isEvent(key);
        const isCreate=(prev,next)=>key=>(key in next&&!(key in prev));
        const isUpdate=(prev,next)=>key=>(key in prev&&key in next&&prev[key]!==next[
                    key]);
        const isDelete=(prev,next)=>key=>!(key in next);
        function createDomNode(fiber){
          const dom=fiber.type=="TEXT_ELEMENT"?document.createTextNode(""):document.createElement(
                      fiber.type);
          Object.keys(fiber.props).filter(isEvent).forEach(key=>{
              const event=key.toLowerCase().substring(2);
              dom.addEventListener(event,fiber.props[key]);
            });
          Object.keys(fiber.props).filter(isProp).forEach(key=>{
              dom[key]=fiber.props[key];
            });
          return dom;
        }
        function updateDomNode(fiber){
          const dom=fiber.dom;
          const parentDom=fiber.parent.dom;
          const oldProps=fiber.alternate.props;
          const newProps=fiber.props;
          if(!dom){
            console.log("fiber does not contain a dom");
            return;
          }
          if(fiber.oldIndex!=fiber.index&&parentDom){
            if(parentDom.children[fiber.index]!==dom){
              parentDom.removeChild(fiber.dom);
              parentDom.insertBefore(fiber.dom,parentDom.children[fiber.index]);
            }
          }
          Object.keys(oldProps).filter(isEvent).filter(key=>isUpdate(oldProps,newProps)(
                          key)||isDelete(oldProps,newProps)(key)).forEach(key=>{
              const event=key.toLowerCase().substring(2);
              dom.removeEventListener(event,oldProps[key]);
            });
          Object.keys(newProps).filter(isEvent).filter(key=>isCreate(oldProps,newProps)(
                          key)||isUpdate(oldProps,newProps)(key)).forEach(key=>{
              const event=key.toLowerCase().substring(2);
              dom.addEventListener(event,newProps[key]);
            });
          Object.keys(oldProps).filter(isProp).filter(isDelete(oldProps,newProps)).forEach(
                      key=>{
              dom[key]="";
            });
          Object.keys(newProps).filter(isProp).filter(key=>isCreate(oldProps,newProps)(
                          key)||isUpdate(oldProps,newProps)(key)).forEach(key=>{
              dom[key]=newProps[key];
            });
        }
        function _removeDomNode_elementFixUp(element){
          if(element.elementUnmounted){
            deletions_removed.add(element);
          }
          element.children.forEach(child=>{
              child._fiber=null;
              _removeDomNode_elementFixUp(child);
            });
        }
        function removeDomNode(fiber){
          if(fiber.dom){
            if(fiber.dom.parentNode){
              fiber.dom.parentNode.removeChild(fiber.dom);
            }
          }else{
            console.error("failed to delete",fiber.element.type);
          }
          fiber.dom=null;
          fiber.element._fiber=null;
          fiber.alternate=null;
          _removeDomNode_elementFixUp(fiber.element);
        }
        return[render,render_update];
      })();
    return{AuthenticatedRouter,ButtonElement,DomElement,DraggableList,HeaderElement,
          LinkElement,ListElement,ListItemElement,NumberInputElement,OSName,Router,Signal,
          StyleSheet,TextElement,TextInputElement,build_platform,downloadFile,env,getStyleSheet,
          locationMatch,parseParameters,patternCompile,patternToRegexp,platform,render,
          render_update,uploadFile,util};
  })();
api=(function(){
    "use strict";
    const[geo_distance]=(function(){
        const RAD2DEG=180/Math.PI;
        const DEG2RAD=Math.PI/180;
        function findLatLonCenter(points){
          let avgX=0;
          let avgY=0;
          let avgZ=0;
          for(var i=0;i<points.length;i++)
            {
              var lat=points[i][0]*DEG2RAD;
              var lon=points[i][1]*DEG2RAD;
              avgX+=Math.cos(lat)*Math.cos(lon);
              avgY+=Math.cos(lat)*Math.sin(lon);
              avgZ+=Math.sin(lat);
            }
          avgX=avgX/points.length;
          avgY=avgY/points.length;
          avgZ=avgZ/points.length;
          var hyp=Math.sqrt(avgX*avgX+avgY*avgY);
          var lon=Math.atan2(avgY,avgX)*RAD2DEG;
          var lat=Math.atan2(avgZ,hyp)*RAD2DEG;
          return[lat,lon];
        }
        function geo_distance(lat1,lon1,lat2,lon2){
          const pi=Math.PI;
          const R=6371e3;
          const phi1=lat1*DEG2RAD;
          const phi2=lat2*DEG2RAD;
          const deltaphi=(lat2-lat1)*DEG2RAD;
          const deltalambda=(lon2-lon1)*DEG2RAD;
          const a=Math.sin(deltaphi/2)*Math.sin(deltaphi/2)+Math.cos(phi1)*Math.cos(
                      phi2)*Math.sin(deltalambda/2)*Math.sin(deltalambda/2);
          const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
          const d=R*c;
          return d;
        }
        function meters_to_feet(distance){
          return distance*3.28083333;
        }
        function feet_to_miles(distance){
          return distance/528;
        }
        return[geo_distance];
      })();
    const[getLastKnownLocation]=(function(){
        function getLastKnownLocation(){
          if(daedalus.platform.isAndroid&&!!Client){
            let s=Client.getLastKnownLocation();
            return JSON.parse(s);
          }else{
            return{lat:40,lon:-75};
          }
        }
        return[getLastKnownLocation];
      })();
    return{geo_distance,getLastKnownLocation};
  })();
resources=(function(daedalus){
    "use strict";
    const platform_prefix=daedalus.platform.isAndroid?"file:///android_asset/site/static/icon/":"/static/icon/";
    
    const svg_icon_names=["button_play","button_pause","button_stop","button_split",
          "gear","shoe","whiteshoe","back","marker_R","marker_L","trash","share","map",
          "map_add","map_remove","map_split","map_close"];
    const png_icon_names=["map_end","map_point","map_start"];
    const svg={};
    const png={};
    svg_icon_names.forEach(name=>{
        svg[name]=platform_prefix+name+".svg";
      });
    png_icon_names.forEach(name=>{
        png[name]=platform_prefix+name+".png";
      });
    return{png,svg};
  })(daedalus);
router=(function(api,daedalus){
    "use strict";
    const Router=daedalus.Router;
    const patternCompile=daedalus.patternCompile;
    let current_match=null;
    class AppRouter extends Router {
      setMatch(match){
        current_match=match;
      }
    }
    AppRouter.match=()=>{
      return current_match;
    };
    function navigate(location){
      history.pushState({},"",location);
    }
    const route_urls={logEntry:"/log/:entry",log:"/log",settings:"/settings",plan:"/plan",
          wildCard:"/:path*",landing:"/"};
    const routes={};
    Object.keys(route_urls).map(key=>{
        routes[key]=patternCompile(route_urls[key]);
      });
    return{AppRouter,navigate,route_urls,routes};
  })(api,daedalus);
components=(function(daedalus){
    "use strict";
    const DomElement=daedalus.DomElement;
    const StyleSheet=daedalus.StyleSheet;
    const TextElement=daedalus.TextElement;
    const[MoreMenu]=(function(){
        const style={moreMenuShadow:'dcs-26f83abc-0',moreMenu:'dcs-26f83abc-1',moreMenuShow:'dcs-26f83abc-2',
                  moreMenuHide:'dcs-26f83abc-3',moreMenuButton:'dcs-26f83abc-4',color_default:'dcs-26f83abc-5',
                  color_danger:'dcs-26f83abc-6'};
        ;
        ;
        ;
        ;
        class MoreMenuButton extends DomElement {
          constructor(text,color,callback){
            super("div",{className:[style.moreMenuButton,color],onClick:callback},
                          [new TextElement(text)]);
          }
          setText(text){
            this.children[0].setText(text);
          }
        }
        class MoreMenuImpl extends DomElement {
          constructor(){
            super("div",{className:[style.moreMenu]},[]);
          }
          onClick(event){
            event.stopPropagation();
          }
        }
        class MoreMenu extends DomElement {
          constructor(callback_close){
            super("div",{className:[style.moreMenuShadow,style.moreMenuHide]},[]);
            
            this.attrs={callback_close,impl:this.appendChild(new MoreMenuImpl())};
            
          }
          onClick(){
            this.attrs.callback_close();
          }
          addAction(text,callback,color){
            if(color!==undefined){
              color=style['color_'+color];
            }
            if(color===undefined){
              color=style.color_default;
            }
            console.log(color);
            this.attrs.impl.appendChild(new MoreMenuButton(text,color,()=>{
                  callback();
                  this.hide();
                }));
          }
          hide(){
            this.updateProps({className:[style.moreMenuShadow,style.moreMenuHide]});
            
          }
          show(){
            this.updateProps({className:[style.moreMenuShadow,style.moreMenuShow]});
            
          }
        }
        return[MoreMenu];
      })();
    const[HSpacer,VSpacer]=(function(){
        class HSpacer extends DomElement {
          constructor(width){
            super("div",{},[]);
            this.attrs={width};
          }
          elementMounted(){
            this._setWidth();
          }
          setWidth(width){
            this.attrs.width=width;
            this._setWidth();
          }
          _setWidth(){
            const node=this.getDomNode();
            if(!!node){
              node.style['max-width']=this.attrs.width;
              node.style['min-width']=this.attrs.width;
              node.style['width']=this.attrs.width;
              node.style['max-height']="1px";
              node.style['min-height']="1px";
              node.style['height']="1px";
            }
          }
        }
        class VSpacer extends DomElement {
          constructor(height){
            super("div",{},[]);
            this.attrs={height};
          }
          elementMounted(){
            this._setHeight();
          }
          setHeight(height){
            this.attrs.height=height;
            this._setHeight();
          }
          _setHeight(){
            const node=this.getDomNode();
            if(!!node){
              node.style['max-height']=this.attrs.height;
              node.style['min-height']=this.attrs.height;
              node.style['height']=this.attrs.height;
              node.style['max-width']="1px";
              node.style['min-width']="1px";
              node.style['width']="1px";
            }
          }
        }
        return[HSpacer,VSpacer];
      })();
    const[]=(function(){
        return[];
      })();
    return{HSpacer,MoreMenu,VSpacer};
  })(daedalus);
app=(function(api,components,daedalus,resources,router){
    "use strict";
    const DomElement=daedalus.DomElement;
    const StyleSheet=daedalus.StyleSheet;
    const svg=resources.svg;
    const meters_per_mile=1609.34;
    const spm_to_mpk=1000.0/60.0;
    const spm_to_mpm=meters_per_mile/60.0;
    const spm_color_map_blue_green=["#A0A0A0","#000080","#002060","#004040","#006020",
          "#008000","#006600","#004D00","#003300","#001A00","#000000"];
    const spm_color_map_autumn=["#A0A0A0","#FFFF00","#FFDF00","#FFC000","#FFA000",
          "#EF7800","#E05000","#D02800","#C00000","#600000","#000000"];
    const spm_color_map=spm_color_map_autumn;
    function spm_get_color(spm){
      const v=Math.floor(spm*10);
      if(v>=spm_color_map.length){
        return"#000000";
      }
      return spm_color_map[v];
    }
    const style={body:'dcs-2e988578-0',header:'dcs-2e988578-1',headerDiv:'dcs-2e988578-2',
          toolbar:'dcs-2e988578-3',toolbarInner:'dcs-2e988578-4',app:'dcs-2e988578-5',
          appTracker:'dcs-2e988578-6',paceRow:'dcs-2e988578-7',paceCol:'dcs-2e988578-8',
          appButtons:'dcs-2e988578-9',svgButton:'dcs-2e988578-10',hide:'dcs-2e988578-11',
          invisible:'dcs-2e988578-12',headerText:'dcs-2e988578-13',titleText:'dcs-2e988578-14',
          smallText:'dcs-2e988578-15',mediumText:'dcs-2e988578-16',largeText:'dcs-2e988578-17',
          dateText:'dcs-2e988578-18',flex_center:'dcs-2e988578-19',flex_spread:'dcs-2e988578-20',
          logView:'dcs-2e988578-21',logItem:'dcs-2e988578-22',logItemCol1:'dcs-2e988578-23',
          logItemCol2:'dcs-2e988578-24',logItemRowTitle:'dcs-2e988578-25',logItemRowInfo:'dcs-2e988578-26',
          logItemActions:'dcs-2e988578-27',logEntryView:'dcs-2e988578-28',map:'dcs-2e988578-29',
          map2:'dcs-2e988578-30',chart:'dcs-2e988578-31',trackBar:'dcs-2e988578-32',trackBar_bar:'dcs-2e988578-33',
          trackBar_button:'dcs-2e988578-34',switchMain:'dcs-2e988578-35',switchMainActive:'dcs-2e988578-36',
          switchButton:'dcs-2e988578-37',switchButtonActive:'dcs-2e988578-38',settingsRow:'dcs-2e988578-39'};
    
    function pad(n,width,z){
      z=z||'0';
      n=n+'';
      return n.length>=width?n:new Array(width-n.length+1).join(z)+n;
    }
    function fmtTime(t){
      let s=t/1000;
      let m=Math.floor(s/60);
      s=pad(Math.floor(s%60),2);
      let h=Math.floor(m/60);
      m=m%60;
      if(h>0){
        m=pad(m,2);
        return`${h}:${m}:${s}`;
      }else{
        return`${m}:${s}`;
      }
    }
    function fmtPace(s){
      s=s*60;
      let m=Math.floor(s/60);
      s=pad(Math.floor(s%60),2);
      return`${m}:${s}`;
    }
    class Div extends daedalus.DomElement {
      constructor(className,children){
        super("div",{className},children);
      }
    }
    class Text extends daedalus.DomElement {
      constructor(text,cls){
        super("div",{className:cls},[]);
        this.attrs.txt=this.appendChild(new daedalus.TextElement(text));
      }
      setText(text){
        this.attrs.txt.setText(text);
      }
    }
    class SwitchElement extends Div {
      constructor(){
        super(style.switchMain);
        this.attrs.btn=this.appendChild(new Div(style.switchButton));
      }
      onClick(){
        if(this.attrs.btn.hasClassName(style.switchButtonActive)){
          this.attrs.btn.removeClassName(style.switchButtonActive);
          this.removeClassName(style.switchMainActive);
        }else{
          this.attrs.btn.addClassName(style.switchButtonActive);
          this.addClassName(style.switchMainActive);
        }
      }
      isChecked(){
        return this.attrs.btn.hasClassName(style.switchButtonActive);
      }
    }
    class SvgElement extends DomElement {
      constructor(url,props){
        super("img",{src:url,...props},[]);
      }
      onLoad(event){
        console.warn("success loading: ",this.props.src);
      }
      onError(error){
        console.warn("error loading: ",this.props.src,JSON.stringify(error));
      }
    }
    class SvgButtonElement extends SvgElement {
      constructor(url,callback,size=96){
        super(url,{width:size,height:size,className:style.svgButton});
        this.attrs={callback};
      }
      onClick(event){
        if(this.attrs.callback){
          this.attrs.callback();
        }
      }
      setUrl(url){
        this.props.src=url;
        this.update();
      }
    }
    class NavHeader extends DomElement {
      constructor(){
        super("div",{className:style.header},[]);
        this.attrs={div:new DomElement("div",{className:style.headerDiv},[]),toolbar:new DomElement(
                      "div",{className:style.toolbar},[]),toolbarInner:new DomElement("div",
                      {className:style.toolbarInner},[])};
        this.appendChild(this.attrs.div);
        this.attrs.div.appendChild(this.attrs.toolbar);
        this.attrs.toolbar.appendChild(this.attrs.toolbarInner);
      }
      addAction(icon,callback){
        this.attrs.toolbarInner.appendChild(new SvgButtonElement(icon,callback,32));
        
        this.attrs.toolbarInner.appendChild(new components.HSpacer("1em"));
      }
      addElement(element){
        this.attrs.toolbarInner.appendChild(element);
        return element;
      }
      hideIcons(bHide){
        if(!!bHide){
          this.attrs.toolbarInner.addClassName(style.invisible);
        }else{
          this.attrs.toolbarInner.removeClassName(style.invisible);
        }
      }
    }
    class TrackerPage extends daedalus.DomElement {
      constructor(){
        super("div",{className:[style.app,style.appTracker]},[]);
        this.attrs.header=this.appendChild(new NavHeader());
        this.attrs.header.addAction(resources.svg.gear,()=>{
            router.navigate(router.routes.settings());
          });
        this.attrs.header.addElement(new components.HSpacer("1em"));
        this.attrs.header.addAction(resources.svg.whiteshoe,()=>{
            router.navigate(router.routes.log());
          });
        this.attrs.header.addElement(new components.HSpacer("1em"));
        this.attrs.header.addAction(resources.svg.map,()=>{
            router.navigate(router.routes.plan());
          });
        this.attrs.header.addElement(new components.HSpacer("1em"));
        this.attrs.distRow=this.appendChild(new Div(style.paceCol));
        this.attrs.distRow.appendChild(new Text("Distance:",style.titleText));
        this.attrs.txt_dist1=this.attrs.distRow.appendChild(new Text("0",style.largeText));
        
        this.attrs.txt_dist2=this.attrs.distRow.appendChild(new Text("0",style.mediumText));
        
        this.attrs.timeRow=this.appendChild(new Div(style.paceCol));
        this.attrs.timeRow.appendChild(new Text("Time:",style.titleText));
        this.attrs.txt_time=this.attrs.timeRow.appendChild(new Text("00:00",style.largeText));
        
        this.attrs.paceRow=this.appendChild(new Div(style.paceRow));
        this.attrs.paceRow.appendChild(new Div(null));
        this.attrs.paceCol1=this.attrs.paceRow.appendChild(new Div(style.paceCol));
        
        this.attrs.paceRow.appendChild(new Div(null));
        this.attrs.paceCol2=this.attrs.paceRow.appendChild(new Div(style.paceCol));
        
        this.attrs.paceRow.appendChild(new Div(null));
        this.attrs.paceCol1.appendChild(new Text("Current Pace: (min./km)",style.titleText));
        
        this.attrs.txt_pace_cur=this.attrs.paceCol1.appendChild(new Text("0",style.mediumText));
        
        this.attrs.paceCol2.appendChild(new Text("Average Pace: (min./km)",style.titleText));
        
        this.attrs.txt_pace_avg=this.attrs.paceCol2.appendChild(new Text("0",style.mediumText));
        
        this.appendChild(new Div(null));
        this.attrs.dashboard=this.appendChild(new DomElement("div",{className:style.appButtons}));
        
        let row=this.attrs.dashboard;
        this.attrs.btn_stop=row.appendChild(new SvgButtonElement(svg.button_stop,
                      ()=>{
              if(daedalus.platform.isAndroid&&!!Client){
                Client.enableTracking(false);
              }else{
                this.handleTrackingChanged({state:"stopped"});
              }
              if(this.attrs.timer!=null){
                clearInterval(this.attrs.timer);
                this.attrs.timer=null;
              }
            }));
        this.attrs.btn_play=row.appendChild(new SvgButtonElement(svg.button_play,
                      ()=>{
              if(daedalus.platform.isAndroid&&!!Client){
                Client.enableTracking(true);
              }else{
                this.handleTrackingChanged({state:"running"});
              }
            }));
        this.attrs.btn_pause=row.appendChild(new SvgButtonElement(svg.button_pause,
                      ()=>{
              if(daedalus.platform.isAndroid&&!!Client){
                Client.pauseTracking();
              }else{
                console.error("backend not enabled");
                this.handleTrackingChanged({state:"paused"});
              }
            }));
        this.attrs.dashboard.addClassName(style.flex_center);
        this.attrs.btn_stop.addClassName(style.hide);
        this.attrs.btn_pause.addClassName(style.hide);
        this.attrs.elapsed_time_ms=0;
        this.attrs.time_delta=0;
        this.attrs.timer=null;
        this.attrs.distances1=0.0;
        this.attrs.distances2=0.0;
        if(!daedalus.platform.isAndroid){
          const payload={uid:3,lat:42,lon:-71,distance:333*1000,samples:1234,dropped_samples:123,
                      accurate:true,elapsed_time_ms:12*60*60*1000+34*60*1000+56*1000,current_pace_spm:4.0,
                      average_pace_spm:.3};
          this.handleLocationUpdate(payload);
        }
      }
      elementMounted(){
        registerAndroidEvent('onlocationupdate',this.handleLocationUpdate.bind(this));
        
        registerAndroidEvent('ontrackingchanged',this.handleTrackingChanged.bind(
                      this));
      }
      elementUnmounted(){
        if(this.attrs.timer!=null){
          clearInterval(this.attrs.timer);
          this.attrs.timer=null;
        }
      }
      handleLocationUpdate(payload){
        if(payload.uid!=3){
          return;
        }
        this.attrs.distances1=(payload.distance/1000).toFixed(3);
        this.attrs.distances2=(payload.distance*0.000621371).toFixed(2);
        this.attrs.txt_dist1.setText(""+this.attrs.distances1+"k");
        this.attrs.txt_dist2.setText(""+this.attrs.distances2+"m");
        this.attrs.txt_pace_cur.setText(fmtPace(payload.current_pace_spm*spm_to_mpk));
        
        this.attrs.txt_pace_avg.setText(fmtPace(payload.average_pace_spm*spm_to_mpk));
        
        this.attrs.elapsed_time_ms=payload.elapsed_time_ms;
        this.attrs.time_delta=0;
        this.updateDisplayTime();
        if(this.attrs.timer!=null){
          clearInterval(this.attrs.timer);
          this.attrs.timer=null;
        }
        this.attrs.timer=setInterval(this.handleTimeout.bind(this),500);
      }
      handleTrackingChanged(payload){
        this.attrs.btn_stop.removeClassName(style.hide);
        this.attrs.btn_play.removeClassName(style.hide);
        this.attrs.btn_pause.removeClassName(style.hide);
        this.attrs.dashboard.removeClassName(style.flex_center);
        this.attrs.dashboard.removeClassName(style.flex_spread);
        this.attrs.current_state=payload.state;
        this.attrs.header.hideIcons(payload.state!=="stopped");
        if(payload.state==="running"){
          this.attrs.dashboard.addClassName(style.flex_center);
          this.attrs.btn_stop.addClassName(style.hide);
          this.attrs.btn_play.addClassName(style.hide);
        }else if(payload.state==="paused"){
          this.attrs.dashboard.addClassName(style.flex_spread);
          this.attrs.btn_pause.addClassName(style.hide);
          if(this.attrs.timer!=null){
            clearInterval(this.attrs.timer);
            this.attrs.timer=null;
          }
        }else if(payload.state==="stopped"){
          this.attrs.dashboard.addClassName(style.flex_center);
          this.attrs.btn_stop.addClassName(style.hide);
          this.attrs.btn_pause.addClassName(style.hide);
        }
      }
      handleTimeout(){
        if(this.attrs.current_state=="paused"&&this.attrs.timer!=null){
          clearInterval(this.attrs.timer);
          this.attrs.timer=null;
        }
        this.attrs.time_delta+=500;
        this.updateDisplayTime();
      }
      updateDisplayTime(){
        if(this.attrs.current_state=="paused"){
          return;
        }
        let t=fmtTime(this.attrs.elapsed_time_ms+this.attrs.time_delta);
        this.attrs.txt_time.setText(t);
      }
    }
    class SettingsPage extends daedalus.DomElement {
      constructor(){
        super("div",{className:style.app},[]);
        this.attrs.header=this.appendChild(new NavHeader());
        this.attrs.header.addAction(resources.svg.back,()=>{
            router.navigate(router.routes.landing());
          });
        let row;
        this.appendChild(new components.VSpacer("1em"));
        row=this.appendChild(new Text("Distance Settings",style.smallText));
        this.appendChild(new components.VSpacer("1em"));
        row=this.appendChild(new Div(style.settingsRow));
        row.appendChild(new Text("Display Kilometers",style.smallText));
        row.appendChild(new SwitchElement());
        row=this.appendChild(new Div(style.settingsRow));
        row.appendChild(new Text("Display Miles",style.smallText));
        row.appendChild(new SwitchElement());
        this.appendChild(new components.VSpacer("1em"));
        row=this.appendChild(new Text("Pace Settings",style.smallText));
        this.appendChild(new components.VSpacer("1em"));
        row=this.appendChild(new Div(style.settingsRow));
        row.appendChild(new Text("Min. per Km",style.smallText));
        row.appendChild(new SwitchElement());
        row=this.appendChild(new Div(style.settingsRow));
        row.appendChild(new Text("Min. per Mile",style.smallText));
        row.appendChild(new SwitchElement());
      }
    }
    const month_short_names=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep',
          'Oct','Nov','Dec'];
    class LogListItem extends daedalus.DomElement {
      constructor(parent,item){
        super("div",{className:style.logItem},[]);
        this.attrs.parent=parent;
        this.attrs.item=item;
        let dt=new Date(0);
        dt.setUTCSeconds(item.start_date);
        let col1=this.appendChild(new daedalus.DomElement("div",{className:style.logItemCol1}));
        
        let col2=this.appendChild(new daedalus.DomElement("div",{className:style.logItemCol2}));
        
        let date=pad(dt.getFullYear(),2)+"/"+pad(1+dt.getMonth(),2)+"/"+pad(dt.getDate(
                    ),2);
        let time=dt.getHours()+":"+pad(dt.getMinutes(),2);
        let pace=fmtPace(item.average_pace_spm*spm_to_mpk);
        let dist=(item.distance/1000.0).toFixed(3)+" k";
        let tmp;
        tmp=col1.appendChild(new daedalus.DomElement("div",{className:style.logItemRowTitle},
                      []));
        tmp.appendChild(new daedalus.DomElement("div",{},[new daedalus.TextElement(
                              `${month_short_names[dt.getMonth()]}`)]));
        tmp=col1.appendChild(new daedalus.DomElement("div",{className:[style.logItemRowTitle,
                              style.dateText]},[]));
        tmp.appendChild(new daedalus.DomElement("div",{},[new daedalus.TextElement(
                              `${pad(dt.getDate(),2)}`)]));
        tmp=col1.appendChild(new daedalus.DomElement("div",{className:style.logItemRowTitle},
                      []));
        tmp.appendChild(new daedalus.DomElement("div",{},[new daedalus.TextElement(
                              `${dt.getFullYear()}`)]));
        tmp=col1.appendChild(new daedalus.DomElement("div",{className:style.logItemRowTitle},
                      []));
        tmp.appendChild(new daedalus.DomElement("div",{},[new daedalus.TextElement(
                              time)]));
        this.attrs.row2=col2.appendChild(new daedalus.DomElement("div",{className:style.logItemRowInfo},
                      []));
        this.attrs.row2.appendChild(new daedalus.DomElement("div",{},[new daedalus.TextElement(
                              `Distance:`)]));
        this.attrs.row2.appendChild(new daedalus.DomElement("div",{},[new daedalus.TextElement(
                              `${dist}`)]));
        this.attrs.row3=col2.appendChild(new daedalus.DomElement("div",{className:style.logItemRowInfo},
                      []));
        this.attrs.row3.appendChild(new daedalus.DomElement("div",{},[new daedalus.TextElement(
                              `Elapsed Time:`)]));
        this.attrs.row3.appendChild(new daedalus.DomElement("div",{},[new daedalus.TextElement(
                              `${fmtTime(item.elapsed_time_ms)}`)]));
        this.attrs.row4=col2.appendChild(new daedalus.DomElement("div",{className:style.logItemRowInfo},
                      []));
        this.attrs.row4.appendChild(new daedalus.DomElement("div",{},[new daedalus.TextElement(
                              `Average Pace:`)]));
        this.attrs.row4.appendChild(new daedalus.DomElement("div",{},[new daedalus.TextElement(
                              `${pace}`)]));
        this.attrs.row5=col2.appendChild(new daedalus.DomElement("div",{className:style.logItemActions},
                      []));
        this.attrs.row5.appendChild(new daedalus.DomElement("div"));
        this.attrs.row5.appendChild(new daedalus.ButtonElement("Details",this.handleDetailsClicked.bind(
                          this)));
        this.attrs.row5.appendChild(new daedalus.DomElement("div"));
      }
      handleDetailsClicked(){
        router.navigate(router.routes.logEntry({entry:this.attrs.item.spk}));
      }
    }
    class LogListView extends daedalus.DomElement {
      constructor(){
        super("div",{className:style.logView},[]);
      }
      clear(){
        this.removeChildren();
      }
      addItem(item){
        this.appendChild(new LogListItem(this,item));
      }
    }
    class LogPage extends daedalus.DomElement {
      constructor(){
        super("div",{className:style.app},[]);
        this.attrs.header=this.appendChild(new NavHeader());
        this.attrs.header.addAction(resources.svg.back,()=>{
            router.navigate(router.routes.landing());
          });
        this.attrs.view=this.appendChild(new LogListView());
      }
      elementMounted(){
        if(daedalus.platform.isAndroid&&!!Client){
          new Promise((accept,reject)=>{
              try{
                let srecords=Client.getRecords();
                accept(JSON.parse(srecords));
              }catch(e){
                reject(""+e);
              };
            }).then(this.receiveRecords.bind(this)).catch(console.error);
        }else{
          const sample={"spk":0,"start_date":0,"num_splits":1,"elapsed_time_ms":1234000,
                      "distance":3200.18888,"average_pace_spm":.5,"log_path":""};
          this.attrs.view.clear();
          this.attrs.view.addItem(sample);
          this.attrs.view.addItem(sample);
          this.attrs.view.addItem(sample);
          this.attrs.view.addItem(sample);
          this.attrs.view.addItem(sample);
          this.attrs.view.addItem(sample);
          this.attrs.view.addItem(sample);
        }
      }
      receiveRecords(records){
        this.attrs.view.clear();
        records.forEach(item=>{
            this.attrs.view.addItem(item);
          });
      }
    }
    class Map extends daedalus.DomElement {
      constructor(){
        super("div",{className:style.map},[]);
        this.attrs.routes=[];
      }
      displayMap(bounds){
        this.attrs.map=L.map(this.props.id);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                  {attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                      subdomains:'abcd',maxZoom:19}).addTo(this.attrs.map);
        this.attrs.map.fitBounds(bounds);
      }
      displayRoute(segments){
        while(this.attrs.routes.length>0){
          let route=this.attrs.routes.pop();
          this.attrs.map.removeLayer(route);
        }
        this.attrs.routes=[];
        try{
          this._displaySegment(segments[0],spm_color_map[0]);
          for(let i=segments.length-1;i>0;i--)
            {
              this._displaySegment(segments[i],spm_color_map[i]);
            }
        }catch(err){
          console.error(""+err);
        };
      }
      _displaySegment(segment,color){
        if(segment.length>0){
          segment=segment.map(t=>{
              return t.map(p=>{
                  return[p[0],p[1]];
                });
            });
          let route=L.polyline(segment,{color:color,weight:4}).addTo(this.attrs.map);
          
          this.attrs.routes.push(route);
        }
      }
    }
    function pt(x,y){
      return{x,y};
    }
    class LineChart extends daedalus.DomElement {
      constructor(){
        super("canvas",{className:style.chart},[]);
        this.attrs.chart=null;
        this.attrs.data=null;
      }
      getSettings(){
        return{type:["line"],data:{datasets:[{label:"average pace",data:[],backgroundColor:"#000000",
                              borderColor:"#000000",pointRadius:0,borderWidth:2,fill:false},{label:"current pace",
                              data:[],backgroundColor:"#008000",borderColor:"#008000",pointRadius:0,
                              borderWidth:2,fill:false}]},options:{scales:{xAxes:[{type:'linear',
                                  position:'bottom',ticks:{beginAtZero:false,callback:(value,index,
                                          values)=>fmtTime(value*1000)}}],yAxes:[{ticks:{beginAtZero:false}}]}}};
        
      }
      elementMounted(){
        if(this.attrs.chart===null){
          let ctxt=this.getDomNode().getContext('2d');
          console.log("construct new chart");
          this.attrs.chart=new Chart(ctxt,this.getSettings());
          if(this.attrs.data!==null){
            this.setData(this.attrs.data);
          }
        }
      }
      elementUnmounted(){
        if(this.attrs.chart!==null){
          this.attrs.chart.destroy();
          this.attrs.chart=null;
        }
      }
      setData(data){
        if(this.attrs.chart!==null){
          let ds=this.attrs.chart.data.datasets;
          ds[0].data=data[0];
          ds[1].data=data[1];
          this.attrs.chart.update();
        }
        this.attrs.data=data;
      }
    }
    class TrackBarTrack extends DomElement {
      constructor(){
        super("div",{className:style.trackBar_bar},[]);
      }
    }
    class TrackBarButton extends DomElement {
      constructor(img){
        super("div",{className:[style.trackBar_button]},[]);
        this.attrs.img=img;
      }
      elementMounted(){
        let nd=this.getDomNode();
        nd.style['background-image']="url("+this.attrs.img+")";
        nd.style['background-size']="contain";
      }
    }
    class TrackBar extends DomElement {
      constructor(callback){
        super("div",{className:style.trackBar},[]);
        this.attrs={callback,pressed:false,posA:0,posB:0,maximum:1.0,tposA:0,tposB:0,
                  startx:[0,0],track:this.appendChild(new TrackBarTrack()),btnMin:this.appendChild(
                      new TrackBarButton(resources.svg.marker_L)),btnMax:this.appendChild(new TrackBarButton(
                          resources.svg.marker_R)),active_btn:-1};
      }
      setTrackColor(color){
        let nd=this.attrs.track.getDomNode();
        if(!!nd){
          nd.style.background=color;
        }
      }
      setPosition(start,end,maximum=1.0){
        let posA=0;
        let posB=0;
        if(maximum>0){
          posA=start;
          posB=end;
        }
        if(posA>posB){
          posA=posB;
        }
        this.attrs.posA=posA;
        this.attrs.posB=posB;
        this.attrs.tposA=posA/maximum;
        this.attrs.tposB=posB/maximum;
        this.attrs.maximum=maximum;
        const btnMin=this.attrs.btnMin.getDomNode();
        const btnMax=this.attrs.btnMax.getDomNode();
        const ele=this.attrs.track.getDomNode();
        if(btnMin&&ele){
          this._setPosition(btnMin,ele,this.attrs.tposA,0);
        }
        if(btnMax&&ele){
          this._setPosition(btnMax,ele,this.attrs.tposB,1);
        }
      }
      _setPosition(btn,ele,tpos,align){
        let m2=ele.clientWidth;
        let m1=0;
        let x=m1+tpos*m2;
        if(x>m2){
          x=m2;
        }else if(x<m1){
          x=m1;
        }
        x+=ele.offsetLeft-btn.clientWidth/2;
        this.attrs.startx[align]=Math.floor(x)+"px";
        if(!this.attrs.pressed){
          btn.style.left=this.attrs.startx[align];
        }
      }
      onMouseDown(event){
        this.trackingStart(event);
        this.trackingMove(event);
      }
      onMouseMove(event){
        if(!this.attrs.pressed){
          return;
        }
        this.trackingMove(event);
      }
      onMouseLeave(event){
        if(!this.attrs.pressed){
          return;
        }
        this.trackingEnd(false);
      }
      onMouseUp(event){
        if(!this.attrs.pressed){
          return;
        }
        this.trackingMove(event);
        this.trackingEnd(true);
      }
      onTouchStart(event){
        this.trackingStart(event);
        this.trackingMove(event);
      }
      onTouchMove(event){
        if(!this.attrs.pressed){
          return;
        }
        this.trackingMove(event);
      }
      onTouchCancel(event){
        if(!this.attrs.pressed){
          return;
        }
        this.trackingEnd(false);
      }
      onTouchEnd(event){
        if(!this.attrs.pressed){
          return;
        }
        this.trackingMove(event);
        this.trackingEnd(true);
      }
      trackingStart(){
        const btnMin=this.attrs.btnMin.getDomNode();
        const btnMax=this.attrs.btnMax.getDomNode();
        this.attrs.startx[0]=btnMin.style.left;
        this.attrs.startx[1]=btnMax.style.left;
        this.attrs.pressed=true;
        this.attrs.active_btn=-1;
      }
      trackingEnd(accept){
        const btnMin=this.attrs.btnMin.getDomNode();
        const btnMax=this.attrs.btnMax.getDomNode();
        const ele=this.attrs.track.getDomNode();
        this.attrs.pressed=false;
        if(accept){
          let p1=Math.floor(this.attrs.tposA*this.attrs.maximum);
          let p2=Math.floor(this.attrs.tposB*this.attrs.maximum);
          this.attrs.posA=p1;
          this.attrs.posB=p2;
          if(this.attrs.callback){
            this.attrs.callback(p1,p2);
          }
        }else{
          btnMin.style.left=this.attrs.startx[0];
          btnMax.style.left=this.attrs.startx[1];
        }
        this.attrs.active_btn=-1;
      }
      trackingMove(event){
        let org_event=event;
        let evt=(((event)||{}).touches||((((event)||{}).originalEvent)||{}).touches);
        
        if(evt){
          event=evt[0];
        }
        if(!event){
          return;
        }
        const btnMin=this.attrs.btnMin.getDomNode();
        const btnMax=this.attrs.btnMax.getDomNode();
        const ele=this.attrs.track.getDomNode();
        const rect=ele.getBoundingClientRect();
        let x=event.pageX-rect.left;
        if(this.attrs.active_btn==-1){
          let x1=parseInt(btnMin.style.left,10);
          let x2=parseInt(btnMax.style.left,10);
          let d1=Math.abs(x-x1);
          let d2=Math.abs(x-x2);
          if(x>x2){
            this.attrs.active_btn=1;
          }else if(x<x1){
            this.attrs.active_btn=0;
          }else if(d1<d2){
            this.attrs.active_btn=0;
          }else{
            this.attrs.active_btn=1;
          }
        }
        let btn;
        if(this.attrs.active_btn===0){
          btn=btnMin;
        }else{
          btn=btnMax;
        }
        let offset=ele.offsetLeft;
        let m2=ele.clientWidth;
        let m1=0;
        if(x>m2){
          x=m2;
        }else if(x<m1){
          x=m1;
        }
        let tpos=(m2>0&&x>=0)?(x-m1)/m2:0.0;
        if(this.attrs.active_btn===0){
          if(tpos>this.attrs.tposB){
            tpos=this.attrs.tposB;
          }
          this.attrs.tposA=tpos;
        }else{
          if(tpos<this.attrs.tposA){
            tpos=this.attrs.tposA;
          }
          this.attrs.tposB=tpos;
        }
        let xpos=m1+tpos*m2;
        if(xpos>m2){
          xpos=m2;
        }else if(xpos<m1){
          xpos=m1;
        }
        xpos+=ele.offsetLeft-btn.clientWidth/2;
        btn.style.left=Math.floor(xpos)+"px";
      }
    }
    function points2segments(points,start,end){
      const N_SEGMENTS=10;
      if(start===undefined||start<0){
        start=0;
      }
      if(end===undefined||end>points.length){
        end=points.length;
      }
      const segments=[];
      for(let j=0;j<N_SEGMENTS+1;j++)
        {
          segments.push([]);
        }
      let point=null;
      let prev_point=null;
      let prev_index=-1;
      let current_segment=null;
      let distance=0.0;
      let delta_t=0;
      let i=0;
      for(i=start;i<end;i++)
        {
          let[lat,lon,index,d,t]=points[i];
          point=[lat,lon];
          if(index>0){
            distance+=d;
            delta_t+=t;
          }
          if(prev_index!==index){
            if(prev_point!==null){
              if(current_segment!==null&&current_segment.length>0){
                segments[prev_index].push(current_segment);
              }
              current_segment=[];
              current_segment.push(prev_point);
              current_segment.push(point);
              prev_index=index;
            }
          }else if(current_segment!==null){
            current_segment.push(point);
            prev_index=index;
          }
          prev_point=point;
        }
      if(current_segment!==null&&current_segment.length>0){
        segments[prev_index].push(current_segment);
      }
      return[distance,delta_t,segments];
    }
    function points2gradient(points,start,end){
      const N_MAX_SEGMENTS=50;
      if(start===undefined||start<0){
        start=0;
      }
      if(end===undefined||end>points.length){
        end=points.length;
      }
      const gradient=[];
      if(end-start<N_MAX_SEGMENTS){
        for(let i=start;i<end;i++)
          {
            let[lat,lon,index,d,t]=points[i];
            if(index>=0){
              gradient.push(spm_color_map[index]);
            }
          }
      }else{
        let N=Math.floor((end-start)/N_MAX_SEGMENTS);
        for(let i=start;i<end;i+=N)
          {
            let data=points.slice(i,i+N).map(item=>item[2]).filter(v=>v>=0);
            let index=Math.floor(data.reduce((a,b)=>a+b,0)/data.length);
            gradient.push(spm_color_map[index]);
          }
      }
      return`linear-gradient(90deg, ${gradient.join(",")})`;
    }
    function filt(b){
      const values=[];
      let mapfn=(v,i)=>v*b[i];
      let redfn=(v1,v2)=>v1+v2;
      return(p)=>{
        values.push(p);
        if(values.length>b.length){
          values.shift();
        }
        if(b.length==values.length){
          return values.map(mapfn).reduce(redfn,0.0);
        }else{
          return 0.0;
        }
      };
    }
    function points2pace(points,start,end){
      if(start===undefined||start<0){
        start=0;
      }
      if(end===undefined||end>points.length){
        end=points.length;
      }
      const dataset0=[];
      const dataset1=[];
      let distance=0.0;
      let elapsed_time=0;
      let i;
      for(i=0;i<start;i++)
        {
          let[lat,lon,index,d,t]=points[i];
          if(index<1){
            continue;
          }
          distance+=d;
          elapsed_time+=t;
        }
      let filter=filt([0.1,0.1,0.2,0.2,0.4]);
      for(i=start;i<end;i++)
        {
          let[lat,lon,index,d,t]=points[i];
          if(index<1){
            continue;
          }
          distance+=d;
          elapsed_time+=t;
          let y1=(distance>1e-6)?(elapsed_time/1000.0/distance):0.0;
          dataset0.push(pt(elapsed_time/1000.0,y1*spm_to_mpk));
          let y2=(d>1e-6)?(t/1000.0/d):0.0;
          dataset1.push(pt(elapsed_time/1000.0,filter(y2)*spm_to_mpk));
        }
      return[dataset0,dataset1];
    }
    function points2pace2(points,start,end){
      if(start===undefined||start<0){
        start=0;
      }
      if(end===undefined||end>points.length){
        end=points.length;
      }
      const dataset0=[];
      const dataset1=[];
      let distance=0.0;
      let elapsed_time=0;
      let filter=filt([0.1,0.1,0.2,0.2,0.4]);
      let i;
      for(i=0;i<start;i++)
        {
          let[lat,lon,index,d,t]=points[i];
          if(index<1){
            continue;
          }
          distance+=d;
          elapsed_time+=t;
          filter((d>1e-6)?(t/1000.0/d):0.0);
        }
      let N_POINTS=200;
      let N=end-start;
      let step=Math.floor(N/N_POINTS);
      if(step<1){
        step=1;
      }
      for(i=start;i<end;i+=step)
        {
          let ad=0.0;
          let at=0;
          let ap=0;
          let n=0;
          for(let j=i;j<end&&j<i+step;j++)
            {
              let[lat,lon,index,d,t]=points[i];
              if(index<1){
                continue;
              }
              ad+=d;
              at+=t;
              ap+=filter((d>1e-6)?(t/1000.0/d):0.0);
              n+=1;
            }
          distance+=ad;
          elapsed_time+=at;
          if(n>0){
            let x=elapsed_time/1000.0;
            let y1=(distance>1e-6)?((elapsed_time/1000.0)/distance):0.0;
            let y2=ap/n;
            dataset0.push(pt(x,y1*spm_to_mpk));
            dataset1.push(pt(x,y2*spm_to_mpk));
          }
        }
      return[dataset0,dataset1];
    }
    class LogEntryPage extends daedalus.DomElement {
      constructor(){
        super("div",{className:style.app},[]);
        this.attrs.menu=new components.MoreMenu(this.handleMenuClose.bind(this));
        
        this.attrs.menu.addAction("Delete",()=>{
            if(daedalus.platform.isAndroid&&!!Client){
              Client.deleteLogEntry(this.state.match.entry);
            }
            router.navigate(router.routes.log());
          },"danger");
        this.attrs.menu.addAction("Cancel",()=>{});
        this.appendChild(this.attrs.menu);
        this.attrs.header=this.appendChild(new NavHeader());
        this.attrs.header.addAction(resources.svg.back,()=>{
            router.navigate(router.routes.log());
          });
        this.attrs.header.addAction(resources.svg.share,()=>{
            if(daedalus.platform.isAndroid&&!!Client){
              Client.shareLogEntry(this.state.match.entry);
            }
          });
        this.attrs.header.addAction(resources.svg.trash,()=>{
            this.attrs.menu.show();
          });
        this.attrs.map=this.appendChild(new Map());
        this.attrs.track=this.appendChild(new TrackBar(this.handleUpdateData.bind(
                          this)));
        this.attrs.lst=this.appendChild(new daedalus.DomElement("div",{className:style.logEntryView},
                      []));
        this.appendChild(new components.VSpacer("2em"));
        this.attrs.linechart=this.appendChild(new LineChart());
        this.appendChild(new components.VSpacer("2em"));
        this.attrs.txt_distance=new daedalus.TextElement('----');
        this.attrs.txt_elapsed=new daedalus.TextElement('----');
        this.attrs.txt_avg_pace=new daedalus.TextElement('----');
        this.attrs.row2=this.attrs.lst.appendChild(new daedalus.DomElement("div",
                      {className:style.logItemRowInfo},[]));
        this.attrs.row2.appendChild(new daedalus.DomElement("div",{},[new daedalus.TextElement(
                              `Distance:`)]));
        this.attrs.row2.appendChild(new daedalus.DomElement("div",{},[this.attrs.txt_distance]));
        
        this.attrs.row3=this.attrs.lst.appendChild(new daedalus.DomElement("div",
                      {className:style.logItemRowInfo},[]));
        this.attrs.row3.appendChild(new daedalus.DomElement("div",{},[new daedalus.TextElement(
                              `Elapsed Time:`)]));
        this.attrs.row3.appendChild(new daedalus.DomElement("div",{},[this.attrs.txt_elapsed]));
        
        this.attrs.row4=this.attrs.lst.appendChild(new daedalus.DomElement("div",
                      {className:style.logItemRowInfo},[]));
        this.attrs.row4.appendChild(new daedalus.DomElement("div",{},[new daedalus.TextElement(
                              `Average Pace:`)]));
        this.attrs.row4.appendChild(new daedalus.DomElement("div",{},[this.attrs.txt_avg_pace]));
        
      }
      elementMounted(){
        if(daedalus.platform.isAndroid&&!!Client){
          new Promise((accept,reject)=>{
              try{
                let srecords=Client.getLogEntry(this.state.match.entry);
                accept(JSON.parse(srecords));
              }catch(e){
                reject(""+e);
              };
            }).then(this.setData.bind(this)).catch(console.error);
        }else{
          const sample={"spk":0,"start_date":0,"num_splits":1,"elapsed_time_ms":1234000,
                      "distance":3200.18888,"average_pace_spm":.5,"log_path":"",points:[]};
          
          let N=1800;
          let lat=40;
          let lon=-75;
          sample.points.push([40,-75,-1,0.0,0]);
          for(let i=0;i<N;i++)
            {
              let index=1+Math.floor(10*i/N);
              lat+=1e-5*(Math.random()*10)*((i>N/2)?-1:1);
              lon-=1e-5*(Math.random()*10);
              sample.points.push([lat,lon,index,8-2*i/N+Math.random()*.5,2000]);
            }
          this.setData(sample);
        }
      }
      setData(data){
        if(((((data)||{}).points)||{}).length>0){
          this.attrs.data=data;
          const[distance,delta_t,segments]=points2segments(data.points);
          const gradient=points2gradient(data.points);
          const point_data=points2pace2(data.points);
          const bounds=L.latLngBounds(data.points.map(p=>[p[0],p[1]]));
          this.attrs.track.setTrackColor(gradient);
          this.attrs.map.displayMap(bounds);
          this.attrs.map.displayRoute(segments);
          this.attrs.linechart.setData(point_data);
          this.attrs.track.setPosition(0,data.points.length,data.points.length);
          let pace="";
          if(distance>1e-6){
            pace=fmtPace((delta_t/1000/distance)*spm_to_mpk);
          }
          let time=fmtTime(delta_t);
          let dist=(distance/1000.0).toFixed(3)+" k";
          this.attrs.txt_distance.setText(dist);
          this.attrs.txt_elapsed.setText(time);
          this.attrs.txt_avg_pace.setText(pace);
        }else{
          console.error("no data");
        }
      }
      handleUpdateData(start,end){
        let[distance,delta_t,segments]=points2segments(this.attrs.data.points,start,
                  end);
        const point_data=points2pace2(this.attrs.data.points,start,end);
        this.attrs.map.displayRoute(segments);
        this.attrs.linechart.setData(point_data);
        let pace="";
        if(distance>1e-6){
          pace=fmtPace((delta_t/1000/distance)*spm_to_mpk);
        }
        let time=fmtTime(delta_t);
        let dist=(distance/1000.0).toFixed(3)+" k";
        this.attrs.txt_distance.setText(dist);
        this.attrs.txt_elapsed.setText(time);
        this.attrs.txt_avg_pace.setText(pace);
      }
      handleMenuClose(){

      }
    }
    let DistanceCtrl=L.Control.extend({onAdd:function(map){
          var el=L.DomUtil.create('div','leaflet-bar my-control');
          el.innerHTML='Distance: 0.000k';
          el.style['font-size']="1.5em";
          el.style.padding=".5em";
          el.style['background-color']="white";
          return el;
        },onRemove:function(map){

        },setDistance:function(distance){
          this.getContainer().innerHTML=""+distance;
        }});
    class DistanceMap extends daedalus.DomElement {
      constructor(){
        super("div",{className:style.map2},[]);
        this.attrs={markers:[],segments:[],icon:{start:L.icon({iconUrl:resources.png.map_start,
                              iconSize:[24,24],iconAnchor:[12,12]}),midpoint:L.icon({iconUrl:resources.png.map_point,
                              iconSize:[24,24],iconAnchor:[12,12]}),end:L.icon({iconUrl:resources.png.map_end,
                              iconSize:[24,24],iconAnchor:[12,12]})}};
        this.attrs.ptopt_add=true;
        this.attrs.ptopt_remove=true;
        this.attrs.ptopt_split=true;
        this.attrs.ptopt_close=false;
      }
      displayMap(){
        const pt=api.getLastKnownLocation();
        this.attrs.map=L.map(this.props.id).setView([pt.lat,pt.lon],14);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                  {attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                      subdomains:'abcd',maxZoom:19}).addTo(this.attrs.map);
        this.attrs.ptnd_add=this.addControl(resources.svg.map_add,"Add Markers",this.handlePtAddClicked.bind(
                      this));
        this.attrs.ptnd_remove=this.addControl(resources.svg.map_remove,"Remove Markers",
                  this.handlePtRemoveClicked.bind(this));
        this.attrs.ptnd_split=this.addControl(resources.svg.map_split,"Split Lines",
                  this.handlePtSplitClicked.bind(this));
        this.attrs.ptnd_close=this.addControl(resources.svg.map_close,"Close Loop",
                  this.handlePtCloseClicked.bind(this));
        this.attrs.map.on('click',this.handleMapClick.bind(this));
        this.attrs.distance_ctrl=new DistanceCtrl({position:'topright'});
        this.attrs.distance_ctrl.addTo(this.attrs.map);
        this.attrs.ptnd_add.style['background']=this.attrs.ptopt_add?'#999999':'#FFFFFF';
        
        this.attrs.ptnd_remove.style['background']=this.attrs.ptopt_remove?'#999999':'#FFFFFF';
        
        this.attrs.ptnd_split.style['background']=(this.attrs.ptopt_add||this.attrs.ptopt_remove)?'#FFFFFF':'#999999';
        
        new L.marker(pt,{}).addTo(this.attrs.map);
      }
      handleMapClick(e){
        if(!this.attrs.ptopt_add){
          return;
        }
        this.attrs.markers.push(this.createMarker(e.latlng));
        this.updateMarkerIcons();
        this.repaintSegments();
      }
      handleMarkerMove(marker,e){
        this.repaintSegments();
      }
      handleMarkerClick(marker,e){
        if(!this.attrs.ptopt_remove){
          return;
        }
        this.removeMarker(marker);
        L.DomEvent.stopPropagation(e);
      }
      handleSegmentClick(index,e){
        this.attrs.markers.splice(index,0,this.createMarker(e.latlng));
        this.updateMarkerIcons();
        this.repaintSegments();
        L.DomEvent.stopPropagation(e);
      }
      createMarker(pt){
        let newMarker=new L.marker(pt,{draggable:true,autoPan:true,icon:this.attrs.icon.end}).addTo(
                  this.attrs.map);
        newMarker.on('click',(e)=>{
            this.handleMarkerClick(newMarker,e);
          });
        newMarker.on('move',(e)=>{
            this.handleMarkerMove(newMarker,e);
          });
        return newMarker;
      }
      removeMarker(marker){
        this.attrs.markers=this.attrs.markers.filter(m=>m._leaflet_id!=marker._leaflet_id);
        
        this.attrs.map.removeLayer(marker);
        this.updateMarkerIcons();
        this.repaintSegments();
      }
      updateMarkerIcons(){
        if(this.attrs.markers.length>0){
          this.attrs.markers[0].setIcon(this.attrs.icon.start);
        }
        if(this.attrs.markers.length>1){
          this.attrs.markers[0].setIcon(this.attrs.icon.start);
          for(let i=1;i<this.attrs.markers.length-1;i++)
            {
              this.attrs.markers[i].setIcon(this.attrs.icon.midpoint);
            }
        }
        if(this.attrs.markers.length>2){
          this.attrs.markers[this.attrs.markers.length-1].setIcon(this.attrs.icon.end);
          
        }
      }
      repaintSegments(){
        while(this.attrs.segments.length>0){
          let segment=this.attrs.segments.pop();
          this.attrs.map.removeLayer(segment);
        }
        let d=0;
        for(let i=1;i<this.attrs.markers.length;i++)
          {
            let p1=this.attrs.markers[i-1].getLatLng();
            let p2=this.attrs.markers[i].getLatLng();
            let newSegment=L.polyline([p1,p2],{color:'#000',weight:7}).addTo(this.attrs.map);
            
            newSegment.on('click',(e)=>{
                this.handleSegmentClick(i,e);
              });
            this.attrs.segments.push(newSegment);
            d+=api.geo_distance(p1.lat,p1.lng,p2.lat,p2.lng);
          }
        if(this.attrs.ptopt_close&&this.attrs.markers.length>1){
          let p1=this.attrs.markers[this.attrs.markers.length-1].getLatLng();
          let p2=this.attrs.markers[0].getLatLng();
          let newSegment=L.polyline([p1,p2],{color:'#000',weight:7}).addTo(this.attrs.map);
          
          newSegment.on('click',(e)=>{
              this.handleSegmentClick(i,e);
            });
          this.attrs.segments.push(newSegment);
          d+=api.geo_distance(p1.lat,p1.lng,p2.lat,p2.lng);
        }
        this.attrs.distance_ctrl.setDistance("Distance: "+d.toFixed(3)+"k");
      }
      addControl(icon,title,fn){
        let html='<img src="'+icon+'" style="margin-top: 3px;" width="24" height="24">';
        
        let className="leaflet-control-zoom-out";
        let node=this.attrs.map.zoomControl._createButton(html,title,className,this.attrs.map.zoomControl._container,
                  fn);
        return node;
      }
      handlePtAddClicked(){
        this.attrs.ptopt_add=!this.attrs.ptopt_add;
        this.attrs.ptnd_add.style['background']=this.attrs.ptopt_add?'#999999':'#FFFFFF';
        
        this.attrs.ptnd_split.style['background']=(this.attrs.ptopt_add||this.attrs.ptopt_remove)?'#FFFFFF':'#999999';
        
      }
      handlePtRemoveClicked(){
        this.attrs.ptopt_remove=!this.attrs.ptopt_remove;
        this.attrs.ptnd_remove.style['background']=this.attrs.ptopt_remove?'#999999':'#FFFFFF';
        
        this.attrs.ptnd_split.style['background']=(this.attrs.ptopt_add||this.attrs.ptopt_remove)?'#FFFFFF':'#999999';
        
      }
      handlePtSplitClicked(){
        this.attrs.ptopt_add=false;
        this.attrs.ptopt_remove=false;
        this.attrs.ptnd_add.style['background']=this.attrs.ptopt_add?'#999999':'#FFFFFF';
        
        this.attrs.ptnd_remove.style['background']=this.attrs.ptopt_remove?'#999999':'#FFFFFF';
        
        this.attrs.ptnd_split.style['background']=(this.attrs.ptopt_add||this.attrs.ptopt_remove)?'#FFFFFF':'#999999';
        
      }
      handlePtCloseClicked(){
        this.attrs.ptopt_close=!this.attrs.ptopt_close;
        this.attrs.ptnd_close.style['background']=this.attrs.ptopt_close?'#999999':'#FFFFFF';
        
        this.repaintSegments();
      }
    }
    class RoutePlanPage extends daedalus.DomElement {
      constructor(){
        super("div",{className:style.app},[]);
        this.attrs.header=this.appendChild(new NavHeader());
        this.attrs.header.addAction(resources.svg.back,()=>{
            router.navigate(router.routes.landing());
          });
        this.attrs.map=this.appendChild(new DistanceMap());
      }
      elementMounted(){
        this.attrs.map.displayMap();
      }
    }
    class App extends daedalus.DomElement {
      constructor(){
        super("div",{},[]);
        this.attrs={page_cache:{},container:new DomElement("div",{id:"app_container"},
                      [])};
        this.appendChild(this.attrs.container);
        const body=document.getElementsByTagName("BODY")[0];
        body.className=style.body;
        this.attrs.router=this.buildRouter(this,this.attrs.container);
        this.handleLocationChanged();
        this.connect(history.locationChanged,this.handleLocationChanged.bind(this));
        
      }
      buildRouter(container){
        const u=router.route_urls;
        let rt=new router.AppRouter(container);
        rt.addRoute(u.logEntry,(cbk)=>{
            this.handleRoute(cbk,LogEntryPage);
          });
        rt.addRoute(u.log,(cbk)=>{
            this.handleRoute(cbk,LogPage);
          });
        rt.addRoute(u.settings,(cbk)=>{
            this.handleRoute(cbk,SettingsPage);
          });
        rt.addRoute(u.plan,(cbk)=>{
            this.handleRoute(cbk,RoutePlanPage);
          });
        rt.setDefaultRoute((cbk)=>{
            this.handleRoute(cbk,TrackerPage);
          });
        return rt;
      }
      handleLocationChanged(){
        this.attrs.router.handleLocationChanged(window.location.pathname);
      }
      handleRoute(fn,page){
        if(this.attrs.page_cache[page]===undefined){
          this.attrs.page_cache[page]=new page();
        }
        fn(this.attrs.page_cache[page]);
      }
    }
    return{App};
  })(api,components,daedalus,resources,router);