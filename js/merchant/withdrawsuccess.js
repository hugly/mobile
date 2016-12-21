/**
 * Created by hulgy on 16/8/24.
 */

(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'withdrawsuccess',
            bankname: decodeURIComponent($.getUrlParam('bankname')),
            cardno:$.getUrlParam('cardno').substring($.getUrlParam('cardno').length-4),
            balance:$.getUrlParam('balance'),
            FeePercent:$.getUrlParam('FeePercent')
        });
        avalon.scan();
    });

})();