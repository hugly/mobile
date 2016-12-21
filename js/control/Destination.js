$(function () {

    window.items=[];
    var list = $('.common_head_list');
    $('#right_list').click(function () {
        if (list.attr('name') == 'tap') {
            list.css({right: "-4rem"});
            list.attr('name', '')
        } else {
            list.css({right: "0"});
            list.attr('name', 'tap')
        }


    });


    $.fn.sliderNav = function (options) {
        var defaults = {
            items:window.items,
            debug: false,
            height: null,
            arrows: true
        };
        var opts = $.extend(defaults, options);
        var o = $.meta ? $.extend({}, opts, $$.data()) : opts;
        var slider = $(this);
        $(slider).addClass('slider');

        $('.slider-content li', slider).addClass('selected');
        $(slider).append('<div class="slider-nav"><ul></ul></div>');
        for (var i in o.items) $('.slider-nav ul', slider).append("<li><a alt='#" + o.items[i] + "'>" + o.items[i] + "</a></li>");
        var height = $('.slider-nav', slider).height();
        if (o.height) height = o.height;
        $('.slider-content, .slider-nav', slider).css('height', height);
        if (o.debug) $(slider).append('<div id="debug">Scroll Offset: <span>0</span></div>');
        $('.slider-nav a', slider).mouseover(function (event) {
            var target = $(this).attr('alt');
            var cOffset = $('.slider-content', slider).offset().top;
            var tOffset = $('.slider-content ' + target, slider).offset().top;
            var height = $('.slider-nav', slider).height();
            if (o.height) height = o.height;
            var pScroll = (tOffset - cOffset + 70) - height / 8;
            //$('.slider-content li', slider).removeClass('selected');
            //$(target).addClass('selected');
            pScroll+=$('.slider-content', slider).scrollTop();
            $('.slider-content', slider).scrollTop(pScroll);
            //$('.slider-content', slider).animate({scrollTop: pScroll});
            if (o.debug) $('#debug span', slider).html(tOffset);
        });

    };

});



