/**
 * Created by hulgy on 13/11/2016.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'binvouchers',
            //版本号
            version:"",
            cardno:'',
            phoneNum:'',
            isWechat:true,
            userInfo:{},
            isBinding:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getUserInfo();
                });
            },
            //获取用户详细信息
            getUserInfo:function(){
                jsonp(host+'jsonp/User_GetUserInfoBySsoUserCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        vm.isShow=true;

                        if(rs.Data){
                            vm.userInfo=rs.Data;
                            vm.phoneNum = rs.Data.MyNumber;
                        }
                    }
                },function(){
                });
            },
            bindCardFn:function(){
                var cardNo = parseInt(vm.cardno);

                if(cardNo >= 2000000 || vm.cardno.length !== 7){
                    $.message({
                        msg:'请输入正确的现金卡号'
                    });
                    return;
                }

                vm.isBinding = true;
                jsonp(host+'jsonp/CashCounpon_BindTwoCash_'+vm.version+'.js',{
                    token:token,
                    number:vm.cardno
                    // phone:vm.phoneNum
                },'callback',function(rs){
                    if(rs.Success){
                        window.location.href = '../personal/bindvouchersSuccess.html';
                    }else{
                        $.message({
                            msg:rs.Msg
                        })
                    }
                    vm.isBinding = false;
                },function(){
                });
            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();