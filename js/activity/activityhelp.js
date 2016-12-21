/**
 * Created by hulgy on 16/8/18.
 */

(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'activityhelp',
            version:'',
            phone:'',
            name:'',
            valiCode:'',
            timeleft: 120,
            state:1,
            isSureing:false,
            helperList:[],
            totalNum:0,
            isShowDia:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getListByCode();
                    vm.userIsLoginin();
                });
            },
            //判断当前用户是否登录
            userIsLoginin:function(){
                jsonp(host+'/jsonp/Account_IsLogin_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        if(rs.Data){
                            vm.isShowDia = false;
                        }else{
                            vm.isShowDia = true;
                        }
                    }else{
                    }
                },function(){
                });

            },
            //通过参与Code获取帮助者列表
            getListByCode:function(){
                jsonp(host+'/jsonp/StudentActivity_PagingByJoinCode_'+vm.version+'.js',{
                    token:token,
                    PageIndex:1,
                    PageSize:10,
                    joinCode: $.getUrlParam('code')
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data;
                        for(var i= 0,j=data.length;i<j;i++){
                            data[i].phone = data[i].Phone.substring(0,3)+"****"+data[i].Phone.substring(7,11);
                        }
                        vm.helperList = data;
                        vm.totalNum = rs.Records;
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
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
                            window.location.href = '/SSOAccount/Login?returnUrl'+window.location.href;
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

                if(vm.name === '' && vm.isShowDia){
                    $.message({
                        msg:'请输入姓名!'
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
                    name:vm.name,
                    joinCode: $.getUrlParam('code'),
                    valiCode:vm.valiCode
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'已成功帮他助学!'
                        });
                        vm.phone = '';
                        vm.name = '';
                        vm.valiCode = '';
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