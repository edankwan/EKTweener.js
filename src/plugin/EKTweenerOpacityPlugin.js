function EKTweenerOpacityPlugin () {
    
    var _from;
    var _to;
    var _style;
    
    this.setFrom  = function (from) {
    	var index = from.indexOf("alpha");
    	if(index>-1){
    		_from = parseFloat(from.slice(from.indexOf("=", index)+1)) / 100;
    	}else{
    		_from = 1;
    	}
    }

    this.setTo = function (to) {
        _to = to;
    }

    this.setOutput = function (value) {
        return "alpha(opacity=" + ((_from + (_to - _from) * value) * 100) + ")";
    }
};
EKTweenerOpacityPlugin.hasOpacity = (function(){
	var testedElement = document.createElement("div");
	return "opacity" in testedElement.style;
})();

if(EKTweener){
	if(!EKTweenerOpacityPlugin.hasOpacity) {
		EKTweener.HTMLStyleAlias.opacity = "filter";
		EKTweener.HTMLPlugins.opacity = EKTweenerOpacityPlugin;
	}
}