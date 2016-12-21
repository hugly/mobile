/**
 * Created by hulgy on 16/6/27.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:'refundault',
            //版本号
            version:0,
            //质量分数
            status:1,
            //评价详情
            cancelResult:'',
            //订单code
            orderCode: $.getUrlParam('code') || '',
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                });
            },
            //提交记录工作
            submitCancel:function(){
                jsonp(host+'/jsonp/Order_RefundConfirm_'+vm.version+'.js',{
                    token: token,
                    code:vm.orderCode,
                    desc:vm.cancelResult,
                    status:vm.status
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'退款审核成功!',
                            callback:function(){
                                window.history.go(-1);
                            }
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