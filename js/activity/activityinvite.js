/**
 * Created by hulgy on 16/9/1.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'activityindex',
            version:'',
            productData:{
                phone:0,
                keybord:0,
                ploy:0
            },
            timeHours:0,
            isShowDia:false,
            d:0,
            h:0,
            m:0,
            s:0,
            code:$.getUrlParam('code'),
            nextRouter:'http://m.wziwash.com/home/WxPage?returnUrl=http://m.wziwash.com/html/html/activity/activityhelpta.html?code='+$.getUrlParam('code'),
            currentDataModel:{},
            isLogin:false,
            isLoading:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.userIsLoginin();
                    vm.getProductNum();
                    vm.isLoginIn();
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
            goNextFn:function(){
                if(vm.isLogin){
                    vm.isLoading = true;
                    jsonp(host+'/jsonp/StudentActivity_InsertHelp_'+vm.version+'.js',{
                        token:token,
                        phone:'',
                        name:'',
                        valiCode:'',
                        joinCode:$.getUrlParam('code')
                    },'callback',function(rs){
                        if(rs.Success){
                            vm.code = rs.Data;
                            $.message({
                                msg:'成功帮他助学',
                                callback:function(){
                                    window.location.href = '../../html/activity/activityhelpsuccess.html';
                                }
                            });
                        }else{
                            vm.isLoading = false;
                            $.message({
                                msg:rs.Msg
                            });
                        }

                        vm.isSureing = false;
                    },function(){
                    });

                }else{
                    window.location.href = vm.nextRouter;
                }
            },
            //判断当前用户帮助他助学
            userIsLoginin:function(){
                jsonp(host+'/jsonp/StudentActivity_HasHelp_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data;
                        if(data){
                            vm.isShowDia = true;
                        }else{
                            vm.isShowDia = false;
                        }
                    }
                    vm.getCurrentNum();
                },function(){
                });
            },
            //判断当前用户是否参加活动
            getCurrentNum:function(){
                jsonp(host+'/jsonp/StudentActivity_GetNowJoinByCode_'+vm.version+'.js',{
                    token:token,
                    code:$.getUrlParam('code')
                },'callback',function(rs){
                    if(rs.Success){
                        vm.currentDataModel = rs.Data;
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