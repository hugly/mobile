/**
 * Created by hulgy on 16/6/9.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"accountmain",
            //版本号
            version:0,
            //集合信息
            account:{},
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getBriefInfo();
                });
            },
            //获取简略信息
            getBriefInfo:function(){
                jsonp(host+'/jsonp/MyAssets_GetMyAssets_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    vm.account=rs.Data;
                },function(){
                });

            }

        });

        vm.getVersion();
        avalon.scan();
    });

})();