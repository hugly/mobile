/**
 * Created by hulgy on 01/10/2016.
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
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getTaskDetail();
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
                        data.isRob = false;
                        if(data.Remark){
                            data.realmark=dayDir[data.Remark.split(',')[0]]+ timeDir[data.Remark.split(',')[1]];
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
            goVerfyFn:function(){
                if(vm.taskDataModel.Status == 2){
                    window.location.href = 'verify.html?tcode='+vm.taskDataModel.TCode+'&ocode='+vm.taskDataModel.OCode;
                    setLocalstorage('verifyLink',window.location.href);
                }else if(vm.taskDataModel.Status == 3 || vm.taskDataModel.Status == 4){
                    window.location.href = 'verifyonlyread.html?tcode='+vm.taskDataModel.TCode+'&ocode='+vm.taskDataModel.OCode;
                }
            },
            //接单
            robOrderFn:function(el){
                el.isRob = true;
                //Logistics_ApplyLogistics_9.js?
                jsonp(host+'jsonp/Logistics_ApplyLogistics_'+vm.version+'.js',{
                    token:token,
                    Code:el.Code
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'接单成功',
                            callback:function(){
                                window.location.href = 'pickuptask.html';
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
            printFn:function(){
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
                            // $.message({
                            //     msg:'打印成功!'
                            // });
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
            }
        });

        vm.getVersion();
        avalon.scan();

    });

})();