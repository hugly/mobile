/**
 * Created by hulgy on 16/6/26.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:'evaluate',
            //版本号
            version:0,
            //质量分数
            status:1,
            //评价详情
            cancelResult:'',
            IsComplete:false,
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

                if(vm.status === '6'){
                    vm.IsComplete = true;
                }

                jsonp(host+'/jsonp/Order_Record_'+vm.version+'.js',{
                    token: token,
                    code:vm.orderCode,
                    IsComplete:vm.IsComplete,
                    desc:vm.cancelResult,
                    Status:vm.status
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'提交记录工作成功!',
                            callback:function(){
                                window.location.href = 'orderlist.html'
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