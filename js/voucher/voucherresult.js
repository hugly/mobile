/**
 * Created by hulgy on 16/9/7.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'voucherresult',
            phone:$.getUrlParam('phone'),
            price:$.getUrlParam('price')
        });
        avalon.scan();
    });

})();