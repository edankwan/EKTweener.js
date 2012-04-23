ui = (function(){
    
    var app = {
    }
    
    
    $(document).ready(function(){
        $.ajax({
            url : "menu.html",
            success : function (data) {
                $("#menu").html(data);
                $("body").append($("#ribbon"));
            },
            error: function(){
                $("#menu").remove();
            }
        });
        
    })
    
    return app;
    
})();

