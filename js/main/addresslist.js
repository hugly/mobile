/**
 * Created by hulgy on 16/6/10.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"address",
            //版本号
            version:0,
            type: $.getUrlParam('type'),
            pickupcode:$.getUrlParam('pickupcode') || '',
            sendcode:'',
            urlData:transUrl2List(),
            searchData:'',
            //所有地址数据
            addressList:[],
            loadingImgShow:true,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getAllAddress();
                    vm.searchData=transList2Url(vm.urlData);
                });
            },
            //获取所有收货地址
            getAllAddress:function(){
                jsonp(host+'/jsonp/ReceiveAddress_GetALLBySsoUserCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    for(var i= 0,j=rs.Data.length;i<j;i++){
                        var data=rs.Data[i];
                        if(data.Area){
                            data.Area=data.Area.split('-').join('')+data.DetailAddress;
                        }
                        if(vm.pickupcode === data.Code){
                            data.isSelect=true;
                        }else{
                            data.isSelect=false;
                        }
                    }
                    vm.addressList=rs.Data;
                    vm.loadingImgShow = false;
                },function(){
                });

            },
            //点击选择收货地址
            tapFn:function(index){
                vm.addressList.forEach(function(el){
                    el.isSelect = false;
                });
                vm.addressList[index].isSelect=true;

                vm.pickupcode=vm.addressList[index].Code;

                var json={
                    'pickupcode':vm.addressList[index].Code
                };

                vm.urlData=jsonInList(json,vm.urlData);
                vm.searchData=transList2Url(vm.urlData.$model);

                window.location.href = "fillorder.html?"+vm.searchData;
            },
            addressFn:function(){
                setLocalstorage('preAddHerf',window.location.href);
                window.location.href = '../personal/newaddress.html';
            },
            editAddressFn:function(el){
                setLocalstorage('preAddHerf',window.location.href);
                window.location.href = '../personal/newaddress.html?code='+el.Code;
            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();