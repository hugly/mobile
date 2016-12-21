/**
 * Created by hulgy on 16/6/10.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"ways",
            //支付方式
            paytype: parseInt($.getUrlParam('paytype')) || 1,
            //取件方式
            distype: parseInt($.getUrlParam('distype')) || 2,
            //将url参数转化为arr
            urlData:transUrl2List(),
            //url参数数据模型
            searchData:'',
            //收货地址详情数据模型
            address:{},
            //是否是第一次进入
            isFirst:false,
            discode:$.getUrlParam('discode') || '',
            //取件时间
            pickupTime: decodeURI($.getUrlParam('pickupTime')) || '随时',
            //版本号
            version:0,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;

                    if(vm.distype === 2 && !vm.isFirst){
                        vm.getAddress();
                    }

                });
                //日期插件
                $('#time3').mobiscroll().treelist({
                    theme: 'mobiscroll',
                    lang: 'zh',
                    display: 'bottom',
                    width: [90, 160],
                    placeholder: decodeURI($.getUrlParam('sendDate')) || '请选择取件时间',
                    defaultValue: [1, 1],
                    onClose:function(valueText,inst){
                        vm.pickupTime = valueText;

                        var json={
                            'pickupTime':valueText
                        };

                        vm.urlData=jsonInList(json,vm.urlData);
                        vm.searchData=transList2Url(vm.urlData.$model);

                    }
                });

            },
            //改变支付方式
            changpay:function(){
                var code=parseInt(avalon(this).data('code'));

                vm.paytype=code;

                var json={
                    'paytype':code
                };

                vm.urlData=jsonInList(json,vm.urlData);
                vm.searchData=transList2Url(vm.urlData.$model);
            },
            //改变取件方式
            changdis:function(){
                var code=parseInt(avalon(this).data('code'));

                vm.distype=code;

                var json={
                    'distype':code
                };

                if(vm.distype === 2 && !vm.isFirst){
                    vm.getAddress();
                }

                vm.urlData=jsonInList(json,vm.urlData);
                vm.searchData=transList2Url(vm.urlData.$model);
            },
            //获取地址
            getAddress:function(){
                var code= $.getUrlParam('discode');

                if(code){
                    vm.getAddressByCode(code);
                }else{
                    vm.getDefaluteAddress();
                }

                vm.isFirst=true;
            },
            //根据code获取地址
            getAddressByCode:function(code){
                jsonp(host+'/jsonp/ReceiveAddress_GetByCode_'+vm.version+'.js',{
                    token:token,
                    code:code
                },'callback',function(rs){
                    if(rs.Success){
                        var data=rs.Data;
                        data.Area='';
                        for(var i= 0,j=data.AreaModels.length;i<j;i++){
                            data.Area+=data.AreaModels[i].Name;
                        }
                        data.Area+=data.DetailAddress;
                        vm.address=data;
                    }
                },function(){
                });
            },
            //获取默认收货地址
            getDefaluteAddress:function(){
                jsonp(host+'/jsonp/ReceiveAddress_GetDefaultReceiveAddressBySsoUserCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        var data=rs.Data;
                        vm.address=data;
                        var json={
                            discode:rs.Data.Code
                        };
                        vm.urlData=jsonInList(json,vm.urlData);
                        vm.searchData=transList2Url(vm.urlData.$model);
                    }

                },function(){
                });
            }
        });
        vm.urlData=jsonInList({'paytype':vm.paytype},vm.urlData);
        vm.urlData=jsonInList({'distype':vm.distype},vm.urlData);
        vm.searchData=transList2Url(vm.urlData);
        vm.getVersion();
        avalon.scan();
    });
})();