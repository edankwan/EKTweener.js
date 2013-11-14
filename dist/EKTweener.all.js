function EKTween(e,t,n,r,i,s){this._target=e;this._appliedTarget=t;this._isStyle=e!==t;this._data=i;this._pauseTime=0;this._isPaused=false;this._isStarted=false;this._currentTime=(new Date).getTime();this._startTime=r*1e3+this._currentTime;this._durationTime=(n||0)*1e3;this._hasFrom=s;this.isFinished=false;this.ease=EKTweenFunc.defaultFunc;this.tweens=null;this.onStart=null;this.onStartParams=null;this.onUpdate=null;this.onUpdateParams=null;this.onComplete=null;this.onCompleteParams=null;this.properties={};this.prefix={};this.suffix={};this.yoyo={};this.plugin={};this.init()}function EKTweenerTransform3dPlugin(){var e=[0,0,0,0,0,0,0,0,0,0,0,0];var t=[0,0,0,0,0,0,0,0,0,0,0,0];var n=180/Math.PI;var r=false;var i=false;var s=false;this.setFrom=function(t){o(e,t)};this.setTo=function(e){o(t,e)};this.setOutput=function(n){return"matrix3d("+(e[0]+(t[0]-e[0])*n)+","+(e[1]+(t[1]-e[1])*n)+","+(e[2]+(t[2]-e[2])*n)+","+"0,"+(e[3]+(t[3]-e[3])*n)+","+(e[4]+(t[4]-e[4])*n)+","+(e[5]+(t[5]-e[5])*n)+","+"0,"+(e[6]+(t[6]-e[6])*n)+","+(e[7]+(t[7]-e[7])*n)+","+(e[8]+(t[8]-e[8])*n)+","+"0,"+(e[9]+(t[9]-e[9])*n)+","+(e[10]+(t[10]-e[10])*n)+","+(e[11]+(t[11]-e[11])*n)+","+"1)"};var o=function(e,t){var n=EKTweener.getStyle("transform",t);if(n.indexOf("matrix3d")>-1){var r=n.substring(9,n.length-1).split(",");for(var i=0,s=0;i<15;i++){if(i==3||i==7||i==11){}else{e[s]=parseFloat(r[i]);s++}}}else if(n.indexOf("matrix")>-1){var r=n.substring(7,n.length-1).split(",");e[0]=parseFloat(r[0]);e[1]=parseFloat(r[1]);e[2]=0;e[3]=parseFloat(r[2]);e[4]=parseFloat(r[3]);e[5]=0;e[6]=0;e[7]=0;e[8]=1;e[9]=parseFloat(r[4]);e[10]=parseFloat(r[5]);e[11]=0}else{e[0]=e[4]=e[8]=e[11]=1;e[1]=e[2]=e[3]=e[5]=e[6]=e[7]=e[9]=e[10]=0}}}function EKTweenerColorPlugin(){var e=[0,0,0];var t=[0,0,0];this.setFrom=function(t){r(e,t)};this.setTo=function(e){r(t,e)};this.setOutput=function(r){return"#"+n(e[0],t[0],r)+n(e[1],t[1],r)+n(e[2],t[2],r)};var n=function(e,t,n){var r=(e+(t-e)*n>>0).toString(16);if(r.length==0)r="00";if(r.length==1)r="0"+r;return r};var r=function(e,t){if(t.substr(0,1)=="#"){if(t.length==4){e[0]=parseInt(t.substr(1,1),16)*17;e[1]=parseInt(t.substr(2,1),16)*17;e[2]=parseInt(t.substr(3,1),16)*17}else if(t.length==7){e[0]=parseInt(t.substr(1,2),16);e[1]=parseInt(t.substr(3,2),16);e[2]=parseInt(t.substr(5,2),16)}}else{var n=/(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(t);e[0]=parseInt(n[2]);e[1]=parseInt(n[3]);e[2]=parseInt(n[4])}}}function EKTweenerOpacityPlugin(){var e;var t;this.setFrom=function(t){if(!t){e=1;return}if(typeof t=="number"){e=parseFloat(t);return}var n=t.indexOf("alpha");if(n>-1){e=parseFloat(t.slice(t.indexOf("=",n)+1))/100}else{e=1}};this.setTo=function(e){t=e};this.setOutput=function(n){var r=e+(t-e)*n;return"alpha(opacity="+(r===1?"none":r*100)+")"}}(function(){var e=0;var t=["ms","moz","webkit","o"];for(var n=0;n<t.length&&!window.requestAnimationFrame;++n){window.requestAnimationFrame=window[t[n]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[t[n]+"CancelAnimationFrame"]||window[t[n]+"CancelRequestAnimationFrame"]}if(!window.requestAnimationFrame)window.requestAnimationFrame=function(t,n){var r=(new Date).getTime();var i=Math.max(0,16-(r-e));var s=window.setTimeout(function(){t(r+i)},i);e=r+i;return s};if(!window.cancelAnimationFrame)window.cancelAnimationFrame=function(e){clearTimeout(e)}})();if(!window.getComputedStyle){window.getComputedStyle=function(e,t){this.el=e;this.getPropertyValue=function(t){var n=/(\-([a-z]){1})/g;if(t=="float")t="styleFloat";if(n.test(t)){t=t.replace(n,function(){return arguments[2].toUpperCase()})}return e.currentStyle[t]?e.currentStyle[t]:null};return this}}var EKTweener=function(e,t){function h(e){return typeof HTMLElement==="object"?e instanceof HTMLElement:typeof e==="object"&&e.nodeType===1&&typeof e.nodeName==="string"}function p(e){return typeof CSSStyleDeclaration==="object"?e instanceof CSSStyleDeclaration:typeof e==="object"&&typeof e.cssText==="string"}function d(){var t=e.createElement("div");var n="Webkit Moz O ms".split(" ");var r=n.length;while(r--){if(n[r]+"Transform"in t.style){i=n[r];break}}}function v(e){if(f[e])e=f[e];for(var t=0;t<a.length;t++)if(a[t]===e)return i+e.charAt(0).toUpperCase()+e.slice(1);return e}function m(e){for(var t in e){var n=t;if(f[t])n=f[t];for(var r=0;r<a.length;r++)if(a[r]===n){n=i+n.charAt(0).toUpperCase()+n.slice(1);break}if(t!==n){e[n]=e[t];delete e[t]}}}function g(e){m(e);m(e.plugin)}function y(e,t){if(!t.plugin)t.plugin={};if(!t.suffix)t.suffix={};for(property in t){if(u[property]&&!t.plugin[property]){t.plugin[property]=u[property]}if(l[property]&&!t.suffix[property]){t.suffix[property]=l[property]}}g(t)}function b(e,t,r,i){if(e.jquery){var s=[];e.each(function(){s[s.length]=b(this,t,r,i)});return s.length>1?s:s[0]}var o;if(h(e)&&r.skipHTMLParsing!=true){o=e.style;y(e,r)}else{o=e;r.appliedTarget=e}if(typeof e.tweenId==="undefined"){e.tweenId=c.length;c[e.tweenId]=[]}var u=r.delay==n?0:r.delay;delete r.delay;var a=new EKTween(e,o,t,u,r,i||false);c[e.tweenId].push(a);if(!i)a.onLoop();return a}function w(e,t,n,r){if(e.jquery){var i=[];e.each(function(){i[i.length]=w(this,t,n,r)});return i.length>1?i:i[0]}var s=b(e,t,r,true);if(h(e)&&r.skipHTMLParsing!=true)g(n);for(var o in n)s.changeFrom(o,n[o]);s.onLoop();return s}function E(e){if(e.jquery){e.each(function(){E(this)});return}var t=c[e.tweenId];if(t){while(t[0]){t[0].removeProperties();t[0].kill();delete t[0]}t.splice(0,t.length)}}function S(e){return c[e.tweenId]}function x(e,t){if(f[t])t=f[t];var n=S(e);if(!n)return null;var r=n.length;while(r--)if(n[r].properties[t])return n[r];return null}function T(n,r){propertyName=v(n);var i=propertyName;var u=/[A-Z]/g;if(propertyName.search(u)>-1){i=propertyName.replace(u,function(){return"-"+arguments[0].toLowerCase()});if(i.indexOf("ms")==0)i="-"+i}if(e.body){if(!s){s=e.createElement("div");o=s.style;o.position="absolute";o.top=o.left="-9000px";document.body.appendChild(s)}o[propertyName]=r;return t.getComputedStyle(s,"null").getPropertyValue(i)}var a=e.createElement("body");var f=e.createElement("div");e.documentElement.appendChild(a);a.appendChild(f);o[propertyName]=r;var l=t.getComputedStyle(f,"null").getPropertyValue(i);e.documentElement.removeChild(a);a=null;f=null;return l}var n;var r={};var i="";var s;var o;var u={};var a=[];var f={};var l={width:"px",height:"px",top:"px",left:"px",bottom:"px",right:"px",marginTop:"px",marginLeft:"px",marginBottom:"px",marginRight:"px",paddingTop:"px",paddingLeft:"px",paddingBottom:"px",paddingRight:"px",fontSize:"px",size:"px"};var c=[];d();r.HTMLPlugins=u;r.HTMLSuffix=l;r.HTMLPrefixedStyle=a;r.HTMLStyleAlias=f;r.getPropertyName=v;r.getStyle=T;r.to=b;r.fromTo=w;r.killTweensOf=E;r.getTweens=S;r.getTween=x;return r}(document,window);EKTween.prototype={init:function(){function r(e,t){return function(){return e.apply(t,Array.prototype.slice.call(arguments))}}for(var e in this._data.plugin){this.plugin[e]=new this._data.plugin[e]}for(e in this._data){switch(e){case"ease":this.ease=EKTweenFunc[this._data[e]];break;case"prefix":case"suffix":case"yoyo":case"onStart":case"onStartParams":case"onUpdate":case"onUpdateParams":case"onComplete":case"onCompleteParams":this[e]=this._data[e];break;case"plugin":break;default:this.properties[e]=[this.plugin[e]?1:this._data[e],0];if(this.plugin[e])this.plugin[e].setTo(this._data[e],this._appliedTarget)}}if(this.yoyo&&this._isStyle){for(var e=0;e<this.yoyo.length;e++){this.yoyo[e]=EKTweener.getPropertyName(this.yoyo[e])}}if(this.prefix&&this._isStyle){var t={};for(var e in this.prefix){t[EKTweener.getPropertyName(e)]=this.prefix[e]}this.prefix=t}if(this.suffix&&this._isStyle){var n={};for(var e in this.suffix){n[EKTweener.getPropertyName(e)]=this.suffix[e]}this.suffix=n}this.tweens=EKTweener.getTweens(this._target);if(this.tweens){if(this.tweens.length>0){e=this.tweens.length;while(e--){if(this.tweens[e].removeProperties(this.properties)==0){this.tweens[e].kill();this.tweens.splice(e,1)}}}}delete this._data;this.onLoop=r(this.onLoop,this)},update:function(){if(this.onUpdate){if(this.onUpdateParams){this.onUpdate.apply(this,this.onUpdateParams)}else{this.onUpdate()}}},onLoop:function(){if(this.isFinished)return;requestAnimationFrame(this.onLoop);this._currentTime=(new Date).getTime();if(!this._isPaused){this.render()}},render:function(){if(this._currentTime>=this._startTime){if(!this._isStarted){if(!this._hasFrom)for(var e in this.properties){this.setProperty(e,this.properties[e])}if(this.onStart){if(this.onStartParams){this.onStart.apply(this,this.onStartParams)}else{this.onStart()}}this._isStarted=true}if(this._currentTime>=this._durationTime+this._startTime){for(var e in this.properties){this.setValue(this.properties[e][4]?this.properties[e][1]:this.properties[e][0],e,this.properties[e])}this.update();if(this.onComplete){if(this.onCompleteParams){this.onComplete.apply(this,this.onCompleteParams)}else{this.onComplete()}}this.kill();e=this.tweens.length;while(e--){if(this.tweens[e])if(this.tweens[e].isFinished)this.tweens.splice(e,1)}return}else{for(var e in this.properties){this.setEaseValue(e,this.properties[e])}this.update()}}},setProperty:function(e,t){var n;if(this.prefix){if(this.prefix[e]){t[2]=this.prefix[e]}}if(this.suffix){if(this.suffix[e]){t[3]=this.suffix[e]}}if(this.yoyo){for(var n=0;n<this.yoyo.length;n++){if(this.yoyo[n]===e){t[4]=true;break}}}if(this._isStyle){var r=this.getCurrentPropertyValue(e);if(this.plugin[e]){this.plugin[e].setFrom(r);t[1]=0}else{t[1]=parseFloat(r)}}else{t[1]=parseFloat(this._appliedTarget[e])}if(isNaN(t[1]))t[1]=0},setEaseValue:function(e,t){if(t[4]){var n=this._durationTime;var r=(this._currentTime-this._startTime)*2/n;this.setValue(this.ease(r>1?2-r:r,t[1],t[0]-t[1],1),e,t)}else{this.setValue(this.ease(this._currentTime-this._startTime<0?0:this._currentTime-this._startTime,t[1],t[0]-t[1],this._durationTime),e,t)}},setValue:function(e,t,n){if(isNaN(e))return;var r=this.plugin[t]?this.plugin[t].setOutput(e):e;if(n.length>2)this._appliedTarget[t]=(n[2]?n[2]:"")+r+(n[3]?n[3]:"");else this._appliedTarget[t]=r},kill:function(){cancelAnimationFrame(this.onLoop);this.isFinished=true},pause:function(){if(this._pauseTime==0)this._pauseTime=(new Date).getTime();this._isPaused=true},resume:function(){if(this._pauseTime>0){var e=(new Date).getTime()-this._pauseTime;this._currentTime+=e;this._startTime+=e;_pauseTime=(new Date).getTime();this._pauseTime=0}if(this._isPaused)this._isPaused=false},removeProperties:function(e){var t;if(e){var n=0;for(propertyName in this.properties){if(propertyName in e)delete this.properties[propertyName];else n++}return n}else{for(propertyName in this.properties)delete this.properties[propertyName]}return 0},changeFrom:function(e,t){if(this._isHTML)e=getPropertyName(e);this.setProperty(e,this.properties[e]);if(this.properties[e]){if(this.plugin[e]){this.plugin[e].setFrom(t)}else{this.properties[e][1]=t}}},changeTo:function(e,t){if(this._isHTML)e=getPropertyName(e);if(this.properties[e]){if(this.plugin[e]){this.plugin[e].setTo(t)}else{this.properties[e][0]=t}}},getCurrentPropertyValue:function(e){var t=/[A-Z]/g;if(e.search(t)>-1){e=e.replace(t,function(){return"-"+arguments[0].toLowerCase()});if(e.indexOf("ms")==0)e="-"+e}return window.getComputedStyle(this._target,"null").getPropertyValue(e)}};var EKTweenFunc={linear:function(e,t,n,r){return n*e/r+t},easeInQuad:function(e,t,n,r){return n*(e/=r)*e+t},easeOutQuad:function(e,t,n,r){return-n*(e/=r)*(e-2)+t},easeInOutQuad:function(e,t,n,r){if((e/=r/2)<1)return n/2*e*e+t;return-n/2*(--e*(e-2)-1)+t},easeInCubic:function(e,t,n,r){return n*(e/=r)*e*e+t},easeOutCubic:function(e,t,n,r){return n*((e=e/r-1)*e*e+1)+t},easeInOutCubic:function(e,t,n,r){if((e/=r/2)<1)return n/2*e*e*e+t;return n/2*((e-=2)*e*e+2)+t},easeOutInCubic:function(e,t,n,r){if(e<r/2)return EKTweenFunc.easeOutCubic(e*2,t,n/2,r);return EKTweenFunc.easeInCubic(e*2-r,t+n/2,n/2,r)},easeInQuart:function(e,t,n,r){return n*(e/=r)*e*e*e+t},easeOutQuart:function(e,t,n,r){return-n*((e=e/r-1)*e*e*e-1)+t},easeInOutQuart:function(e,t,n,r){if((e/=r/2)<1)return n/2*e*e*e*e+t;return-n/2*((e-=2)*e*e*e-2)+t},easeOutInQuart:function(e,t,n,r){if(e<r/2)return EKTweenFunc.easeOutQuart(e*2,t,n/2,r);return EKTweenFunc.easeInQuart(e*2-r,t+n/2,n/2,r)},easeInQuint:function(e,t,n,r){return n*(e/=r)*e*e*e*e+t},easeOutQuint:function(e,t,n,r){return n*((e=e/r-1)*e*e*e*e+1)+t},easeInOutQuint:function(e,t,n,r){if((e/=r/2)<1)return n/2*e*e*e*e*e+t;return n/2*((e-=2)*e*e*e*e+2)+t},easeOutInQuint:function(e,t,n,r){if(e<r/2)return EKTweenFunc.easeOutQuint(e*2,t,n/2,r);return EKTweenFunc.easeInQuint(e*2-r,t+n/2,n/2,r)},easeInSine:function(e,t,n,r){return-n*Math.cos(e/r*(Math.PI/2))+n+t},easeOutSine:function(e,t,n,r){return n*Math.sin(e/r*(Math.PI/2))+t},easeInOutSine:function(e,t,n,r){return-n/2*(Math.cos(Math.PI*e/r)-1)+t},easeOutInSine:function(e,t,n,r){if(e<r/2)return EKTweenFunc.easeOutSine(e*2,t,n/2,r);return EKTweenFunc.easeInSine(e*2-r,t+n/2,n/2,r)},easeInExpo:function(e,t,n,r){return e==0?t:n*Math.pow(2,10*(e/r-1))+t-n*.001},easeOutExpo:function(e,t,n,r){return e==r?t+n:n*1.001*(-Math.pow(2,-10*e/r)+1)+t},easeInOutExpo:function(e,t,n,r){if(e==0)return t;if(e==r)return t+n;if((e/=r/2)<1)return n/2*Math.pow(2,10*(e-1))+t-n*5e-4;return n/2*1.0005*(-Math.pow(2,-10*--e)+2)+t},easeOutInExpo:function(e,t,n,r){if(e<r/2)return EKTweenFunc.easeOutExpo(e*2,t,n/2,r);return EKTweenFunc.easeInExpo(e*2-r,t+n/2,n/2,r)},easeInCirc:function(e,t,n,r){return-n*(Math.sqrt(1-(e/=r)*e)-1)+t},easeOutCirc:function(e,t,n,r){return n*Math.sqrt(1-(e=e/r-1)*e)+t},easeInOutCirc:function(e,t,n,r){if((e/=r/2)<1)return-n/2*(Math.sqrt(1-e*e)-1)+t;return n/2*(Math.sqrt(1-(e-=2)*e)+1)+t},easeOutInCirc:function(e,t,n,r){if(e<r/2)return EKTweenFunc.easeOutCirc(e*2,t,n/2,r);return EKTweenFunc.easeInCirc(e*2-r,t+n/2,n/2,r)},easeInElastic:function(e,t,n,r,i,s){var o;if(e==0)return t;if((e/=r)==1)return t+n;if(!s)s=r*.3;if(!i||i<Math.abs(n)){i=n;o=s/4}else o=s/(2*Math.PI)*Math.asin(n/i);return-(i*Math.pow(2,10*(e-=1))*Math.sin((e*r-o)*2*Math.PI/s))+t},easeOutElastic:function(e,t,n,r,i,s){var o;if(e==0)return t;if((e/=r)==1)return t+n;if(!s)s=r*.3;if(!i||i<Math.abs(n)){i=n;o=s/4}else o=s/(2*Math.PI)*Math.asin(n/i);return i*Math.pow(2,-10*e)*Math.sin((e*r-o)*2*Math.PI/s)+n+t},easeInOutElastic:function(e,t,n,r,i,s){var o;if(e==0)return t;if((e/=r/2)==2)return t+n;if(!s)s=r*.3*1.5;if(!i||i<Math.abs(n)){i=n;o=s/4}else o=s/(2*Math.PI)*Math.asin(n/i);if(e<1)return-.5*i*Math.pow(2,10*(e-=1))*Math.sin((e*r-o)*2*Math.PI/s)+t;return i*Math.pow(2,-10*(e-=1))*Math.sin((e*r-o)*2*Math.PI/s)*.5+n+t},easeOutInElastic:function(e,t,n,r,i,s){if(e<r/2)return EKTweenFunc.easeOutElastic(e*2,t,n/2,r,i,s);return EKTweenFunc.easeInElastic(e*2-r,t+n/2,n/2,r,i,s)},easeInBack:function(e,t,n,r,i){if(i==undefined)i=1.70158;return n*(e/=r)*e*((i+1)*e-i)+t},easeOutBack:function(e,t,n,r,i){if(i==undefined)i=1.70158;return n*((e=e/r-1)*e*((i+1)*e+i)+1)+t},easeInOutBack:function(e,t,n,r,i){if(i==undefined)i=1.70158;if((e/=r/2)<1)return n/2*e*e*(((i*=1.525)+1)*e-i)+t;return n/2*((e-=2)*e*(((i*=1.525)+1)*e+i)+2)+t},easeOutInBack:function(e,t,n,r,i){if(e<r/2)return EKTweenFunc.easeOutBack(e*2,t,n/2,r,i);return EKTweenFunc.easeInBack(e*2-r,t+n/2,n/2,r,i)},easeInBounce:function(e,t,n,r){return n-EKTweenFunc.easeOutBounce(r-e,0,n,r)+t},easeOutBounce:function(e,t,n,r){if((e/=r)<1/2.75){return n*7.5625*e*e+t}else if(e<2/2.75){return n*(7.5625*(e-=1.5/2.75)*e+.75)+t}else if(e<2.5/2.75){return n*(7.5625*(e-=2.25/2.75)*e+.9375)+t}else{return n*(7.5625*(e-=2.625/2.75)*e+.984375)+t}},easeInOutBounce:function(e,t,n,r){if(e<r/2)return EKTweenFunc.easeInBounce(e*2,0,n,r)*.5+t;else return EKTweenFunc.easeOutBounce(e*2-r,0,n,r)*.5+n*.5+t},easeOutInBounce:function(e,t,n,r){if(e<r/2)return EKTweenFunc.easeOutBounce(e*2,t,n/2,r);return EKTweenFunc.easeInBounce(e*2-r,t+n/2,n/2,r)}};EKTweenFunc.defaultFunc=EKTweenFunc.easeOutCirc;if(EKTweener){EKTweener.HTMLStyleAlias.transform3d="transform";EKTweener.HTMLPrefixedStyle.push("transform");EKTweener.HTMLPlugins.transform3d=EKTweenerTransform3dPlugin}if(EKTweener){EKTweener.HTMLPlugins.backgroundColor=EKTweener.HTMLPlugins.color=EKTweenerColorPlugin}EKTweenerOpacityPlugin.hasOpacity=function(){var e=document.createElement("div");return"opacity"in e.style}();if(EKTweener){if(!EKTweenerOpacityPlugin.hasOpacity){EKTweener.HTMLStyleAlias.opacity="filter";EKTweener.HTMLPlugins.opacity=EKTweenerOpacityPlugin}}
