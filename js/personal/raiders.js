/**
 * Created by hulgy on 16/7/22.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'wallet',
            version:'',
            nowPageIndex:1,
            loadingImgShow:true,
            raider:[],
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getBriefInfo();
                });
            },
            //获取攻略信息
            getBriefInfo:function(){
                jsonp(sildHost+'/jsonp/Shop_GetGuidePage_'+vm.version+'.js',{
                    token:token,
                    PageIndex:vm.nowPageIndex,
                    PageSize:10
                },'callback',function(rs){
                },function(){
                });
            }

        });

        vm.getVersion();
        avalon.scan();
    });

})();