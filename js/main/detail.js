/**
 * Created by hulgy on 16/6/1.
 */
(function(){
    var myScroll;
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
            showNotice:'100',
            //tabindex
            tabindex:0,
            typeinex:parseInt($.getUrlParam('typeindex')),
            //店铺信息
            shopInfo:{
                PickUpFee:0,
                LogistFee:0
            },
            //店铺基本信息
            BaseInfo:{
                Shop:{
                    Logo:'',
                    PickType:1,
                    FreePickAmount:0,
                    PickFee:0,
                    LogicType:1,
                    FreeLogicAmount:0,
                    LogicFee:0
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
            //是否显示类别菜单
            isShowTypebox:false,
            //第三级数据模型
            thirdDataModel:{
                Children:[]
            },
            thirdChildModel:{},
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
                    vm.getShopIsByColl();

                    // if(vm.typeinex){
                    //     vm.tabindex = parseInt($.getUrlParam('typeindex'));
                    //     vm.getgroupon(true,true);
                    // }
                });
            },
            showTypeBoxFn:function(el){
                vm.isShowTypebox = true;
                vm.thirdDataModel = el;
            },
            clooseFn:function(){
                vm.isShowTypebox = false;
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
                    if(vm.tabindex === 0){
                        vm.getMainList();
                    }
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
                },'fixedCallFn1');
            },
            //获取店铺销售属性下一级分类
            getNextByMainID:function(){
                vm.categoryList = [];
                jsonp(sildHost+'/jsonp/Shop_GetSaleCategory_'+vm.version+'.js',{
                    token: token,
                    ShopCode:$.getUrlParam("dataid"),
                    SaleType:vm.SaleWashTypeCode
                },'callback',function(rs){
                    if(rs.Data.length === 0){
                        vm.loadingImgShow = false;
                    }
                    if(rs.Data.length > 0){
                        vm.SaleCategoryCode=rs.Data[0].CategoryCode;
                        vm.categoryList=rs.Data;
                        vm.getPriceListByMix();
                    }else{
                        vm.subcateList=[];
                    }
                },function(){
                },'fixedCallFn2');
            },
            //获取店铺销售属性和一级分类下的价格信息集合
            getPriceListByMix:function(){
                vm.loadingImgShow = true;
                vm.subcateList = [];
                jsonp(sildHost+'/jsonp/Shop_GetSubCategoryPrice_'+vm.version+'.js',{
                    token: token,
                    ShopCode:$.getUrlParam("dataid"),
                    SaleType:vm.SaleWashTypeCode,
                    CategoryCode:vm.SaleCategoryCode,
                    SubCategoryCode:vm.SubCategoryCode
                },'callback',function(rs){
                    var data=rs.Data;
                    for(var i= 0,j=data.length;i<j;i++){
                        if(data[i].Children){
                            data[i].num=0;
                            var secondData = data[i].Children;

                            for(var n = 0,m = secondData.length;n<m;n++){
                                secondData[n].num=0;
                                secondData[n].isSelect = false;
                                secondData[n].type=vm.SaleWashTypeCode;
                            }

                            secondData[0].isSelect = true;
                        }else{
                            data[i].num=0;
                            data[i].type=vm.SaleWashTypeCode;
                        }
                    }
                    vm.subcateList=data;
                    vm.loadingImgShow = false;
                    avalon.scan();
                    vm.refreshData();
                },function(){
                },'fixedCallFn3');
            },
            //数量加操作
            addFn:function($index){
                vm.boxPosition();
                var type=parseInt(avalon(this).data("type")),
                    code=avalon(this).data("id"),
                    obj=vm.getObjByCode(code),
                    parentObj = vm.getParentObjByCode(code);

                parentObj.num ++;
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
                vm.boxPosition();
                var type=avalon(this).data("type"),
                    code=avalon(this).data("id"),
                    obj=vm.getObjByCode(code),
                    parentObj = vm.getParentObjByCode(code);

                parentObj.num --;
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
            chooseType:function(el){
                if(vm.loadingImgShow) return;
                if(vm.SaleWashTypeCode == el.SaleWashType) return;
                // var type=parseInt(avalon(this).data("type"));
                vm.SaleWashTypeCode=el.SaleWashType;
                vm.SaleCategoryCode="";
                vm.SubCategoryCode="";

                vm.getNextByMainID();
                vm.boxPosition();
            },
            //选择品类
            chooseCate:function(el){
                if(vm.loadingImgShow) return;

                if(vm.SaleCategoryCode ==  el.CategoryCode) return;
                // var cate=avalon(this).data("cate");
                vm.SaleCategoryCode=el.CategoryCode;
                vm.SubCategoryCode="";


                vm.getPriceListByMix();

                vm.boxPosition();
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
                    if(el.Children){
                        el.Children.forEach(function(ele){
                            if(code === ele.Code){
                                obj=ele;
                            }
                        });
                    }else{
                        if(code === el.Code){
                            obj=el;
                        }
                    }
                });
                return obj;
            },
            getParentObjByCode:function(code){
                var obj={};
                vm.subcateList.forEach(function(el){
                    if(el.Children){
                        el.Children.forEach(function(ele){
                            if(code === ele.Code){
                                obj=el;
                            }
                        });
                    }
                });
                return obj;
            },
            changeTypeFn:function(el){
                vm.thirdDataModel.Children.forEach(function(item){
                    item.isSelect = false;
                });

                el.isSelect = true;
            },
            //每次切换类别的时候刷新数据
            refreshData:function(){
                vm.subcateList.forEach(function(el){
                    var data=el;
                    vm.proList.forEach(function(el){
                        el.value.forEach(function(val){
                            if(data.Children){
                                data.Children.forEach(function(item){
                                    if(item.Code === val.code){
                                        data.num += val.num;
                                        item.num=val.num;
                                    }
                                });
                            }else{
                                if(data.Code === val.code){
                                    data.num=val.num;
                                }
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
                    if(el.Children){
                        el.Children.forEach(function(item){
                            item.num = 0;
                        })
                    }else{
                        el.num=0;
                    }
                });

                vm.isshow='100';

                vm.totalPrice=0;
                vm.totalNum=0;
            },
            //显示清单列表
            showList:function(){
                vm.boxPosition();
                if(vm.proList[0].value.size() > 0 || vm.proList[1].value.size() > 0 || vm.proList[2].value.size() > 0 || vm.proList[3].value.size() > 0){
                    if(vm.isshow === '100'){
                        vm.isshow = '0';
                    }else{
                        vm.isshow = '100';
                    }
                }
            },
            goBackFn:function(){
                window.location.href = getLocalstorage('detailLink');
            },
            //去结算
            settlementFn:function(){
                var dataArr=[];

                vm.proList.forEach(function(el){
                    if(el.value.size() > 0){
                        dataArr=dataArr.concat(el.value);
                    }
                });
                if(dataArr.length > 0){
                    setLocalstorage('preFillorderHerf',window.location.href);
                    window.location.href="fillorder.html?"+serializaDataOther(dataArr,"codes");
                }
                // else{
                //     $.message({
                //         msg:'请至少选择一个商品！'
                //     });
                // }
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
        vm.caculateHeight();
        avalon.scan();
    });
})();
