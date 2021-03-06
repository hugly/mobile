/**
 * Created by hulgy on 20/11/2016.
 */
(function(){
    'use strict';

    require(['mmRequest','domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"list",
            //列表数据模型
            listData:[],
            //品牌数据模型
            FacetsData:[],
            FacArr:[],
            //搜索关键字
            keyword: decodeURI($.getUrlParam('key')) || "",
            title: decodeURI($.getUrlParam('title')) || '品牌馆',
            //排序名称
            SortColumn:"",
            //排序值
            SortType:0,
            //经纬度
            Lat:getLocalstorage('lat') || 0,
            //经纬度
            Lon:getLocalstorage('lon') || 0,
            //是否显示排序选项
            showSort:'100%',
            //是否显示筛选视图部分
            showFilter:16,
            loadingImgShow:true,
            nowPageIndex:1,
            maxPageNum:0,
            WashSaleType: $.getUrlParam('washtype') || '',
            typeStr:'智能排序',
            service:[
                {tip:'干',name:'干洗熨烫',type:1,isSelect:false},
                {tip:'水',name:'清洗保养',type:2,isSelect:false},
                {tip:'高',name:'奢侈护理',type:3,isSelect:false},
                {tip:'裁',name:'裁剪维修',type:4,isSelect:false}
            ],
            //url参数
            searchData:'',
            //将url参数转化为arr
            urlData:[],
            shopCode:$.getUrlParam('dataid') || '',
            //获取版本号
            getVersion:function(){
                vm.searchData=window.location.search.split('?')[1];
                vm.urlData=transUrl2List();
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getListData(true,true);
                });
            },
            goToDetailFn:function(el){

                if(vm.shopCode !== el.ShopCode){
                    vm.searchData = $.removeUrlParam('skus');
                    vm.urlData = transUrl2ListWithSearch($.removeUrlParam('skus'));
                }else{
                    vm.searchData=window.location.search.split('?')[1];
                    vm.urlData=transUrl2List();
                }

                var json={
                    dataid:el.ShopCode
                };
                vm.urlData=jsonInList(json,vm.urlData);
                vm.searchData=transList2Url(vm.urlData.$model);

                window.location.href = 'offline_shopdetail.html?'+vm.searchData;
            },
            //获取列表数据
            getListData:function(first,type){
                if(first){
                    vm.loadingImgShow = true;
                }

                jsonp(host+'/jsonp/Shop_Search_'+vm.version+'.js',{
                    token: token,
                    PageIndex:vm.nowPageIndex,
                    PageSize:10,
                    Keyword:vm.keyword || "",
                    Lat:vm.Lat || "",
                    Lon:vm.Lon || "",
                    SortColumn:vm.SortColumn,
                    SortType:vm.SortType,
                    WashSaleTypes:vm.WashSaleType,
                    //WashSaleType:vm.WashSaleType,
                    Fac:$.transJsonListToString(vm.FacArr,"Fac")
                },'callback',function(rs){
                    var data=rs.Data.Data;

                    for(var i= 0,j=data.length;i<j;i++){
                        var score = parseFloat(data[i].CommentScore) || 0;

                        data[i].CommentIntScore = (score/5)*3;

                        if(!type){
                            vm.listData.push(data[i]);
                        }
                    }

                    if(type){
                        vm.listData=data;
                    }
                    vm.maxPageNum=rs.Data.TotalPages;
                    var facetsArr = rs.Facets;

                    for(var n= 0,m=facetsArr.length;n<m;n++){
                        facetsArr[n].isSelect = false;
                    }
                    vm.FacetsData=facetsArr;
                    vm.loadingImgShow = false;
                },function(){
                });
            },
            //排序box Fn
            showSortFn:function(){
                if(vm.showSort === 0){
                    vm.showSort = '100%';
                }else{
                    vm.showSort = 0;
                }
            },
            //筛选box Fn
            showFilterFn:function(){
                vm.showFilter=0;
                vm.showSort = '100%';
            },
            dispelledFn:function(){
                vm.showSort='100%';
            },
            //选择排序
            chooseType:function(str,$event){
                var zobj=$(this),
                    avobj=avalon(this),
                    colnum=avobj.data("column");

                vm.loadingImgShow = true;
                vm.typeStr = str;

                zobj.addClass("active");
                zobj.siblings().removeClass("active");

                vm.SortColumn=colnum;

                if(colnum === 'location'){
                    vm.SortType = 1;
                }else{
                    vm.SortType = 0;
                }

                vm.showSort='100%';
                vm.nowPageIndex = 1;
                vm.maxPageNum = 0;
                vm.listData = [];
                vm.getListData(false,true);

                $event.stopPropagation();

            },
            //筛选确定操作
            sureFn:function($event){
                vm.showFilter=16;
                vm.getListData(false,true);
                $event.stopPropagation();
            },
            //选择商品
            chooseFacets:function(el,$event){
                var json={};

                vm.FacetsData.forEach(function(ele){
                    ele.isSelect = false;
                });
                el.isSelect = !el.isSelect;
                json[el.Name]=el.Code;

                if(el.isSelect){
                    vm.FacArr[0] = json;
                }else{
                    vm.FacArr=[];
                }
                //vm.FacArr.push(json);
                $event.stopPropagation();
            },
            closeFilter:function(){
                vm.showFilter=16;
            },
            returnFn:function($event){
                $event.stopPropagation();
            },
            chooseServiceFn:function(el){
                vm.service.forEach(function(el){
                    el.isSelect = false;
                });
                vm.WashSaleType = el.type;
                el.isSelect = !el.isSelect;
            }
        });


        var a = new $.scrollLoad({
            mainDiv: $(".listbox"),
            buttonLength: 50,
            ajaxFn: function (){
                vm.nowPageIndex++;

                if(vm.nowPageIndex <= vm.maxPageNum){
                    vm.getListData(false,false);
                }else{
                    vm.nowPageIndex = vm.maxPageNum;
                }
                a.ajaxSuccess();
            }
        });

        vm.getVersion();
        avalon.scan();
    });

})();