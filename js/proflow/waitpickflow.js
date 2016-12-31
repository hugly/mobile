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

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"pickuptask",
            //版本号
            version:0,
            Lat:getLocalstorage('logLat') || 0,
            Lon:getLocalstorage('logLon') || 0,
            nowPageIndex:1,
            maxPageNum:999,
            loadingImgShow:true,
            showLocation:false,
            taskDataModel:[],
            sortCoulumn:'OrderDate',
            filterName:'',
            filterValue:'',
            hasTimeDataModel:[],
            modifyDataModel:{},
            isModifing:false,
            showLoading:false,
            showText:'点击加载更多',
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    //vm.scrollFn();
                    vm.getTaskList(false);
                });
            },
            //获取任务列表
            getTaskList:function(nodatafn){
                vm.showLoading = true;
                jsonp(host+'jsonp/Logistics_GetLogisOrderByPage_'+vm.version+'.js',{
                    token:token,
                    Lat:vm.Lat,
                    Lon:vm.Lon,
                    PageIndex:vm.nowPageIndex,
                    PageSize:10,
                    Status:2,
                    sortCoulumn:vm.sortCoulumn,
                    sortType:'Desc',
                    filterName:vm.filterName,
                    filterValue:vm.filterValue
                },'callback',function(rs){

                    if(rs.Success){
                        vm.showLoading = false;
                        vm.loadingImgShow = false;
                        var data = rs.Data;

                        if(data.length == 0){
                            nodatafn && nodatafn();
                        }

                        for(var i=0,j=data.length;i<j;i++){
                            // if(data[i].Type == 1){
                            //     data[i].showTime = data[i].PickTime;
                            // }
                            if(data[i].Remark){
                                data[i].realmark=dayDir[data[i].Remark.split(',')[0]] + timeDir[data[i].Remark.split(',')[1]];
                            }

                            if(data[i].RemainTime > 0){

                                var oldTime = new Date(data[i].PickTime).getTime(),
                                    nowTime = new Date(data[i].CreateTime).getTime(),
                                    subTime = parseInt((oldTime-nowTime)/1000),
                                    json = {
                                        timer:null,
                                        code:data[i].Code,
                                        RemainTime:parseInt(data[i].RemainTime),
                                        subTime:subTime
                                    };

                                vm.hasTimeDataModel.push(json);
                            }

                            data[i].isRob = false;
                            data[i].isVerfy = false;
                            data[i].isPick = false;
                            data[i].showSilder = false;
                            vm.taskDataModel.push(data[i]);
                        }

                        if(rs.TotalPages <= 1){
                            nodatafn && nodatafn();
                        }

                        vm.maxPageNum=rs.TotalPages;
                        if(rs.TotalPages === 1){
                            vm.showText = '没有更多数据了';
                        }
                        vm.timerFn();
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
                vm.nowPageIndex = 1;
                vm.taskDataModel = [];
                vm.getTaskList();
                // vm.cacheDataModel = [];
            },
            timerFn:function(){
                var obj = $('.waitpickflow ul');
                vm.hasTimeDataModel.forEach(function(item){
                    clearInterval(item.timer);
                    item.timer = setInterval(function(){
                        item.RemainTime --;
                        item.scale = (1-(item.RemainTime/item.subTime))*100;

                        obj.find('li').each(function(){
                            var _this = this,
                                code = $(_this).attr('code');

                            if(code === item.code){
                                $(_this).find('.flow-timeline em').html('<i class="iconfont icon-chulizhong"></i>'+dao2time(parseInt(item.RemainTime)));
                                $(_this).find('.flow-timeline span').css({width:item.scale+'%'})
                            }

                        });

                        if(item.RemainTime <= 0){
                            clearInterval(item.timer);
                        }

                    },1000);
                });
            },
            scrollFn:function(){
                $('.waitpickflow ul').dropload({
                    scrollArea : $('.waitpickflow'),
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
            },
            verifyFn:function(el){

                if(!el.HasItem){
                    setLocalstorage('inComLink',window.location.href);
                    window.location.href='../merchant/pickchooseclassical.html?ordercode='+el.OCode+'&shopcode='+el.ShopCode;

                }else{
                    window.location.href='../logistics/verfylist.html?tcode='+el.TCode+'&ocode='+el.OCode;
                    setLocalstorage('verifyLink',window.location.href);
                }

            },
            tapItemFn:function($event){
                var oZoom = $('.zoom1'),
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
                var oZoom = $('.zoom1');

                oZoom.hide();
                $('.silder-filter').hide();
            },
            filterFn:function(fName,fValue,$event){
                var oZoom = $('.zoom1'),
                    obj = $(this),
                    oFilter=$('.silder-filter');

                vm.filterName = fName;
                vm.filterValue = fValue;
                vm.sortCoulumn = '';

                vm.taskDataModel = [];
                vm.nowPageIndex = 1;

                vm.getTaskList();

                oZoom.hide();
                oFilter.hide();
                obj.find('.silder-filter').hide();
                $event.stopPropagation();
            },
            filterOtherFn:function(sName,$event){
                var oZoom = $('.zoom1'),
                    obj = $(this),
                    oFilter=$('.silder-filter');

                vm.filterName = '';
                vm.filterValue = '';
                vm.sortCoulumn = sName;

                vm.taskDataModel = [];
                vm.nowPageIndex = 1;

                vm.getTaskList();

                oZoom.hide();
                oFilter.hide();
                obj.find('.silder-filter').hide();
                $event.stopPropagation();
            },
            showOperFn:function(el){
                el.showSilder = !el.showSilder;
            },
            cancelFn:function(el,$remove){
                var obj = $(this);

                $.dialog({
                    msg:'确定取消该物流单？',
                    sureFn:function(){
                        jsonp(host+'jsonp/Logistics_Cancel_'+vm.version+'.js',{
                            token:token,
                            code:el.Code
                        },'callback',function(rs){
                            if(rs.Success){
                                $remove();
                            }else{
                                $.message({
                                    msg:rs.Msg
                                })
                            }

                            vm.isModifing = false;
                        },function(){
                        });
                    },
                    cancelFn:function(){

                    }
                });

            },
            showModifyFn:function(el){
                var oModify = $('.modify-box'),
                    oZoom = $('.zoom');

                el.showSilder = false;
                el.PickTime = el.PickTime.replace(' ','T');
                vm.modifyDataModel = el;

                oModify.show();
                oZoom.show();

            },
            closeModifyFn:function(){
                var oModify = $('.modify-box'),
                    oZoom = $('.zoom');

                oModify.hide();
                oZoom.hide();
            },
            modifyFn:function(el){
                var oModify = $('.modify-box'),
                    oZoom = $('.zoom');

                vm.isModifing = true;
                jsonp(host+'jsonp/Logistics_Edit_'+vm.version+'.js',{
                    token:token,
                    code:el.Code,
                    orderTime:$('#time').val().replace('T',' '),
                    address:$('#address').val(),
                    remark:$('#remark').val()
                },'callback',function(rs){
                    if(rs.Success){
                        el.Remark = $('#remark').val();
                        el.PickTime = $('#time').val().replace('T',' ');
                        oModify.hide();
                        oZoom.hide();
                    }else{
                        $.message({
                            msg:rs.Msg
                        })
                    }

                    vm.isModifing = false;
                },function(){
                });
            },
            goDetailFn:function(el){
                window.location.href = 'detailflow.html?code='+el.Code;
            },
            hasPickFn:function(el,remove){
                $.dialog({
                    msg:'请确认所有商品已完成核实，确认送达？',
                    sureFn:function(){
                        el.isPick = true;
                        jsonp(host+'jsonp/Logistics_ApplyPickComplete_'+vm.version+'.js',{
                            token:token,
                            logisticsCode:el.Code,
                            oCode:el.OCode
                        },'callback',function(rs){
                            if(rs.Success){
                                $.message({
                                    msg:'取货成功！',
                                    callback:function(){
                                        remove();
                                        el.isPick = false;
                                    }
                                })
                            }else{
                                $.message({
                                    msg:rs.Msg,
                                    callback:function(){
                                        el.isPick = false;
                                    }
                                })
                            }
                        },function(){
                        });
                    },
                    cancelFn:function(){

                    }
                });
            }
        });

        vm.getVersion();
        avalon.scan();

    });

})();