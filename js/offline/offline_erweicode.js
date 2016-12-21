/**
 * Created by hulgy on 14/11/2016.
 */

(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"erweicode",
            phoneNum:'',
            code:'',
            version:'',
            loadingImgShow:true,
            timer:null,
            goNext:true,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getAuthCode();
                });
            },
            getAuthCode:function(){
                jsonp(host+'jsonp/QrCode_GetAuthCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        vm.code = rs.Data;
                        vm.loadingImgShow = false;

                        vm.timer = setInterval(function(){
                            if(vm.goNext){
                                vm.runIsAuthFn();
                            }
                        },1000);
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            runIsAuthFn:function(){
                vm.goNext = false;
                jsonp(host+'jsonp/Logistics_HasAuthorized_'+vm.version+'.js',{
                    token:token,
                    code:vm.code
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data;
                        if(!data){
                            vm.goNext = true;
                        }else{
                            window.location.href = '../offline/offline_ordersearch.html?authCode='+data.AuthorizeCode+'&authType='+data.ApplyAuthorizeType+'&SSOCode='+data.UserSSOCode;
                            clearInterval(vm.timer);
                        }
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