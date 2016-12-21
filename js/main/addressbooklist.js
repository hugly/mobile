/**
 * Created by hulgy on 22/09/2016.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"address",
            //版本号
            version:0,
            type: $.getUrlParam('addType'),
            pickupcode:'',
            sendcode:'',
            urlData:transUrl2List(),
            searchData:'',
            //所有地址数据
            addressList:[],
            loadingImgShow:true,
            //获取版本号
            getVersion:function(){
                vm.urlData.forEach(function(el){
                    for(var name in el){
                        if(name === 'addType'){
                            vm.type = el[name];
                        }

                        if(name === 'pickAddressCode' && vm.type === 'pickup'){
                            vm.pickupcode = el[name];
                        }else if(name === 'sendAddressCode' && vm.type === 'send'){
                            vm.pickupcode = el[name];
                        }
                    }
                })
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
                        if(vm.pickupcode){
                            if(vm.pickupcode === data.Code){
                                data.isSelect=true;
                            }else{
                                data.isSelect=false;
                            }
                        }else{
                            data.isSelect=false;
                        }
                    }
                    vm.addressList=rs.Data;
                    vm.loadingImgShow = false;
                    if(vm.addressList.size() === 0) return;

                    vm.addressList.forEach(function(el,$index){
                        if(vm.pickupcode == ''){
                            if(el.IsDefault){
                                vm.tapFn($index);
                            }
                        }
                    });
                },function(){
                });

            },
            //点击选择收货地址
            tapFn:function(index){
                var json={},
                    codejson={};
                vm.addressList.forEach(function(el){
                    el.isSelect = false;
                });
                vm.addressList[index].isSelect=true;

                vm.pickupcode=vm.addressList[index].Code;

                if(vm.type === 'pickup'){
                    json={
                        'pcikupaddress':vm.addressList[index].ShortAddress
                    };
                    codejson={
                        'pickAddressCode':vm.addressList[index].Code
                    }
                }else if(vm.type === 'send'){

                    json={
                        'sendaddress':vm.addressList[index].ShortAddress
                    };
                    codejson={
                        'sendAddressCode':vm.addressList[index].Code
                    };
                }

                vm.urlData=jsonInList(json,vm.urlData);
                vm.urlData=jsonInList(codejson,vm.urlData);
                vm.searchData=transList2Url(vm.urlData.$model);


                window.location.href = "book.html?"+vm.searchData;
            },
            editFn:function(el){
                setLocalstorage('preAddHerf',window.location.href);
                window.location.href = '../personal/newaddress.html?code='+el.Code;
            },
            addressFn:function(){
                setLocalstorage('preAddHerf',window.location.href);
                window.location.href = '../personal/newaddress.html';
            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();