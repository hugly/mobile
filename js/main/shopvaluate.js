/**
 * Created by hulgy on 16/6/13.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:'valuate',
            //版本号
            version:0,
            //店铺code
            ShopCode: $.getUrlParam('dataid'),
            //预约code
            bookCode: $.getUrlParam("bookcode"),
            //ordercode
            orderCode: $.getUrlParam('ordercode'),
            //评论列表数据模型
            commentList:[],
            shopInfo:{
                CommentScore:0,
                QualityScore:0,
                LogisScore:0,
                ServiceScore:0
            },
            loadingImgShow:true,
            //是否被收藏
            isCollection:false,
            nowPageIndex:1,
            maxPageNum:1,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getShopInfo();
                    vm.getValuateData(true);
                });
            },
            //获取店铺详情
            getShopInfo:function(){
                jsonp(host+'/jsonp/Shop_ShopInfo_'+vm.version+'.js',{
                    token: token,
                    ShopCode:vm.ShopCode
                },'callback',function(rs){
                    var data = rs.Info;

                    if(!data.CommentScore)  data.CommentScore = 0;
                    if(!data.QualityScore)  data.QualityScore = 0;
                    if(!data.LogisScore)    data.LogisScore = 0;
                    if(!data.ServiceScore)  data.ServiceScore = 0;

                    vm.shopInfo = rs.Info;
                },function(){
                });
            },
            //获取评价数据
            getValuateData:function(type){
                jsonp(host+'/jsonp/Shop_GetComment_'+vm.version+'.js',{
                    token: token,
                    Page:vm.nowPageIndex,
                    PageSize:10,
                    ShopCode:vm.ShopCode
                },'callback',function(rs){
                    vm.loadingImgShow = false;

                    if(type){
                        vm.commentList = rs.Data;
                    }else{
                        var data = rs.Data;

                        for(var i = 0,j=data.length;i<j;i++){
                            vm.commentList.push(data[i]);
                        }
                    }
                    vm.maxPageNum = rs.TotalPages;
                },function(){
                });

            },
            //获取该商家是否被收藏
            getShopIsByColl:function(){
                jsonp(host+'/jsonp/Guide_GetCollectionCount_'+vm.version+'.js',{
                    token: token,
                    code:$.getUrlParam("dataid")
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
            //收藏该商家
            collectionFn:function(){
                if(vm.isCollection){
                    jsonp(host+'/jsonp/Guide_CancelCollection_'+vm.version+'.js',{
                        token: token,
                        code:$.getUrlParam("dataid")
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
                        type:3,
                        code:$.getUrlParam("dataid")
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
            }
        });

        $('.evallist ul').dropload({
           scrollArea : window,
           loadDownFn : function(me){
               vm.nowPageIndex++;

               if(vm.nowPageIndex <= vm.maxPageNum){
                   vm.getValuateData(false);
               }else{
                   vm.nowPageIndex = vm.maxPageNum;
               }
               me.resetload();
           }
        });

        vm.getVersion();
        avalon.scan();
    });

})();