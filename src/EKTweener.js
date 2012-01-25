/**
*
* Version:  0.3.2.1
* Author:   Edan Kwan
* Contact:  info@edankwan.com
* Website:  http://www.edankwan.com/
* Twitter:  @edankwan
*
* Copyright (c) 2012 Edan Kwan
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
**/



/*
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */

if(!window.requestAnimFrame){
    window.requestAnimFrame = (function(window){
        return  window.requestAnimationFrame       || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function(callback){
                    window.setTimeout(callback, 1000 / 60);
                };
    })(window);
}

/*
 * getComputedStyle for IE:
 * http://snipplr.com/view/13523/
 */
if (!window.getComputedStyle) {
    window.getComputedStyle = function(el, pseudo) {
        this.el = el;
        this.getPropertyValue = function(prop) {
            var re = /(\-([a-z]){1})/g;
            if (prop == 'float') prop = 'styleFloat';
            if (re.test(prop)) {
                prop = prop.replace(re, function () {
                    return arguments[2].toUpperCase();
                });
            }
            return el.currentStyle[prop] ? el.currentStyle[prop] : null;
        }
        return this;
    }
}


EKTweener = (function() {

    var app = {};
    
    var _browserPrefix = "";
    
    var HTMLPlugins = {};
    var HTMLPrefixedStyle = [];
    var HTMLStyleAlias = {};
    var HTMLSuffix = {
        width: "px",
        height: "px",
        top: "px",
        left: "px",
        bottom: "px",
        right: "px",
        marginTop: "px",
        marginLeft: "px",
        marginBottom: "px",
        marginRight: "px",
        paddingTop: "px",
        paddingLeft: "px",
        paddingBottom: "px",
        paddingRight: "px",
        fontSize: "px",
        size: "px"
    };

    var _targetTweens = [];

    function _isHTMLElement(target){
        return typeof HTMLElement === "object" ? target instanceof HTMLElement :  typeof target === "object" && target.nodeType === 1 && typeof target.nodeName==="string";
    };
    function _isStyle(target){
        return typeof CSSStyleDeclaration === "object" ? target instanceof CSSStyleDeclaration :  typeof target === "object" && typeof target.cssText ==="string";
    };
    function _init(){
        var testedElement = document.createElement("div");
        var browserPrefixes = 'Webkit Moz O ms'.split(' ');
        var i = browserPrefixes.length;
        while(i--){
            if(browserPrefixes[i]+"Transform" in testedElement.style) {
                _browserPrefix = browserPrefixes[i];
                break;
            }
        }
    }
    
    
    /*
     *  change the style alias into the real style name and then add the browser prefix
     */
    function getPropertyName(name){
        if(HTMLStyleAlias[name]) name = HTMLStyleAlias[name];
        for(var i = 0; i<HTMLPrefixedStyle.length;i++) if(HTMLPrefixedStyle[i] === name) return _browserPrefix + name.charAt(0).toUpperCase() + name.slice(1);
        return name;
    }
    
    
    function _parseDataNaming(data){
        
        for(var name in data){
            var newName = name;
            if(HTMLStyleAlias[name]) newName = HTMLStyleAlias[name];
            for(var i = 0; i<HTMLPrefixedStyle.length;i++) if(HTMLPrefixedStyle[i] === newName) {newName = _browserPrefix + newName.charAt(0).toUpperCase() + newName.slice(1); break};
            if(name !== newName){
                data[newName] = data[name];
                delete data[name];
            }
        }
        for(var name in data.plugin){
            var newName = name;
            if(HTMLStyleAlias[name]) newName = HTMLStyleAlias[name];
            for(var i = 0; i<HTMLPrefixedStyle.length;i++) if(HTMLPrefixedStyle[i] === newName) {newName = _browserPrefix + newName.charAt(0).toUpperCase() + newName.slice(1); break};
            if(name !== newName){
                data.plugin[newName] = data.plugin[name];
                delete data.plugin[name];
            }
        }
    }
    
    /*
     * automatically apply plugins and suffix values
     */ 
    function _parseHTMLStyle(target, data){
        if(!data.plugin) data.plugin = {};
        if(!data.suffix) data.suffix = {};
        for(property in data) {
            if(HTMLPlugins[property] && !data.plugin[property]) {
                data.plugin[property] = HTMLPlugins[property];
            }
            if(HTMLSuffix[property] && !data.suffix[property]){
                data.suffix[property] = HTMLSuffix[property];
            }
        }
        _parseDataNaming(data);
    }
    
    function to(target, duration, data, hasFrom) {
        var appliedTarget;
        if(_isHTMLElement(target)){
            appliedTarget = target.style;
            _parseHTMLStyle(target, data)
        }else{
            appliedTarget = target;
            data.appliedTarget = target;
        }

        // implant an array of tweenIds to the target
        if (typeof target.tweenId === "undefined") {
            target.tweenId = _targetTweens.length;
            _targetTweens[target.tweenId] = [];
        }
        
        // if there is no user added delay value, use 0 
        var delay = 0;
        if(data.delay){
            delay = data.delay;
            delete data.delay;
        }
        
        // create a EKTween and add the tween to the list
        var ekTween = new EKTween(target, appliedTarget, duration, delay, data, hasFrom || false);
        _targetTweens[target.tweenId].push(ekTween);
        
        return ekTween;
        
    };

    function fromTo(target, duration, fromData, toData) {
        // create a EKTween and change the from values afterwards
        var ekTween = to(target, duration, toData, true);
        if(_isHTMLElement(target))_parseDataNaming(fromData);
        for (var i in fromData) ekTween.changeFrom(i, fromData[i]);
        ekTween.onLoop();
        return ekTween;
    };


    function killTweensOf(target) {
        // kill all the tweens of the target
        var tween = _targetTweens[target.tweenId];
        if (tween) {
            while (tween[0]) {
                tween[0].removeProperties();
                tween[0].kill();
                delete tween[0];
            }
            tween.splice(0, tween.length);
        }
    };
    
    function getTweens(target){
        // get an array of tweens
        return _targetTweens[target.tweenId];
    };
    
    function getTween(target, propertyName){
        
        if(HTMLStyleAlias[propertyName]) propertyName = HTMLStyleAlias[propertyName];
        
        // get a tween of a target by the propertyName
        var arr = getTweens(target);
        if(!arr) return null;
        var i = arr.length;
        while(i--) if(arr[i].properties[propertyName]) return arr[i];
        return null;
    };
    
    
    _init();
    
    app.HTMLPlugins = HTMLPlugins;
    app.HTMLSuffix = HTMLSuffix;
    app.HTMLPrefixedStyle = HTMLPrefixedStyle;
    app.HTMLStyleAlias = HTMLStyleAlias;
    
    app.getPropertyName = getPropertyName;
    app.to = to;
    app.fromTo = fromTo;
    app.killTweensOf = killTweensOf;
    app.getTweens = getTweens;
    app.getTween = getTween;
    
    return app;
    
})();


/*
 * EKTween Class
 */

function EKTween(target, appliedTarget, duration, delay, data, hasFrom){
    
    this._target = target;
    this._appliedTarget = appliedTarget;
    this._isStyle = target !== appliedTarget;
    this._data = data;
    this._pauseTime = 0;
    this._isPaused = false;
    this._isStarted = false;
    this._currentTime = new Date().getTime();
    this._startTime = delay * 1000 + this._currentTime;
    this._durationTime = duration * 1000;
    this._hasFrom = hasFrom;
    
    
    this.isFinished = false;
    this.ease = EKTweenFunc.easeOutCirc;
    this.tweens = null;
    this.onStart = null;
    this.onStartParams = null;
    this.onUpdate = null;
    this.onUpdateParams = null;
    this.onComplete = null;
    this.onCompleteParams = null;
    this.properties = {}; // {[to, from, prefix, suffix]}
    this.prefix = {};
    this.suffix = {};
    this.plugin = {};
    
    this.init();
    
}

EKTween.prototype = {
    
    init: function(){
        //---------- Collect the plugin data first ----------//
        for (var i in this._data.plugin) {
            this.plugin[i] = new this._data.plugin[i]();
        }
        
        //---------- Collect data ----------//
        for(i in this._data){
            switch (i) {
                case "ease":
                    this.ease = EKTweenFunc[this._data[i]];
                    break;
                case "prefix":
                case "suffix":
                case "onStart":
                case "onStartParams":
                case "onUpdate":
                case "onUpdateParams":
                case "onComplete":
                case "onCompleteParams":
                    this[i] = this._data[i];
                    break;
                case "plugin":
                    break;
                default:
                    this.properties[i] = [this.plugin[i] ? 1 : this._data[i], 0];
                    if(this.plugin[i])this.plugin[i].setTo(this._data[i], this._appliedTarget);
            }
    
        };
        
        //-------- REMOVE THE REPEATED ITEMS ---------//
        this.tweens = EKTweener.getTweens(this._target);
        if(this.tweens){
            if(this.tweens.length>0){
                i = this.tweens.length;
                while(i--){
                    if(this.tweens[i].removeProperties(this.properties)==0){
                        this.tweens[i].kill();
                        this.tweens.splice(i, 1);
                    };
                };
            };
        };
        
        delete this._data;
        
        function bind(fn, scope){
            return function(){
                return fn.apply(scope, Array.prototype.slice.call(arguments));
            };
        };
        
        this.onLoop = bind(this.onLoop, this);
        this.onLoop();
        
    },


    update: function(){
        if (this.onUpdate) {
            if (this.onUpdateParams) {
                this.onUpdate.apply(this, this.onUpdateParams);
            } else {
                this.onUpdate();
            }
        }
    },
    
    onLoop: function () {
        if(this.isFinished)return;
        requestAnimFrame(this.onLoop);
        this._currentTime = new Date().getTime();
        if (!this._isPaused) {
            if (this._currentTime >= this._startTime) {
                if (this._isStarted) {
                    if (this._currentTime >= this._durationTime + this._startTime) {
                        for(var i in this.properties){
                            this.setValue(this.properties[i][0], i, this.properties[i]);
                        }
                        this.update();
                        if (this.onComplete) {
                            if (this.onCompleteParams) {
                                this.onComplete.apply(this, this.onCompleteParams);
                            } else {
                                this.onComplete();
                            }
                        }
                        this.kill();
                        i = this.tweens.length;
                        while(i--){
                            if(this.tweens[i])if(this.tweens[i].isFinished) this.tweens.splice(i, 1);
                        }
                        return;
                    }else{
                        for(var i in this.properties){
                            this.setEaseValue(i, this.properties[i]);
                        }
                        this.update();
                    }
                }else{

                    if(!this._hasFrom) for(var i in this.properties){
                        this.setProperty(i, this.properties[i]);
                    }
                    
                    if (this.onStart) {
                        if (this.onStartParams) {
                            this.onStart.apply(this, this.onStartParams);
                        } else {
                            this.onStart();
                        }
                    }
                    this._isStarted = true;
                }
            };
        };
        
    },
    
    setProperty: function (propertyName, property) {
        var i;
        if (this.prefix) {
            if (this.prefix[propertyName]) {
                property[2] = this.prefix[propertyName];
            }
        };
        if (this.suffix) {
            if (this.suffix[propertyName]) {
                property[3] = this.suffix[propertyName];
            }
        };
        if(this._isStyle) {
            var currentValue = this.getCurrentPropertyValue(propertyName);
            if(this.plugin[propertyName]) {
                this.plugin[propertyName].setFrom(currentValue);
                property[1] = 0;
            }else{
                property[1] = parseFloat(currentValue);
            }
        }else{
            property[1] = this._appliedTarget[propertyName];
        }
        if(isNaN(property[1])) property[1] = 0;
    },

    setEaseValue: function (propertyName, property) {
        this.setValue(this.ease(this._currentTime - this._startTime < 0 ? 0 : this._currentTime - this._startTime, property[1], property[0] - property[1], this._durationTime), propertyName, property);
    },
    
    setValue: function (value, propertyName, property) {
        if (isNaN(value)) return;
        
        var pValue = this.plugin[propertyName] ? this.plugin[propertyName].setOutput(value) : value;

        if (property.length>2)
            this._appliedTarget[propertyName] = (property[2] ? property[2] : "") + pValue + (property[3] ? property[3] : "");
        else this._appliedTarget[propertyName] = pValue;
        
    },

    kill: function(){
        this.isFinished = true;
    },
    
    pause: function(){
        if(this._pauseTime==0) this._pauseTime = new Date().getTime();
        this._isPaused = true;
    },
    resume: function(){
        if(this._pauseTime>0) {
            var timeDiff = new Date().getTime() - this._pauseTime;
            this._currentTime += timeDiff;
            this._startTime += timeDiff;
            _pauseTime = new Date().getTime();
            this._pauseTime = 0;
        } 
        if (this._isPaused) this._isPaused = false;
    },
    removeProperties: function(propertyNames){
        var i;
        if(propertyNames){
            var size = 0;
            for(propertyName in this.properties){
                if(propertyName in propertyNames) delete this.properties[propertyName]; else size++;
            };
            return size;
        }else{
            for(propertyName in this.properties)delete this.properties[propertyName];
        }
        return 0;
    },
    changeFrom: function (propertyName, value) {
        if(this._isHTML)propertyName = getPropertyName(propertyName);
        this.setProperty(propertyName, this.properties[propertyName]);
        if (this.properties[propertyName]) {
            if (this.plugin[propertyName]) {
                this.plugin[propertyName].setFrom(value);
            } else {
                this.properties[propertyName][1] = value;
            }
        }
    },
    
    changeTo: function (propertyName, value) {
        if(this._isHTML)propertyName = getPropertyName(propertyName);
        if (this.properties[propertyName]) {
            if (this.plugin[propertyName]) {
                this.plugin[propertyName].setTo(value);
            } else {
                this.properties[propertyName][0] = value;
            }
        }
    },
    
    getCurrentPropertyValue: function(propertyName){
        var re = /[A-Z]/g;
        if (re.test(propertyName)) {
            propertyName = propertyName.replace(re, function() {return "-" + arguments[0].toLowerCase()});
            if(propertyName.indexOf("ms") == 0) propertyName = "-" + propertyName;
        }
        
        return window.getComputedStyle(this._target).getPropertyValue(propertyName);
    }
};




/*
 * Tween Functions
 * http://code.google.com/p/tweener/
 */

var EKTweenFunc = {
    linear: function(t, b, c, d) {
        return c*t/d + b;
    },      
    easeInQuad: function(t, b, c, d) {
        return c*(t/=d)*t + b;
    },      
    easeOutQuad: function(t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },      
    easeInOutQuad: function(t, b, c, d) {
        if((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 *((--t)*(t-2) - 1) + b;
    },      
    easeInCubic: function(t, b, c, d) {
        return c*(t/=d)*t*t + b;
    },      
    easeOutCubic: function(t, b, c, d) {
        return c*((t=t/d-1)*t*t + 1) + b;
    },      
    easeInOutCubic: function(t, b, c, d) {
        if((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    },      
    easeOutInCubic: function(t, b, c, d) {
        if(t < d/2) return EKTweenFunc.easeOutCubic(t*2, b, c/2, d);
        return EKTweenFunc.easeInCubic((t*2)-d, b+c/2, c/2, d);
    },      
    easeInQuart: function(t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
    },      
    easeOutQuart: function(t, b, c, d) {
        return -c *((t=t/d-1)*t*t*t - 1) + b;
    },      
    easeInOutQuart: function(t, b, c, d) {
        if((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 *((t-=2)*t*t*t - 2) + b;
    },      
    easeOutInQuart: function(t, b, c, d) {
        if(t < d/2) return EKTweenFunc.easeOutQuart(t*2, b, c/2, d);
        return EKTweenFunc.easeInQuart((t*2)-d, b+c/2, c/2, d);
    },      
    easeInQuint: function(t, b, c, d) {
        return c*(t/=d)*t*t*t*t + b;
    },      
    easeOutQuint: function(t, b, c, d) {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    },      
    easeInOutQuint: function(t, b, c, d) {
        if((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    },      
    easeOutInQuint: function(t, b, c, d) {
        if(t < d/2) return EKTweenFunc.easeOutQuint(t*2, b, c/2, d);
        return EKTweenFunc.easeInQuint((t*2)-d, b+c/2, c/2, d);
    },      
    easeInSine: function(t, b, c, d) {
        return -c * Math.cos(t/d *(Math.PI/2)) + c + b;
    },      
    easeOutSine: function(t, b, c, d) {
        return c * Math.sin(t/d *(Math.PI/2)) + b;
    },      
    easeInOutSine: function(t, b, c, d) {
        return -c/2 *(Math.cos(Math.PI*t/d) - 1) + b;
    },      
    easeOutInSine: function(t, b, c, d) {
        if(t < d/2) return EKTweenFunc.easeOutSine(t*2, b, c/2, d);
        return EKTweenFunc.easeInSine((t*2)-d, b+c/2, c/2, d);
    },      
    easeInExpo: function(t, b, c, d) {
        return(t==0) ? b : c * Math.pow(2, 10 *(t/d - 1)) + b - c * 0.001;
    },      
    easeOutExpo: function(t, b, c, d) {
        return(t==d) ? b+c : c * 1.001 *(-Math.pow(2, -10 * t/d) + 1) + b;
    },      
    easeInOutExpo: function(t, b, c, d) {
        if(t==0) return b;
        if(t==d) return b+c;
        if((t/=d/2) < 1) return c/2 * Math.pow(2, 10 *(t - 1)) + b - c * 0.0005;
        return c/2 * 1.0005 *(-Math.pow(2, -10 * --t) + 2) + b;
    },      
    easeOutInExpo: function(t, b, c, d) {
        if(t < d/2) return EKTweenFunc.easeOutExpo(t*2, b, c/2, d);
        return EKTweenFunc.easeInExpo((t*2)-d, b+c/2, c/2, d);
    },      
    easeInCirc: function(t, b, c, d) {
        return -c *(Math.sqrt(1 -(t/=d)*t) - 1) + b;
    },      
    easeOutCirc: function(t, b, c, d) {
        return c * Math.sqrt(1 -(t=t/d-1)*t) + b;
    },      
    easeInOutCirc: function(t, b, c, d) {
        if((t/=d/2) < 1) return -c/2 *(Math.sqrt(1 - t*t) - 1) + b;
        return c/2 *(Math.sqrt(1 -(t-=2)*t) + 1) + b;
    },      
    easeOutInCirc: function(t, b, c, d) {
        if(t < d/2) return EKTweenFunc.easeOutCirc(t*2, b, c/2, d);
        return EKTweenFunc.easeInCirc((t*2)-d, b+c/2, c/2, d);
    },      
    easeInElastic: function(t, b, c, d, a, p) {
        var s;
        if(t==0) return b;  if((t/=d)==1) return b+c;  if(!p) p=d*.3;
        if(!a || a < Math.abs(c)) { a=c; s=p/4; } else s = p/(2*Math.PI) * Math.asin(c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
    },      
    easeOutElastic: function(t, b, c, d, a, p) {
        var s;
        if(t==0) return b;  if((t/=d)==1) return b+c;  if(!p) p=d*.3;
        if(!a || a < Math.abs(c)) { a=c; s=p/4; } else s = p/(2*Math.PI) * Math.asin(c/a);
        return(a*Math.pow(2,-10*t) * Math.sin((t*d-s)*(2*Math.PI)/p ) + c + b);
    },      
    easeInOutElastic: function(t, b, c, d, a, p) {
        var s;
        if(t==0) return b;  if((t/=d/2)==2) return b+c;  if(!p) p=d*(.3*1.5);
        if(!a || a < Math.abs(c)) { a=c; s=p/4; }          else s = p/(2*Math.PI) * Math.asin(c/a);
        if(t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },      
    easeOutInElastic: function(t, b, c, d, a, p) {
        if(t < d/2) return EKTweenFunc.easeOutElastic(t*2, b, c/2, d, a, p);
        return EKTweenFunc.easeInElastic((t*2)-d, b+c/2, c/2, d, a, p);
    },      
    easeInBack: function(t, b, c, d, s) {
        if(s == undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },      
    easeOutBack: function(t, b, c, d, s) {
        if(s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },      
    easeInOutBack: function(t, b, c, d, s) {
        if(s == undefined) s = 1.70158;
        if((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },      
    easeOutInBack: function(t, b, c, d, s) {
        if(t < d/2) return EKTweenFunc.easeOutBack(t*2, b, c/2, d, s);
        return EKTweenFunc.easeInBack((t*2)-d, b+c/2, c/2, d, s);
    },      
    easeInBounce: function(t, b, c, d) {
        return c - EKTweenFunc.easeOutBounce(d-t, 0, c, d) + b;
    },      
    easeOutBounce: function(t, b, c, d) {
        if((t/=d) <(1/2.75)) {
                return c*(7.5625*t*t) + b;
        } else if(t <(2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if(t <(2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    },      
    easeInOutBounce: function(t, b, c, d) {
        if(t < d/2) return EKTweenFunc.easeInBounce(t*2, 0, c, d) * .5 + b;
        else return EKTweenFunc.easeOutBounce(t*2-d, 0, c, d) * .5 + c*.5 + b;
    },      
    easeOutInBounce: function(t, b, c, d) {
        if(t < d/2) return EKTweenFunc.easeOutBounce(t*2, b, c/2, d);
        return EKTweenFunc.easeInBounce((t*2)-d, b+c/2, c/2, d);
    }
};





