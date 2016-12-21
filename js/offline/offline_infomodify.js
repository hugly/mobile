/**
 * Created by hulgy on 23/11/2016.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var dayDir={
            '随时':0,
            '周一至周五':1,
            '周末':2
        };
        var timeDir={
            '随时':0,
            '早上':1,
            '中午':2,
            '晚上':3
        };
        var vm = avalon.define({
            $id:'offlineInfo',
            //版本号
            version:"",
            //url参数
            searchData:'',
            //将url参数转化为arr
            urlData:[],
            //商品总数
            proCount:0,
            authCode:               decodeURI($.getUrlParam('authCode'))                || '',
            orderCode:              decodeURI($.getUrlParam('orderCode'))               || '',
            authType:               decodeURI(decodeURI($.getUrlParam('authType')))     || 1,
            SSOCode:                decodeURI(decodeURI($.getUrlParam('SSOCode')))      || '',
            // showpickupDate:         decodeURI($.getUrlParam('showpickupDate'))          || '请选择送件时间',
            sendDate:               decodeURI($.getUrlParam('sendDate'))                || '随时  随时',
            pickupName:             decodeURI($.getUrlParam('pickupName'))              || '',
            pickupTel:              decodeURI($.getUrlParam('pickupTel'))               || '',
            pickupPoiLat:           decodeURI($.getUrlParam('pickupPoiLat'))            || '',
            pickupPoiLon:           decodeURI($.getUrlParam('pickupPoiLon'))            || '',
            pickupPoiName:          decodeURI($.getUrlParam('pickupPoiName'))           || '请选择取件地址',
            pickupPoiCode:          decodeURI($.getUrlParam('pickupPoiCode'))           || '',
            pickupAddress:          decodeURI($.getUrlParam('pickupAddress'))           || '',
            pickupDetailAddress:    decodeURI($.getUrlParam('pickupDetailAddress'))     || '',
            deliveryName:           decodeURI($.getUrlParam('deliveryName'))            || '',
            deliveryTel:            decodeURI($.getUrlParam('deliveryTel'))             || '',
            deliveryPoiLat:         decodeURI($.getUrlParam('deliveryPoiLat'))            || '',
            deliveryPoiLon:         decodeURI($.getUrlParam('deliveryPoiLon'))            || '',
            deliveryPoiName:        decodeURI($.getUrlParam('deliveryPoiName'))         || '请选择送件地址',
            deliveryPoiCode:        decodeURI($.getUrlParam('deliveryPoiCode'))         || '',
            deliveryAddress:        decodeURI($.getUrlParam('deliveryAddress'))         || '',
            deliveryDetailAddress:  decodeURI($.getUrlParam('deliveryDetailAddress'))   || '',
            isSame:                 decodeURI($.getUrlParam('isSame')) === 'true'?true:false ,
            //已选择的商品数据模型
            proList:[
                {name:"干洗熨烫",totalPrice:0,totalNum:0,value:[]},
                {name:"清洗保养",totalPrice:0,totalNum:0,value:[]},
                {name:"奢侈护理",totalPrice:0,totalNum:0,value:[]},
                {name:"裁剪维修",totalPrice:0,totalNum:0,value:[]}
            ],
            hasPro:false,
            isSuring:false,
            skuData:[],
            //获取版本号
            getVersion:function(){
                if(decodeURIComponent($.getUrlParam('skus'))){
                    vm.searchData=window.location.search.split('?')[1];
                    vm.getCountByUrl();
                    vm.urlData=transUrl2List();
                }else{

                    vm.urlData=[
                        {authCode:vm.authCode},
                        {orderCode:vm.orderCode},
                        {authType:vm.authType},
                        {SSOCode:vm.SSOCode},
                        // {showpickupDate:vm.showpickupDate},
                        {sendDate:vm.sendDate},
                        {pickupName:vm.pickupName},
                        {pickupTel:vm.pickupTel},
                        {pickupPoiLat:vm.pickupPoiLat},
                        {pickupPoiLon:vm.pickupPoiLon},
                        {pickupPoiName:vm.pickupPoiName},
                        {pickupPoiCode:vm.pickupPoiCode},
                        {pickupAddress:vm.pickupAddress},
                        {pickupDetailAddress:vm.pickupDetailAddress},
                        {deliveryName:vm.deliveryName},
                        {deliveryTel:vm.deliveryTel},
                        {deliveryPoiLat:vm.deliveryPoiLat},
                        {deliveryPoiLon:vm.deliveryPoiLon},
                        {deliveryPoiName:vm.deliveryPoiName},
                        {deliveryPoiCode:vm.deliveryPoiCode},
                        {deliveryAddress:vm.deliveryAddress},
                        {deliveryDetailAddress:vm.deliveryDetailAddress},
                        {isSame:vm.isSame}
                    ];

                    vm.searchData=transList2Url(vm.urlData.$model);
                }

                getBaseVersion(function(rs){
                    vm.version=rs;
                    var str = decodeURIComponent($.getUrlParam('skus'));
                    if(str){
                        vm.getSkuDataModel();
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
                        vm.sendDate = valueText;

                        var json={
                            'sendDate':valueText
                        };

                        vm.urlData=jsonInList(json,vm.urlData);
                        vm.searchData=transList2Url(vm.urlData.$model);
                    }
                });
            },
            getSkuDataModel:function(){
                var json={},
                    data=decodeURIComponent($.getUrlParam('skus')),
                    dataArr=data.split("-");

                json.token=token;
                for(var i= 0,j=dataArr.length;i<j;i++){
                    if(dataArr[i] !== ''){
                        var arr=dataArr[i].split(".");

                        json[arr[0]]=arr[1];
                    }
                }

                jsonp(host+'/jsonp/ShopSale_GetWashOrderProduct_'+vm.version+'.js',json,'callback',function(rs){
                    var data = rs.Data.Data;

                    for(var i=0,j=data.length;i<j;i++){
                        var json={
                            type:data[i].SaleType,
                            code:data[i].Code,
                            name:data[i].SubCategoryName,
                            price:data[i].Price,
                            num:data[i].Num
                        };

                        vm.proList[data[i].SaleType -1].value.push(json);
                        vm.hasPro = true;
                    }

                    vm.skuData = data;
                    vm.calcuteNumAndPrice();
                },function(){
                });
            },
            //获取整个订单信息
            getOrderInfo:function(){
                var json={},
                    data=decodeURIComponent(window.location.search.substring(1,window.location.search.length)),
                    dataArr=data.split("&");

                json.token=token;
                for(var i= 0,j=dataArr.length;i<j;i++){
                    if(dataArr[i] !== ''){
                        var arr=dataArr[i].split("=");

                        json[arr[0]]=arr[1];
                    }
                }

                jsonp(sildHost+'/jsonp/Order_GetWashCreateOrderInfo_'+vm.version+'.js',json,'callback',function(rs){

                },function(){
                });

            },
            //计算单类物品的总价和总数量
            calcuteNumAndPrice:function(){
                vm.proList.forEach(function(el){
                    el.num=0;
                    el.ttprice=0;

                    el.value.forEach(function(target){
                        el.num += parseInt(target.num);
                        el.ttprice += target.num * target.price;
                    });
                    // vm.proTotalPrice += el.ttprice;
                    el.ttprice = el.ttprice.toFixed(2);
                });
            },
            changeSameFn:function(){
                vm.isSame = !vm.isSame;

                var json={
                    isSame:vm.isSame
                };

                vm.urlData=jsonInList(json,vm.urlData);
                vm.searchData=transList2Url(vm.urlData.$model);
            },
            //根据url获取商品总量
            getCountByUrl:function(){
                var prostr= $.getUrlParam('provalue');

                if(prostr){
                    var arr=prostr.split(",");
                    for(var i= 0,j=arr.length;i<j;i++){
                        if(arr[i].split('-')[0].indexOf('prolen') != -1){
                            vm.proCount=arr[i].split('-')[1];
                        }
                    }
                }
            },
            changeOption:function(str){
                var json={};

                json[str] = vm[str];

                vm.urlData=jsonInList(json,vm.urlData);
                vm.searchData=transList2Url(vm.urlData.$model);
            },
            makeSureFn:function(){
                vm.isSuring = true;
                var json={
                    token:token,
                    ssoUserCode:vm.SSOCode,
                    authType:vm.authType,
                    authCode:vm.authCode,
                    SendDayScore:dayDir[vm.sendDate.split(' ')[0]],
                    SendTimeScore:timeDir[vm.sendDate.split(' ')[1]],
                    PickAddress:{
                        ReceiverName:vm.pickupName,
                        Phone:vm.pickupTel,
                        DetailAddress:vm.pickupDetailAddress,
                        Address:vm.pickupAddress,
                        ShortAddress:vm.pickupPoiName,
                        IsDefault:false,
                        Latitude:vm.pickupPoiLat,
                        Longitude:vm.pickupPoiLon,
                        FromAreaCode:vm.pickupPoiCode
                    },
                    SendAddress:{
                        ReceiverName:vm.deliveryName,
                        Phone:vm.deliveryTel,
                        DetailAddress:vm.deliveryDetailAddress,
                        Address:vm.deliveryAddress,
                        ShortAddress:vm.deliveryPoiName,
                        IsDefault:false,
                        Latitude:vm.deliveryPoiLat,
                        Longitude:vm.deliveryPoiLon,
                        FromAreaCode:vm.deliveryPoiCode
                    },
                    PayMethod:1,
                    SendType:2,
                    UsePoint:0,
                    UseCounponCode:'',
                    HasMessage:false,
                    Message:'',
                    UserMemberCardBalance:false,
                    BillName:'明细',
                    HasNeedBill:true,
                    BillType:'',
                    PickupDate:'',
                };

                if(vm.isSame){
                    json.SendAddress = json.PickAddress;
                }

                vm.skuData.forEach(function(el){
                    json['SkuCodes['+el.Code+']']=el.Num;
                });



                jsonp(sildHost+'/jsonp/Order_JWashCreateByLogisticser_'+vm.version+'.js',json,'callback',function(rs){
                    vm.isSuring = false;
                    console.log(rs);
                },function(){
                });
            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();