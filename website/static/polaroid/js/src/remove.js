
var remove = function(el) {
    if ($(el).parent().parent().parent().hasClass("liked-galleries")) {
        unlike($(el).attr("title"));
        $(el).remove();
    } else if ($(el).hasClass("img")) {
        $.ajax({url: "/rm/img/" + $("img", el).attr("data-id")}).complete(function(xhr) {
            if (xhr.responseText == "OK") {
                $(el).remove();
                arrange_gallery();
                display_alert("removed");
            }
        });
    } else {
        $.ajax({url: "/rm/gl/" + $(el).attr("title")}).complete(function(xhr) {
            if (xhr.responseText == "OK") {
                $(el).parent().remove();
            }
        });
    }
}

var activate_rm = function() {
    $(".rm-container a").click(function(e) {
        if ($("#remove").hasClass("removing")) {
            e.preventDefault();
            remove(this);
        }
    });
}

$(document).ready(function() {
    $("#remove").click(function() {
        $("#remove").toggleClass("removing");
        $(".rm-container").toggleClass("removing");
    });
    activate_rm();
});
