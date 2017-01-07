

var set_name = function() {
    $.post("/name/set/" + $("#gid").val(), {name: $("#naming").val()}, function(data) {
        if (data == "OK") {
            display_alert("named");
        }
    });
}

var get_name = function(el) {
    $.ajax("name/" + $(el).attr("data-id")).complete(function(xhr) {
        if (xhr.responseText != "" && xhr.responseText != "None") {
            var data = xhr.responseText.split(";");
            var gid = data[0];
            var name = data[1];
            $("a", "." + gid).attr("title", name);
        }
    });
}

$(document).ready(function() {
    $("#naming").change(function() {
        set_name();
    });
});
