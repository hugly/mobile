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
            $id:"distritask",
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
                jsonp(host+'jsonp/Logistics_PagingWay_'+vm.version+'.js',{
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
                            if(data[i].Logistics.Remark){
                                data[i].Logistics.realmark=dayDir[data[i].Logistics.Remark.split(',')[0]] + timeDir[data[i].Logistics.Remark.split(',')[1]];
                            }
                            data[i].Logistics.isRob = false;
                            data[i].arriving = false;
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
            },
            isArrivFn:function(el,remove){
                el.arriving = true;
                jsonp(host+'jsonp/Logistics_ApplyComplete_'+vm.version+'.js',{
                    token:token,
                    logisticsCode:el.LogisticsCode,
                    TCode:el.Logistics.TCode
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data,
                            price = data.PayPrice;

                        if(data.HasReceive){
                            $.message({
                                msg:'确认送达！',
                                callback:function(){
                                    remove();
                                    el.arriving = false;
                                }
                            });
                        }else{
                            $.dialog({
                                msg:'该订单未支付，请收取￥'+price+'元现金货款。确定已收到对方现金货款？',
                                sureText:'已收钱',
                                sureFn:function(){
                                    vm.getCashFn(el.LogisticsCode,el.Logistics.TCode);
                                    el.arriving = false;
                                },
                                cancelFn:function(){
                                    el.arriving = false;
                                }
                            });
                        }
                    }else{
                        $.message({
                            msg:rs.Msg,
                            callback:function(){
                                el.arriving = false;
                            }
                        });
                    }

                },function(){
                });
            },
            //收取现金
            getCashFn:function(LogisticsCode,TCode){
                jsonp(host+'jsonp/Logistics_CashPay_'+vm.version+'.js',{
                    token:token,
                    logisticsCode:LogisticsCode,
                    tcode:TCode
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'收取现金成功,请再次点击确认送达!'
                        })
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