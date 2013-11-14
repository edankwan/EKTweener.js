function EKTweenerOpacityPlugin () {

    var _from;
    var _to;

    this.setFrom  = function (from) {
        if(!from){
            _from = 1;
            return;
        }
        if(typeof from == 'number'){
            _from = parseFloat(from);
            return;
        }
        var index = from.indexOf('alpha');
        if(index>-1){
            _from = parseFloat(from.slice(from.indexOf('=', index)+1)) / 100;
        }else{
            _from = 1;
        }
    }

    this.setTo = function (to) {
        _to = to;
    }

    this.setOutput = function (value) {
        var opacity = _from + (_to - _from) * value;
        return 'alpha(opacity=' + ( opacity === 1 ? 'none' : opacity * 100) + ')';
    }
};
EKTweenerOpacityPlugin.hasOpacity = (function(){
    var testedElement = document.createElement('div');
    return 'opacity' in testedElement.style;
})();

if(EKTweener){
    if(!EKTweenerOpacityPlugin.hasOpacity) {
        EKTweener.HTMLStyleAlias.opacity = 'filter';
        EKTweener.HTMLPlugins.opacity = EKTweenerOpacityPlugin;
    }
}
