/**
 * Created by hulgy on 16/7/26.
 */

(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'strategydetail',
            version:'',
            code: $.getUrlParam('id'),
            isCollection:false,
            strategyDetail:[],
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getShopIsByColl();
                    vm.getBriefInfo();
                    vm.insertScan();
                });
            },
            insertScan:function(){
                jsonp(sildHost+'/jsonp/Shop_InsertScann_'+vm.version+'.js',{
                    token: token,
                    code:$.getUrlParam("id")
                },'callback',function(rs){
                },function(){
                });
            },
            //获取该商家是否被收藏
            getShopIsByColl:function(){
                jsonp(host+'/jsonp/Guide_GetCollectionCount_'+vm.version+'.js',{
                    token: token,
                    code:$.getUrlParam("id")
                },'callback',function(rs){
                    if(rs.Data === 1){
                        vm.isCollection = true;
                    }
                    if(rs.Code === 8001){
                        window.location.href = 'http://m.wziwash.com/SSOAccount/Login?returnUrl=http%3a%2f%2fm.wziwash.com%2f';
                    }

                },function(){
                });
            },
            //获取攻略详情信息
            getBriefInfo:function(){
                jsonp(sildHost+'/jsonp/Shop_GetReportDetailByCode_'+vm.version+'.js',{
                    token:token,
                    code:vm.code
                },'callback',function(rs){
                    vm.strategyDetail = rs.Data;
                });
            },
            //收藏该商家
            collectionFn:function(){
                if(vm.isCollection){
                    jsonp(host+'/jsonp/Guide_CancelCollection_'+vm.version+'.js',{
                        token: token,
                        type:1,
                        code:$.getUrlParam("id")
                    },'callback',function(rs){
                        if(rs.Success){
                            $.message({
                                msg:'取消收藏成功!'
                            });
                            vm.isCollection = false;
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
                        type:1,
                        code:$.getUrlParam("id")
                    },'callback',function(rs){
                        if(rs.Success){
                            $.message({
                                msg:'收藏成功!'
                            });
                            vm.isCollection = true;
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
            },
            //攻略点赞
            addLikeFn:function(el,$event){
                jsonp(sildHost+'/jsonp/Shop_InsertClickLike_'+vm.version+'.js',{
                    token:token,
                    type:1,
                    code:el.Code
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'点赞成功!'
                        });
                        vm.strategyDetail.ClickLikeCount += 1;
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });

                $event.stopPropagation();
            }

        });

        vm.getVersion();
        avalon.scan();
    });

})();