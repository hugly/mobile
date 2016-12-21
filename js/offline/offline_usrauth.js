/**
 * Created by hulgy on 14/11/2016.
 */

(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"userauth",
            version:'',
            type:$.getUrlParam('AuthorizeType'),
            ssoCode:$.getUrlParam('ApplySSOCode'),
            authorizeCode:$.getUrlParam('AuthorizeCode'),
            authing:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    // vm.userAuthFn();
                });
            },
            userAuthFn:function(){
                vm.authing = true;
                jsonp(host+'jsonp/Logistics_Authorize_'+vm.version+'.js',{
                    token:token,
                    ssoCode:vm.ssoCode,
                    authorizeCode:vm.authorizeCode,
                    type:vm.type
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'授权已成功！',
                            callback:function () {
                                vm.authing = false;
                                window.location.href = '../main/index.html';
                            }
                        })
                    }else{
                        $.message({
                            msg:rs.Msg,
                            callback:function () {
                                vm.authing = false;
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