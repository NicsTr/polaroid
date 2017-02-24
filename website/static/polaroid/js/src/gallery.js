
var arrange_line = function(start, w) {

}

var arrange_gallery = function(gallery, h_min, h_max) {
    var w = $( gallery ).width() - 4;
    var ratios = new Array();
    $("a > img", gallery).each(function() {
        var r = ($(this).prop("naturalWidth")) / $(this).prop("naturalHeight");
        ratios.push(r);
    });
    var n_img = 0;
    var w_row;
    while (n_img < $("a > img", gallery).length) {
        var first = n_img;
        var h = 0;
        var sum_r = 0;
        while ((h > h_max || h < h_min) && n_img < $("a > img", gallery).length) {
            sum_r += ratios[n_img];
            n_img += 1;
            h = (w - (n_img - first) * 3) / sum_r;
        }
        if (h > h_max || h < h_min) {
            h = 600;
            best_h = 600;
            best_gcd = 0;
            do {
                h--;
                w_row = 0;
                for (var i = first; i < n_img; i++) {
                    $("a > img", gallery).get(i).height = h;
                    w_row += $("a > img", gallery).get(i).width + 3;
                }
                g = gcd(w - w_row - 6, h);
                if (g > best_gcd && g < h / 6) {
                    best_h = h; 
                    best_gcd = g;
                }
            } while (h > 100);
            h = best_h;
        }
        w_row = 0;
        for (var i = first; i < n_img; i++) {
            $("a > img", gallery).get(i).height = h;
            w_row += $("a > img", gallery).get(i).width + 3;
        }
    }
    return [h, w - w_row - 6];
}

function gcd(a, b) {
    a = Math.round(a);
    b = Math.round(b);
    if (a < b) {
        r = a;
        a = b;
        b = r;
    }
      return b ? gcd(b, a % b) : Math.abs(a);
}

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

var arrange_all = function() {
    $("#padding").html();
    var h_min = window.innerHeight / 10.0;
    var h_max = window.innerHeight / 2.0;
    var [h, w_pad] = arrange_gallery($("#gallery"), h_min, h_max);
    /* Compute gap on last row */
    if (w_pad > 0) {
        $("#padding").width(w_pad);
        $("#padding").height(h);
        square = gcd(h, w_pad);
        /* Number of images to put */
        var nb_img = (h / square) * (w_pad / square);
        for (i = 0; i < nb_img; i++) {
            var img = choose($("a > img", "#gallery"));
            var new_img = $(img).clone();
            if (i < w_pad / square / 2 && false) {
                new_img.get(0).height = 2*square;
                new_img.get(0).width = 2*square;
            } else {
                new_img.get(0).height = square;
                new_img.get(0).width = square;
            } 
            new_img.addClass("square");
            $("#padding").append(new_img);
        }
    }
}

$(window).on("load", arrange_all);

$(window).resize(arrange_all);

