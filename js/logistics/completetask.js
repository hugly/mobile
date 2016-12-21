/**
 * Created by hulgy on 01/10/2016.
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
            nowPageIndex:1,
            maxPageNum:0,
            loadingImgShow:true,
            showLocation:false,
            taskDataModel:[],
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getTaskList(false);
                });
            },
            //获取任务列表
            getTaskList:function(status){
                jsonp(host+'jsonp/Logistics_PagingComplete_'+vm.version+'.js',{
                    token:token,
                    PageIndex:vm.nowPageIndex,
                    PageSize:10
                },'callback',function(rs){

                    if(rs.Success){
                        vm.loadingImgShow = false;
                        var data = rs.Data;

                        for(var i=0,j=data.length;i<j;i++){
                            if(data[i].Logistics.Type == 1){
                                data[i].Logistics.showTime = data[i].Logistics.PickTime;
                            }
                            if(data[i].Remark){
                                data[i].Logistics.realmark=dayDir[data[i].Logistics.Remark.split(',')[0]] + timeDir[data[i].Logistics.Remark.split(',')[1]];
                            }
                            data[i].Logistics.isRob = false;
                            data[i].showStatus = statusModel[data[i].Logistics.Status];

                            if(status){
                                vm.taskDataModel.push(data[i]);
                            }
                        }

                        if(!status){
                            vm.taskDataModel = data;
                        }

                        vm.maxPageNum=rs.TotalPages;
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }

                },function(){
                });
            }
        });

        var a = new $.scrollLoad({
            mainDiv: $(".taskitem"),
            buttonLength: 50,
            ajaxFn: function (){
                vm.nowPageIndex++;

                if(vm.nowPageIndex <= vm.maxPageNum){
                    vm.getTaskList(true);
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