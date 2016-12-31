/**
 * Created by hulgy on 23/12/2016.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'merrychristmas',
            version:'',
            isShowTypebox:false,
            thirdDataModel:{
                Name:'羽绒服',
                Children:[
                    {
                        ScaleName:'长',
                        isSelect:true,
                        Price:9.9,
                        OriPirce:40,
                        num:0,
                        Code:'53E417CB1CDEF6F9'
                    },
                    {
                        ScaleName:'中长',
                        isSelect:false,
                        Price:9.9,
                        OriPirce:32,
                        num:0,
                        Code:'549C61E27CBE7FB6'
                    },
                    {
                        ScaleName:'短',
                        isSelect:false,
                        Price:9.9,
                        OriPirce:25,
                        num:0,
                        Code:'7342FFAD76949770'
                    }
                ]
            },
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                });
            },
            goShopFn:function(){
                setLocalstorage('detailLink',window.location.href);
                window.location.href = '../../html/main/detail.html?dataid=20160907111900190180';
            },
            changeTypeFn:function(el){
                vm.thirdDataModel.Children.forEach(function(item){
                    item.isSelect = false;
                });
                el.isSelect = true;
            },
            goFn:function(){
                vm.isShowTypebox = true;
            },
            clooseFn:function(){
                vm.isShowTypebox = false;
            },
            //去结算
            settlementFn:function(code){
                var arr = [{
                    code:code,
                    num:1
                }];
                setLocalstorage('preFillorderHerf',window.location.href);
                window.location.href="../main/fillorder.html?"+serializaDataOther(arr,"codes");
            }
        });
        vm.getVersion();
        avalon.scan();
    });

})();