/**
 * Created by hulgy on 16/6/12.
 */

(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:'cancel',
            //版本号
            version:0,
            //订单code
            orderCode: $.getUrlParam('code') || '',
            //取消原因
            cancelResult:'',
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    //vm.submitCancel();
                });
            },
            //提交取消原因
            submitCancel:function(){
                jsonp(host+'jsonp/Order_CancelOrder_'+vm.version+'.js',{
                    token:token,
                    code:vm.orderCode,
                    desc:vm.cancelResult
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'取消成功!'
                        });
                        window.location.href = '../merchant/personorderlist.html'
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });

            }
        });

        vm.getVersion();
        avalon.scan();
    });

})();