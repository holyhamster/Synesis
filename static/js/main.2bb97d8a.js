(()=>{"use strict";var e={8947:(e,t,r)=>{r.r(t),r.d(t,{default:()=>Kt});var n=r(9526),o=r(3535),a=r(4445),i=r(4152),u=r(885),l=r(3292),s=r(5640),c=r(4333),f=r(1133),d=r(6032),h=r(5588),p=r(4942),v=r(7132),y=r(8576),g=r(9233),m=r(9980),w=r(4637),b=r(8521),j=r(4755),x=r(9316),O=r(6625),S=r(8223),C=r(7557);function P(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function k(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?P(Object(r),!0).forEach((function(t){(0,p.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):P(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var E=function(){var e=function(e,t,r){return(1-e)*t+e*r};return e._closure={},e.asString="function lerpWorklet(progress,start,end){return(1-progress)*start+progress*end;}",e.__workletHash=6785042939311,e.__location="C:\\Users\\holyh\\source\\repos\\ReactTest\\wordApp\\src\\screens\\synonyms\\colorChart\\animatedRectangle.tsx (65:0)",e}();const W=function(e){var t=e.animationProgress,r=e.transition,o=e.style,a=e.dataKey,i=e.registerTransitionUpdates,u=(0,j.useSharedValue)(r);(0,n.useEffect)((function(){null==i||i(a,(function(e){return u.value=e}))}),[a,i]);var l=(0,n.useMemo)((function(){return k({position:"absolute"},o)}),[o]),s=(0,O.useAnimatedStyle)(function(){var e=function(){var e=u.value,r=e.start,n=e.end,o=t.value;return k(k({},l),{},{left:E(o,r.left,n.left),bottom:E(o,r.bottom,n.bottom),width:E(o,r.width,n.width),height:E(o,r.height,n.height),backgroundColor:n.color})};return e._closure={transitionRef:u,animationProgress:t,staticStyle:l,lerpWorklet:E},e.asString="function _f(){const{transitionRef,animationProgress,staticStyle,lerpWorklet}=jsThis._closure;{const{start:start,end:end}=transitionRef.value;const{value:value}=animationProgress;return{...staticStyle,left:lerpWorklet(value,start.left,end.left),bottom:lerpWorklet(value,start.bottom,end.bottom),width:lerpWorklet(value,start.width,end.width),height:lerpWorklet(value,start.height,end.height),backgroundColor:end.color};}}",e.__workletHash=8683403149442,e.__location="C:\\Users\\holyh\\source\\repos\\ReactTest\\wordApp\\src\\screens\\synonyms\\colorChart\\animatedRectangle.tsx (48:21)",e.__optimalization=2,e}(),[t]);return(0,C.jsx)(S.default,{style:s})};var A=r(5671),M=r(3144),D=function(){function e(t,r,n,o,a){(0,A.default)(this,e),this.left=t,this.bottom=r,this.width=n,this.height=o,this.color=a}return(0,M.default)(e,null,[{key:"Zero",value:function(){return{left:0,bottom:0,width:0,height:0,color:"white"}}}]),e}();function T(e,t,r){return(1-e)*t+e*r}function I(e,t,r,n){var o=e[t-1],a=o?o.left+o.width:0;e.splice(t,0,{left:a,width:0,height:r,bottom:0,color:n})}function z(e){var t=new Map,r=new Map;return e.forEach((function(e){var n,o=e.end.color,a=1+(null!=(n=r.get(o))?n:0);r.set(o,a),t.set(o+a,e)})),t}var N=c.default.create({view:{flexDirection:"row",position:"absolute",width:"100%",height:"100%"}}),R=1e3;const F=function(e){var t=e.colorNormal,r=e.animationLength,o=e.size,a=e.style,i=function(e){var t,r,o=n.useState([]),a=(0,u.default)(o,2),i=a[0],l=a[1],s=n.useState(e(i)),c=(0,u.default)(s,2),f=c[0],d=c[1],h=n.useRef(new Map),p=n.useCallback((function(e,t){h.current.set(e,t)}),[]);return t=h.current,r=f,t.forEach((function(e,n){r.has(n)||t.delete(n)})),{array:i,setArray:n.useCallback((function(t){l((function(r){var n="function"==typeof t?t(r):t,o=e(n);return o.forEach((function(e,t){var r;return null==(r=h.current.get(t))?void 0:r(e)})),d(o),n}))}),[l,d,e]),registerCallback:p,keys:f}}(z),l=i.registerCallback,s=i.keys,c=i.setArray,d=i.array,h=(0,j.useSharedValue)(1),p=(0,n.useCallback)((function(){var e=isNaN(r)?R:r;h.value=0,h.value=(0,x.withTiming)(1,{duration:e})}),[r]);return(0,n.useEffect)((function(){if(null!=t&&t.IsValid){var e=function(e,t){var r,n;e=Array.from(e),t=Array.from(t);for(var o=e.length,a=t.length,i=(null==(r=e[0])?void 0:r.height)||(null==(n=t[0])?void 0:n.height)||0,u=0;u<Math.max(o,a);u+=1){var l,s,c,f,d,h;(null==(l=e[u])?void 0:l.color)!==(null==(s=t[u])?void 0:s.color)&&(o<=u||(null==(c=e[u])?void 0:c.color)==(null==(f=t[u+1])?void 0:f.color)?(I(e,u,i,t[u].color),o+=1):a<=u||(null==(d=t[u])?void 0:d.color)==(null==(h=e[u+1])?void 0:h.color)?(I(t,u,i,e[u].color),a+=1):(I(e,u,i,t[u].color),I(t,u+1,i,e[u+1].color),o+=1,a+=1))}return[e,t]}(d.map((function(e){var t,r,n,o=e.start,a=e.end;return t=h.value,n=a,new D(T(t,(r=o).left,n.left),T(t,r.bottom,n.bottom),T(t,r.width,n.width),T(t,r.height,n.height),n.color)})).filter((function(e){return 0!=e.width})),t.ToGradient().ToRectangle(o)),r=(0,u.default)(e,2),n=r[0],a=r[1],i=n.map((function(e,t){return{start:n[t],end:a[t]}}));c((function(e){return e.length&&p(),i}))}}),[t,o,c]),(0,C.jsx)(f.default,{style:[N.view,a],children:Array.from(s.keys()).map((function(e){return(0,C.jsx)(W,{transition:s.get(e),dataKey:e,animationProgress:h,registerTransitionUpdates:l},e)}))})};function V(e){var t=new Set(B);for(var r of e)t.delete(r);return 0==t.size?B[Math.floor(Math.random()*B.length)]:Array.from(t)[Math.floor(Math.random()*t.size)]}var B=["#B66DFF","#FF2A95","#FFB6DB","#4673FF","#00A6A6","#8CCAFF","#FB6E6E","#FFB488","#24FF24"],_="#7A7B7A",H="#FFFFFF",L="#000000";function G(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function U(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?G(Object(r),!0).forEach((function(t){(0,p.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):G(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var K=(0,n.memo)((function(e){var t=e.colorNormal,r=e.word,o=e.onPress,a=e.style,i=n.useRef(new b.default.Value(0)).current;n.useEffect((function(){b.default.timing(i,{toValue:1,duration:500,useNativeDriver:!0}).start()}),[]);var l=(0,n.useMemo)((function(){var e,r=(null!=a?a:{}).zIndex,n=void 0===r?0:r;return c.default.create({chart:{zIndex:n+1},container:U(U({},a),{},{backgroundColor:null!=(e=null==t?void 0:t.getDominantColor())?e:"white"}),word:{margin:5,marginHorizontal:10,fontSize:20,zIndex:n+2}})}),[a]),s=(0,n.useState)({height:0,width:0}),d=(0,u.default)(s,2),h=d[0],p=d[1];return(0,C.jsx)(b.default.View,{style:{opacity:i},children:(0,C.jsx)(w.default,{android_ripple:{color:H,foreground:!0},onPress:function(){return o(r)},style:function(e){var t=e.pressed;return{opacity:"android"!=v.default.OS&&t?.6:1}},children:(0,C.jsxs)(f.default,{style:l.container,onLayout:0==h.width?function(e){var t=e.nativeEvent;p({height:t.layout.height,width:t.layout.width})}:void 0,children:[0!=h.width&&(0,C.jsx)(F,{colorNormal:t,style:l.chart,size:h}),(0,C.jsx)(g.default,{style:l.word,children:r})]})})})}));const q=K;var J=function(e){return e.ApiKeyEntered="api-key-entered",e.ApiChanged="api-changed",e.LayoutChanged="layout-changed",e.CloudCountChanged="cloud-count-changed",e.HintsReset="hints-reset",e}({}),Z=r(5861),Q=r(5519),X=function(){function e(){(0,A.default)(this,e)}return(0,M.default)(e,null,[{key:"GetString",value:function(){var e=(0,Z.default)((function*(e){return Q.default.getItem(e)}));return function(t){return e.apply(this,arguments)}}()},{key:"SetString",value:function(){var e=(0,Z.default)((function*(e,t){return Q.default.setItem(e,t)}));return function(t,r){return e.apply(this,arguments)}}()}]),e}(),Y=function(e){return e.WasLaunched="WasLaunched",e.DisabledVisualts="DisabledVisuals",e.TileLayout="TileLayout",e.CloudCount="CloudCount",e}({}),$=r(1787);function ee(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function te(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?ee(Object(r),!0).forEach((function(t){(0,p.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ee(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var re=.85,ne=.4,oe=1e3,ae=c.default.create({view:{position:"absolute",width:"100%",height:"100%"},imageBackground:{width:"100%",height:"100%"}});const ie=function(e){var t=e.style,r=e.faded,o=e.source,a=e.fadeFloor,i=e.fadeCeiling,u=e.duration;a=isNaN(a)?ne:a,i=isNaN(i)?re:i,u=isNaN(u)?oe:u;var l=n.useState(new b.default.Value(i))[0];return n.useEffect((function(){b.default.timing(l,{toValue:r?a:i,duration:u,useNativeDriver:!0}).start()}),[r]),(0,C.jsx)(b.default.View,{style:te(te(te({},t),ae.view),{},{opacity:l}),children:(0,C.jsx)($.default,{source:o,resizeMode:"center",style:ae.imageBackground})})};var ue=r(2982),le=r(136),se=r(2963),ce=r(1120),fe=r(8664);function de(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,ce.default)(e);if(t){var o=(0,ce.default)(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return(0,se.default)(this,r)}}var he=function(e){(0,le.default)(r,e);var t=de(r);function r(){return(0,A.default)(this,r),t.call(this)}return(0,M.default)(r,null,[{key:"Copy",value:function(e){return(0,ue.default)(e)}}]),r}((0,fe.default)(Array));var pe=function(){function e(t){(0,A.default)(this,e),this.name=t,this.connections=new Map,this.connectionSum=[]}return(0,M.default)(e,[{key:"addConnection",value:function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;this.nullCache();var n=this.connections.get(e)||[];for(0==n.length&&this.connections.set(e,n),n[t]=(n[t]||0)+r;this.connectionSum.length<=t;)this.connectionSum.push(0);this.connectionSum[t]+=r}},{key:"nullCache",value:function(){this.normalCache=void 0,this.wordMapCache=void 0}},{key:"GetWordNormal",value:function(){return this.normalCache||(this.normalCache=function(e,t){var r=new he,n=function(e){for(var t=[],r=1,n=0,o=e.length-1;o>=0;o--){var a=e[o];if(t[o]=a?r:0,a){var i=r*a;n+=i,r=Math.ceil(1.3*i)}}return t.map((function(e){return n?e/n:0}))}(t);for(var o of e){for(var a=(0,u.default)(o,2),i=a[0],l=a[1],s=0,c=0;c<l.length;c++)s+=n[c]*l[c]||0;r.push({word:i,value:parseFloat(s.toFixed(5))})}return r}(this.connections,this.connectionSum)),he.Copy(this.normalCache)}},{key:"GetWordMap",value:function(){var e=this;return this.wordMapCache||(this.wordMapCache=new Map,this.GetWordNormal().forEach((function(t){var r=t.word,n=t.value;return e.wordMapCache.set(r,n)}))),this.wordMapCache}}],[{key:"GetSorted",value:function(e,t){var r=Array.from(e);return t&&""!=t?(r.sort((function(e,r){return(r.GetWordMap().get(t)||0)-(e.GetWordMap().get(t)||0)})),r):r}}]),e}();var ve=r(2826);function ye(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,ce.default)(e);if(t){var o=(0,ce.default)(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return(0,se.default)(this,r)}}var ge=function(e){(0,le.default)(r,e);var t=ye(r);function r(){(0,A.default)(this,r);for(var e=arguments.length,n=new Array(e),o=0;o<e;o++)n[o]=arguments[o];return t.call.apply(t,[this].concat((0,ue.default)(null!=n?n:[])))}return(0,M.default)(r,[{key:"ToRectangle",value:function(e){return this.map((function(t){return new D(t.start*e.width,0,t.width*e.width,e.height,t.color)}))}}]),r}((0,fe.default)(Array));function me(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,ce.default)(e);if(t){var o=(0,ce.default)(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return(0,se.default)(this,r)}}var we=function(e){(0,le.default)(r,e);var t=me(r);function r(e,n){var o;(0,A.default)(this,r);var a=e.length>0&&n.size>0,i=e.map((function(e){var t=n.get(e.word);return t||(a=!1),{color:t,value:e.value}}));return(o=t.call.apply(t,[this].concat((0,ue.default)(i)))).IsValid=!1,o.IsValid=a,o}return(0,M.default)(r,[{key:"isEqualTo",value:function(e){var t=this.length;if(t!=e.length)return!1;for(var r=0;r<t;r++)if(this[r].color!=e[r].color||this[r].value!=e[r].value)return!1;return!0}},{key:"ToGradient",value:function(){var e=[],t=0;return this.forEach((function(r){e.push({color:r.color,start:t,width:r.value}),t+=r.value})),(0,ve.default)(ge,e)}},{key:"getDominantColor",value:function(){var e=0,t=void 0;return this.forEach((function(r){r.value>e&&(t=r.color,e=r.value)})),t}}]),r}((0,fe.default)(Array));function be(e,t,r,o){var a=n.useMemo((function(){return function(e){var t=e.map((function(e){return e.Word})),r=new Map,n=function(e){var t=r.get(e);return t||(t=new pe(e),r.set(e,t)),t},o=function(e,r,o){for(var a of e)t.includes(a)||n(a).addConnection(r,o)};for(var a of e)for(var i of a.definitionSets)for(var u of i)for(var l of u)if(t.includes(l))for(var s of(o(u,l,1),i))s!==u&&o(s,l,2);else n(l).addConnection(a.Word,0);return r}(e)}),[e]),i=n.useMemo((function(){var e=pe.GetSorted(Array.from(a.values()),r).slice(0,isNaN(o)?1/0:o);return new Map(e.map((function(e,t){return[e.name,{value:e,order:t}]})))}),[a,o,r]),l=n.useRef(),s=n.useState([]),c=(0,u.default)(s,2),f=c[0],d=c[1];n.useEffect((function(){l.current&&clearInterval(l.current),d((function(e){var t=function(e){var t=function(e,t,r){var n=Array.from(t);for(var o of e.entries()){var a=(0,u.default)(o,2),i=(a[0],a[1]),l=i.value,s=i.order;if(!n[s]&&(n[s]=l,0==--r))break}return n}(i,e,xe);return i.size==t.length&&clearInterval(r),t},r=setInterval((function(){r==l.current?d(t):clearInterval(r)}),je);return l.current=r,function(e,t){var r=[];return t.forEach((function(t){var n=e.get(null==t?void 0:t.name)||{},o=n.order,a=n.value;a&&(r[o]=a)})),r}(i,e)}))}),[d,i]);var h=n.useRef(new Map);return{clouds:f,colorNormals:n.useMemo((function(){var e=function(e,t,r){var n=new Map;return e.forEach((function(e){var o=r.get(e.name),a=new we(e.GetWordNormal(),t);a.IsValid&&n.set(e.name,null!=o&&o.isEqualTo(a)?o:a)})),n}(Array.from(a.values()),t,h.current);return h.current=e,e}),[t,a]),displayInfo:{totalCount:a.size,renderedCount:f.length}}}var je=250,xe=20;function Oe(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function Se(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Oe(Object(r),!0).forEach((function(t){(0,p.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Oe(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var Ce=c.default.create({innerView:{flex:1,flexDirection:"row",alignContent:"flex-start",justifyContent:"space-around",flexWrap:"wrap",gap:15,margin:10},synonymScrollContainer:{margin:5,marginBottom:50},tooltip:{position:"absolute",left:5,bottom:5,alignItems:"center",justifyContent:"center",paddingHorizontal:5},tooltipBackground:{width:"100%",height:"100%",borderWidth:2,borderRadius:15,position:"absolute",backgroundColor:H,opacity:.7},tooltipText:{margin:7}}),Pe=(0,C.jsx)(m.Transition.Change,{durationMs:100}),ke=30,Ee=r(7270);const We=function(e){var t,r=e.synonyms,o=e.colorMap,a=e.wordToSortBy,i=e.addNewWord,l=e.style,s=(0,n.useState)(ke),c=(0,u.default)(s,2),d=c[0],p=c[1];(0,n.useEffect)((function(){var e=function(){return X.GetString(Y.CloudCount).then((function(e){var t=parseInt(e);!isNaN(t)&&p(t)}))};e();var t=h.default.addListener(J.CloudCountChanged,e);return function(){return t.remove()}}),[]);var w=be(r,o,a,d),b=w.clouds,j=w.colorNormals,x=w.displayInfo,O=(0,n.useRef)();(0,n.useEffect)((function(){!function(){var e;"android"==v.default.OS&&(null==(e=O.current)||e.animateNextTransition())}()}),[r]);var S=null!=(t=null==l?void 0:l.zIndex)?t:0,P=[];for(var k of b)if(k){var E=k.name,W=j.get(E);P.push((0,C.jsx)(q,{word:E,colorNormal:W,onPress:i,style:{zIndex:S+1}},E))}return(0,C.jsxs)(f.default,{style:{flex:1},children:[(0,C.jsx)(ie,{source:Ee,faded:b.length>0}),(0,C.jsx)(y.default,{keyboardShouldPersistTaps:"handled",style:{zIndex:S},contentContainerStyle:Ce.synonymScrollContainer,children:"android"==v.default.OS?(0,C.jsx)(m.Transitioning.View,{ref:O,style:Ce.innerView,transition:Pe,children:P}):(0,C.jsx)(f.default,{style:Ce.innerView,children:P})}),(0,C.jsxs)(f.default,{style:Ce.tooltip,pointerEvents:"none",children:[(0,C.jsx)(f.default,{style:Se(Se({},Ce.tooltipBackground),{},{zIndex:S+10})}),(0,C.jsx)(g.default,{style:Se(Se({},Ce.tooltipText),{},{zIndex:S+11}),children:"Showing: "+x.renderedCount+"/"+x.totalCount})]})]})};var Ae,Me,De,Te=function(e){return e.Network="Unknown network error",e.WrongAPIkey="Server denies request, check API key",e.NoWord="No word in the database",e.Parsing="Can't parse the response",e}({}),Ie=function(){function e(t,r,n){(0,A.default)(this,e),this.urlGetter=t,this.parse=r,this.normalize=n}return(0,M.default)(e,[{key:"fetchResponse",value:function(e){return fetch(this.urlGetter(e))}},{key:"GetSynonyms",value:function(e){var t=this;return e=this.normalize?this.normalize(e):e,this.fetchResponse(e).then((function(r){return t.parse(e,r)})).catch((function(e){return{type:"error",errorMessage:Te.Network}}))}}]),e}(),ze=function(e){return e.Self="Default",e.Meriam="MeriamWebster",e.Datamuse="Datamuse",e.BigHugeThesarus="BigHugeThesarus",e}({}),Ne=(Ae={},(0,p.default)(Ae,ze.Self,!1),(0,p.default)(Ae,ze.Meriam,!0),(0,p.default)(Ae,ze.BigHugeThesarus,!0),(0,p.default)(Ae,ze.Datamuse,!1),Ae),Re=(Me={},(0,p.default)(Me,ze.Self,""),(0,p.default)(Me,ze.Meriam,"https://dictionaryapi.com/"),(0,p.default)(Me,ze.BigHugeThesarus,"https://words.bighugelabs.com/account/getkey"),(0,p.default)(Me,ze.Datamuse,""),Me),Fe=(De={},(0,p.default)(De,ze.Self,"Default (Datamuse)"),(0,p.default)(De,ze.Meriam,"Merriam-Webster"),(0,p.default)(De,ze.Datamuse,"Datamuse"),(0,p.default)(De,ze.BigHugeThesarus,"BigHugeThesarus"),De);function Ve(){return new Ie((function(e){return"https://api.datamuse.com/words?rel_syn="+e}),Be,(function(e){return e.replace(" ","_")}))}function Be(e,t){return _e.apply(this,arguments)}function _e(){return(_e=(0,Z.default)((function*(e,t){try{var r;if(!t.ok)throw new Error("Something went wrong: "+t.status);var n=yield t.text();if(!n)throw new Error("Empty response");var o=JSON.parse(n);if(0==o.length||void 0==(null==(r=o[0])?void 0:r.word))throw new Error(Te.NoWord);return{type:"success",data:[o.map((function(e){return new Set([e.word])}))]}}catch(a){return{type:"error",errorMessage:a.message}}}))).apply(this,arguments)}function He(e,t){return Le.apply(this,arguments)}function Le(){return Le=(0,Z.default)((function*(e,t){try{if(!t.ok)throw new Error("Something went wrong: "+t.status);var r=yield t.text();if(!r)throw new Error("Empty response");if(r.includes("Invalid API key"))return{type:"error",errorMessage:Te.WrongAPIkey};var n=JSON.parse(r),o=[];if(0==n.length||void 0==n[0].meta)throw new Error(Te.NoWord);return n.filter((function(t){return t.meta.id==e})).forEach((function(e){var t=[];e.meta.syns.forEach((function(e){(null==e?void 0:e.length)>0&&t.push(new Set(e))})),o.push(t)})),{type:"success",data:o}}catch(a){return{type:"error",errorMessage:a.message}}})),Le.apply(this,arguments)}var Ge=r(7216),Ue=function(){function e(){(0,A.default)(this,e)}return(0,M.default)(e,null,[{key:"Set",value:function(e,t){var r=Ke(e);return"web"==v.default.OS?X.SetString(r,t):Ge.setItemAsync(r,t)}},{key:"Get",value:function(){var e=(0,Z.default)((function*(e){var t=Ke(e);return"web"==v.default.OS?X.GetString(t):Ge.getItemAsync(t)}));return function(t){return e.apply(this,arguments)}}()}]),e}(),Ke=function(e){return"key-"+e};var qe=["syn","sim"];function Je(e,t){return Ze.apply(this,arguments)}function Ze(){return(Ze=(0,Z.default)((function*(e,t){if(500==t.status)return{type:"error",errorMessage:Te.WrongAPIkey};if(404==t.status)return{type:"error",errorMessage:Te.NoWord};if(!t.ok)return{type:"error",errorMessage:Te.Network};try{var r=yield t.text();if(!r)throw new Error("empty response");var n=JSON.parse(r),o=new Set;for(var a in n)for(var i in n[a])qe.includes(i)&&Array.from(n[a][i]).forEach((function(e){return o.add(e)}));return{type:"success",data:[[o]]}}catch(u){return{type:"error",errorMessage:u.message}}}))).apply(this,arguments)}function Qe(){return(Qe=(0,Z.default)((function*(){var e,t,r=(yield Ye())||ze.Self;switch(Ne[r]&&(e=yield Ue.Get(r)),r){case ze.Self:return rt();case ze.Meriam:return t=e,new Ie((function(e){return"https://www.dictionaryapi.com/api/v3/references/thesaurus/json/"+e+"?key="+t}),He);case ze.Datamuse:return Ve();case ze.BigHugeThesarus:return function(e){return new Ie((function(t){return"https://words.bighugelabs.com/api/2/"+e+"/"+t+"/json"}),Je)}(e)}}))).apply(this,arguments)}var Xe="current_api_name";function Ye(){return $e.apply(this,arguments)}function $e(){return($e=(0,Z.default)((function*(){return(yield X.GetString(Xe))||ze.Self}))).apply(this,arguments)}function et(e,t){return tt.apply(this,arguments)}function tt(){return(tt=(0,Z.default)((function*(e,t){var r=[];return r.push(X.SetString(Xe,e)),e!=ze.Self&&t&&r.push(Ue.Set(e,t)),Promise.all(r)}))).apply(this,arguments)}var rt=Ve,nt=function(){function e(t){(0,A.default)(this,e),this.definitionSets=[],this.isEmpty=!1,this.wasFetched=!1,this.Word=function(e){return e.replace(/[^a-z0-9\s-]/gi,"").trim().toLowerCase()}(t)}return(0,M.default)(e,[{key:"set",value:function(e){this.wasFetched=!0,this.definitionSets=e,this.isEmpty=0==this.definitionSets.length}},{key:"Load",value:function(){var e=(0,Z.default)((function*(e){var t=yield e.GetSynonyms(this.Word),r="success"==t.type?t.data:[];return this.set(r),t}));return function(t){return e.apply(this,arguments)}}()},{key:"IsEmpty",get:function(){return this.isEmpty}},{key:"WasFetched",get:function(){return this.wasFetched}}]),e}();var ot=r(3497),at=r(3439),it=r(1451),ut=r(6483);function lt(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function st(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?lt(Object(r),!0).forEach((function(t){(0,p.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):lt(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var ct="black",ft="white",dt="darkgrey",ht=40,pt=c.default.create({inputButton:{alignItems:"center",borderWidth:2,borderRadius:15,marginHorizontal:5}});const vt=function(e){var t=e.disabled,r=e.style,n=e.name,o=e.onPress,a=(null==r?void 0:r.backgroundColor)||ft,i=t?(null==r?void 0:r.disabledCountourColor)||dt:(null==r?void 0:r.countourColor)||ct;return(0,C.jsx)(it.default,{style:st(st({},pt.inputButton),{},{backgroundColor:a,borderColor:i}),onPress:o,disabled:t,children:(0,C.jsx)(ut.default,{name:n,size:(null==r?void 0:r.size)||ht,color:i})})};function yt(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function gt(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?yt(Object(r),!0).forEach((function(t){(0,p.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):yt(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var mt=c.default.create({text:{fontSize:20,marginHorizontal:7,marginVertical:5},listContainer:{flexDirection:"row"},inputHolder:{flex:1,borderWidth:2,borderRadius:15,marginHorizontal:5,justifyContent:"center",alignItems:"center",backgroundColor:H},inputText:{fontSize:20,width:"95%",textAlign:"center"},inputContainer:{paddingVertical:5,flexDirection:"row"},wordList:{flex:5,flexDirection:"row",justifyContent:"flex-start",flexWrap:"wrap",alignSelf:"stretch",alignContent:"center",alignItems:"center",marginHorizontal:5,gap:5},highlightedWord:{borderWidth:3,borderColor:L,margin:-3},materialButtonStyle:{backgroundColor:H,disabledCountourColor:_,countourColor:L}}),wt=(0,C.jsx)(m.Transition.Together,{children:(0,C.jsx)(m.Transition.Change,{durationMs:200})});const bt=function(e){var t=e.synonyms,r=e.colorMap,o=e.highlightedWord,a=e.onWordPress,i=e.onWordLongPress,l=e.onClearButton,s=e.onOptions,c=e.onAddWord,d="web"!=v.default.OS,h=n.useRef();n.useEffect((function(){d&&h.current.animateNextTransition()}),[t]);var p=t.map((function(e){var t=e.Word,n=e.IsEmpty,u=!e.WasFetched||n||!r.has(t)?_:r.get(t);return(0,C.jsx)(w.default,{android_ripple:{color:H},style:function(e){return function(e){return gt(gt({backgroundColor:u},t==o?mt.highlightedWord:[]),{},{opacity:!d&&e?.6:1})}(e.pressed)},onPress:function(){return a(t)},onLongPress:function(){i(t),d&&at.selectionAsync()},children:(0,C.jsx)(g.default,{style:mt.text,children:t})},t)})),y=n.useState(""),b=(0,u.default)(y,2),j=b[0],x=b[1],O=function(e){c(e),x("")};return(0,C.jsxs)(f.default,{children:[(0,C.jsxs)(f.default,{style:mt.listContainer,children:[(0,C.jsx)(f.default,{style:{alignSelf:"flex-end"},children:(0,C.jsx)(vt,{name:"settings",onPress:s,style:mt.materialButtonStyle})}),d?(0,C.jsx)(m.Transitioning.View,{style:mt.wordList,transition:wt,ref:h,children:p}):(0,C.jsx)(f.default,{style:mt.wordList,children:p})]}),(0,C.jsxs)(f.default,{style:mt.inputContainer,children:[(0,C.jsx)(vt,{disabled:0==t.length,name:"clear",onPress:l,style:mt.materialButtonStyle}),(0,C.jsx)(f.default,{style:mt.inputHolder,children:(0,C.jsx)(ot.default,{style:mt.inputText,autoFocus:!0,blurOnSubmit:!0,value:j,onChangeText:function(e){x(e)},onSubmitEditing:function(e){var t=e.nativeEvent.text;t&&O(t)}})}),(0,C.jsx)(vt,{disabled:""===j,name:"add",onPress:function(){return O(j)},style:mt.materialButtonStyle})]})]})};var jt=["Enter a word to find its synonyms","Add more related words","Press and hold any selected word to prioritize its relation"],xt=r(2727);var Ot=c.default.create({connectionIndicator:{position:"absolute",right:10,top:50,width:40,height:40,zIndex:1},container:{flex:1,backgroundColor:"white",justifyContent:"center",alignContent:"center"},controlView:{backgroundColor:"#eac8f7",paddingVertical:5}});const St=function(e){var t=e.navigation,r=n.useState(),o=(0,u.default)(r,2),i=o[0],c=o[1];(0,n.useEffect)((function(){var e=function(){return function(){return Qe.apply(this,arguments)}().then((function(e){return c(e)}))};e();var t=h.default.addListener(J.ApiChanged,e);return function(){return t.remove()}}),[]);var p=(0,n.useState)(""),v=(0,u.default)(p,2),y=v[0],g=v[1],m=function(e,t){var r=n.useState([]),o=(0,u.default)(r,2),i=o[0],l=o[1],s=(0,a.useToast)();return(0,n.useEffect)((function(){l([])}),[e]),{synonyms:i,addWord:(0,n.useCallback)((function(t){l((function(r){var n=new nt(t),o=!n||""==n.Word,a=-1!=r.findIndex((function(e){return e.Word==n.Word}));return o||a?r:(n.Load(e).then((function(e){"error"==e.type&&s.show(e.errorMessage),l((function(e){return Array.from(e)}))})),[].concat((0,ue.default)(r),[n]))}))}),[l,e]),removeWord:(0,n.useCallback)((function(e){l((function(r){var n=r.findIndex((function(t){return t.Word==e}));return n<0?r:(null==t||t(e),[].concat((0,ue.default)(r.slice(0,n)),(0,ue.default)(r.slice(n+1))))}))}),[l,t]),clearWords:(0,n.useCallback)((function(){return l([])}),[l])}}(i,(0,n.useCallback)((function(e){g((function(t){return t==e?"":t}))}),[g])),w=m.synonyms,b=m.addWord,j=m.removeWord,x=m.clearWords;!function(e,t){var r=n.useState(-1),o=(0,u.default)(r,2),i=o[0],l=o[1];n.useEffect((function(){var e=function(){return X.GetString(Y.WasLaunched).then((function(e){e||(X.SetString(Y.WasLaunched,"yes"),l(0))}))};e();var t=h.default.addListener(J.HintsReset,e);return function(){return t.remove()}}),[]),n.useEffect((function(){0==i&&t>0&&l(1),1==i&&t>1&&l(2)}),[t]);var s=(0,a.useToast)();n.useEffect((function(){e&&i>=0&&i<=jt.length&&(null==s.show||s.show(jt[i],{onPress:function(e){return null==s?void 0:s.hide(e)}}))}),[i,e])}((0,xt.useIsFocused)(),w.length);var O=function(e,t){var r=(0,n.useRef)(void 0);return(0,n.useMemo)((function(){var t=e(r.current);return r.current=t,t}),t)}((function(e){return function(e,t){var r=new Set;null==e||e.forEach((function(e,n){t.includes(n)&&r.add(e)}));var n=new Map;return t.forEach((function(t){var o=(null==e?void 0:e.get(t))||V(Array.from(r));n.set(t,o),r.add(o)})),n}(e,w.map((function(e){return e.Word})))}),[w]),S=null!=w.find((function(e){return!e.WasFetched}));return(0,C.jsxs)(s.SafeAreaView,{style:Ot.container,children:[(0,C.jsx)(l.default,{style:"auto"}),(0,C.jsx)(We,{synonyms:w.filter((function(e){return e.WasFetched&&!e.IsEmpty})),colorMap:O,addNewWord:b,wordToSortBy:y}),(0,C.jsx)(f.default,{style:Ot.connectionIndicator,children:(0,C.jsx)(d.default,{pointerEvents:"none",animating:S,size:"large",color:L})}),(0,C.jsx)(f.default,{style:Ot.controlView,children:(0,C.jsx)(bt,{synonyms:w,colorMap:O,highlightedWord:y,onClearButton:x,onWordPress:function(e){return j(e)},onWordLongPress:function(e){return g(e)},onOptions:function(){return t.navigate("Options")},onAddWord:b})})]})};var Ct=r(7301),Pt=r(9220),kt=r(6085),Et=c.default.create({text:{left:20,fontSize:16},touchable:{padding:10},view:{flexDirection:"row",alignItems:"center"}});const Wt=function(e){var t=e.title,r=e.state,n=e.onValueChange;return(0,C.jsx)(it.default,{onPress:function(){return n(!r)},style:Et.touchable,children:(0,C.jsxs)(f.default,{style:Et.view,children:[(0,C.jsx)(kt.default,{value:r,onValueChange:function(){return n(!r)}}),(0,C.jsx)(g.default,{style:Et.text,children:t})]})})};const At=function(e){var t=e.navigation,r=(0,a.useToast)(),o=n.useState(),i=(0,u.default)(o,2),l=i[0],s=i[1],c=Object.values(ze).map((function(e){return{name:e,state:l==e,text:Fe[e]}}));return n.useEffect((function(){Ye().then((function(e){return s(e)}));var e=h.default.addListener(J.ApiKeyEntered,(function(e){var t=e.varName,n=e.varValue,o=t;l!=o||n?(s(o),et(o,n).then((function(){return h.default.emit(J.ApiChanged)}))):r.show("Please provide a key to use "+Fe[o]+" API")}));return function(){return e.remove()}}),[]),(0,C.jsx)(f.default,{children:c.map((function(e){var r=e.name,n=e.state,o=e.text;return(0,C.jsx)(Wt,{onValueChange:function(){!function(e){var r=c.find((function(t){return t.name==e})).state;Ne[e]?t.navigate("InputModal",{varName:e,varHint:"Enter a key for "+Fe[e]+" API",varLink:Re[e],eventName:J.ApiKeyEntered}):r||(s(e),et(e).then((function(){return h.default.emit(J.ApiChanged)})))}(r)},state:n,title:o},r)}))})};var Mt=r(6459),Dt=r(2790),Tt=r.n(Dt);c.default.create({view:{}});function It(e){return e>=zt.uimax}var zt={step:10,min:20,max:70,uimax:80,default:30};const Nt=function(e){(0,Mt.default)(e);var t=(0,n.useState)(-1),r=(0,u.default)(t,2),o=r[0],a=r[1];-1==o&&X.GetString(Y.CloudCount).then((function(e){var t=function(e){var t=parseInt(e)||zt.default;return It(t)?zt.uimax:t}(e);a(t)}));return(0,C.jsxs)(f.default,{style:{justifyContent:"center",alignItems:"center"},children:[(0,C.jsx)(g.default,{children:" Tile limit"}),(0,C.jsxs)(g.default,{children:[" ",o>zt.max?"No limit":o]}),(0,C.jsx)(Tt(),{style:{alignItems:"center",width:"90%",height:40},step:zt.step,value:o,minimumValue:zt.min,maximumValue:zt.uimax,onValueChange:function(e){var t;X.SetString(Y.CloudCount,(It(t=e)?1e3:t).toString()),a(e),h.default.emit(J.CloudCountChanged)},minimumTrackTintColor:"#FFFFFF",maximumTrackTintColor:"#000000"})]})};function Rt(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function Ft(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Rt(Object(r),!0).forEach((function(t){(0,p.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Rt(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var Vt=c.default.create({container:{flex:1},content:{left:20,paddingVertical:20},header:{flexDirection:"row",alignItems:"center",padding:16},linkText:{fontSize:15,color:"blue"},resetHints:{flexDirection:"row",alignItems:"center",gap:10},title:{marginLeft:16,fontSize:18,fontWeight:"bold"}}),Bt="https://github.com/holyhamster/Synesis/",_t=function(e){return e.Display="Display",e.API="API",e.Hints="Hints",e.About="About",e}({});const Ht=function(e){var t,r,o=e.navigation,a=e.route,i=(t={},(0,p.default)(t,_t.Display,(0,C.jsx)(Nt,{})),(0,p.default)(t,_t.API,(0,C.jsx)(At,{navigation:o})),(0,p.default)(t,_t.About,(0,C.jsx)(g.default,{style:Vt.linkText,onPress:function(){return Ct.default.openURL(Bt)},children:Bt})),(0,p.default)(t,_t.Hints,(0,C.jsxs)(it.default,{style:Vt.resetHints,onPress:function(){"android"==v.default.OS&&at.selectionAsync(),X.SetString(Y.WasLaunched,"").then((function(){return h.default.emit(J.HintsReset)}))},children:[(0,C.jsx)(ut.default,{name:"replay-circle-filled",size:30}),(0,C.jsx)(g.default,{style:{fontSize:15},children:"Reset Hints"})]})),t),l=n.useState([]),s=(0,u.default)(l,2),c=s[0],d=s[1],y=(null!=(r=a.params)?r:{unravel:void 0}).unravel;return(0,n.useEffect)((function(){var e=Object.keys(_t).indexOf(y);e>=0&&d([e])}),[]),(0,C.jsx)(f.default,{children:(0,C.jsx)(Pt.default,{underlayColor:H,sections:Object.values(_t),activeSections:c,renderHeader:function(e,t,r){return(0,C.jsxs)(f.default,{style:Ft({},Vt.header),children:[r?(0,C.jsx)(ut.default,{name:"expand-less",size:24,color:L}):(0,C.jsx)(ut.default,{name:"expand-more",size:24,color:L}),(0,C.jsx)(g.default,{style:Vt.title,children:e})]},t)},renderContent:function(e){return(0,C.jsx)(f.default,{style:Vt.content,children:i[e]})||null},onChange:function(e){d((0,ue.default)(e))}})})};var Lt=c.default.create({buttonView:{flexDirection:"row",gap:10},buttons:{},input:{backgroundColor:H,fontSize:20,width:"80%",justifyContent:"center",textAlign:"center"},linkText:{fontSize:20,color:"blue",textAlign:"center"},parentView:{flex:1,alignItems:"center",gap:10,justifyContent:"center"},hintText:{fontSize:25,textAlign:"center"}});const Gt=function(e){var t=e.navigation,r=e.route.params,o=r.eventName,a=r.varName,i=r.varHint,l=r.varLink,s=function(e){var t={varName:a,varValue:e};h.default.emit(o,t)},c=n.useState(""),d=(0,u.default)(c,2),p=d[0],v=d[1];return(0,C.jsxs)(f.default,{style:Lt.parentView,children:[(0,C.jsx)(g.default,{style:Lt.hintText,children:null!=i?i:"Enter variable"}),(0,C.jsx)(g.default,{style:Lt.linkText,onPress:function(){return Ct.default.openURL(l)},children:l}),(0,C.jsx)(ot.default,{autoFocus:!0,blurOnSubmit:!0,value:p,onChangeText:function(e){v(e)},style:Lt.input,onSubmitEditing:function(e){var r=e.nativeEvent.text;r&&(s(r),t.goBack())}}),(0,C.jsxs)(f.default,{style:Lt.buttonView,children:[(0,C.jsx)(vt,{name:"clear",onPress:function(){return t.goBack()},style:{size:50}}),(0,C.jsx)(vt,{name:"check",onPress:function(){s(p),t.goBack()},style:{size:50}})]})]})};var Ut=(0,r(7377).default)();function Kt(){return(0,C.jsx)(i.SafeAreaProvider,{children:(0,C.jsx)(o.default,{children:(0,C.jsx)(a.ToastProvider,{placement:"center",children:(0,C.jsxs)(Ut.Navigator,{children:[(0,C.jsx)(Ut.Screen,{name:"Synesis",component:St,options:{headerShown:!1}}),(0,C.jsx)(Ut.Screen,{name:"Options",component:Ht}),(0,C.jsx)(Ut.Group,{screenOptions:{presentation:"modal"},children:(0,C.jsx)(Ut.Screen,{name:"InputModal",component:Gt})})]})})})})}},7270:(e,t,r)=>{e.exports=r.p+"static/media/icon.ac02a88b55326f25267d.png"}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var a=t[n]={id:n,loaded:!1,exports:{}};return e[n].call(a.exports,a,a.exports,r),a.loaded=!0,a.exports}r.m=e,(()=>{var e=[];r.O=(t,n,o,a)=>{if(!n){var i=1/0;for(c=0;c<e.length;c++){for(var[n,o,a]=e[c],u=!0,l=0;l<n.length;l++)(!1&a||i>=a)&&Object.keys(r.O).every((e=>r.O[e](n[l])))?n.splice(l--,1):(u=!1,a<i&&(i=a));if(u){e.splice(c--,1);var s=o();void 0!==s&&(t=s)}}return t}a=a||0;for(var c=e.length;c>0&&e[c-1][2]>a;c--)e[c]=e[c-1];e[c]=[n,o,a]}})(),r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},(()=>{var e,t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__;r.t=function(n,o){if(1&o&&(n=this(n)),8&o)return n;if("object"===typeof n&&n){if(4&o&&n.__esModule)return n;if(16&o&&"function"===typeof n.then)return n}var a=Object.create(null);r.r(a);var i={};e=e||[null,t({}),t([]),t(t)];for(var u=2&o&&n;"object"==typeof u&&!~e.indexOf(u);u=t(u))Object.getOwnPropertyNames(u).forEach((e=>i[e]=()=>n[e]));return i.default=()=>n,r.d(a,i),a}})(),r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),r.p="/Synesis/",(()=>{var e={179:0};r.O.j=t=>0===e[t];var t=(t,n)=>{var o,a,[i,u,l]=n,s=0;if(i.some((t=>0!==e[t]))){for(o in u)r.o(u,o)&&(r.m[o]=u[o]);if(l)var c=l(r)}for(t&&t(n);s<i.length;s++)a=i[s],r.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return r.O(c)},n=self.webpackChunkweb=self.webpackChunkweb||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var n=r.O(void 0,[569],(()=>r(9386)));n=r.O(n)})();
//# sourceMappingURL=main.2bb97d8a.js.map