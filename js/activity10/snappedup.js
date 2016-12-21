/**
 * Created by hulgy on 16/6/1.
 */
(function(){
    var myScroll;
    'use strict';
    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"snappedUp",
            //版本号
            version:"",
            //总价格
            totalPrice:0,
            //总商品数量
            totalNum:0,
            top:0,
            //是否显示
            isshow:false,
            //tabindex
            tabindex:0,
            typeinex:parseInt($.getUrlParam('typeindex')),
            //当前洗衣类型
            SaleWashTypeCode:1,
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
            //第三级数据模型
            thirdDataModel:{
                Children:[]
            },
            canUse:false,
            //是否显示类别菜单
            isShowTypebox:false,
            caculateHeight:function(){
                var fontSize=$(window).width()/16,
                    heigt = $(window).height()/fontSize;

                $('.order-type,.order-con').height(heigt-2+'rem');
                //myScroll = new IScroll('#ordercon', { scrollX: true, freeScroll: true });
                //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
                simpScroller(document.querySelector('.order-con'));
            },
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.checkUsrIsUse();
                });
            },
            checkUsrIsUse:function(){
                jsonp(host+'jsonp/DiscountActivity_HasJoinOnePrice_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        if(!rs.Data){
                            vm.canUse = true;
                        }
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            backFn:function(){
                vm.isshow = false;
            },
            serverFn:function(num){
                vm.isshow = true;
                vm.SaleWashTypeCode = num;
                vm.getNextByMainID();
            },
            showTypeBoxFn:function(el){
                vm.isShowTypebox = true;
                vm.thirdDataModel = el;
            },
            changeTypeFn:function(el){
                vm.thirdDataModel.Children.forEach(function(item){
                    item.isSelect = false;
                });

                el.isSelect = true;
            },
            clooseFn:function(){
                vm.isShowTypebox = false;
            },
            //获取店铺销售属性下一级分类
            getNextByMainID:function(){
                vm.categoryList = [];
                jsonp(host+'/jsonp/ShopSale_GetOnePriceSaleCategory_'+vm.version+'.js',{
                    token: token,
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
                jsonp(host+'/jsonp/shopSale_GetOnePriceSubCategoryPrice_'+vm.version+'.js',{
                    token: token,
                    SaleType:vm.SaleWashTypeCode,
                    CategoryCode:vm.SaleCategoryCode
                },'callback',function(rs){
                    var data=rs.Data;
                    for(var i= 0,j=data.length;i<j;i++){
                        if(data[i].Children){
                            data[i].num=0;
                            var secondData = data[i].Children;

                            if(secondData.length > 0){
                                for(var n = 0,m = secondData.length;n<m;n++){
                                    secondData[n].num=0;
                                    secondData[n].isSelect = false;
                                    secondData[n].type=vm.SaleWashTypeCode;
                                }
                                secondData[0].isSelect = true;
                            }

                        }else{
                            data[i].num=0;
                            data[i].type=vm.SaleWashTypeCode;
                        }
                    }
                    vm.subcateList=data;
                    vm.loadingImgShow = false;
                },function(){
                },'fixedCallFn3');
            },
            //选择品类
            chooseCate:function(el){
                if(vm.loadingImgShow) return;

                if(vm.SaleCategoryCode ==  el.CategoryCode) return;
                // var cate=avalon(this).data("cate");
                vm.SaleCategoryCode=el.CategoryCode;
                vm.SubCategoryCode="";


                vm.getPriceListByMix();
            },
            //去结算
            settlementFn:function(el){
                setLocalstorage('preFillorderHerf',window.location.href);
                window.location.href="../main/fillorder.html?codes["+el.Code+"]=1";
            }
        });

        vm.getVersion();
        vm.caculateHeight();
        avalon.scan();
    });
})();
