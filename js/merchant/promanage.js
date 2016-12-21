/**
 * Created by hulgy on 16/6/29.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:'promanage',
            //版本号
            version:0,
            //销售属性数据模型 如:干洗熨烫、清洗保养、奢侈护理等等
            saleWashType:[],
            //二级分类数据模型
            secondList:[],
            //三级分类数据模型
            thirdList:[],
            //是否显示右侧弹出层
            isShow:false,
            //当前销售属性type
            currentType:'',
            //二级栏目code
            secondType:0,
            //类别名称
            typeName:'',
            //是否发生了改变
            isChange:false,
            //高度
            height:0,
            //上一级数据模型
            preData:{},
            loadingImgShowOther:true,
            loadingImgShow:true,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getWashType();
                    vm.calcute();
                });
            },
            //获取销售属性
            getWashType:function(){
                jsonp(host+'/jsonp/ShopSale_GetSaleWashType_'+vm.version+'.js',{
                    token: token
                },'callback',function(rs){
                    vm.loadingImgShow = false;
                    if(rs.Success && rs.Data.length > 0){
                        vm.saleWashType=rs.Data;
                        if(vm.currentType === ''){
                            vm.currentType=rs.Data[0].SaleWashType;
                        }
                        vm.getSecondClass();
                    }
                },function(){
                });
            },
            changeCurrentTypeFn:function(el){
                vm.currentType = el.SaleWashType;
                vm.secondList = [];
                vm.getSecondClass();
            },
            //根据销售属性获取二级分类
            getSecondClass:function(){
                //m.wziwash.com//jsonp/ShopSale_GetShopCategoryPriceBySaleType_9.js?callback=test&token=3dd9jddd84jwe3&SaleType=1
                jsonp(host+'/jsonp/ShopSale_GetShopCategoryPriceBySaleType_'+vm.version+'.js',{
                    token: token,
                    SaleType:vm.currentType
                },'callback',function(rs){
                    var data = rs.Data;

                    vm.loadingImgShow = false;
                    if(rs.Success && data.length > 0){
                        for(var i= 0,j=data.length;i<j;i++){
                            if(!data[i].IsSetPrice){
                                data[i].Price = '';
                            }
                        }
                        vm.secondType = data[0].CategoryCode;
                        vm.secondList = data;
                        //vm.getThirdClass();
                    }
                },function(){
                });
            },
            //根据二级分类code获取三级分类
            getThirdClass:function(el){
                //m.wziwash.com//jsonp/ShopSale_GetShopSubCategoryPriceBySaleTypeAndCategoryCode_9.js?callback=test&token=3dd9jddd84jwe3&SaleType=1&CategoryCode=
                jsonp(host+'/jsonp/ShopSale_GetShopSubCategoryPriceBySaleTypeAndCategoryCode_'+vm.version+'.js',{
                    token: token,
                    SaleType:vm.currentType,
                    CategoryCode:vm.secondType
                },'callback',function(rs){
                    var data = rs.Data;

                    vm.loadingImgShowOther = false;
                    if(!el.IsSale){
                        for(var i= 0,j=data.length;i<j;i++){
                            data[i].IsSale = false;
                        }
                    }

                    if(rs.Success && data.length > 0){
                        vm.thirdList = data;
                    }
                },function(){
                });
            },
            //点击二级菜单获取第三级菜单
            showThirdFn:function(el){
                vm.typeName = el.CategoryName;
                vm.secondType = el.CategoryCode;
                vm.preData = el;
                vm.getThirdClass(el);
                vm.isShow = !vm.isShow;
            },
            //改变显示状态
            changeShowState:function(el){
                el.IsSale = !el.IsSale;

                jsonp(host+'/jsonp/ShopSale_SaveSinglePrice_'+vm.version+'.js',{
                    token: token,
                    Type:1,
                    ActionType:2,
                    WashSaleType:vm.currentType,
                    CategoryCode:el.CategoryCode,
                    IsCkeck:el.IsSale
                },'callback',function(rs){
                },function(){
                });

            },
            focusFn:function(e){
                e.stopPropagation();
            },
            changeShow:function(el,e){
                el.IsSale = !el.IsSale;
                vm.isChange = true;

                jsonp(host+'/jsonp/ShopSale_SaveSinglePrice_'+vm.version+'.js',{
                    token: token,
                    Type:2,
                    ActionType:2,
                    WashSaleType:vm.currentType,
                    CategoryCode:el.CategoryCode,
                    IsCkeck:el.IsSale
                },'callback',function(rs){
                },function(){
                });

                e.stopPropagation();
            },
            //修改显示装填
            hideZoomer:function(){
                vm.isShow = !vm.isShow;
                vm.getWashType();
            },
            //阻止默认事件
            preventFn:function(e){
                e.stopPropagation();
            },
            //监听第二级数据变化
            changSecFn:function(obj){
                var setPrice = true;

                if(obj.Price === ''){
                    setPrice = false;
                }

                jsonp(host+'/jsonp/ShopSale_SaveSinglePrice_'+vm.version+'.js',{
                    token: token,
                    Type:1,
                    ActionType:1,
                    WashSaleType:vm.currentType,
                    CategoryCode:obj.CategoryCode,
                    HasSetPrice:setPrice,
                    Price:obj.Price
                },'callback',function(rs){
                },function(){
                });


                vm.thirdList.forEach(function(el){
                    el.Price = obj.Price;
                });
            },
            //监听值变化
            changeFn:function(el){
                var setPrice = true;
                vm.isChange = true;

                if(el.Price === ''){
                    setPrice = false;
                }

                jsonp(host+'/jsonp/ShopSale_SaveSinglePrice_'+vm.version+'.js',{
                    token: token,
                    Type:2,
                    ActionType:1,
                    WashSaleType:vm.currentType,
                    CategoryCode:el.CategoryCode,
                    HasSetPrice:setPrice,
                    Price:el.Price
                },'callback',function(rs){
                },function(){
                });
            },
            //计算值
            calcute:function(){
                var fontSize=$(window).width()/16;
                vm.height = $(window).height()-fontSize*2.5;
            }
        });

        vm.getVersion();
        avalon.scan();
    });

})();