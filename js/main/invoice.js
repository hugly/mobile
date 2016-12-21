/**
 * Created by hulgy on 16/6/10.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"ways",
            invoiceName: decodeURI($.getUrlParam('invoiceName')) || '',
            //支付方式
            //invoiceType: parseInt($.getUrlParam('invoiceType')) || 1,
            //发票类型
            invoiceDis: parseInt($.getUrlParam('invoiceDis')) || 1,
            //将url参数转化为arr
            urlData:transUrl2List(),
            //url参数数据模型
            searchData:'',
            //改变支付方式
            changpay:function(){
                var code=parseInt(avalon(this).data('code'));

                vm.paytype=code;

                var json={
                    'paytype':code
                };

                vm.urlData=jsonInList(json,vm.urlData);
                vm.searchData=transList2Url(vm.urlData.$model);
            },
            //改变取件方式
            changdis:function(){
                var code=parseInt(avalon(this).data('code'));

                vm.invoiceDis=code;

                var json={
                    'invoiceDis':code
                };

                vm.urlData=jsonInList(json,vm.urlData);
                vm.searchData=transList2Url(vm.urlData.$model);
            },
            changeNameFn:function(){
                var json={
                    'invoiceName':vm.invoiceName
                };

                vm.urlData=jsonInList(json,vm.urlData);
                vm.searchData=transList2Url(vm.urlData.$model);
            }
        });
        vm.urlData=jsonInList({'invoiceName':vm.invoiceName},vm.urlData);
        vm.urlData=jsonInList({'invoiceDis':vm.invoiceDis},vm.urlData);
        vm.searchData=transList2Url(vm.urlData);
        avalon.scan();
    });
})();