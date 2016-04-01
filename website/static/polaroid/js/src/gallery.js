
var arrange_line = function(start, w) {

}

var arrange_gallery = function() {
    var w = $("#gallery").width() - 4;
    console.log(w);
    var ratios = new Array();
    $("#gallery > a > img").each(function() {
        console.log($(this).width());
        console.log($(this).outerWidth());
        console.log($(this).prop("naturalWidth"));
        console.log($(this).height());
        console.log($(this).outerHeight());
        var r = ($(this).prop("naturalWidth")) / $(this).prop("naturalHeight");
        ratios.push(r);
    });
    console.log(ratios);
    var n_img = 0;
    while (n_img < $("#gallery > a > img").length) {
        var first = n_img;
        var h = 0;
        var sum_r = 0;
        while ((h > 600 || h < 100) && n_img < $("#gallery > a > img").length) {
            sum_r += ratios[n_img];
            n_img += 1;
            h = (w - (n_img - first) * 3) / sum_r;
        }
        if (h > 600 || h < 100) {
            h = 600;
        }
        for (var i = first; i < n_img; i++) {
            $("#gallery > a > img").get(i).height = h;
        }
    }
}

$(window).on("load", arrange_gallery);

$(window).resize(arrange_gallery);
