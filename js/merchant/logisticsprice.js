/**
 * Created by hulgy on 16/7/1.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:'logisticsprice',
            //版本号
            version:0,
            //取件状态
            pickupState:1,
            //配送状态
            distriState:1,
            //取件费用
            PickFee:0,
            //物流费用
            LogicFee:0,
            //免费取件限额
            FreePickAmount:0,
            //免费送件限额
            FreeLogicAmount:0,
            showPick:false,
            showDis:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getLogistData();
                });
            },
            //修改取件方式
            changePickFn:function(num){
                //if(num === 1){
                //    vm.PickFee = 0;
                //}
                if(vm.pickupState === 2){
                    vm.pickupState = 3;
                }else if(vm.pickupState === 3){
                    vm.pickupState = 2;
                }
            },
            //修改配送方式
            changeDisFn:function(num){
                //if(num === 1){
                //    vm.LogicFee = 0;
                //}
                //vm.distriState = num;

                if(vm.distriState === 2){
                    vm.distriState = 3;
                }else if(vm.distriState === 3){
                    vm.distriState = 2;
                }
            },
            showPickFn:function(){
                vm.showPick = !vm.showPick;

                if(!vm.showPick){
                    vm.pickupState = 1;
                }else{
                    vm.pickupState = 3;
                }
            },
            showDisFn:function(){
                vm.showDis = !vm.showDis;
                if(!vm.showDis){
                    vm.distriState = 1;
                }else{
                    vm.distriState = 3;
                }
            },
            //保存数据
            saveLogistFn:function(){

                jsonp(host+'jsonp/Shop_UpdateLogicFee_'+vm.version+'.js',{
                    token:token,
                    PickFee:vm.PickFee,
                    LogicFee:vm.LogicFee,
                    PickType:vm.pickupState,
                    LogicType:vm.distriState,
                    FreePickAmount:vm.FreePickAmount,
                    FreeLogicAmount:vm.FreeLogicAmount
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'保存成功!',
                            callback:function(){
                                window.location.href='logistics.html';
                            }
                        });
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            //获取物流信息
            getLogistData:function(){
                jsonp(host+'jsonp/Shop_GetLogicFee_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        vm.PickFee = rs.Data.PickFee;
                        vm.LogicFee = rs.Data.LogicFee;
                        vm.FreePickAmount = rs.Data.FreePickAmount;
                        vm.FreeLogicAmount = rs.Data.FreeLogicAmount;
                        vm.pickupState = rs.Data.PickType;
                        vm.distriState = rs.Data.LogicType;

                        if(vm.distriState !== 1){
                            vm.showDis = true;
                        }

                        if(vm.pickupState !== 1){
                            vm.showPick = true;
                        }
                    }

                },function(){
                });
            }

        });

        vm.getVersion();
        avalon.scan();
    });
})();