function EKTweenerOpacityPlugin () {
    
    var _from;
    var _to;
    var _target;
    
    this.setFrom = function (from) {
        _from = from === "" ? 1: parseFloat(from);
    }

    this.setTo = function (to, target) {
        _to = to;
        if(target) _target = target;
    }

    this.setOutput = (typeof document.body.style.opacity === "undefined") ?
        function (value) {
            _target.filter = "alpha(opacity=" + ((_from + (_to - _from) * value) * 100) + ")";
            return 1;
        }:
        function (value) {
            return _from + (_to - _from) * value;
        }
}

if(EKTweener)EKTweener.HTMLPlugins.opacity = EKTweenerOpacityPlugin;