/**
 * Created by hulgy on 16/6/27.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:'activity',
            //版本号
            version:0,
            //服务数据模型
            activityData:[],
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;

                    //TODO
                    //vm.getAllActivity();
                });
            },
            //获取所有活动
            getAllActivity:function(){
                jsonp(host+'jsonp/Shop_GetBusiness_'+vm.version+'.js',{
                    token: token
                },'callback',function(rs){
                },function(){
                });

            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();