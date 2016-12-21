/**
 * Created by hulgy on 16/9/4.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"coupons",
            index:0,
            //版本号
            version:0,
            //优惠券数据
            couponsData:[],
            loadingImgShow:true,
            nowPageIndex:1,
            maxPageNum:0,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getOutCou();
                });
            },
            //获取已使用的优惠券
            getOutCou:function(){
                vm.loadingImgShow = true;
                vm.couponsData = [];

                jsonp(host+'/jsonp/CashCounpon_GetCanUse_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    vm.loadingImgShow = false;
                    vm.couponsData=rs.Data;
                },function(){
                });

            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();