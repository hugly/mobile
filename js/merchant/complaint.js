/**
 * Created by hulgy on 16/6/26.
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
                if(vm.cancelResult === ''){
                    $.message({
                        msg:'投诉建议内容不能为空!'
                    });
                    return;
                }

                jsonp(host+'jsonp/FeedBack_Insert_'+vm.version+'.js',{
                    token:token,
                    content:vm.cancelResult
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'提交投诉建议成功!',
                            callback:function(){
                                window.location.href = '../personal/person.html';
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