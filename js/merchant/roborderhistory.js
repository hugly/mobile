/**
 * Created by hulgy on 16/8/1.
 */
(function(){
    'use strict';

    var dayDir={
        0:'随时',
        1:'周一至周五',
        2:'周末'
    };
    var timeDir={
        0:'随时',
        1:'早上',
        2:'中午',
        3:'晚上'
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
            beginTime:'',
            pollingDataModel:[],
            showTips:false,
            totalNum:0,
            loadingImgShow:true,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getRobOrderList();
                });
            },
            //获取商家抢单列表
            getRobOrderList:function(){
                vm.robOrderList = [];
                jsonp(host+'jsonp/Booking_PagingRecord_'+vm.version+'.js',{
                    token:token,
                    SortType:1,
                    PageIndex:vm.nowPageIndex,
                    PageSize:8,
                    SortColumn:vm.SortColumn
                },'callback',function(rs){
                    var data=rs.Data;
                    vm.loadingImgShow = false;
                    if(!data){
                        vm.loadingImgShow = false;
                        return;
                    }
                    for(var i= 0,j=data.length;i<j;i++){
                        var substr='';

                        if(data[i].Products){
                            for(var n= 0,m=data[i].Products.length;n<m;n++){
                                var str=data[i].Products[n].ProductName+data[i].Products[n].Number+'件,';
                                substr += str;
                            }
                        }

                        if(data[i].ThirdCode){
                            data[i].linkUrl = '../merchant/orderinfo.html?type=seller&code='+data[i].ThirdCode;
                        }else{
                            data[i].linkUrl = '../merchant/roborderhistorydetail.html?code='+data[i].Code
                        }

                        data[i].proList=substr;
                        data[i].WashSaleType=washTypeDir[data[i].BookingRequest.WashSaleType];
                        data[i].sendTime=dayDir[data[i].SendDateRangeType]+" "+timeDir[data[i].SendTimeRangeType];

                        vm.robOrderList.push(data[i]);
                    }
                    vm.maxPageNum = rs.TotalPages;
                    vm.beginTime = rs.NowDateTime;

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

                vm.getRobOrderList();
            }
        });

        //vm.$watch("selected", function(v) {
        //    var t = 1;
        //    vm.robOrderList.sort(function(a, b) {
        //        var ret = a[v] > b[v] ? 1 : -1
        //        return t * ret
        //    })
        //});
        var a = new $.scrollLoad({
            mainDiv: $(".order-box"),
            buttonLength: 50,
            ajaxFn: function (){
                vm.nowPageIndex++;

                if(vm.nowPageIndex <= vm.maxPageNum){
                    vm.getRobOrderList();
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