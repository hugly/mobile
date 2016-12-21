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
            ShopCode: '',
            //总价格
            totalPrice:0,
            //总商品数量
            totalNum:0,
            //是否显示
            isshow:'100',
            //tabindex
            tabindex:0,
            //店铺信息
            shopInfo:{},
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
            SaleWashTypeCode: parseInt($.getUrlParam('washtype')) || 1,
            //订单code
            ordercode: parseInt($.getUrlParam('ordercode')) || '',
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
            //url商品
            urlProList:[],
            //商品总数
            proLen:0,
            loadingImgShow:true,
            //url参数
            searchData:'',
            //将url参数转化为arr
            urlData:[],
            //是否显示类别菜单
            isShowTypebox:false,
            //第三级数据模型
            thirdDataModel:{
                Children:[]
            },
            //获取版本号
            getVersion:function(){
                vm.caculate();
                vm.getProByUrl();
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getMainList();
                });
                vm.searchData=window.location.search.split('?')[1];
                vm.urlData=transUrl2List();
            },
            showTypeBoxFn:function(el){
                vm.isShowTypebox = true;
                vm.thirdDataModel = el;
            },
            clooseFn:function(){
                vm.isShowTypebox = false;
            },
            //获取url的商品数目
            getProByUrl:function(){
                var str= $.getUrlParam('provalue'),
                    arr=str.split(',');

                for(var i= 0,j=arr.length;i<j;i++){
                    var code =arr[i].split('-')[0];
                    if( code.indexOf('codes') != -1){
                        vm.proList[vm.SaleWashTypeCode-1].value.push({
                            code:code.split('[')[1].split(']')[0],
                            name:decodeURI(arr[i].split('-')[1]),
                            num:parseInt(arr[i].split('-')[2]),
                            type:vm.SaleWashTypeCode
                        });
                    }
                }
                vm.getAllInfo();
            },
            //计算高度
            caculate:function(){
                // var oDetail=$('.header-detail').height(),
                //     oBottom=$('.bottom-silder').height(),
                //     oOrder= $('.order-fn').height(),
                //     height=$(document).height();

                var fontSize=$(window).width()/16,
                    heigt = $(window).height()/fontSize;

                $(".order-type,.order-con").height(heigt-6.3+'rem');
                simpScroller(document.querySelector('.order-con'));
            },
            //获取店铺销售属性
            getMainList:function(){
                vm.tabindex=0;
                jsonp(sildHost+'/jsonp/Shop_GetSaleWashType_'+vm.version+'.js',{
                    token: token,
                    ShopCode:'20160907111900190180'
                },'callback',function(rs){
                    if(rs.Data.length > 0){
                        //vm.SaleWashTypeCode=rs.Data[0].SaleWashType;
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
                    ShopCode:'20160907111900190180',
                    SaleType:vm.SaleWashTypeCode
                },'callback',function(rs){
                    vm.SaleCategoryCode=rs.Data[0].CategoryCode;
                    vm.categoryList=rs.Data;
                    vm.getPriceListByMix();
                },function(){
                });
            },
            //获取店铺销售属性和一级分类下的价格信息集合
            getPriceListByMix:function(){
                jsonp(sildHost+'/jsonp/Shop_GetSubCategoryPrice_'+vm.version+'.js',{
                    token: token,
                    ShopCode:'20160907111900190180',
                    SaleType:vm.SaleWashTypeCode,
                    CategoryCode:vm.SaleCategoryCode,
                    SubCategoryCode:vm.SubCategoryCode
                },'callback',function(rs){
                    var data=rs.Data;
                    // for(var i= 0,j=data.length;i<j;i++){
                    //     data[i].num=0;
                    //     data[i].type=vm.SaleWashTypeCode;
                    // }
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
                    vm.refreshData();
                },function(){
                });
            },
            //数量加操作
            addFn:function($index){
                var type=parseInt(avalon(this).data("type")),
                    code=avalon(this).data("id"),
                    obj=vm.getObjByCode(code),
                    parentObj = vm.getParentObjByCode(code);

                parentObj.num ++;
                obj.num ++;

                if(vm.proList[type-1].value.size() > 0){
                    for(var i= 0,j= vm.proList[type-1].value.length;i<j;i++){
                        var el=vm.proList[type-1].value[i];

                        if(code === el.code || code === el.Code){
                            if(obj.num){
                                el.num=obj.num;
                            }else{
                                el.num++;
                            }
                            vm.getAllInfo();

                            if(vm.totalPrice === 0){
                                vm.isshow = '100';
                            }

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

                if(vm.totalPrice === 0){
                    vm.isshow = '100';
                }

                vm.getAllInfo();

            },
            //数量减操作
            reFn:function($remove,$index){
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
                            return;
                        }
                    }
                }

                vm.getAllInfo();
            },
            changeTypeFn:function(el){
                vm.thirdDataModel.Children.forEach(function(item){
                    item.isSelect = false;
                });

                el.isSelect = true;
            },
            //选择大分类
            chooseType:function(){
                var type=parseInt(avalon(this).data("type"));
                vm.SaleWashTypeCode=type;
                vm.SaleCategoryCode="";
                vm.SubCategoryCode="";

                var json={
                    'washtype':vm.SaleWashTypeCode
                };
                vm.urlData=jsonInList(json,vm.urlData);
                vm.searchData=transList2Url(vm.urlData.$model);

                vm.getNextByMainID();
            },
            //选择品类
            chooseCate:function(){
                var cate=avalon(this).data("cate");
                vm.SaleCategoryCode=cate;
                vm.SubCategoryCode="";

                vm.getPriceListByMix();
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
                // var obj={};
                // vm.subcateList.forEach(function(el){
                //     if(code === el.Code){
                //         obj=el;
                //     }
                // });
                // return obj;
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

                // vm.subcateList.forEach(function(el){
                //     el.num=0;
                // });

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
                var dataArr=[],
                    len=0;

                vm.proList[vm.SaleWashTypeCode-1].value.forEach(function(el){
                    dataArr.push(el);
                });

                for(var n= 0,m=dataArr.length;n<m;n++){
                    len+=parseInt(dataArr[n].num);
                }
                if(vm.ordercode){
                    //TODO
                }else{
                    window.location.href="book.html?"+ $.removeUrlParamWithData('provalue',vm.searchData)+'&'+serializationData(dataArr,"codes",true,len);
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
