function EKTweenerColorPlugin () {

    var _from = [0, 0, 0];
    var _to = [0, 0, 0];

    this.setFrom = function (from) {
        _setRGB(_from, from);
    }

    this.setTo = function (to) {
        _setRGB(_to, to);
    }

    this.setOutput = function (value) {
        return "#" + _getHex(_from[0], _to[0], value) + _getHex(_from[1], _to[1], value) + _getHex(_from[2], _to[2], value);
    }

    var _getHex = function (from, to, ratio) {
        var tmp = (from + (to - from) * ratio >> 0).toString(16);
        if (tmp.length == 0) tmp = "00";
        if (tmp.length == 1) tmp = "0" + tmp;
        return tmp;
    }

    var _setRGB = function (arr, value) {
        if (value.substr(0, 1) == "#") {
            if (value.length == 4) {
                arr[0] = parseInt(value.substr(1, 1), 16) * 17;
                arr[1] = parseInt(value.substr(2, 1), 16) * 17;
                arr[2] = parseInt(value.substr(3, 1), 16) * 17;
            } else if (value.length == 7) {
                arr[0] = parseInt(value.substr(1, 2), 16);
                arr[1] = parseInt(value.substr(3, 2), 16);
                arr[2] = parseInt(value.substr(5, 2), 16);
            }
        } else {
            var rgb = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(value);
            arr[0] = parseInt(rgb[2]);
            arr[1] = parseInt(rgb[3]);
            arr[2] = parseInt(rgb[4]);
        }
    }

}

if(EKTweener) {
    EKTweener.HTMLPlugins.backgroundColor =
    EKTweener.HTMLPlugins.color =
    EKTweenerColorPlugin;
}