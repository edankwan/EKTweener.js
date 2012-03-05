ui = (function(){
    var app = {
        CANVAS_WIDTH: 580,
        CANVAS_HEIGHT: 380,
        IMG_WIDTH: 128,
        IMG_HEIGHT:128
    }
    
    var _viewSource;
    
    $(document).ready(function(){
        _viewSource = $("#view-source");
        _viewSource.click(function(){
            window.open("view-source:" + window.location.href, "view-source", "width=720,height: 580");
        });
    })
    
    return app;
    
})();

