/**
 * Created by hulgy on 16/6/23.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:'coupondetail',
            //版本号
            version:"",
            //团购券数据模型
            groupData:{},
            //团购券code
            couponCode: $.getUrlParam('code') || '',
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getCouponDetailByCode();
                });
            },
            //根据code获取团购券详细信息
            getCouponDetailByCode:function(){
                jsonp(host+'jsonp/GroupCoupon_GetGroupCouponDetail_'+vm.version+'.js',{
                    token:token,
                    Code:vm.couponCode,
                    Lat:getLocalstorage('lat') || 0,
                    Lng:getLocalstorage('lon') || 0
                },'callback',function(rs){
                    if(rs.Success){
                        vm.groupData=rs.Data;
                    }
                },function(){
                });

            },
            //立即抢购
            rushFn:function(){
                var dataArr=[{
                    code:vm.couponCode,
                    num:1
                }];
                window.location.href='grouporder.html'+serializaData(dataArr,"codes");
            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();