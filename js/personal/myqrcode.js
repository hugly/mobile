/**
 * Created by hulgy on 16/8/6.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:'myqrcode',
            //版本号
            version:-1,
            userInfo:{
                HeadImage:'',
                NickName:''
            },
            qrimg:'',
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getUserInfo();
                    //vm.getQrCode();
                });
            },
            //获取用户详细信息
            getUserInfo:function(){
                jsonp(host+'/jsonp/User_GetUserInfoBySsoUserCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){

                    vm.userInfo=rs.Data;

                },function(){
                });
            },
            getQrCode:function(){
                jsonp(host+'/jsonp/QrCode_MyQrCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    vm.qrimg = rs;
                },function(){
                });
            }

        });

        vm.getVersion();
        avalon.scan();
    });
})();