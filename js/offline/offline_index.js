/**
 * Created by hulgy on 07/11/2016.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"offline",
            phoneNum:'',
            version:'',
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                });
            },
            checkPhoneFn:function(){
                jsonp(host+'/jsonp/Logistics_GetUserAccountAndDefaultAddressByPhone_'+vm.version+'.js',{
                    token:token,
                    phone:vm.phoneNum
                },'callback',function(rs){
                    console.log(rs);
                },function(){
                });

            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();