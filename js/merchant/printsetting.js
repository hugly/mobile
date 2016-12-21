/**
 * Created by hulgy on 17/10/2016.
 */
var showConfig,setBluetooth;

(function(){
    'use strict';
    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"printsetting",
            //版本号
            version:"",
            shopcode:$.getUrlParam('shopCode'),
            text:'请选择设备',
            showDis:false,
            //获取设备值
            getInitValue:function(){
                var config = window.android.getConfig();
            },
            changeDisFn:function(){
                vm.showDis = !vm.showDis;
            },
            //获取蓝牙列表
            chooseFn:function(){
                window.android.getBluetoothList();
            },
            //保存数据
            saveFn:function(){
                window.android.saveConfig(vm.shopCode, vm.text, vm.showDis);
            }
        });
        vm.getInitValue();
        avalon.scan();

        showConfig = function(shopCode,bluetoothAddr,autoPrint)
        {
            vm.text = bluetoothAddr;
            vm.shopcode = shopCode;
            vm.showDis = autoPrint;

            alert(bluetoothAddr);
            alert('vm.text'+bluetoothAddr);
            alert(shopCode);
            alert('vm.shopcode'+bluetoothAddr);
            alert(autoPrint);
            alert('vm.shopcode'+bluetoothAddr);
        }

        setBluetooth = function(addr)
        {
            alert(addr);
            vm.text = addr;
        }
    });
})();
