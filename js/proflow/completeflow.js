/**
 * Created by hulgy on 17/12/2016.
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

    var statusModel={
        1:'待接单',
        2:'已接单',
        3:'配送中',
        4:'已完成'
    };

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"completetask",
            //版本号
            version:0,
            Lat:0,
            Lon:0,
            nowPageIndex:0,
            maxPageNum:999,
            loadingImgShow:true,
            showLocation:false,
            taskDataModel:[],
            sortCoulumn:'',
            filterName:'',
            filterValue:'',
            keyword: $.getUrlParam('key'),
            top:0,
            lastDataTime:'',
            endDataTime:'',
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.scrollFn();
                });
            },
            showSearchFn:function(){
                if(vm.top === 0){
                    vm.top = '2rem';
                }else{
                    vm.top = 0;
                }
            },
            getTaskFn:function(){
                var val = $(this).val(),
                    oDate = new Date(val);

                vm.lastDataTime = val + ' 00:00:00';
                oDate.setDate(oDate.getDate()+1);
                vm.endDataTime =  oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+oDate.getDate() + ' 00:00:00';

                vm.nowPageIndex = 1;
                vm.taskDataModel = [];
                vm.getTaskList();
            },
            //获取任务列表
            getTaskList:function(callback){
                jsonp(host+'jsonp/Logistics_GetLogisOrderByPage_'+vm.version+'.js',{
                    token:token,
                    PageIndex:vm.nowPageIndex,
                    PageSize:10,
                    Status:4,
                    sortCoulumn:vm.sortCoulumn,
                    sortType:'Desc',
                    filterName:vm.filterName,
                    filterValue:vm.filterValue,
                    Keyword:vm.keyword,
                    lastDateTime:vm.lastDataTime,
                    endDateTime:vm.endDataTime
                },'callback',function(rs){

                    if(rs.Success){
                        vm.loadingImgShow = false;
                        var data = rs.Data;

                        if(data.length === 0){
                            callback && callback();
                        }

                        for(var i=0,j=data.length;i<j;i++){
                            if(data[i].Type == 1){
                                data[i].showTime = data[i].PickTime;
                            }
                            if(data[i].Remark){
                                data[i].realmark=dayDir[data[i].Remark.split(',')[0]] + timeDir[data[i].Remark.split(',')[1]];
                            }
                            data[i].isRob = false;
                            data[i].showStatus = statusModel[data[i].Status];

                            vm.taskDataModel.push(data[i]);
                        }

                        vm.maxPageNum=rs.TotalPages;
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }

                },function(){
                });
            },
            scrollFn:function(){
                $('.complete ul').dropload({
                    scrollArea : $('.complete'),
                    loadDownFn : function(me){
                        vm.nowPageIndex++;

                        if(vm.nowPageIndex <= vm.maxPageNum){
                            vm.getTaskList(function(){
                                $('.dropload-down').html('<div class="dropload-noData">没有更多数据了</div>');
                            });
                        }else{
                            vm.nowPageIndex = vm.maxPageNum;
                            me.isData = false;
                        }
                        me.resetload();
                    }
                });
            }
        });

        vm.getVersion();
        avalon.scan();

    });

})();