
var set_cover = function(el) {
    $.ajax("/cover/set/" + $("#gid").val() + "/" + $("img", el).attr("data-id"));
    display_alert("pinned");
}

var get_cover = function(el) {
    $.ajax("cover/" + $(el).attr("data-id")).complete(function(xhr) {
        if (xhr.responseText != "") {
            var data = xhr.responseText.split(";");
            var gid = data[0];
            var mid = data[1];
            $("img", "." + gid).attr("src", "img/" + gid + "/" + mid + ".jpg");
        }
    });
}

var activate_pin = function() {
    $(".pinning a").click(function(e) {
        e.preventDefault();
        set_cover(this);
    });
}

$(document).ready(function() {
    $("#pin").click(function() {
        $("#pin").toggleClass("pinning");
        $("#gallery").toggleClass("pinning");
        activate_pin();
    });
});
