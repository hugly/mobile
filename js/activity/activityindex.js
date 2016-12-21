/**
 * Created by hulgy on 16/8/17.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'activityindex',
            version:'',
            phone:'',
            name:'',
            valiCode:'',
            timeleft: 60,
            state:1,
            productData:{
                phone:0,
                keybord:0,
                ploy:0
            },
            timeHours:0,
            isShowDia:false,
            isLogin:false,
            isLoading:false,
            d:0,
            h:0,
            m:0,
            s:0,
            currentDataModel:{},
            hrefAddress:'',
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.isLoginIn();
                    vm.getProductNum();
                    //vm.getUserJoinInfo();
                    vm.userIsLoginin();
                });
            },
            //获取商品数量
            getProductNum:function(){
                jsonp(host+'/jsonp/StudentActivity_GetTotalLevelCount_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data,
                            time = parseInt(rs.Seconds);

                        vm.productData.phone = data['1'] || 0;
                        vm.productData.keybord = data['2'] || 0;
                        vm.productData.ploy = data['3'] || 0;

                        setInterval(function(){
                            time --;
                            vm.daoTime(time);
                        },1000);
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            daoTime:function(s){
                vm.d=parseInt(s/86400);
                s%=86400;

                vm.h=parseInt(s/3600);
                s%=3600;

                vm.m=parseInt(s/60);
                s%=60;

                vm.s = s;

            },
            //判断当前用户是否参加活动
            userIsLoginin:function(){
                jsonp(host+'/jsonp/StudentActivity_HasJoin_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data;
                        if(data){
                            vm.isShowDia = true;
                            vm.getCurrentNum();
                        }else{
                            vm.isShowDia = false;
                        }
                    }else{
                    }
                },function(){
                    $.message({
                        msg:rs.Msg
                    });
                });
            },
            //获取邀请人员信息
            getUserJoinInfo:function(){
                jsonp(host+'/jsonp//StudentActivity_GetNowJoinBySSOCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        vm.currentDataModel = rs.Data;
                        vm.hrefAddress = '../../html/activity/activityshare.html?username='+rs.Data.UserName+'&phone='+rs.Data.Phone+'&code='+rs.Data.Code
                    }
                },function(){
                });
            },
            //获取邀请人员信息
            getCurrentNum:function(){
                jsonp(host+'/jsonp/StudentActivity_GetNowJoinBySSOCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        vm.currentDataModel = rs.Data;
                        vm.hrefAddress = '../../html/activity/activityshare.html?username='+rs.Data.UserName+'&phone='+rs.Data.Phone+'&code='+rs.Data.Code
                    }
                },function(){
                });
            },
            //判断是否登陆
            isLoginIn:function(){
                jsonp(host+'/jsonp/account_IsLogin_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        if(rs.Data){
                            vm.isLogin = true;
                        }else{
                            vm.isLogin = false;
                        }
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            //参加活动
            joinFn:function(){
                vm.isLoading = true;
                if(vm.isLogin){
                    jsonp(host+'/jsonp/StudentActivity_JoinActivity_'+vm.version+'.js',{
                        token:token,
                        phone:'',
                        name:'',
                        valiCode:''
                    },'callback',function(rs){
                        vm.isLoading = false;
                        if(rs.Success){
                            vm.code = rs.Data;
                            $.message({
                                msg:'成功参加活动',
                                callback:function(){
                                    window.location.href = '../../html/activity/activityshare.html?username='+rs.Data.Name+'&phone='+rs.Data.Phone+'&code='+rs.Data.JoinCode
                                    //window.location.href = '../../html/activity/activityshare.html?username=aaa&phone='+vm.phone+'&code='+rs.Data
                                }
                            });
                        }else{
                            $.message({
                                msg:rs.Msg
                            });
                        }
                    },function(){
                    });
                }else{
                    //http://localhost:63342/mobile/html/activity/activityhelp.html
                    window.location.href = 'http://m.wziwash.com/home/WxPage?returnUrl=http://m.wziwash.com/html/html/activity/activityhelp.html';
                }
            }

        });

        vm.getVersion();
        avalon.scan();
    });

})();