function EKTweenerTransform3dPlugin () {
                
    var _from = [0,0,0,0,0,0,0,0,0,0,0,0];
    var _to = [0,0,0,0,0,0,0,0,0,0,0,0];
    
    var RAD_TO_DEG = 180 / Math.PI;
    
    var _hasTranslate = false;
    var _hasRotate = false;
    var _hasScale = false;

    this.setFrom = function (from) {
        _setValues(_from, from);
    }

    this.setTo = function (to) {
        _setValues(_to, to);
    }

    this.setOutput = function (value) {
        return "matrix3d(" + 
        (_from[0] + (_to[0] - _from[0])*value) + ","+
        (_from[1] + (_to[1] - _from[1])*value) + ","+
        (_from[2] + (_to[2] - _from[2])*value) + ","+
        "0,"+
        (_from[3] + (_to[3] - _from[3])*value) + ","+
        (_from[4] + (_to[4] - _from[4])*value) + ","+
        (_from[5] + (_to[5] - _from[5])*value) + ","+
        "0,"+
        (_from[6] + (_to[6] - _from[6])*value) + ","+
        (_from[7] + (_to[7] - _from[7])*value) + ","+
        (_from[8] + (_to[8] - _from[8])*value) + ","+
        "0,"+
        (_from[9] + (_to[9] - _from[9])*value) + ","+
        (_from[10] + (_to[10] - _from[10])*value) + ","+
        (_from[11] + (_to[11] - _from[11])*value) + ","+
        "1)";
        
    }

    var _setValues = function (arr, value) {
        var cssText = EKTweener.getStyle("transform", value);
        if(cssText.indexOf("matrix3d")>-1){
            var tmp = (cssText.substring(9, cssText.length-1)).split(",");
            for(var i= 0, j = 0; i<15;i++){
                if(i==3 || i==7 ||i ==11) {
                }else{
                    arr[j] = parseFloat(tmp[i]);
                    j++;
                }
            }
        }else if(cssText.indexOf("matrix")>-1){
            var tmp = (cssText.substring(7, cssText.length-1)).split(",");
            arr[0] = parseFloat(tmp[0]);
            arr[1] = parseFloat(tmp[1]);
            arr[2] = 0;
            arr[3] = parseFloat(tmp[2]);
            arr[4] = parseFloat(tmp[3]);
            arr[5] = 0;
            arr[6] = 0;
            arr[7] = 0;
            arr[8] = 1;
            arr[9] = parseFloat(tmp[4]);
            arr[10] = parseFloat(tmp[5]);
            arr[11] = 0;
        }else{
            arr[0] = arr[4] = arr[8] = arr[11] = 1;
            arr[1] = arr[2] = arr[3] = arr[5] = arr[6] = arr[7] = arr[9] = arr[10] = 0; 
        }
    }
}

if(EKTweener) {
	EKTweener.HTMLStyleAlias.transform3d = "transform";
	EKTweener.HTMLPrefixedStyle.push("transform");
	EKTweener.HTMLPlugins.transform3d = EKTweenerTransform3dPlugin;
}









