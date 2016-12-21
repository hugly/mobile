/**
 * Created by hulgy on 16/9/1.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'actihelp',
            version:'',
            phone:'',
            password:'',
            valiCode:'',
            timeleft:120,
            state:1,
            timeHours:0,
            isShowDia:false,
            isSureing:false,
            code:'',
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                });
            },
            //判断用户是否注册
            checkUserIsRegister:function(){
                if(!/^[1][34578][0-9]{9}$/.test(vm.phone)){
                    $.message({
                        msg:'请输入正确的手机号码!'
                    })
                }else{
                    jsonp(host+'/jsonp/StudentActivity_HasRegister_'+vm.version+'.js',{
                        token:token,
                        phone:vm.phone
                    },'callback',function(rs){
                        if(rs.Success){
                            var data = rs.Data;
                            if(data){
                                vm.isShowDia = true;
                            }else{
                                vm.isShowDia = false;
                            }
                        }else{
                            $.message({
                                msg:rs.Msg
                            })
                        }
                    },function(){
                    });
                }
            },
            //获取验证码
            getCodeFn:function(){

                if(!/^[1][34578][0-9]{9}$/.test(vm.phone)){
                    $.message({
                        msg:'请输入正确的手机号码!'
                    });
                    return;
                }

                vm.state = 2;
                jsonp(host+'/jsonp/StudentActivity_SendJoinValiCode_'+vm.version+'.js',{
                    token:token,
                    phone:vm.phone
                },'callback',function(rs){
                    if(rs.Success){
                        vm.state = 3;
                        var timer = null;

                        timer = setInterval(function(){

                            vm.timeleft --;

                            if(vm.timeleft < 1){
                                vm.state = 1;
                                vm.timeleft = 120;
                                clearInterval(timer);
                            }
                        },1000)
                    }else{
                        if(rs.Data === 1){
                            $.message({
                                msg:rs.Msg,
                                callback:function(){
                                    window.location.href = '/SSOAccount/Login?returnUrl='+window.location.href;
                                }
                            });
                        }else {
                            $.message({
                                msg: rs.Msg
                            });
                            vm.state = 1;
                        }
                    }
                },function(){
                });

            },
            //参加活动
            joinFn:function(){

                if(!/^.+$/.test(vm.password) && !vm.isShowDia){
                    $.message({
                        msg:'请输入正确的密码格式!'
                    });
                    return;
                }

                if(!/^[1][34578][0-9]{9}$/.test(vm.phone) && vm.isShowDia){
                    $.message({
                        msg:'请输入正确的手机号码!'
                    });
                    return;
                }

                if(!/^[0-9]{6}$/.test(vm.valiCode) && vm.isShowDia){
                    $.message({
                        msg:'请输入正确的验证码!'
                    });

                    return;
                }
                vm.isSureing = true;
                jsonp(host+'/jsonp/StudentActivity_JoinActivity_'+vm.version+'.js',{
                    token:token,
                    phone:vm.phone,
                    name:vm.password,
                    valiCode:vm.valiCode
                },'callback',function(rs){
                    if(rs.Success){
                        vm.code = rs.Data;
                        $.message({
                            msg:'成功参加活动',
                            callback:function(){
                                window.location.href = '../../html/activity/activityshare.html?username='+rs.Data.Name+'&phone='+rs.Data.Phone+'&code='+rs.Data.JoinCode
                            }
                        });
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }

                    vm.isSureing = false;
                },function(){
                });

            }

        });
        vm.getVersion();
        avalon.scan();
    });

})();