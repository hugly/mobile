/**
 * Created by hulgy on 15/11/2016.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"couponsdetail",
            no:$.getUrlParam('no'),
            price:$.getUrlParam('price'),
            MinPrice:$.getUrlParam('MinPrice'),
            startTime:decodeURIComponent($.getUrlParam('startTime')),
            endTime:decodeURIComponent($.getUrlParam('endTime'))
        });
        avalon.scan();
    });
})();