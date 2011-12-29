/**
*
* Version: 	0.2a
* Author:	Edan Kwan
* Contact: 	info@edankwan.com
* Website:	http://www.edankwan.com/
* Twitter:	@edankwan
*
* Copyright (c) 2011 Edan Kwan
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
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
    })();
}

var EKTweener = EKTweener || new function() {
    
    var _this = this;
    
    var _targetTweens = [];
    this.HTMLPlugins = {};
    this.HTMLSuffix = {
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
    
    var isHTMLElement = function(target){
        return typeof HTMLElement === "object" ? target instanceof HTMLElement :  typeof target === "object" && target.nodeType === 1 && typeof target.nodeName==="string";
    }
    
    
    this.to = function (target, duration, data) {

        if (isHTMLElement(target)){
            target.style.HTMLElement = target;
            target = target.style;
    
            for (var i in _this.HTMLPlugins) {
                if(!data.plugin) data.plugin = {};
                if(!data.suffix) data.suffix = {};
                for(i in data) {
                    if(_this.HTMLPlugins[i] && !data.plugin[i]) {
                        data.plugin[i] = _this.HTMLPlugins[i];
                    }else if(_this.HTMLSuffix[i] && !data.suffix[i]){
                        data.suffix[i] = _this.HTMLSuffix[i];
                    }
                }
            }
        }

        if (typeof target.tweenId == "undefined") {
            target.tweenId = _targetTweens.length;
            _targetTweens[target.tweenId] = [];
        }
        var delay = 0;
        if(data.delay){
            delay = data.delay;
            delete data.delay;
        }
        var ekTween = new EKTween(target, duration, delay, data);
        _targetTweens[target.tweenId].push(ekTween);
        return ekTween;
    };

    this.fromTo = function (target, duration, from, to) {
        var ekTween = _this.to(target, duration, to);
        for (var i in from) ekTween.changeFrom(i, from[i]);
        return ekTween;
    },

    this.killTweensOf = function (target) {
        var tween = _targetTweens[target.tweenId];
        if (tween) {
            while (tween[0]) {
                tween[0].removeProperties();
                tween[0].kill();
                delete tween[0];
            }
            tween.splice(0, tween.length);
        }
    },
    
    this.getTweens = function(target){
        var tmp = target
        if (isHTMLElement(tmp)) tmp = tmp.style;
        return _targetTweens[tmp.tweenId];
    }
    
    this.getTween = function(target, keyName){
        var arr = _this.getTweens(target);
        var i = arr.length;
        while(i--) if(arr[i].properties[keyName]) return arr[i];
        return null;
    }




    /*
     * EKTween Class
     */

    function EKTween(target, duration, delay, data){
        
        var _self = this;
        var _target = target;
        var _isPaused = false;
        var _isStarted = false;
        var _currentTime = new Date().getTime();
        var _startTime = delay * 1000 + _currentTime;
        var _durationTime = duration * 1000;
        
        this.isFinished = false;
        this.ease = EKTweenFunc.easeOutCirc;
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
    
    
        //---------- Collect the plugin data first ----------//
        for (var i in data.plugin) {
            this.plugin[i] = new data.plugin[i]();
        }
        
        //---------- Collect data ----------//
        for(i in data){
            switch (i) {
                case "ease":
                    this.ease = EKTweenFunc[data[i]];
                    break;
                case "prefix": case "suffix": case "onStart": case "onStartParams": case "onUpdate": case "onUpdateParams": case "onComplete": case "onCompleteParams":
                    this[i] = data[i];
                    break;
                case "plugin":
                    break;
                default:
                    this.properties[i] = [this.plugin[i] ? 1 : data[i], null, null, null];
                    if(this.plugin[i])_self.plugin[i].setTo(data[i], _target);
            }
    
        };
    
    
        //-------- REMOVE THE REPEATED ITEMS ---------//
        this.tweens = _this.getTweens(_target);
        if(this.tweens){
            if(this.tweens.length>0){
                var keyNames = [];
                i = this.tweens.length;
                while(i--){
                    if(this.tweens[i].removeProperties(_self.properties)==0){
                        this.tweens[i].kill();
                        this.tweens.splice(i, 1);
                    };
                };
            };
        };
    
        var update = function(){
            if (_self.onUpdate) {
                if (_self.onUpdateParams) {
                    _self.onUpdate.apply(_self._self, _self.onUpdateParams);
                } else {
                    _self.onUpdate();
                }
            }
        };
        var onLoop = function () {
            if(_self.isFinished)return;
            requestAnimFrame(onLoop);
            _currentTime = new Date().getTime();
            if (!_isPaused) {
                if (_currentTime >= _startTime) {
                    if (_isStarted) {
                        if (_currentTime >= _durationTime + _startTime) {
                            for(var i in _self.properties){
                                setValue(_self.properties[i][0], i, _self.properties[i]);
                            }
                            update();
                            if (_self.onComplete) {
                                if (_self.onCompleteParams) {
                                    _self.onComplete.apply(_self, _self.onCompleteParams);
                                } else {
                                    _self.onComplete();
                                }
                            }
                            _self.kill();
                            i = _self.tweens.length;
                            while(i--){
                                if(_self.tweens[i])if(_self.tweens[i].isFinished) _self.tweens.splice(i, 1);
                            }
                            return;
                        }else{
                            for(var i in _self.properties){
                                setEaseValue(i, _self.properties[i]);
                            }
                            update();
                        }
                    }else{
    
                        for(var i in _self.properties){
                            setProperty(i, _self.properties[i]);
                        }
                        
                           if (_self.onStart) {
                               if (_self.onStartParams) {
                                   _self.onStart.apply(_self, _self.onStartParams);
                               } else {
                                   _self.onStart();
                               }
                           }
                        _isStarted = true;
                    }
                };
            };
            
        };
        var setProperty = function (keyName, property) {
            var i;
            if (_self.prefix) {
                if (_self.prefix[keyName]) {
                    property[2] = _self.prefix[keyName];
                }
            };
            if (_self.suffix) {
                if (_self.suffix[keyName]) {
                    property[3] = _self.suffix[keyName];
                }
            };
            property[1] = _self.plugin[keyName] ? 0 : parseFloat(_target[keyName]);
            if(isNaN(property[1])) property[1] = 0;
            if(_self.plugin[keyName]) _self.plugin[keyName].setFrom(_target[keyName]);
        };
    
        var setEaseValue = function (keyName, property) {
            setValue(_self.ease(_currentTime - _startTime < 0 ? 0 : _currentTime - _startTime, property[1], property[0] - property[1], _durationTime), keyName, property);
        };
        var setValue = function (value, keyName, property) {
            if (isNaN(value)) return;
            
            var pValue = _self.plugin[keyName] ? _self.plugin[keyName].setOutput(value) : value;
    
            if (property[2] || property[3])
                _target[keyName] = (property[2] ? property[2] : "") + pValue + (property[3] ? property[3] : "");
            else _target[keyName] = pValue;
            
        };
    
        this.kill = function(){
            _self.isFinished = true;
        };
        this.pause = function(){
            _isPaused = true;
        };
        this.resume = function(){
            if (_isPaused) _isPaused = false;
        };
        this.removeProperties = function(keyNames){
            var i;
            if(keyNames){
                var size = 0;
                for(i in _self.properties){
                    if(i in keyNames) delete _self.properties[i]; else size++;
                };
                return size;
            }else{
                for(i in _self.properties)delete _self.properties[i];
            }
            return 0;
        };
        this.changeFrom = function (keyName, value) {
            if(!_isStarted)setProperty(keyName, _self.properties[keyName]);
            if (_self.properties[keyName]) {
                if (_self.plugin[keyName]) {
                    _self.plugin[keyName].setFrom(value);
                } else {
                    _self.properties[keyName][1] = value;
                }
            }
            setEaseValue(keyName, _self.properties[keyName]);
        };
        this.changeTo = function (keyName, value) {
            if (_self.properties[keyName]) {
                if (_self.plugin[keyName]) {
                    _self.plugin[keyName].setTo(value);
                } else {
                    _self.properties[keyName][0] = value;
                }
            }
        };
        onLoop();
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
    
}