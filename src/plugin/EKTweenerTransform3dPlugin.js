function EKTweenerTransform3dPlugin () {
                
    var _from = [0,0,0,0,0,0,0,0,0,0];// tx, ty, tz, rx, ry, rz,sx, sy, sz
    var _to = [0,0,0,0,0,0,0,0,0,0];
    
    var RAD_TO_DEG = 180 / Math.PI;
    
    var _hasTranslate = false;
    var _hasRotate = false;
    var _hasScale = false;

    this.setFrom = function (from) {
        _getValues(_from, from);
    }

    this.setTo = function (to) {
        _getValues(_to, to);
    }

    this.setOutput = function (value) {
        return (_hasTranslate ? "translate3d("+_returnStyleText(0,value)+"px,"+_returnStyleText(1,value)+"px,"+_returnStyleText(1,value)+"px) ":"") +
               (_hasRotate ? "rotate3d("+_returnStyleText(3,value)+","+_returnStyleText(4,value)+","+_returnStyleText(5,value)+","+_returnStyleText(6,value)+"deg) ":"") +
               (_hasScale ? "scale3d("+_returnStyleText(7,value)+","+_returnStyleText(8,value)+","+_returnStyleText(9,value)+") ":"");
    }
    
    function _returnStyleText(i, value){
        return _from[i] + (_to[i] - _from[i])*value;
    }
    
    function _getValuesFromStyle(style, itemName){
        var i;
        if((i = style.indexOf(itemName+"("))>-1){
            return style.substring(i + itemName.length + 1, style.indexOf(")", i)).split(",");
        }
        return null;
    }

    var _getValues = function (arr, value) {
        var style = _getValuesFromStyle(value, "translate3d");
        if(style){
            arr[0] = parseFloat(style[0]);
            arr[1] = parseFloat(style[1]);
            arr[2] = parseFloat(style[2]);
            _hasTranslate = true;
        }
        style = _getValuesFromStyle(value, "rotate3d");
        if(style){
            arr[3] = parseFloat(style[0]);
            arr[4] = parseFloat(style[1]);
            arr[5] = parseFloat(style[2]);
            var sum = arr[3] + arr[4] + arr[5];
            if(sum==0) sum = 1;
            arr[3]/=sum;
            arr[4]/=sum;
            arr[5]/=sum;
            arr[6] = parseFloat(style[3]) * (style[3].substr(1,3)=="rad" ? RAD_TO_DEG : 1);
            _hasRotate = true;
        }
        style = _getValuesFromStyle(value, "scale3d");
        if(style){
            arr[7] = parseFloat(style[0]);
            arr[8] = parseFloat(style[1]);
            arr[9] = parseFloat(style[2]);
            _hasScale = true;
        }
    }

}
if(EKTweener) {
	EKTweener.HTMLStyleAlias.transform3d = "transform";
	EKTweener.HTMLPrefixedStyle.push("transform");
	EKTweener.HTMLPlugins.transform3d = EKTweenerTransform3dPlugin;
}