ui = (function(){
    
    var app = {
    }
    
    
    $(document).ready(function(){
        $.ajax({
            url : "menu.html",
            success : function (data) {
                $("#menu").html(data);
            },
            error: function(){
                $("#menu").remove();
            }
        });
        
    })
    
    return app;
    
})();

