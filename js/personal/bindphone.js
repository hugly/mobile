/**
 * Created by hulgy on 16/8/6.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:'bindphone',
            //版本号
            version:-1,
            phoneNum:'',
            validateCode:'',
            state:1,
            isOk:false,
            timeLeft:60,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                });
            },
            getFirstCode:function(){
                vm.getCode();
            },
            getSecondCode:function(){
                vm.getCode();
            },
            getCode:function(){
                if(vm.version === -1){
                    $.message({
                        msg:'请等待获取系统版本号!'
                    });
                    return;
                }

                if(!/^[1][34578][0-9]{9}$/.test(vm.phoneNum)){
                    $.message({
                        msg:'请填写正确的手机号码!'
                    });
                    return;
                }
                vm.state = 2;
                jsonp(host+'/jsonp/Member_SendPhoneCode_'+vm.version+'.js',{
                    token:token,
                    phone:vm.phoneNum,
                    type:3
                },'callback',function(rs){
                    if(rs.Success){
                        vm.state = 3;
                        setInterval(function(){
                            vm.timeLeft --;

                            if(vm.timeLeft <= 0){
                                vm.state = 4;
                                vm.timeLeft = 0;
                            }
                        },1000)
                    }else{
                        vm.state = 1;
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });

            },
            checkCodeFn:function(){
                if(!/^[1][34578][0-9]{9}$/.test(vm.phoneNum)){
                    $.message({
                        msg:'请填写正确的手机号码!'
                    });
                    return;
                }

                if(vm.validateCode === ''){
                    $.message({
                        msg:'请先填写验证码!'
                    });
                    return;
                }

                jsonp(host+'/jsonp/User_BindPhone_'+vm.version+'.js',{
                    token:token,
                    phone:vm.phoneNum,
                    validateCode:vm.validateCode
                },'callback',function(rs){
                    if(rs.Success){
                        window.location.href = 'http://m.wziwash.com/SSOAccount/LogOff';
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