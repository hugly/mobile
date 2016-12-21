/**
 * Created by hulgy on 29/10/2016.
 */

(function(){
    'use strict';

    require(['mmRequest','domReady!'],function(avalon){

        var vm=avalon.define({
            $id:"printdetail",
            //版本号
            version:"",
            code:$.getUrlParam('code') || '',
            isShow:false,
            printDataModel:{
                No:'',
                key:'',
                phone:'',
                nickname:'',
                autoPrint:true,
                status:1
            },
            isProcessing:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    if(vm.code){
                        vm.getPrintDetailByCode();
                    }
                });

            },
            getPrintDetailByCode:function(){
                jsonp(host+'/jsonp/PrintDevice_GetDeviceByCode_'+vm.version+'.js',{
                    token:token,
                    code:vm.code
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data;

                        data.DeviceParams = JSON.parse(data.DeviceParams);

                        vm.printDataModel.No = data.DeviceParams.MachineCode;
                        vm.printDataModel.key = data.DeviceParams.MachineKey;
                        vm.printDataModel.phone = data.DeviceParams.Phone;
                        vm.printDataModel.nickname = data.Name;
                        vm.printDataModel.autoPrint = data.AutoPrint;
                        vm.printDataModel.status = data.State;

                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            changeAutoFn:function(){
                vm.printDataModel.autoPrint = !vm.printDataModel.autoPrint;
            },
            saveFn:function(){

                if(vm.printDataModel.No === ''){
                    $.message({
                        msg:'设备编号必填！'
                    });

                    return;
                }

                if(vm.printDataModel.key === ''){
                    $.message({
                        msg:'设备密钥必填！'
                    });

                    return;
                }

                if(!/^[1][34578][0-9]{9}$/g.test(vm.printDataModel.phone)){
                    $.message({
                        msg:'请输入正确的流量卡号！'
                    });

                    return;
                }

                if(vm.printDataModel.nickname === ''){
                    $.message({
                        msg:'打印机别名必填！'
                    });

                    return;
                }

                if(vm.code){
                    vm.editPrintSettings();
                }else{
                    vm.addPrintSettings();
                }
            },
            addPrintSettings:function(){
                vm.isProcessing = true;
                //jsonp/PrintDevice_AddPrintDevice_version.js
                jsonp(host+'/jsonp/PrintDevice_AddPrintDevice_'+vm.version+'.js',{
                    token:token,
                    machineCode:vm.printDataModel.No,
                    machineKey:vm.printDataModel.key,
                    mobilePhone:vm.printDataModel.phone,
                    printName:vm.printDataModel.nickname,
                    autoPrint:vm.printDataModel.autoPrint
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'添加成功！',
                            callback:function(){
                                window.location.href = 'printlist.html';
                                vm.isProcessing = false;
                            }
                        });
                    }else{
                        $.message({
                            msg:rs.Msg,
                            callback:function(){
                                vm.isProcessing = false;
                            }
                        });
                    }
                },function(){
                });
            },
            editPrintSettings:function(){
                vm.isProcessing = true;
                jsonp(host+'/jsonp/PrintDevice_UpdatePrintDevice_'+vm.version+'.js',{
                    token:token,
                    code:vm.code,
                    machineCode:vm.printDataModel.No,
                    machineKey:vm.printDataModel.key,
                    mobilePhone:vm.printDataModel.phone,
                    printName:vm.printDataModel.nickname,
                    autoPrint:vm.printDataModel.autoPrint,
                    state:parseInt(vm.printDataModel.status)
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'修改成功！',
                            callback:function(){
                                window.location.href = 'printlist.html';
                                vm.isProcessing = false;
                            }
                        });
                    }else{
                        $.message({
                            msg:rs.Msg,
                            callback:function(){
                                vm.isProcessing = false;
                            }
                        });
                    }
                },function(){
                });
            }
        });
        vm.getVersion();
        avalon.scan();

    });
})();