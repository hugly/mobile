/**
 * Created by hulgy on 30/09/2016.
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

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"newtask",
            //版本号
            version:0,
            Lat:0,
            Lon:0,
            nowPageIndex:1,
            maxPageNum:0,
            loadingImgShow:true,
            showLocation:false,
            taskDataModel:[],
            NowDateTime:'',
            isLoading:false,
            cacheNum:0,
            cacheDataModel:[],
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getLocation();
                    //vm.getTaskList(false);
                });
            },
            //获取当前定位
            getLocation:function(){
                $.getAddress({
                    callback:function(rs){
                        if(rs){
                            vm.showLocation = false;
                            vm.Lat=rs.lat;
                            vm.Lon=rs.lng;

                            vm.getTaskList(false);
                        }
                    },
                    errorFn:function(){
                        vm.showLocation = true;
                        vm.getTaskList(false);
                    }
                });
            },
            //获取任务列表
            getTaskList:function(status){
                if(vm.nowPageIndex == 0) vm.nowPageIndex = 1;
                jsonp(host+'jsonp/Logistics_GetLogisOrderByPage_'+vm.version+'.js',{
                    token:token,
                    Lat:vm.Lat,
                    Lon:vm.Lon,
                    PageIndex:vm.nowPageIndex,
                    PageSize:6
                },'callback',function(rs){

                    if(rs.Success){
                        vm.loadingImgShow = false;
                        var data = rs.Data;

                        vm.NowDateTime = rs.NowDateTime;

                        for(var i=0,j=data.length;i<j;i++){
                            if(data[i].Type == 1){
                                data[i].showTime = data[i].PickTime;
                            }else if(data[i].Type == 2){

                            }

                            if(data[i].Remark){
                                data[i].realmark=dayDir[data[i].Remark.split(',')[0]]+ timeDir[data[i].Remark.split(',')[1]];
                            }
                            data[i].isRob = false;

                            if(status){
                                vm.taskDataModel.push(data[i]);
                            }
                        }
                        vm.maxPageNum=rs.TotalPages;

                        if(!status){
                            vm.taskDataModel = data;
                        }
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }

                    setInterval(function(){
                        if(!vm.isLoading){
                            vm.roundTaskList()
                        }
                    },10000);
                },function(){
                });
            },
            //轮询API
            roundTaskList:function(){
                vm.isLoading = true;
                jsonp(host+'jsonp/Logistics_GetLogisticsOrderList_'+vm.version+'.js',{
                        token:token,
                        Lat:vm.Lat,
                        Lon:vm.Lon,
                        beginTime:vm.NowDateTime
                    },'callback',function(rs){
                        if(rs.Success){
                            vm.loadingImgShow = false;
                            var data = rs.Data;

                            vm.NowDateTime = rs.NowDateTime;

                            vm.isLoading = false;
                            if(data.length == 0) return;

                            for(var i=0,j=data.length;i<j;i++){
                                if(data[i].Type == 1){
                                    data[i].showTime = data[i].PickTime;
                                }

                                if(data[i].Remark){
                                    data[i].realmark=dayDir[data[i].Remark.split(',')[0]] + timeDir[data[i].Remark.split(',')[1]];
                                }
                                data[i].isRob = false;
                                vm.cacheDataModel.unshift(data[i]);
                            }

                            vm.cacheNum += data.length;
                        }else{
                            $.message({
                                msg:rs.Msg
                            });
                        }
                },function(){
                });
            },
            pushFn:function(){
                vm.cacheDataModel.forEach(function(el){
                    vm.taskDataModel.unshift(el);
                });
                vm.cacheNum = 0;
                vm.cacheDataModel = [];
            },
            //接单
            robOrderFn:function(el,remove){
                el.isRob = true;
                //Logistics_ApplyLogistics_9.js?
                jsonp(host+'jsonp/Logistics_ApplyLogistics_'+vm.version+'.js',{
                    token:token,
                    Code:el.Code
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'接单成功!',
                            callback:function(){
                                el.isRob = false;
                                remove();
                            }
                        });
                    }else{
                        $.message({
                            msg:rs.Msg,
                            callback:function () {
                                el.isRob = false;
                            }
                        });
                    }
                },function(){
                });
            }
        });

        var a = new $.scrollLoad({
            mainDiv: $(".tasklist"),
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