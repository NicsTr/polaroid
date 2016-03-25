
    var like = function(gid) {
        var liked = Cookies.get("liked").split(";");
        for (var i = 0; i < liked.length; i++) {
            if (liked[i] === gid)
                return;
        }
        $("#like").addClass("liked");
        Cookies.set("liked", Cookies.get("liked") + gid + ";");
    }

    var unlike = function(gid) {
        var liked = Cookies.get("liked").split(";");
        var liked_str = "";
        for (var i = 0; i < liked.length; i++) {
            if (liked[i] != gid && liked[i] != "")
                liked_str += liked[i] + ";";
        }
        if (liked_str === ";")
            liked_str = "";
        $("#like").removeClass("liked");
        Cookies.set("liked", liked_str);
    }

    var is_liked = function(gid) {
        var liked = Cookies.get("liked").split(";");
        for (var i = 0; i < liked.length; i++) {
            if (liked[i] === gid) {
                return true;
            }
        }
        return false;
    }

    var toggle_like = function(gid) {
        if (is_liked(gid))
            unlike(gid);
        else
            like(gid);
    }

    $(document).ready(function() {
        if (Cookies.get("liked") == undefined)
            Cookies.set("liked", "");
        $("#like").click(function() {
            toggle_like($("#gid").val());
        });

        if (is_liked($("#gid").val())) {
            $("#like").addClass("liked");
        }
    });
