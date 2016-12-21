/**
 * Created by hulgy on 16/6/19.
 */
(function(){
    'use strict';

    var dayDir={
        1:'随时',
        2:'周一至周五',
        3:'周末'
    };
    var timeDir={
        1:'随时',
        2:'早上',
        3:'中午',
        4:'晚上'
    };

    var washTypeDir={
        1:'干洗熨烫',
        2:'清洗保养',
        3:'奢侈护理',
        4:'裁剪维修'
    };

    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:'roborder',
            //版本号
            version:"",
            //是否显示排序
            isShow:false,
            //排序规则
            sortType:1,
            //排序名称
            sortName:'智能排序',
            //排序字段
            selected:"CreateTime",
            SortColumn:'',
            //抢单列表数据
            robOrderList:[],
            bookIsLoadSuccess:true,
            nowPageIndex:1,
            maxPageNum:0,
            loadingImgShow:true,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getRobOrderList(true);
                });
            },
            //获取商家抢单列表
            getRobOrderList:function(type){
                if(type){
                    vm.loadingImgShow = true;
                }
                jsonp(host+'jsonp/Booking_GetPageBySsoUserCode_'+vm.version+'.js',{
                    token:token,
                    SortType:1,
                    PageIndex:vm.nowPageIndex,
                    PageSize:8,
                    SortColumn:vm.SortColumn
                },'callback',function(rs){
                    if(type){
                        vm.robOrderList = [];
                    }
                    vm.loadingImgShow = false;

                    var data=rs.Data;

                    for(var i= 0,j=data.length;i<j;i++){
                        var substr='';

                        if(data[i].products){
                            for(var n= 0,m=data[i].products.length;n<m;n++){
                                var str=data[i].products[n].SubCategoryName+data[i].products[n].Number+'件,';
                                substr += str;
                            }

                            data[i].proList=substr;
                        }

                        //data[i].WashSaleType=washTypeDir[data[i].WashSaleType];
                        data[i].sendTime=dayDir[data[i].SendDateRangeType]+" "+timeDir[data[i].SendTimeRangeType];

                        if(data[i].Status === 1){
                            data[i].activeUrl='../main/chooseshop.html?code='+data[i].Code;
                        }else if(data[i].Status === 2){
                            data[i].activeUrl='../main/quickbook.html?code='+ data[i].ThirdCode;
                        }else{
                            data[i].activeUrl= 'javascript:;';
                        }

                        vm.robOrderList.push(data[i]);
                    }
                    vm.maxPageNum = rs.TotalPages;
                    //vm.robOrderList=data;

                    //vm.robOrderList.forEach(function(el){
                    //    el.WashSaleType=washTypeDir[el.WashSaleType];
                    //    el.sendTime=dayDir[el.SendDateRangeType]+" "+timeDir[el.SendTimeRangeType];
                    //});

                },function(){
                });
            },
            //是否显示排序
            changeSort:function(){
                vm.isShow=!vm.isShow;
            },
            //排序规则选择
            sortData:function(index,name,type){
                //vm.selected=avalon(this).data('sort');
                vm.sortType=index;
                vm.sortName=name;
                vm.SortColumn = type;
                vm.isShow=!vm.isShow;

                vm.getRobOrderList(true);
            }
        });

        var a = new $.scrollLoad({
            mainDiv: $(".order-box"),
            buttonLength: 50,
            ajaxFn: function (){
                vm.nowPageIndex++;

                if(vm.nowPageIndex <= vm.maxPageNum){
                    vm.getRobOrderList(false);
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