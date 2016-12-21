/**
 * Created by hulgy on 16/8/16.
 */

(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'messagelist',
            version:'',
            nowPageIndex:1,
            maxPageNum:1,
            messageListModel:[],
            activityAccount:0,
            firstActivity:false,
            secondActivity:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getNowActivity();
                    vm.hasRedPackage();
                    vm.getMessageList(true);
                });
            },
            //获取当前活动的参与情况
            getNowActivity:function(){
                jsonp(host+'/jsonp/DailyActivity_GetValueByToday_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data;

                        if(data){
                            vm.activityAccount = data.length;

                            for(var i = 0,j=data.length;i<j;i++){
                                if(data[i] === 1){
                                    vm.firstActivity = true;
                                }
                                if(data[i] === 2){
                                    vm.secondActivity = true;
                                }
                            }
                        }
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            hasRedPackage:function(){
                jsonp(host+'/jsonp/DailyActivity_HasExistByToday_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        if(rs.Data){
                            $.redPackets({
                                url:host+'jsonp/DailyActivity_InsertReward_'+vm.version+'.js'
                            })
                        }
                    }
                },function(){
                });
            },
            loginFn:function(){
                if(!vm.firstActivity){
                    window.location.href = '/SSOAccount/Login?returnUrl='+window.location.href;
                }
            },
            shareFn:function(){
                if(!vm.secondActivity){
                    window.location.href = '../personal/recommond.html';
                }
            },
            //获取会员卡列表
            getMessageList:function(type){
                jsonp(host+'/jsonp/ShopMessage_Paging_'+vm.version+'.js',{
                    token:token,
                    PageIndex:vm.nowPageIndex,
                    PageSize:10
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data;

                        // for(var n=0,m=data.length;n<m;n++){
                        //     data[n].isCollection = false;
                        // }

                        if(type){
                            vm.messageListModel = data;
                        }else{

                            for(var i= 0,j=data.length;i<j;i++){
                                vm.messageListModel.push(data[i]);
                            }
                        }
                        vm.maxPageNum = rs.TotalPages;
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            //收藏商家
            collectionFn:function(el){
                if(el.isCollection){
                    jsonp(host+'/jsonp/Guide_CancelCollection_'+vm.version+'.js',{
                        token: token,
                        code:el.ShopCode
                    },'callback',function(rs){
                        if(rs.Success){
                            $.message({
                                msg:'取消收藏成功!'
                            });
                            el.isCollection = false;
                        }else{
                            $.message({
                                msg:rs.Msg
                            });
                            if(rs.Code === 8001){
                                window.location.href = 'http://m.wziwash.com/SSOAccount/Login?returnUrl=http%3a%2f%2fm.wziwash.com%2f';
                            }
                        }
                    },function(){
                    });
                }else{
                    jsonp(sildHost+'/jsonp/Shop_InsertCollection_'+vm.version+'.js',{
                        token: token,
                        type:3,
                        code:el.ShopCode
                    },'callback',function(rs){
                        if(rs.Success){
                            $.message({
                                msg:'收藏成功!'
                            });
                            el.isCollection = true;
                        }else{
                            $.message({
                                msg:rs.Msg
                            });
                            if(rs.Code === 8001){
                                window.location.href = 'http://m.wziwash.com/SSOAccount/Login?returnUrl=http%3a%2f%2fm.wziwash.com%2f';
                            }

                        }
                    },function(){
                    });
                }
            }
        });

        var b = new $.scrollLoad({
            mainDiv: $(".shopdynamic"),
            buttonLength: 50,
            ajaxFn: function (){
                vm.nowPageIndex++;

                if(vm.nowPageIndex <= vm.maxPageNum){
                    vm.getMessageList(false);
                }else{
                    vm.nowPageIndex = vm.maxPageNum;
                }
                b.ajaxSuccess();
            }
        });
        vm.getVersion();
        avalon.scan();
    });

})();