/**
 * Created by hulgy on 15/3/30.
 */
(function(){
    var rootHtml=$(':root');
    var rootResize=function(){
        var fontSize=$(window).width()/16;
        if(fontSize>67.6) fontSize=67.5;
        rootHtml.css('font-size',fontSize);
    }
    rootResize();
    $(window).resize(function(){
        rootResize();
    });

})();
