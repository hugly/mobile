/**
 * Created by hulgy on 16/6/1.
 */


/**
 * Created by hulgy on 16/6/1.
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
            //总价格
            totalPrice:0,
            //总商品数量
            totalNum:0,
            top:0,
            //是否显示
            isshow:'100',
            //tabindex
            tabindex:0,
            //店铺信息
            shopInfo:{},
            //店铺基本信息
            BaseInfo:{
                Shop:{
                    Logo:''
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
            //预约code
            bookCode: $.getUrlParam("bookcode"),
            //ordercode
            orderCode: $.getUrlParam('ordercode'),
            //选择部分定位
            boxPosition:function(){
                vm.top = -6;
            },
            caculateHeight:function(){
                var fontSize=$(window).width()/16,
                    heigt = $(window).height()/fontSize;

                $('.order-type,.order-con').height(heigt-6.2+'rem');
                //myScroll = new IScroll('#ordercon', { scrollX: true, freeScroll: true });
                //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
                simpScroller(document.querySelector('.order-con'));
            },
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getShopInfo();
                    vm.addScanHistory();
                });
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
                    vm.getMainList();
                },function(){
                });
            },
            //获取店铺销售属性
            getMainList:function(){
                vm.tabindex=0;
                jsonp(sildHost+'/jsonp/Shop_GetSaleWashType_'+vm.version+'.js',{
                    token: token,
                    ShopCode:$.getUrlParam("dataid")
                },'callback',function(rs){
                    if(rs.Data.length > 0){
                        vm.SaleWashTypeCode=rs.Data[0].SaleWashType;
                        vm.washTypeList=rs.Data;
                        vm.getNextByMainID();
                    }else{
                        vm.loadingImgShow = false;
                    }
                },function(){
                });
            },
            //获取店铺销售属性下一级分类
            getNextByMainID:function(){
                jsonp(sildHost+'/jsonp/Shop_GetSaleCategory_'+vm.version+'.js',{
                    token: token,
                    ShopCode:$.getUrlParam("dataid"),
                    SaleType:vm.SaleWashTypeCode
                },'callback',function(rs){
                    if(rs.Data.length === 0){
                        vm.loadingImgShow = false;
                    }
                    vm.SaleCategoryCode=rs.Data[0].CategoryCode;
                    vm.categoryList=rs.Data;
                    vm.getPriceListByMix();
                },function(){
                });
            },
            //获取店铺销售属性和一级分类下的价格信息集合
            getPriceListByMix:function(){
                vm.loadingImgShow = true;
                jsonp(sildHost+'/jsonp/Shop_GetSubCategoryPrice_'+vm.version+'.js',{
                    token: token,
                    ShopCode:$.getUrlParam("dataid"),
                    SaleType:vm.SaleWashTypeCode,
                    CategoryCode:vm.SaleCategoryCode,
                    SubCategoryCode:vm.SubCategoryCode
                },'callback',function(rs){
                    var data=rs.Data;
                    for(var i= 0,j=data.length;i<j;i++){
                        data[i].num=0;
                        data[i].type=vm.SaleWashTypeCode;
                    }
                    vm.subcateList=data;
                    vm.loadingImgShow = false;
                    vm.refreshData();
                },function(){
                });
            },
            //数量加操作
            addFn:function($index){
                //vm.boxPosition();
                var type=parseInt(avalon(this).data("type")),
                    code=avalon(this).data("id"),
                    obj=vm.getObjByCode(code);

                obj.num ++;

                if(vm.proList[type-1].value.size() > 0){
                    for(var i= 0,j= vm.proList[type-1].value.length;i<j;i++){
                        var el=vm.proList[type-1].value[i];
                        if(code === el.code){
                            if(obj.num){
                                el.num=obj.num;
                            }else{
                                el.num++;
                            }
                            vm.getAllInfo();
                            return;
                        }
                    }
                }

                var json={
                    type:type,
                    code:obj.Code,
                    name:obj.Name,
                    price:obj.Price,
                    num:obj.num
                };

                vm.proList[type-1].value.push(json);

                vm.getAllInfo();

            },
            //数量减操作
            reFn:function($remove,$index){
                //vm.boxPosition();
                var type=avalon(this).data("type"),
                    code=avalon(this).data("id"),
                    obj=vm.getObjByCode(code);

                obj.num --;
                if(obj.num <=0 ){
                    obj.num=0;
                }

                if(vm.proList[type-1].value.size() > 0){
                    for(var i= 0,j= vm.proList[type-1].value.length;i<j;i++){
                        var el=vm.proList[type-1].value[i];
                        if(code === el.code){
                            if(obj.num){
                                if(obj.num > 0){
                                    el.num=obj.num;
                                }else{
                                    vm.proList[type-1].value.remove(el);
                                }
                            }else{
                                el.num--;

                                if(el.num <=0 ){
                                    el.num=0;
                                    vm.proList[type-1].value.remove(el);
                                }
                            }

                            vm.getAllInfo();
                            if(vm.totalPrice === 0){
                                vm.isshow = '100';
                            }

                            return;
                        }
                    }
                }

                if(vm.totalPrice === 0){
                    vm.isshow = '100';
                }

                vm.getAllInfo();

            },
            //选择大分类
            chooseType:function(){
                var type=parseInt(avalon(this).data("type"));
                vm.SaleWashTypeCode=type;
                vm.SaleCategoryCode="";
                vm.SubCategoryCode="";

                vm.getNextByMainID();
                vm.boxPosition();
            },
            //选择品类
            chooseCate:function(el){
                var cate=avalon(this).data("cate");
                vm.SaleCategoryCode=el.CategoryCode;
                vm.SubCategoryCode='';

                vm.getPriceListByMix();
                vm.boxPosition();
            },
            swipeUpFn:function(){
                vm.boxPosition();
            },
            swipeDownFn:function(){
                var top=$('.scroller_vertical').css('top');
                if(top === '0px'){
                    vm.top = 0;
                }else{
                    vm.boxPosition();
                }
            },
            //获取全部价格和全部数量
            getAllInfo:function(){
                vm.totalPrice=0;
                vm.totalNum=0;

                vm.proList.forEach(function(el){
                    el.value.forEach(function(item){
                        vm.totalPrice+=item.price*item.num;
                        vm.totalNum+=item.num;
                    });

                });
            },
            //根据code  返回对象
            getObjByCode:function(code){
                var obj={};
                vm.subcateList.forEach(function(el){
                    if(code === el.Code){
                        obj=el;
                    }
                });
                return obj;
            },
            //每次切换类别的时候刷新数据
            refreshData:function(){
                vm.subcateList.forEach(function(el){
                    var data=el;
                    vm.proList.forEach(function(el){
                        el.value.forEach(function(val){
                            if(data.Code === val.code){
                                data.num=val.num;
                            }
                        });
                    });
                });
            },
            //清除所有数据
            clearAll:function(){
                vm.proList=[
                    {name:"干洗熨烫",value:[]},
                    {name:"清洗保养",value:[]},
                    {name:"奢侈护理",value:[]},
                    {name:"裁剪维修",value:[]}
                ];

                vm.subcateList.forEach(function(el){
                    el.num=0;
                });

                vm.isshow='100';

                vm.totalPrice=0;
                vm.totalNum=0;
            },
            //显示清单列表
            showList:function(){
                if(vm.proList[0].value.size() > 0 || vm.proList[1].value.size() > 0 || vm.proList[2].value.size() > 0 || vm.proList[3].value.size() > 0){
                    if(vm.isshow === '100'){
                        vm.isshow = '0';
                    }else{
                        vm.isshow = '100';
                    }
                }
            },
            //去结算
            settlementFn:function(){
                jsonp(host+'jsonp/Booking_UpdateCBBooingRequestStatusToFinish_'+vm.version+'.js',{
                    token:token,
                    code: $.getUrlParam('ordercode'),
                    bookingRequestApplyCode: $.getUrlParam('bookcode')
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'确认订单成功!'
                        });
                        window.location.href = rs.Data.PayUrl;
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){

                });

            },
            //获取商家的优惠券
            getCoupons:function(type){
                vm.tabindex=1;
                vm.loadingImgShow1 = true;
                if(type){
                    vm.couponsList = [];
                }

                if(vm.nowPageIndex1 < 1) return;
                //if(vm.couponsList.size() == 0){
                jsonp(host+'/jsonp/CounponInfo_GetUnExpireCouponPageByShopCode_'+vm.version+'.js',{
                    token: token,
                    PageIndex:vm.nowPageIndex1,
                    PageSize:10,
                    shopCode:$.getUrlParam("dataid")
                },'callback',function(rs){
                    var data = rs.Data;
                    if(data){
                        for(var i= 0,j=data.length;i<j;i++){
                            if(!type){
                                vm.couponsList.push(data[i]);
                            }
                        }
                        if(type){
                            vm.couponsList=data;
                        }
                        vm.maxPageNum1 = rs.TotalPages;
                    }else{
                        vm.hasCouponsList = true;
                    }
                    vm.loadingImgShow1 = false;
                },function(){
                });
                //}
            },
            //领取优惠券
            getCoupon:function(){
                var code=avalon(this).data('code');

                jsonp(sildHost+'/jsonp/Shop_ReceiveCounpon_'+vm.version+'.js',{
                    token: token,
                    code:code
                },'callback',function(rs){
                    if(rs.Code == 110){
                        window.location.href='http://m.wziwash.com/SSOAccount/Login?returnUrl=http%3a%2f%2fm.wziwash.com%2f';
                    }else{
                        if(rs.Success){
                            $.message({
                                msg:'领取成功!'
                            });
                        }else{
                            $.message({
                                msg:rs.Msg
                            });
                        }
                    }
                },function(){
                });
            },
            //获取商家的团购券
            getgroupon:function(type){
                vm.tabindex=2;
                vm.loadingImgShow2 = true;

                if(type){
                    vm.grouponsList = [];
                }
                var arr=[{
                    'ShopCode':$.getUrlParam("dataid")
                }];

                if(vm.nowPageIndex2 < 1) return;

                jsonp(host+'/jsonp/GroupCoupon_PagingByShop_'+vm.version+'.js',{
                    token: token,
                    PageIndex:vm.nowPageIndex2,
                    PageSize:10,
                    'ShopCode':$.getUrlParam("dataid")
                },'callback',function(rs){
                    var data = rs.Data;
                    if(data){

                        for(var i= 0,j=data.length;i<j;i++){

                            if(!type){
                                vm.grouponsList.push(data[i]);
                            }
                        }

                        if(type){
                            vm.grouponsList=data;
                        }

                        vm.maxPageNum2 = rs.TotalPages;
                    }else{
                        vm.hasGroupsList = true;
                    }
                    vm.loadingImgShow2 = false;
                },function(){
                });
            },
            //添加我的足迹
            addScanHistory:function(){
                jsonp(host+'/jsonp/Shop_InsertScanHistory_'+vm.version+'.js',{
                    token: token,
                    ShopCode:$.getUrlParam("dataid")
                },'callback',function(rs){
                },function(){
                });
            },
            //收藏该商家
            collectionFn:function(){
                jsonp(sildHost+'/jsonp/Shop_InsertCollection_'+vm.version+'.js',{
                    token: token,
                    type:3,
                    code:$.getUrlParam("dataid")
                },'callback',function(rs){
                    $.message({
                        msg:'收藏成功!'
                    });
                },function(){
                });
            },
            //关闭弹出层
            closeZoomFn:function(){
                vm.isshow = '100';
            }
        });


        vm.getVersion();
        vm.caculateHeight();
        avalon.scan();
    });
})();

