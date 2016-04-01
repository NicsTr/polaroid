
var display_alert = function(cls) {
    console.log(cls);
    $("#alert").addClass(cls);
    $("#alert").addClass("active");
    setTimeout(function() {
        $("#alert").removeClass("active");    
    }, 1000);
    setTimeout(function() {
        $("#alert").removeClass(cls);
    }, 1500);
}

