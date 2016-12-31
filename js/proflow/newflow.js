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
            Lat:getLocalstorage('logLat') || 0,
            Lon:getLocalstorage('logLon') || 0,
            nowPageIndex:0,
            maxPageNum:999,
            taskDataModel:[],
            NowDateTime:'',
            isLoading:false,
            cacheNum:0,
            cacheDataModel:[],
            isLocation:true,
            sortCoulumn:'',
            filterName:'',
            filterValue:'',
            showMore:false,
            showLoading:false,
            showText:'点击加载更多',
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getLocation();
                    //vm.scrollFn();
                });
            },
            //获取当前定位
            getLocation:function(){
                // $.getAddress({
                //     callback:function(rs){
                //         if(rs){
                //             vm.isLocation = false;
                //             vm.Lat=rs.lat;
                //             vm.Lon=rs.lng;
                //             setLocalstorage('logLat',rs.lat);
                //             setLocalstorage('logLon',rs.lng);
                //             //vm.scrollFn();
                //             vm.getTaskList();
                //             vm.showMore = true;
                //         }
                //     },
                //     errorFn:function(){
                //         $.dialog({
                //             msg:'不能获取当前定位地址，是否需要重试？',
                //             sureFn:function(){
                //                 vm.getLocation();
                //             },
                //             cancelFn:function(){
                //                 vm.isLocation = false;
                //                 //vm.scrollFn();
                //                 vm.getTaskList();
                //                 vm.showMore = true;
                //             }
                //         })
                //     }
                // });
                vm.getTaskList();
                vm.showMore = true;

            },
            goDetailFn:function(el){
                window.location.href = 'detailflow.html?code='+el.Code;
            },
            //获取任务列表
            getTaskList:function(nodatafn){
                vm.showLoading = true;
                vm.isLocation = false;
                if(vm.nowPageIndex == 0) vm.nowPageIndex = 1;
                jsonp(host+'jsonp/Logistics_GetLogisOrderByPage_'+vm.version+'.js',{
                    token:token,
                    Lat:vm.Lat,
                    Lon:vm.Lon,
                    PageIndex:vm.nowPageIndex,
                    PageSize:10,
                    Status:1,
                    sortCoulumn:vm.sortCoulumn,
                    sortType:'Desc',
                    filterName:vm.filterName,
                    filterValue:vm.filterValue
                },'callback',function(rs){

                    if(rs.Success){
                        vm.showLoading = false;
                        var data = rs.Data;

                        if(data.length == 0){
                            nodatafn && nodatafn();
                            return;
                        }

                        vm.NowDateTime = rs.NowDateTime;

                        for(var i=0,j=data.length;i<j;i++){
                            // if(data[i].Type == 1){
                            //     data[i].showTime = data[i].PickTime;
                            // }
                            if(data[i].Remark){
                                data[i].realmark=dayDir[data[i].Remark.split(',')[0]]+ timeDir[data[i].Remark.split(',')[1]];
                            }
                            data[i].isRob = false;
                            vm.taskDataModel.push(data[i]);
                        }
                        if(rs.TotalPages <= 1){
                            nodatafn && nodatafn();
                        }
                        vm.maxPageNum=rs.TotalPages;
                        if(rs.TotalPages === 1){
                            vm.showText = '没有更多数据了';
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
                    Status:1,
                    beginTime:vm.NowDateTime
                },'callback',function(rs){
                    if(rs.Success){
                        vm.isLocation = false;
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
                // vm.cacheDataModel.forEach(function(el){
                //     vm.taskDataModel.unshift(el);
                // });
                vm.cacheNum = 0;
                vm.nowPageIndex = 0;
                vm.taskDataModel = [];
                vm.getTaskList();
                // vm.cacheDataModel = [];
            },
            //接单
            robOrderFn:function(el,remove){
                $.dialog({
                    msg:'确认抢单？',
                    sureFn:function(){
                        el.isRob = true;
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
                    },
                    cancelFn:function(){

                    }
                });
            },
            tapItemFn:function($event){
                var oZoom = $('.zoom'),
                    obj = $(this),
                    oFilter=$('.silder-filter');

                if(obj.find('.silder-filter').css('display') === 'none'){
                    oZoom.show();
                    oFilter.hide();
                    obj.find('.silder-filter').show();
                }else if(obj.find('.silder-filter').css('display') === 'block'){
                    oZoom.hide();
                    obj.find('.silder-filter').hide();
                }

                $event.stopPropagation();
            },
            closeIntemFn:function(){
                var oZoom = $('.zoom');

                oZoom.hide();
                $('.silder-filter').hide();
            },
            filterFn:function(fName,fValue,$event){
                var oZoom = $('.zoom'),
                    obj = $(this),
                    oFilter=$('.silder-filter');

                vm.filterName = fName;
                vm.filterValue = fValue;
                vm.sortCoulumn = '';

                vm.taskDataModel = [];
                vm.nowPageIndex = 0;

                vm.getTaskList();

                oZoom.hide();
                oFilter.hide();
                obj.find('.silder-filter').hide();
                $event.stopPropagation();
            },
            filterOtherFn:function(sName,$event){
                var oZoom = $('.zoom'),
                    obj = $(this),
                    oFilter=$('.silder-filter');

                vm.filterName = '';
                vm.filterValue = '';
                vm.sortCoulumn = sName;

                vm.taskDataModel = [];
                vm.nowPageIndex = 0;

                vm.getTaskList();

                oZoom.hide();
                oFilter.hide();
                obj.find('.silder-filter').hide();
                $event.stopPropagation();
            },
            scrollFn:function(){
                vm.isLocation = false;
                $('.newflow ul').dropload({
                    scrollArea : $('.newflow'),
                    loadDownFn : function(me){
                        vm.nowPageIndex++;

                        if(vm.nowPageIndex <= vm.maxPageNum){
                            vm.getTaskList(function(){
                                me.$domDown.html(me.opts.domDown.domNoData);
                            });
                        }else{
                            vm.nowPageIndex = vm.maxPageNum;
                            me.isData = false;
                        }
                        me.resetload();
                    }
                });
            },
            loadingMore:function(){
                vm.nowPageIndex++;

                if(vm.nowPageIndex <= vm.maxPageNum){
                    vm.getTaskList();
                }else{
                    vm.nowPageIndex = vm.maxPageNum;
                    vm.showText = '没有更多数据了';
                }
            }
        });

        vm.getVersion();
        avalon.scan();

    });

})();