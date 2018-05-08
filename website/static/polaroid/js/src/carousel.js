
var enter_carousel = function(el) {
    $("li", "#gallery-carousel").removeClass("active");
    $(".carousel-item", "#gallery-carousel").removeClass("active");
    $("li[data-img=" + $(el).attr("data-id") + "]", "#gallery-carousel").addClass("active");
    $(".carousel-item[data-img=" + $(el).attr("data-id") + "]", "#gallery-carousel").addClass("active");
    $("#gallery-carousel").removeClass("hidden");
    $("#gallery").addClass("hidden");
};

var exit_carousel = function() {
    $("#gallery-carousel").addClass("hidden");
    $("#gallery").removeClass("hidden");
}

$(document).ready(function() {
    $("img", "#gallery-carousel").each(function() {
        $(this).attr("src", $(this).attr("data-src"));
    });
    $("img").click(function(e) {
        e.preventDefault();
        if ($("#gallery").hasClass("action-in-progress"))
            return;
        if ($("#gallery").hasClass("hidden")) {
            exit_carousel();
        } else {
            enter_carousel(this);
        }
    });
});
