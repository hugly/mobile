/**
 * Created by hulgy on 17/12/2016.
 */
(function(){
    'use strict';

    var statusModel={
        1:'待接单',
        2:'已接单',
        3:'配送中',
        4:'已完成'
    };

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
            $id:"taskDetail",
            //版本号
            version:0,
            taskDataModel:[],
            code:$.getUrlParam('code') || '',
            isPrinting:false,
            showNav:false,
            modifyDataModel:{},
            isModifing:false,
            timer:null,
            timeText:'00:00',
            totalTime:0,
            timeScale:0,
            proListDataModel:[
                {
                    name:'1',
                    title:'干洗熨烫',
                    value:[]
                },
                {
                    name:'2',
                    title:'清洗保养',
                    value:[]
                },
                {
                    name:'3',
                    title:'奢侈护理',
                    value:[]
                },
                {
                    name:'4',
                    title:'裁剪维护',
                    value:[]
                }
            ],
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getTaskDetail();
                });
            },
            showMoreFn:function(){
                vm.showNav = !vm.showNav;
            },
            cancelFn:function(el){
                var obj = $(this);
                $.dialog({
                    msg:'是否取消该订单？',
                    sureFn:function(){
                        jsonp(host+'jsonp/Logistics_Cancel_'+vm.version+'.js',{
                            token:token,
                            code:el.Code
                        },'callback',function(rs){
                            if(rs.Success){
                                window.history.go(-1);
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
                    oZoom = $('.zoom1');

                vm.showNav = false;
                el.showSilder = false;
                el.PickTime = el.PickTime.replace(' ','T');
                vm.modifyDataModel = el;

                oModify.show();
                oZoom.show();

            },
            closeModifyFn:function(){
                var oModify = $('.modify-box'),
                    oZoom = $('.zoom1');

                oModify.hide();
                oZoom.hide();
            },
            modifyFn:function(code){
                var oModify = $('.modify-box'),
                    oZoom = $('.zoom1');

                vm.isModifing = true;
                jsonp(host+'jsonp/Logistics_Edit_'+vm.version+'.js',{
                    token:token,
                    code:code,
                    orderTime:$('#time').val().replace('T',' '),
                    address:$('#address').val(),
                    remark:$('#remark').val()
                },'callback',function(rs){
                    if(rs.Success){
                        oModify.hide();
                        oZoom.hide();
                        vm.getTaskDetail();
                    }else{
                        $.message({
                            msg:rs.Msg
                        })
                    }

                    vm.isModifing = false;
                },function(){
                });
            },
            //获取任务列表
            getTaskDetail:function(){
                jsonp(host+'jsonp/Logistics_GetLogisticsByCode_'+vm.version+'.js',{
                    token:token,
                    Code:vm.code
                },'callback',function(rs){

                    if(rs.Success){
                        var data = rs.Data;

                        if(data.Type == 1){
                            data.showTime = data.PickTime;
                        }else if(data.Type == 2){
                            data.HasAllCheck = true;
                        }
                        if(data.Remark){
                            data.realmark=dayDir[data.Remark.split(',')[0]]+ timeDir[data.Remark.split(',')[1]];
                        }

                        if(data.RemainTime > 0){
                            var oldTime = new Date(data.PickTime).getTime(),
                                nowTime = new Date(data.CreateTime).getTime();

                            vm.totalTime = parseInt((oldTime-nowTime)/1000);

                            clearInterval(vm.timer);
                            vm.timer = setInterval(function(){
                                data.RemainTime --;
                                vm.timeText = dao2time(parseInt(data.RemainTime));
                                vm.timeScale = (1-(parseInt(data.RemainTime)/vm.totalTime))*100+'%';

                                if(data.RemainTime <= 0){
                                    vm.timeText = '00:00:00';
                                    data.RemainTime = 0;
                                    clearInterval(vm.timer);
                                }

                            },1000);
                        }

                        var productList = data.Products;
                        if(productList){
                            for(var i=0,j=productList.length;i<j;i++){
                                var item = productList[i];
                                vm.proListDataModel.forEach(function(el){
                                    if(item.SaleType === el.name){
                                        el.value.push(item);
                                    }
                                });
                            }
                        }

                        data.showStatus = statusModel[data.Status];

                        vm.taskDataModel = data;
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            verifyFn:function(el){
                // if(!el.HasItem){
                setLocalstorage('inComLink',window.location.href);
                window.location.href='../merchant/pickchooseclassical.html?ordercode='+el.OCode+'&shopcode='+el.ShopCode;
                // }else{
                //     setLocalstorage('verifyLink',window.location.href);
                //     window.location.href='../proflow/verfylist.html?tcode='+el.TCode+'&ocode='+el.OCode;
                // }
            },
            goVerfyFn:function(){
                if(vm.taskDataModel.Status == 2){
                    window.location.href = 'verfylist.html?tcode='+vm.taskDataModel.TCode+'&ocode='+vm.taskDataModel.OCode;
                    setLocalstorage('verifyLink',window.location.href);
                }
                else if(vm.taskDataModel.Status == 3 || vm.taskDataModel.Status == 4){
                    window.location.href = 'verfylistonlyread.html?tcode='+vm.taskDataModel.TCode+'&ocode='+vm.taskDataModel.OCode;
                }
            },
            //接单
            robOrderFn:function(el){
                //Logistics_ApplyLogistics_9.js?
                $.dialog({
                    msg:'是否接单？',
                    sureFn:function(){
                        jsonp(host+'jsonp/Logistics_ApplyLogistics_'+vm.version+'.js',{
                            token:token,
                            Code:el.Code
                        },'callback',function(rs){
                            if(rs.Success){
                                $.message({
                                    msg:'接单成功',
                                    callback:function(){
                                        vm.getTaskDetail();
                                    }
                                });
                            }else{
                                $.message({
                                    msg:rs.Msg,
                                    callback:function () {
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
            printFn:function(){
                $.dialog({
                    msg:'是否确认打印该订单？',
                    sureFn:function(){
                        vm.isPrinting = true;
                        jsonp(host+'jsonp/PrintDevice_GetLogisticsOrderTicket_'+vm.version+'.js',{
                            token:token,
                            oCode:vm.taskDataModel.OCode,
                            printLogistics:1,
                            printUser:1,
                            printShop:1
                        },'callback',function(rs){
                            if(rs.Success){
                                var data = rs.Data;
                                if(data.Success){
                                    $.message({
                                        msg:'打印成功!'
                                    });
                                    window.android.print(data.Data,vm.taskDataModel.OCode);
                                }else{
                                    $.message({
                                        msg:data.Msg
                                    });
                                }
                            }else{
                                $.message({
                                    msg:rs.Msg
                                });
                            }
                            vm.isPrinting = false;
                        },function(){
                        });
                    },
                    cancelFn:function(){
                    }
                });

            },
            hasPickFn:function(){
                $.dialog({
                    msg:'是否确认取货？',
                    sureFn:function(){
                        jsonp(host+'jsonp/Logistics_ApplyPickComplete_'+vm.version+'.js',{
                            token:token,
                            logisticsCode:vm.taskDataModel.Code,
                            oCode:vm.taskDataModel.OCode
                        },'callback',function(rs){
                            if(rs.Success){
                                $.message({
                                    msg:'取货成功！',
                                    callback:function(){
                                        vm.getTaskDetail();
                                    }
                                })
                            }else{
                                $.message({
                                    msg:rs.Msg,
                                    callback:function(){

                                    }
                                })
                            }
                        },function(){
                        });

                    },
                    cancelFn:function(){
                    }
                });

            },
            hasPickOtherFn:function(el,remove){
                $.dialog({
                    msg:'是否确认送达？',
                    sureFn:function(){
                        el.isPick = true;
                        jsonp(host+'jsonp/Logistics_ApplyComplete_'+vm.version+'.js',{
                            token:token,
                            logisticsCode:vm.taskDataModel.Code
                        },'callback',function(rs){
                            if(rs.Success){
                                var data = rs.Data,
                                    price = data.PayPrice;

                                if(data.HasReceive){
                                    $.message({
                                        msg:'确认送达！',
                                        callback:function(){
                                            vm.getTaskDetail();
                                        }
                                    });
                                }else{
                                    $.dialog({
                                        msg:'该订单未支付，请收取￥'+price+'元现金货款。确定已收到对方现金货款？',
                                        sureText:'已收钱',
                                        sureFn:function(){
                                            vm.getCashFn(vm.taskDataModel.Code,vm.taskDataModel.OCode);
                                        },
                                        cancelFn:function(){
                                        }
                                    });
                                }
                            }else{
                                $.message({
                                    msg:rs.Msg,
                                    callback:function(){
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

        vm.getVersion();
        avalon.scan();

    });

})();