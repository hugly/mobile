/**
 * Created by hulgy on 16/7/4.
 */
/**
 * Created by hulgy on 16/6/27.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:'mymerchant',
            //版本号
            version:0,
            //服务数据模型
            mymerchantData:{
                Shop:{}
            },
            shomeData:{
                MonthNum:0,
                MonthTotalPrice:0
            },
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.checkIsSellerFn();
                    vm.getMerchantInfo();
                    vm.getTableDataAndBlance();
                });
            },
            //验证是否是卖家
            checkIsSellerFn:function(){
                jsonp(host+'/jsonp/SellerApply_ValidateIsSeller_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    var data = rs.Data;
                    if(rs.Success){
                        if(rs.Code === 113){
                            window.location.href = '../merchant/shopsettled.html';
                        }else if(rs.Code === 115){
                            window.location.href = '../merchant/submitsuccess.html?code='+data.Code+'&date='+data.LastAuditDate+'&state='+data.ShowStatus;
                        }
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            //获取报表数据以及余额
            getTableDataAndBlance:function(){
                jsonp(host+'jsonp/Shop_GetShopShowOrderAndTradeData_'+vm.version+'.js',{
                    token: token
                },'callback',function(rs){
                    if(rs.Success){
                        vm.shomeData = rs.Data;
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            //获取所有活动
            getMerchantInfo:function(){
                jsonp(host+'jsonp/Shop_WashShop_'+vm.version+'.js',{
                    token: token
                },'callback',function(rs){
                    rs.Shop.BusinessBeginTime = rs.Shop.BusinessBeginTime.replace("时",":").replace('分','');
                    rs.Shop.BusinessEndTime = rs.Shop.BusinessEndTime.replace("时",":").replace('分','');
                    vm.mymerchantData = rs;
                },function(){
                });

            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();