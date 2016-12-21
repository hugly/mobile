/**
 * Created by hulgy on 16/9/2.
 */
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
            timeleft: 120,
            state:1,
            timeHours:0,
            isShowDia:false,
            isSureing:false,
            wantgo:false,
            code:'',
            joincode:$.getUrlParam('code'),
            linkUrl:'',
            //获取版本号
            getVersion:function(){
                vm.linkUrl = 'http://m.wziwash.com/SSOAccount/Login?returnUrl=http://m.wziwash.com/html/html/activity/activityinvite.html?code='+vm.joincode;
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
                jsonp(host+'/jsonp/StudentActivity_SendHelpValiCode_'+vm.version+'.js',{
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
                jsonp(host+'/jsonp/StudentActivity_InsertHelp_'+vm.version+'.js',{
                    token:token,
                    phone:vm.phone,
                    name:vm.password,
                    valiCode:vm.valiCode,
                    joinCode:$.getUrlParam('code')
                },'callback',function(rs){
                    if(rs.Success){
                        vm.code = rs.Data;
                        $.message({
                            msg:'成功帮他助学',
                            callback:function(){
                                window.location.href = '../../html/activity/activityhelpsuccess.html?phone='+vm.phone;
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