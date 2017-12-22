

$(document).ready(function() {
    $("img", "#gallery-carousel").each(function() {
        $(this).attr("src", $(this).attr("data-src"));
    });
    $("img").click(function(e) {
        e.preventDefault();
        $("li", "#gallery-carousel").removeClass("active");
        $(".carousel-item", "#gallery-carousel").removeClass("active");
        $("li[data-img=" + $(this).attr("data-id") + "]", "#gallery-carousel").addClass("active");
        $(".carousel-item[data-img=" + $(this).attr("data-id") + "]", "#gallery-carousel").addClass("active");
        $("#gallery-carousel").removeClass("hidden");
        $("#gallery").addClass("hidden");
    });
});
