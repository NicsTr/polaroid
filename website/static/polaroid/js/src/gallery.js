
var max = function(a) {
    var m = a[0];
    for (var i = 1; i < a.length; i++)
        if (m < a[i])
            m = a[i];
    return m;
}

var arrange_line = function(start, w) {

}

var linear_tab = function(seq, k) {
    var n = seq.length;
    var t = [];
    var sub_t = [];
    for (var j = 0; j < k; j++) {
        sub_t.push(0);
    }
    for (var i = 0; i < n; i++) {
        t.push(sub_t.slice());
    }
    sub_t.pop();
    s = [];
    for (var i = 0; i < n - 1; i++) {
        s.push(sub_t.slice());
    }
    for (var i = 0; i < n; i++) {
        if (i > 0)
            t[i][0] = seq[i] + (t[i - 1][0]);
        else
            t[i][0] = seq[i];
    }
    for (var i = 0; i < k; i++) {
        t[0][j] = seq[0];
    }
    for (var i = 1; i < n; i++) {
        for (var j = 1; j < k; j++) {
            var min_it;
            var min_idx = -1;
            for (var l = 0; l < i; l++) {
                it = max([t[l][j-1], t[i][0] - t[l][0]]);
                if (min_idx == -1 || it < min_it) {
                    min_it = it;
                    min_idx = l;
                }
            }
            t[i][j] = min_it;
            s[i-1][j-1] = min_idx;
        }
    }
    return [t, s];
}

var linear_partition = function(seq, k) {
    if (k <= 0) 
        return [];
    var n = seq.length - 1;
    if (k > n) {
        return seq.map(function(x) { return [x]; });
    }
    ts = linear_tab(seq, k);
    t = ts[0];
    s = ts[1];
    k -= 2;
    ans = [];
    while (k >= 0) {
        var tab = [];
        for (var i = s[n-1][k] + 1; i < n + 1; i++) {
            tab.push(seq[i]);
        }
        ans = [tab].concat(ans);
        n = s[n-1][k];
        k -= 1;
    }
    return [seq.slice(0, n+1)].concat(ans);
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
    var ideal_h = window.innerHeight / 2.3;
    var sum_width = 0;
    var ratio = [];
    $("a > img", gallery).each(function() {
        var r = ($(this).prop("naturalWidth")) / $(this).prop("naturalHeight");
        ratio.push(r);
        sum_width += (r * ideal_h);
    });
    var partition = linear_partition(ratio, Math.round(sum_width/$(window).width()));
    var sum_ratio = 0;
    var img_idx = 0;
    for (var i = 0; i < partition.length; i++) {
        sum_ratio = 0;
        for (var j = 0; j < partition[i].length; j++) {
            sum_ratio += ratio[img_idx + j];
        }
        for (var j = 0; j < partition[i].length; j++) {
            var img = $("a > img", gallery).get(img_idx);
            img.width = ($(window).width() - 10 - 4*partition[i].length) / sum_ratio * ratio[img_idx];
            img.height = ($(window).width() - 10 - 4*partition[i].length) / sum_ratio;
            img_idx += 1;
        }
    }
    return;
    for (var i = 0; i < partition.length; i++) {
        var img = $("a > img", gallery).get(i);
        w_row += $("a > img", gallery).get(i).width + 3;
    }
    return;
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

