/**
 * Created by hulgy on 16/8/2.
 */
(function(){
    'use strict';
    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"detail",
            //版本号
            version:"",
            //店铺code
            ShopCode: $.getUrlParam('dataid'),
            //预约code
            bookCode: $.getUrlParam("bookcode"),
            //ordercode
            orderCode: $.getUrlParam('ordercode'),
            //总价格
            totalPrice:0,
            //总商品数量
            totalNum:0,
            //是否显示
            isshow:'100',
            showNotice:'100',
            //tabindex
            tabindex:0,
            //店铺信息
            shopInfo:{
                PickUpFee:0,
                LogistFee:0
            },
            //店铺基本信息
            BaseInfo:{
                Shop:{
                    Logo:'',
                    Images:[]
                }
            },
            //已选择的商品数据模型
            proList:[
                {name:"干洗熨烫",value:[]},
                {name:"清洗保养",value:[]},
                {name:"奢侈护理",value:[]},
                {name:"裁剪维修",value:[]}
            ],
            //优惠券数据模型
            couponsList:[],
            //团购券数据模型
            grouponsList:[],
            //当前洗衣类型
            SaleWashTypeCode:"",
            //洗衣类型数据模型
            washTypeList:[],
            //当前服装类别
            SaleCategoryCode:"",
            //所有二级类目数据模型
            categoryList:[],
            //具体某个商品
            SubCategoryCode:"",
            //所有商品的数据模型
            subcateList:[],
            loadingImgShow:true,
            loadingImgShow1:true,
            loadingImgShow2:true,
            nowPageIndex1:1,
            maxPageNum1:1,
            nowPageIndex2:1,
            maxPageNum2:1,
            hasCouponsList:false,
            hasGroupsList:false,
            //是否被收藏
            isCollection:false,
            //选择部分定位
            boxPosition:function(){
                $(window).scrollTop(10000);
            },
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getShopInfo();
                    vm.addScanHistory();
                    vm.getShopIsByColl();
                });
            },
            showNoticeFn:function(){
                vm.showNotice = '0';
            },
            hideNoticeFn:function(){
                vm.showNotice = '100';
            },
            //获取店铺详情
            getShopInfo:function(){
                jsonp(host+'/jsonp/Shop_ShopInfo_'+vm.version+'.js',{
                    token: token,
                    ShopCode:$.getUrlParam("dataid")
                },'callback',function(rs){
                    rs.Info.BusinessBeginTime = rs.Info.BusinessBeginTime.replace("时",':').replace('分','');
                    rs.Info.BusinessEndTime = rs.Info.BusinessEndTime.replace("时",':').replace('分','');
                    vm.shopInfo = rs.Info;
                    vm.BaseInfo = rs.BaseInfo;
                },function(){
                });
            },
            //添加我的足迹
            addScanHistory:function(){
                jsonp(host+'/jsonp/Shop_InsertScanHistory_'+vm.version+'.js',{
                    token: token,
                    ShopCode:$.getUrlParam("dataid")
                },'callback',function(rs){
                    if(rs.Code === 8001){
                        window.location.href = 'http://m.wziwash.com/SSOAccount/Login?returnUrl=http%3a%2f%2fm.wziwash.com%2f';
                    }
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
            },
            //关闭弹出层
            closeZoomFn:function(){
                vm.isshow = '100';
            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();
