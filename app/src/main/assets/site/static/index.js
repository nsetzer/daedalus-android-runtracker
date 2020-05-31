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
          };
          if(p2<0){
            p2=0;
          };
          if(p1>arr.length){
            p1=arr.length;
          };
          if(p2>arr.length){
            p2=arr.length;
          };
          if(p1==p2){
            return;
          };
          arr.splice(p2,0,arr.splice(p1,1)[0]);
          return;
        };
        function randomFloat(min,max){
          return Math.random()*(max-min)+min;
        };
        function randomInt(min,max){
          min=Math.ceil(min);
          max=Math.floor(max);
          return Math.floor(Math.random()*(max-min+1))+min;
        };
        function object2style_helper(prefix,obj){
          const items=Object.keys(obj).map(key=>{
              const type=typeof(obj[key]);
              if(type==="object"){
                return object2style_helper(prefix+key+"-",obj[key]);
              }else{
                return[prefix+key+": "+obj[key]];
              };
            });
          return[].concat.apply([],items);
        };
        function object2style(obj){
          const arr=object2style_helper("",obj);
          return[].concat.apply([],arr).join(';');
        };
        function serializeParameters(obj){
          if(Object.keys(obj).length==0){
            return"";
          };
          const strings=Object.keys(obj).reduce(function(a,k){
              if(obj[k]===null||obj[k]===undefined){

              }else if(Array.isArray(obj[k])){
                for(let i=0;i<obj[k].length;i++){
                  a.push(encodeURIComponent(k)+'='+encodeURIComponent(obj[k][i]));
                  
                };
              }else{
                a.push(encodeURIComponent(k)+'='+encodeURIComponent(obj[k]));
              };
              return a;
            },[]);
          return'?'+strings.join('&');
        };
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
            };
          };
          return urlParams;
        };
        function isFunction(x){
          return(x instanceof Function);
        };
        function joinpath(...parts){
          let str="";
          for(let i=0;i<parts.length;i++){
            if(!str.endsWith("/")&&!parts[i].startsWith("/")){
              str+="/";
            };
            str+=parts[i];
          };
          return str;
        };
        function splitpath(path){
          const parts=path.split('/');
          if(parts.length>0&&parts[parts.length-1].length===0){
            parts.pop();
          };
          return parts;
        };
        function dirname(path){
          const parts=path.split('/');
          while(parts.length>0&&parts[parts.length-1].length===0){
            parts.pop();
          };
          return joinpath(...parts.slice(0,-1));
        };
        function splitext(name){
          const index=name.lastIndexOf('.');
          if(index<=0||name[index-1]=='/'){
            return[name,''];
          }else{
            return[name.slice(0,index),name.slice(index)];
          };
        };
        let css_sheet=null;
        let selector_names={};
        function generateStyleSheetName(){
          const chars='abcdefghijklmnopqrstuvwxyz';
          let name;
          do{
            name="css-";
            for(let i=0;i<6;i++){
              let c=chars[randomInt(0,chars.length-1)];
              name+=c;
            };
          }while(selector_names[name]!==undefined);
          return name;
        };
        function shuffle(array){
          let currentIndex=array.length,temporaryValue,randomIndex;
          while(0!==currentIndex){
            randomIndex=Math.floor(Math.random()*currentIndex);
            currentIndex-=1;
            temporaryValue=array[currentIndex];
            array[currentIndex]=array[randomIndex];
            array[randomIndex]=temporaryValue;
          };
          return array;
        };
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
          };
          if(css_sheet===null){
            css_sheet=document.createElement('style');
            css_sheet.type='text/css';
            document.head.appendChild(css_sheet);
          };
          const text=object2style(style);
          selector_names[name]=style;
          if(!(css_sheet.sheet||{}).insertRule){
            (css_sheet.styleSheet||css_sheet.sheet).addRule(selector,text);
          }else{
            css_sheet.sheet.insertRule(selector+"{"+text+"}",css_sheet.sheet.rules.length);
            
          };
          return name;
        };
        function getStyleSheet(name){
          return selector_names[name];
        };
        const util={array_move,randomInt,randomFloat,object2style,serializeParameters,
                  parseParameters,isFunction,joinpath,splitpath,dirname,splitext,shuffle};
        
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
          };
          return signal;
        };
        let element_uid=0;
        function generateElementId(){
          const chars='abcdefghijklmnopqrstuvwxyz';
          let name;
          name="-";
          for(let i=0;i<6;i++){
            let c=chars[util.randomInt(0,chars.length-1)];
            name+=c;
          };
          return name+"-"+(element_uid++);
        };
        class DomElement{
          constructor(type,props,children){
            if(type===undefined){
              throw`DomElement type is undefined. super called with ${arguments.length} arguments`;
              
            };
            this.type=type;
            if(props===undefined){
              this.props={};
            }else{
              this.props=props;
            };
            if(this.props.id===undefined){
              this.props.id=this.constructor.name+generateElementId();
            };
            if(children===undefined){
              this.children=[];
            }else{
              this.children=children;
            };
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
          };
          _update(element){

          };
          update(){
            this._update(this);
          };
          updateState(state,doUpdate){
            const newState={...this.state,...state};
            if(doUpdate!==false){
              if((doUpdate===true)||(this.elementUpdateState===undefined)||(this.elementUpdateState(
                                      this.state,newState)!==false)){
                this.update();
              };
            };
            this.state=newState;
          };
          updateProps(props,doUpdate){
            const newProps={...this.props,...props};
            if(doUpdate!==false){
              if((doUpdate===true)||(this.elementUpdateProps===undefined)||(this.elementUpdateProps(
                                      this.props,newProps)!==false)){
                this.update();
              };
            };
            this.props=newProps;
          };
          appendChild(childElement){
            if(!childElement||!childElement.type){
              throw"invalid child";
            };
            if(typeof this.children==="string"){
              this.children=[this.children];
            }else if(typeof this.children==="undefined"){
              this.children=[];
            };
            this.children.push(childElement);
            this.update();
            return childElement;
          };
          insertChild(index,childElement){
            if(!childElement||!childElement.type){
              throw"invalid child";
            };
            if(index<0){
              index+=this.children.length+1;
            };
            if(index<0||index>this.children.length){
              console.error("invalid index: "+index);
              return;
            };
            if(typeof this.children==="string"){
              this.children=[this.children];
            }else if(typeof this.children==="undefined"){
              this.children=[];
            };
            this.children.splice(index,0,childElement);
            this.update();
            return childElement;
          };
          removeChild(childElement){
            if(!childElement||!childElement.type){
              throw"invalid child";
            };
            const index=this.children.indexOf(childElement);
            if(index>=0){
              this.children.splice(index,1);
              this.update();
            }else{
              console.error("child not in list");
            };
          };
          removeChildren(){
            this.children.splice(0,this.children.length);
            this.update();
          };
          replaceChild(childElement,newChildElement){
            const index=this.children.indexOf(childElement);
            if(index>=0){
              this.children[index]=newChildElement;
              this.update();
            };
          };
          addClassName(cls){
            let props;
            if(!this.props.className){
              props={className:cls};
            }else if(Array.isArray(this.props.className)){
              props={className:[cls,...this.props.className]};
            }else{
              props={className:[cls,this.props.className]};
            };
            this.updateProps(props);
          };
          removeClassName(cls){
            let props;
            if(Array.isArray(this.props.className)){
              props={className:this.props.className.filter(x=>x!==cls)};
              if(props.className.length===this.props.className.length){
                return;
              };
              this.updateProps(props);
            }else if(this.props.className===cls){
              props={className:null};
              this.updateProps(props);
            };
          };
          hasClassName(cls){
            let props;
            if(Array.isArray(this.props.className)){
              return this.props.className.filter(x=>x===cls).length===1;
            };
            return this.props.className===cls;
          };
          connect(signal,callback){
            console.log("signal connect:"+signal._event_name,callback);
            const ref={element:this,signal:signal,callback:callback};
            signal._slots.push(ref);
            this.slots.push(ref);
          };
          disconnect(signal){
            console.log("signal disconnect:"+signal._event_name);
          };
          getDomNode(){
            return this._fiber&&this._fiber.dom;
          };
          isMounted(){
            return this._fiber!==null;
          };
        };
        class TextElement extends DomElement {
          constructor(text,props={}){
            super("TEXT_ELEMENT",{'nodeValue':text,...props},[]);
          };
          setText(text){
            this.props={'nodeValue':text};
            this.update();
          };
          getText(){
            return this.props.nodeValue;
          };
        };
        class LinkElement extends DomElement {
          constructor(text,url){
            super("div",{className:LinkElement.style.link,title:url},[new TextElement(
                                  text)]);
            this.state={url};
          };
          onClick(){
            if(this.state.url.startsWith('http')){
              window.open(this.state.url,'_blank');
            }else{
              history.pushState({},"",this.state.url);
            };
          };
        };
        LinkElement.style={link:'dcs-8415668d-0'};
        class ListElement extends DomElement {
          constructor(){
            super("ul",{},[]);
          };
        };
        class ListItemElement extends DomElement {
          constructor(item){
            super("li",{},[item]);
          };
        };
        class HeaderElement extends DomElement {
          constructor(text=""){
            super("h1",{},[]);
            this.node=this.appendChild(new TextElement(text));
          };
          setText(text){
            this.node.setText(text);
          };
        };
        class ButtonElement extends DomElement {
          constructor(text,onClick){
            super("button",{'onClick':onClick},[new TextElement(text)]);
            console.log(this.type);
          };
          setText(text){
            this.children[0].setText(text);
          };
          getText(){
            return this.children[0].props.nodeValue;
          };
        };
        class TextInputElement extends DomElement {
          constructor(text,_,submit_callback){
            super("input",{value:text},[]);
            this.textChanged=Signal(this,'textChanged');
            this.attrs={submit_callback};
          };
          setText(text){
            this.updateProps({value:text});
            this.textChanged.emit(this.props);
          };
          onChange(event){
            this.updateProps({value:event.target.value},false);
            this.textChanged.emit(this.props);
          };
          onPaste(event){
            this.updateProps({value:event.target.value},false);
            this.textChanged.emit(this.props);
          };
          onKeyUp(event){
            this.updateProps({value:event.target.value},false);
            this.textChanged.emit(this.props);
            if(event.key=="Enter"){
              if(this.attrs.submit_callback){
                this.attrs.submit_callback(this.props.value);
              };
            };
          };
        };
        class NumberInputElement extends DomElement {
          constructor(value){
            super("input",{value:value,type:"number"},[]);
            this.valueChanged=Signal(this,'valueChanged');
          };
          onChange(event){
            this.updateProps({value:parseInt(event.target.value,10)},false);
            this.valueChanged.emit(this.props);
          };
          onPaste(event){
            this.updateProps({value:parseInt(event.target.value,10)},false);
            this.valueChanged.emit(this.props);
          };
          onKeyUp(event){
            this.updateProps({value:parseInt(event.target.value,10)},false);
            this.valueChanged.emit(this.props);
          };
          onInput(event){
            this.updateProps({value:parseInt(event.target.value,10)},false);
            this.valueChanged.emit(this.props);
          };
        };
        function swap(nodeA,nodeB){
          if(!nodeA||!nodeB){
            return;
          };
          const parentA=nodeA.parentNode;
          const siblingA=nodeA.nextSibling===nodeB?nodeA:nodeA.nextSibling;
          nodeB.parentNode.insertBefore(nodeA,nodeB);
          parentA.insertBefore(nodeB,siblingA);
        };
        function isAbove(nodeA,nodeB){
          if(!nodeA||!nodeB){
            return false;
          };
          const rectA=nodeA.getBoundingClientRect();
          const rectB=nodeB.getBoundingClientRect();
          return(rectA.top+rectA.height/2<rectB.top+rectB.height/2);
        };
        function childIndex(node){
          let count=0;
          while((node=node.previousSibling)!=null){
            count++;
          };
          return count;
        };
        const placeholder='dcs-8415668d-1';
        class DraggableListItem extends DomElement {
          constructor(){
            super("div",{},[]);
          };
          onTouchStart(event){
            this.attrs.parent.handleChildDragBegin(this,event);
          };
          onTouchMove(event){
            this.attrs.parent.handleChildDragMove(this,event);
          };
          onTouchEnd(event){
            this.attrs.parent.handleChildDragEnd(this,{target:this.getDomNode()});
            
          };
          onTouchCancel(event){
            this.attrs.parent.handleChildDragEnd(this,{target:this.getDomNode()});
            
          };
          onMouseDown(event){
            this.attrs.parent.handleChildDragBegin(this,event);
          };
          onMouseMove(event){
            this.attrs.parent.handleChildDragMove(this,event);
          };
          onMouseLeave(event){
            this.attrs.parent.handleChildDragEnd(this,event);
          };
          onMouseUp(event){
            this.attrs.parent.handleChildDragEnd(this,event);
          };
        };
        class DraggableList extends DomElement {
          constructor(){
            super("div",{},[]);
            this.attrs={x:null,y:null,placeholder:null,placeholderClassName:placeholder,
                          draggingEle:null,isDraggingStarted:false,indexStart:-1,lockX:true};
            
          };
          setPlaceholderClassName(className){
            this.attrs.placeholderClassName=className;
          };
          handleChildDragBegin(child,event){
            event.preventDefault();
            if(!!this.attrs.draggingEle){
              this.handleChildDragCancel();
              return;
            };
            let evt=(((event)||{}).touches||((((event)||{}).originalEvent)||{}).touches);
            
            if(evt){
              event=evt[0];
            };
            this.attrs.draggingEle=child.getDomNode();
            this.attrs.indexStart=childIndex(this.attrs.draggingEle);
            const rect=this.attrs.draggingEle.getBoundingClientRect();
            this.attrs.x=event.clientX-rect.left;
            this.attrs.y=event.pageY-rect.top;
          };
          handleChildDragMove(child,event){
            if(!this.attrs.draggingEle||this.attrs.draggingEle!==child.getDomNode(
                            )){
              return;
            };
            event.preventDefault();
            let evt=(((event)||{}).touches||((((event)||{}).originalEvent)||{}).touches);
            
            if(evt){
              event=evt[0];
            };
            const draggingRect=this.attrs.draggingEle.getBoundingClientRect();
            if(!this.attrs.isDraggingStarted){
              this.attrs.isDraggingStarted=true;
              this.attrs.placeholder=document.createElement('div');
              this.attrs.placeholder.classList.add(this.attrs.placeholderClassName);
              
              this.attrs.draggingEle.parentNode.insertBefore(this.attrs.placeholder,
                              this.attrs.draggingEle.nextSibling);
              this.attrs.placeholder.style.height=`${draggingRect.height}px`;
            };
            this.attrs.draggingEle.style.position='absolute';
            let ypos=event.pageY-this.attrs.y+window.scrollY;
            this.attrs.draggingEle.style.top=`${ypos}px`;
            if(!this.attrs.lockX){
              this.attrs.draggingEle.style.left=`${event.pageX-this.attrs.x}px`;
            };
            const prevEle=this.attrs.draggingEle.previousElementSibling;
            const nextEle=this.attrs.placeholder.nextElementSibling;
            if(prevEle&&isAbove(this.attrs.draggingEle,prevEle)){
              swap(this.attrs.placeholder,this.attrs.draggingEle);
              swap(this.attrs.placeholder,prevEle);
              return;
            };
            if(nextEle&&isAbove(nextEle,this.attrs.draggingEle)){
              swap(nextEle,this.attrs.placeholder);
              swap(nextEle,this.attrs.draggingEle);
            };
          };
          handleChildDragEnd(child,event){
            if(!this.attrs.draggingEle||this.attrs.draggingEle!==child.getDomNode(
                            )){
              return;
            };
            this.handleChildDragCancel();
          };
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
          };
          updateModel(indexStart,indexEnd){
            this.children.splice(indexEnd,0,this.children.splice(indexStart,1)[0]);
            
          };
        };
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
          };
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
          for(let i=1;i<arr.length;i++){
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
              };
            }else{
              tokens.push({param:false,value:part});
            };
          };
          return(items,query_items)=>{
            let location='';
            for(let i=0;i<tokens.length;i++){
              location+='/';
              if(tokens[i].param){
                location+=items[tokens[i].name];
              }else{
                location+=tokens[i].value;
              };
            };
            if(!!query_items){
              location+=util.serializeParameters(query_items);
            };
            return location;
          };
        };
        function patternToRegexp(pattern,exact=true){
          const arr=pattern.split('/');
          let re="^";
          let tokens=[];
          for(let i=exact?1:0;i<arr.length;i++){
            let part=arr[i];
            if(i==0&&exact===false){

            }else{
              re+="\\/";
            };
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
              };
            }else{
              re+=part;
            };
          };
          if(re!=="^\\/"){
            re+="\\/?";
          };
          re+="$";
          return{re:new RegExp(re,"i"),text:re,tokens};
        };
        function locationMatch(obj,location){
          obj.re.lastIndex=0;
          let arr=location.match(obj.re);
          if(arr==null){
            return null;
          };
          let result={};
          for(let i=1;i<arr.length;i++){
            result[obj.tokens[i-1]]=arr[i];
          };
          return result;
        };
        function patternMatch(pattern,location){
          return locationMatch(patternToRegexp(pattern),location);
        };
        class Router{
          constructor(container,default_callback){
            if(!container){
              throw'invalid container';
            };
            this.container=container;
            this.default_callback=default_callback;
            this.routes=[];
            this.current_index=-1;
            this.current_location=null;
          };
          handleLocationChanged(location){
            let index=0;
            while(index<this.routes.length){
              const item=this.routes[index];
              const match=locationMatch(item.re,location);
              if(match!==null){
                let fn=(element)=>this.setElement(index,location,match,element);
                if(this.doRoute(item,fn,match)){
                  return;
                };
              };
              index+=1;
            };
            let fn=(element)=>this.setElement(-1,location,null,element);
            this.default_callback(fn);
            return;
          };
          doRoute(item,fn,match){
            item.callback(fn,match);
            return true;
          };
          setElement(index,location,match,element){
            if(!!element){
              console.log(element);
              if(index!=this.current_index){
                this.container.children=[element];
                this.container.update();
              };
              if(this.current_location!==location){
                this.setMatch(match);
                element.updateState({match:match});
              };
              this.current_index=index;
            }else{
              this.container.children=[];
              this.current_index=-1;
              this.container.update();
            };
            this.current_location=location;
          };
          addRoute(pattern,callback){
            const re=patternToRegexp(pattern);
            this.routes.push({pattern,callback,re});
          };
          setDefaultRoute(callback){
            this.default_callback=callback;
          };
          setMatch(match){

          };
        };
        class AuthenticatedRouter extends Router {
          constructor(container,route_list,default_callback){
            super(container,route_list,default_callback);
            this.authenticated=false;
          };
          doRoute(item,fn,match){
            let has_auth=this.isAuthenticated();
            if(item.auth===true&&item.noauth===undefined){
              if(!!has_auth){
                item.callback(fn,match);
                return true;
              }else if(item.fallback!==undefined){
                history.pushState({},"",item.fallback);
                return true;
              };
            };
            if(item.auth===undefined&&item.noauth===true){
              console.log(item,has_auth);
              if(!has_auth){
                item.callback(fn,match);
                return true;
              }else if(item.fallback!==undefined){
                history.pushState({},"",item.fallback);
                return true;
              };
            };
            if(item.auth===undefined&&item.noauth===undefined){
              item.callback(fn,match);
              return true;
            };
            return false;
          };
          isAuthenticated(){
            return this.authenticated;
          };
          setAuthenticated(value){
            this.authenticated=!!value;
          };
          addAuthRoute(pattern,callback,fallback){
            const re=patternToRegexp(pattern);
            this.routes.push({pattern,callback,auth:true,fallback,re});
          };
          addNoAuthRoute(pattern,callback,fallback){
            const re=patternToRegexp(pattern);
            this.routes.push({pattern,callback,noauth:true,fallback,re});
          };
        };
        return[AuthenticatedRouter,Router,locationMatch,patternCompile,patternToRegexp];
        
      })();
    const[downloadFile,uploadFile]=(function(){
        function saveBlob(blob,fileName){
          let a=document.createElement('a');
          a.href=window.URL.createObjectURL(blob);
          a.download=fileName;
          a.dispatchEvent(new MouseEvent('click'));
        };
        function downloadFile(url,headers={},params={},success=null,failure=null){
        
          const postData=new FormData();
          const queryString=util.serializeParameters(params);
          const xhr=new XMLHttpRequest();
          xhr.open('GET',url+queryString);
          for(let key in headers){
            xhr.setRequestHeader(key,headers[key]);
          };
          xhr.responseType='blob';
          xhr.onload=function(this_,event_){
            let blob=this_.target.response;
            if(!blob||this_.target.status!=200){
              if(failure!==null){
                failure({status:this_.target.status,blob});
              };
            }else{
              let contentDispo=xhr.getResponseHeader('Content-Disposition');
              console.log(xhr);
              let fileName;
              if(contentDispo!==null){
                fileName=contentDispo.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[
                                1];
              };
              if(!fileName){
                console.error("filename not found in xhr request header 'Content-Disposition'");
                
                let parts;
                parts=xhr.responseURL.split('/');
                parts=parts[parts.length-1].split('?');
                fileName=parts[0]||'resource.bin';
              };
              saveBlob(blob,fileName);
              if(success!==null){
                success({url,fileName,blob});
              };
            };
          };
          xhr.send(postData);
        };
        function _uploadFileImpl(elem,urlbase,headers={},params={},success=null,failure=null,
                  progress=null){
          let queryString=util.serializeParameters(params);
          let arrayLength=elem.files.length;
          for(let i=0;i<arrayLength;i++){
            let file=elem.files[i];
            let bytesTransfered=0;
            let url;
            if(urlbase.endsWith('/')){
              url=urlbase+file.name;
            }else{
              url=urlbase+'/'+file.name;
            };
            url+=queryString;
            let xhr=new XMLHttpRequest();
            xhr.open('POST',url,true);
            for(let key in headers){
              xhr.setRequestHeader(key,headers[key]);
            };
            xhr.upload.onprogress=function(event){
              if(event.lengthComputable){
                if(progress!==null){
                  bytesTransfered=event.loaded;
                  progress({bytesTransfered,fileSize:file.size,fileName:file.name,
                                          finished:false});
                };
              };
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
                  };
                };
              }else if(xhr.status>=400){
                if(failure!==null){
                  let params={fileName:file.name,url,status:xhr.status};
                  failure(params);
                  if(progress!==null){
                    progress({bytesTransfered,fileSize:file.size,fileName:file.name,
                                              finished:true});
                  };
                };
              }else{
                console.log("xhr status changed: "+xhr.status);
              };
            };
            if(progress!==null){
              progress({bytesTransfered,fileSize:file.size,fileName:file.name,finished:false,
                                  first:true});
            };
            let fd=new FormData();
            fd.append('upload',file);
            xhr.send(fd);
          };
        };
        function uploadFile(urlbase,headers={},params={},success=null,failure=null,
                  progress=null){
          let element=document.createElement('input');
          element.type='file';
          element.hidden=true;
          element.onchange=(event)=>{
            _uploadFileImpl(element,urlbase,headers,params,success,failure,progress);
            
          };
          element.dispatchEvent(new MouseEvent('click'));
        };
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
          };
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
          };
        }else if((verOffset=nAgt.indexOf("Firefox"))!=-1){
          browserName="Firefox";
          fullVersion=nAgt.substring(verOffset+8);
        }else if((nameOffset=nAgt.lastIndexOf(' ')+1)<(verOffset=nAgt.lastIndexOf(
                          '/'))){
          browserName=nAgt.substring(nameOffset,verOffset);
          fullVersion=nAgt.substring(verOffset+1);
          if(browserName.toLowerCase()==browserName.toUpperCase()){
            browserName=navigator.appName;
          };
        };
        if((ix=fullVersion.indexOf(";"))!=-1){
          fullVersion=fullVersion.substring(0,ix);
        };
        if((ix=fullVersion.indexOf(" "))!=-1){
          fullVersion=fullVersion.substring(0,ix);
        };
        majorVersion=parseInt(''+fullVersion,10);
        if(isNaN(majorVersion)){
          fullVersion=''+parseFloat(navigator.appVersion);
          majorVersion=parseInt(navigator.appVersion,10);
        };
        let OSName="Unknown OS";
        if(navigator.appVersion.indexOf("Win")!=-1){
          OSName="Windows";
        };
        if(navigator.appVersion.indexOf("Mac")!=-1){
          OSName="MacOS";
        };
        if(navigator.appVersion.indexOf("X11")!=-1){
          OSName="UNIX";
        };
        if(navigator.appVersion.indexOf("Linux")!=-1){
          OSName="Linux";
        };
        function getDefaultFontSize(parentElement){
          parentElement=parentElement||document.body;
          let div=document.createElement('div');
          div.style.width="1000em";
          parentElement.appendChild(div);
          let pixels=div.offsetWidth/1000;
          parentElement.removeChild(div);
          return pixels;
        };
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
          };
        };
        function render_update(element){
          if(!element.dirty&&element._fiber!==null){
            element.dirty=true;
            const fiber={effect:'UPDATE',children:[element],_fibers:[],alternate:null,
                          partial:true};
            updatequeue.push(fiber);
          };
          if(!workLoopActive){
            workLoopActive=true;
            setTimeout(workLoop,0);
          };
        };
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
                };
                if(workstack.length==0&&wipRoot){
                  commitRoot();
                };
                if(workstack.length==0&&updatequeue.length>0&&!wipRoot){
                  wipRoot=updatequeue[0];
                  workstack.push(wipRoot);
                  updatequeue.shift();
                };
                shouldYield=deadline.timeRemaining()<1;
              };
            }else{
              while(1){
                while(workstack.length>0){
                  let unit=workstack.pop();
                  performUnitOfWork(unit);
                };
                if(wipRoot){
                  commitRoot();
                };
                if(updatequeue.length>0&&!wipRoot){
                  wipRoot=updatequeue[0];
                  workstack.push(wipRoot);
                  updatequeue.shift();
                }else{
                  break;
                };
              };
            };
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
            };
          }else{
            workLoopActive=false;
          };
        };
        function performUnitOfWork(fiber){
          if(!fiber.dom&&fiber.effect=='CREATE'){
            fiber.dom=createDomNode(fiber);
          };
          reconcileChildren(fiber);
        };
        function reconcileChildren(parentFiber){
          workCounter+=1;
          const oldParentFiber=parentFiber.alternate;
          if(!!oldParentFiber){
            oldParentFiber.children.forEach(child=>{
                child._delete=true;
              });
          };
          let prev=parentFiber;
          while(prev.next){
            prev=prev.next;
          };
          parentFiber.children.forEach((element,index)=>{
              if(!element||!element.type){
                console.error(`${parentFiber.element.props.id}: undefined child element at index ${index} `);
                
                return;
              };
              const oldFiber=element._fiber;
              element._delete=false;
              const oldIndex=oldFiber?oldFiber.index:index;
              if(parentFiber.partial){
                index=oldIndex;
              };
              let effect;
              if(!!oldFiber){
                if(oldIndex==index&&element.dirty===false){
                  return;
                }else{
                  effect='UPDATE';
                };
              }else{
                effect='CREATE';
              };
              element.dirty=false;
              const newFiber={type:element.type,effect:effect,props:{...element.props},
                              children:element.children.slice(),_fibers:[],parent:(parentFiber.partial&&oldFiber)?oldFiber.parent:parentFiber,
                              alternate:oldFiber,dom:oldFiber?oldFiber.dom:null,signals:element.signals,
                              element:element,index:index,oldIndex:oldIndex};
              if(!newFiber.parent.dom){
                console.error(`element parent is not mounted id: ${element.props.id} effect: ${effect}`);
                
                return;
              };
              if(newFiber.props.style){
                console.warn("unsafe use of inline style: ",newFiber.type,element.props.id,
                                  newFiber.props.style);
              };
              if(typeof(newFiber.props.style)==='object'){
                newFiber.props.style=util.object2style(newFiber.props.style);
              };
              if(Array.isArray(newFiber.props.className)){
                newFiber.props.className=newFiber.props.className.join(' ');
              };
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
                };
              });
          };
        };
        function commitRoot(){
          deletions_removed=new Set();
          deletions.forEach(removeDomNode);
          if(deletions_removed.size>0){
            deletions_removed.forEach(elem=>{
                requestIdleCallback(elem.elementUnmounted.bind(elem));
              });
          };
          let unit=wipRoot.next;
          let next;
          while(unit){
            commitWork(unit);
            next=unit.next;
            unit.next=null;
            unit=next;
          };
          currentRoot=wipRoot;
          wipRoot=null;
          deletions=[];
        };
        function commitWork(fiber){
          const parentDom=fiber.parent.dom;
          if(!parentDom){
            console.warn(`element has no parent. effect: ${fiber.effect}`);
            return;
          };
          if(fiber.effect==='CREATE'){
            const length=parentDom.children.length;
            const position=fiber.index;
            if(length==position){
              parentDom.appendChild(fiber.dom);
            }else{
              parentDom.insertBefore(fiber.dom,parentDom.children[position]);
            };
            if(fiber.element.elementMounted){
              requestIdleCallback(fiber.element.elementMounted.bind(fiber.element));
              
            };
          }else if(fiber.effect==='UPDATE'){
            fiber.alternate.alternate=null;
            updateDomNode(fiber);
          }else if(fiber.effect==='DELETE'){
            fiber.alternate.alternate=null;
            removeDomNode(fiber);
          };
        };
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
        };
        function updateDomNode(fiber){
          const dom=fiber.dom;
          const parentDom=fiber.parent.dom;
          const oldProps=fiber.alternate.props;
          const newProps=fiber.props;
          if(!dom){
            console.log("fiber does not contain a dom");
            return;
          };
          if(fiber.oldIndex!=fiber.index&&parentDom){
            if(parentDom.children[fiber.index]!==dom){
              parentDom.removeChild(fiber.dom);
              parentDom.insertBefore(fiber.dom,parentDom.children[fiber.index]);
            };
          };
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
        };
        function _removeDomNode_elementFixUp(element){
          if(element.elementUnmounted){
            deletions_removed.add(element);
          };
          element.children.forEach(child=>{
              child._fiber=null;
              _removeDomNode_elementFixUp(child);
            });
        };
        function removeDomNode(fiber){
          if(fiber.dom){
            if(fiber.dom.parentNode){
              fiber.dom.parentNode.removeChild(fiber.dom);
            };
          }else{
            console.error("failed to delete",fiber.element.type);
          };
          fiber.dom=null;
          fiber.element._fiber=null;
          fiber.alternate=null;
          _removeDomNode_elementFixUp(fiber.element);
        };
        return[render,render_update];
      })();
    return{AuthenticatedRouter,ButtonElement,DomElement,DraggableList,HeaderElement,
          LinkElement,ListElement,ListItemElement,NumberInputElement,OSName,Router,Signal,
          StyleSheet,TextElement,TextInputElement,build_platform,downloadFile,env,getStyleSheet,
          locationMatch,parseParameters,patternCompile,patternToRegexp,platform,render,
          render_update,uploadFile,util};
  })();
resources=(function(daedalus){
    "use strict";
    const platform_prefix=daedalus.platform.isAndroid?"file:///android_asset/site/static/icon/":"/static/icon/";
    
    const svg_icon_names=["button_play","button_pause","button_stop"];
    const svg={};
    svg_icon_names.forEach(name=>{
        svg[name]=platform_prefix+name+".svg";
      });
    return{svg};
  })(daedalus);
app=(function(daedalus,resources){
    "use strict";
    const DomElement=daedalus.DomElement;
    const svg=resources.svg;
    const meters_per_mile=1609.34;
    const spm_to_mpk=1000.0/60.0;
    const spm_to_mpm=meters_per_mile/60.0;
    const style={body:'dcs-2e988578-0',app:'dcs-2e988578-1',appButtons:'dcs-2e988578-2',
          svgButton:'dcs-2e988578-3',hide:'dcs-2e988578-4',titleText:'dcs-2e988578-5',
          smallText:'dcs-2e988578-6',mediumText:'dcs-2e988578-7',largeText:'dcs-2e988578-8',
          flex_center:'dcs-2e988578-9',flex_spread:'dcs-2e988578-10'};
    function pad(n,width,z){
      z=z||'0';
      n=n+'';
      return n.length>=width?n:new Array(width-n.length+1).join(z)+n;
    };
    function fmtTime(t){
      let s=t/1000;
      let m=Math.floor(s/60);
      s=pad(Math.floor(s%60),2);
      let h=Math.floor(s/60);
      m=pad(m,2);
      return`${h}:${m}:${s}`;
    };
    class HSpacer extends DomElement {
      constructor(width){
        super("div",{},[]);
        this.attrs={width};
      };
      elementMounted(){
        this._setWidth();
      };
      setWidth(width){
        this.attrs.width=width;
        this._setWidth();
      };
      _setWidth(){
        const node=this.getDomNode();
        if(!!node){
          node.style['max-width']=this.attrs.width;
          node.style['min-width']=this.attrs.width;
          node.style['width']=this.attrs.width;
          node.style['max-height']="1px";
          node.style['min-height']="1px";
          node.style['height']="1px";
        };
      };
    };
    class Text extends daedalus.DomElement {
      constructor(text,cls){
        super("div",{className:cls},[]);
        this.attrs.txt=this.appendChild(new daedalus.TextElement(text));
      };
      setText(text){
        this.attrs.txt.setText(text);
      };
    };
    class SvgElement extends DomElement {
      constructor(url,props){
        super("img",{src:url,...props},[]);
      };
      onLoad(event){
        console.warn("success loading: ",this.props.src);
      };
      onError(error){
        console.warn("error loading: ",this.props.src,JSON.stringify(error));
      };
    };
    class SvgButtonElement extends SvgElement {
      constructor(url,callback){
        super(url,{width:96,height:96,className:style.svgButton});
        this.attrs={callback};
      };
      onClick(event){
        if(this.attrs.callback){
          this.attrs.callback();
        };
      };
      setUrl(url){
        this.props.src=url;
        this.update();
      };
    };
    class App extends daedalus.DomElement {
      constructor(){
        super("div",{className:style.app},[]);
        const body=document.getElementsByTagName("BODY")[0];
        body.className=style.body;
        this.attrs.txt_samples=this.appendChild(new Text("0/0",style.titleText));
        
        this.appendChild(new Text("distance:",style.titleText));
        this.attrs.txt_dist1=this.appendChild(new Text("0",style.largeText));
        this.attrs.txt_dist2=this.appendChild(new Text("0",style.mediumText));
        this.appendChild(new Text("time:",style.titleText));
        this.attrs.txt_time=this.appendChild(new Text("00:00",style.largeText));
        this.appendChild(new Text("current pace: (min./km)",style.titleText));
        this.attrs.txt_pace_cur=this.appendChild(new Text("0",style.mediumText));
        
        this.appendChild(new Text("average pace: (min./km)",style.titleText));
        this.attrs.txt_pace_avg=this.appendChild(new Text("0",style.smallText));
        this.attrs.dashboard=this.appendChild(new DomElement("div",{className:style.appButtons}));
        
        let row=this.attrs.dashboard;
        this.attrs.btn_stop=row.appendChild(new SvgButtonElement(svg.button_stop,
                      ()=>{
              if(daedalus.platform.isAndroid&&!!Client){
                Client.enableTracking(false);
              }else{
                this.handleTrackingChanged({state:"stopped"});
              };
              if(this.attrs.timer!=null){
                console.log("clear timer");
                clearInterval(this.attrs.timer);
                this.attrs.timer=null;
              };
            }));
        this.attrs.btn_play=row.appendChild(new SvgButtonElement(svg.button_play,
                      ()=>{
              if(daedalus.platform.isAndroid&&!!Client){
                Client.enableTracking(true);
              }else{
                this.handleTrackingChanged({state:"running"});
              };
            }));
        this.attrs.btn_pause=row.appendChild(new SvgButtonElement(svg.button_pause,
                      ()=>{
              if(daedalus.platform.isAndroid&&!!Client){
                Client.pauseTracking();
              }else{
                console.error("backend not enabled");
                this.handleTrackingChanged({state:"paused"});
              };
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
          const payload={uid:3,lat:42,lon:-71,distance:5000,samples:1234,dropped_samples:123,
                      accurate:true,elapsed_time_ms:123456,current_pace_spm:.45,average_pace_spm:.3};
          
          this.handleLocationUpdate(payload);
        };
      };
      elementMounted(){
        registerAndroidEvent('onlocationupdate',this.handleLocationUpdate.bind(this));
        
        registerAndroidEvent('ontrackingchanged',this.handleTrackingChanged.bind(
                      this));
      };
      elementUnmounted(){
        if(this.attrs.timer!=null){
          clearInterval(this.attrs.timer);
          this.attrs.timer=null;
        };
      };
      handleLocationUpdate(payload){
        if(payload.uid!=3){
          return;
        };
        this.attrs.distances1=(payload.distance/1000).toFixed(3);
        this.attrs.distances2=(payload.distance*0.000621371).toFixed(2);
        this.attrs.txt_dist1.setText(""+this.attrs.distances1+"k");
        this.attrs.txt_dist2.setText(""+this.attrs.distances2+"m");
        this.attrs.txt_samples.setText(payload.samples+"/"+payload.dropped_samples+":"+payload.accurate);
        
        let pace;
        pace=payload.current_pace_spm*1000/60;
        this.attrs.txt_pace_cur.setText(""+pace.toFixed(2));
        pace=payload.average_pace_spm*1000/60;
        this.attrs.txt_pace_avg.setText(""+pace.toFixed(2));
        this.attrs.elapsed_time_ms=payload.elapsed_time_ms;
        this.attrs.time_delta=0;
        this.updateDisplayTime();
        if(this.attrs.timer!=null){
          clearInterval(this.attrs.timer);
          this.attrs.timer=null;
        };
        this.attrs.timer=setInterval(this.handleTimeout.bind(this),500);
      };
      handleTrackingChanged(payload){
        this.attrs.btn_stop.removeClassName(style.hide);
        this.attrs.btn_play.removeClassName(style.hide);
        this.attrs.btn_pause.removeClassName(style.hide);
        this.attrs.dashboard.removeClassName(style.flex_center);
        this.attrs.dashboard.removeClassName(style.flex_spread);
        this.attrs.current_state=payload.state;
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
          };
        }else if(payload.state==="stopped"){
          this.attrs.dashboard.addClassName(style.flex_center);
          this.attrs.btn_stop.addClassName(style.hide);
          this.attrs.btn_pause.addClassName(style.hide);
        };
      };
      handleTimeout(){
        this.attrs.time_delta+=500;
        this.updateDisplayTime();
      };
      updateDisplayTime(){
        if(this.attrs.current_state=="paused"){
          return;
        };
        let t=fmtTime(this.attrs.elapsed_time_ms+this.attrs.time_delta);
        this.attrs.txt_time.setText(t);
      };
    };
    return{App};
  })(daedalus,resources);