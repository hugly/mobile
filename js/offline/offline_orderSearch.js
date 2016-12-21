/**
 * Created by hulgy on 23/11/2016.
 */

(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"orderSearch",
            code:'',
            isSearch:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                });
            },
            //获取订单详情
            getOderInfo:function(){
                vm.isSearch = true;
                jsonp(host+'/jsonp/Order_JGetOrderDetail_'+vm.version+'.js',{
                    token:token,
                    code:vm.code,
                    isuser:true
                },'callback',function(rs){
                    if(rs.Success){
                        var data=rs.Data;

                        if(data){
                            window.location.href = '../offline/offline_infomodify.html'+window.location.search+'&orderCode='+vm.code;
                        }else{
                            $.message({
                                msg:'无法找到该订单，请重新输入！',
                                callback:function(){
                                    vm.isSearch = false;
                                }
                            })
                        }
                        console.log(data);
                    }
                },function(){
                });

            },
            searchFn:function(){
                vm.getOderInfo();
            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();