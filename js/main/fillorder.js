/**
 * Created by hulgy on 16/6/8.
 */
(function(){
    'use strict';

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
    var invoice={
        1:'公司',
        2:'个人'
    };

    var saleTypeDir={
        1:'干洗熨烫',
        2:'清洗保养',
        3:'奢侈护理',
        4:'裁剪维修'
    };

    var stamp2timeline = function (b) {
        b = b || new Date().getTime();
        var a = new Date(parseInt(b));
        var year = a.getFullYear();
        var month = parseInt(a.getMonth()) + 1;
        month = (month < 10) ? "0" + month : month;
        var date = a.getDate();
        date = (date < 10) ? "0" + date : date;
        var hours = a.getHours();
        hours = (hours < 10) ? "0" + hours : hours;
        var minutes = a.getMinutes();
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        var seconds = a.getSeconds();
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        if(hours >21){
            return year + "-" + month + "-" + (date+1) + " " + '09' + ":" + '00'+ ":" + '00';
        }else if(hours < 9){
            return year + "-" + month + "-" + date + " " + '09' + ":" + '00'+ ":" + '00';
        }else{
            return year + "-" + month + "-" + date + " " + hours + ":" + minutes+ ":" + seconds;
        }
    };



    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"fillorder",
            //版本号
            version:"",
            //已选择的商品数据模型
            proList:[
                {name:"干洗熨烫",value:[]},
                {name:"清洗保养",value:[]},
                {name:"奢侈护理",value:[]},
                {name:"裁剪维修",value:[]}
            ],
            //sku数据
            skuData:[],
            //url参数
            searchData:window.location.search,
            //合计后的价格
            OriPrice:0,
            //总价
            Price:0,
            payAble:0,
            //总积分
            totalScore:0,
            //积分
            score:0,
            TotalNum:0,
            //发票类型
            ticketType: invoice[parseInt($.getUrlParam('invoiceDis'))] || '个人',
            //发票名称
            ticketname: decodeURI($.getUrlParam('invoiceName')) || '明细',
            //备注
            remark:'',
            //使用积分
            useScore:false,
            hasAddress:false,
            showDis:decodeURI($.getUrlParam('showDis')) || false,
            urlData:transUrl2List(),
            //付款方式
            paytype: parseInt($.getUrlParam('paytype')) || 1,
            //配送方式
            distype: parseInt($.getUrlParam('distype')) || 2,
            //优惠券code
            couponCode:$.getUrlParam('couponsCode'),
            //优惠券名称
            couponName:decodeURI($.getUrlParam('couponsName')),
            //优惠券价格
            couponPrice:parseInt($.getUrlParam('couponsPrice')) || 0,
            //配送地址code
            discode: $.getUrlParam('discode') || '',
            //配送的送货地址数据模型
            disAddress:{
                Phone:''
            },
            memberCardObj:{
                Balance:0
            },
            //取件地址code
            pickupcode: $.getUrlParam('pickupcode') || '',
            showPickupTime: decodeURI($.getUrlParam('showpickupDate')) || stamp2timeline(),
            //取件时间
            pickupTime: decodeURI($.getUrlParam('pickupDate')),
            SendTime:decodeURI($.getUrlParam('pickupTime')) || '随时 随时',
            //送货时间 day
            SendDayScore:decodeURI($.getUrlParam('pickupTime')).split(' ')[0] || '随时',
            //送货时间 time
            SendTimeScore:decodeURI($.getUrlParam('pickupTime')).split(' ')[1] || '随时',
            //取件地址的地址数据模型
            pickupAddress:{
                Phone:''
            },
            //取件费用
            PickFee:0,
            //配送费用
            LogicFee:0,
            //店铺资料
            shopInfo:{},
            isPaying:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getOrderInfo();
                    vm.getScore();

                    if(vm.discode){
                        vm.getAddressByCode(1,vm.discode);
                    }else{
                        vm.getDefaluteAddress(1);
                    }

                    if(vm.pickupcode){
                        vm.hasAddress = true;
                        vm.getAddressByCode(2,vm.pickupcode);
                    }else{
                        vm.getDefaluteAddress(2);
                    }

                });

                // var oDate = new Date();
                // //日期插件
                // $('#picktime').mobiscroll().datetime({
                //     theme: 'ios',
                //     lang: 'zh',
                //     display: 'bottom',
                //     headerText: false,
                //     monthText:'月',
                //     dayText:'日',
                //     minuteText:'分',
                //     hourText:'时',
                //     minDate: new Date(oDate.getFullYear(),oDate.getMonth(),oDate.getDate(),oDate.getHours(),oDate.getMinutes()+5),
                //     timeWheels: 'HHii',
                //     dateOrder: 'mmdd',
                //     stepMinute: 5,
                //     showNow: true,
                //     rtl: false,
                //     onClose:function(event, inst){
                //         vm.pickupTime = event;
                //     }
                // });

            },
            backFn:function(){
                window.location.href = getLocalstorage('preFillorderHerf');
            },
            //改变使用积分状态
            changeScore:function(){
                vm.useScore=!vm.useScore;
            },
            changeShowDis:function(){
                vm.showDis = !vm.showDis;

                if(!vm.showDis){
                    vm.couponName = '';
                    vm.couponPrice = 0;
                    vm.couponCode = '';
                }


                var showDis={
                    'showDis':vm.showDis
                };


                vm.urlData=jsonInList(showDis,vm.urlData);

                vm.searchData=transList2Url(vm.urlData.$model);
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

                    if(rs.Code === 110){
                        $.message({
                            msg:rs.Msg
                        });
                        return;
                    }
                    var mainData = rs.Data;

                    vm.TotalNum = rs.Data.TotalNum;
                    var sku=rs.Data.Skus;

                    for(var i= 0,j=sku.length;i<j;i++){
                        sku[i].index = i+1;
                        sku[i].saleTypeName = saleTypeDir[sku[i].SaleType];
                    }

                    vm.skuData=sku;

                    vm.Price=rs.Data.Price;

                    vm.shopInfo = rs.Data.Shop.Shop;


                    var price={
                        'totalPrice':vm.OriPrice
                    };
                    var shopCode={
                        'shopCode':rs.Data.Shop.ShopCode
                    };

                    vm.OriPrice=rs.Data.TotalPrice;
                    vm.payAble = mainData.PayPrice;
                    vm.memberCardObj = rs.Data.MemberCard;
                    var shopDetail = rs.Data.Shop.Shop;

                    // if(shopDetail.PickType === 2){
                    //     if(vm.OriPrice < shopDetail.FreePickAmount){
                    //         vm.PickFee = shopDetail.PickFee;
                    //     }
                    // }else if(shopDetail.PickType === 3){
                    //     vm.PickFee = shopDetail.PickFee;
                    // }

                    vm.PickFee = mainData.PickPrice;

                    // if(shopDetail.LogicType === 2){
                    //     if(vm.OriPrice < shopDetail.FreeLogicAmount){
                    //         vm.LogicFee = shopDetail.LogicFee;
                    //     }
                    // }else if(shopDetail.LogicType === 3){
                    //     vm.LogicFee = shopDetail.LogicFee;
                    // }

                    vm.LogicFee = mainData.SendPrice;

                    vm.urlData=jsonInList(price,vm.urlData);
                    vm.urlData=jsonInList(shopCode,vm.urlData);

                    vm.searchData=transList2Url(vm.urlData.$model);
                },function(){
                });

            },
            //根据code获取地址
            getAddressByCode:function(obj,code){
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

                        if(obj === 1){
                            vm.disAddress=data;
                            vm.disAddress.Phone = data.Phone.substring(0,3)+"****"+data.Phone.substring(7,11);
                        }else if(obj === 2){
                            vm.pickupAddress=data;
                            vm.pickupAddress.Phone = data.Phone.substring(0,3)+"****"+data.Phone.substring(7,11);
                        }
                    }
                },function(){
                });
            },
            //获取默认收货地址
            getDefaluteAddress:function(obj){
                jsonp(host+'/jsonp/ReceiveAddress_GetDefaultReceiveAddressBySsoUserCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    var data = rs.Data;
                    if(rs.Success){
                        if(obj === 1){
                            vm.disAddress=rs.Data;
                            vm.disAddress.Phone = data.Phone.substring(0,3)+"****"+data.Phone.substring(7,11);
                            vm.discode = rs.Data.Code;

                            var discode={
                                'discode':vm.discode
                            };


                            vm.urlData=jsonInList(discode,vm.urlData);

                            vm.searchData=transList2Url(vm.urlData.$model);


                        }else if(obj === 2){
                            vm.pickupAddress=rs.Data;
                            vm.pickupAddress.Phone = data.Phone.substring(0,3)+"****"+data.Phone.substring(7,11);

                            vm.pickupcode = rs.Data.Code;
                            //pickupcode

                            var pickupcode={
                                'pickupcode':vm.pickupcode
                            };


                            vm.urlData=jsonInList(pickupcode,vm.urlData);

                            vm.searchData=transList2Url(vm.urlData.$model);

                        }
                        vm.hasAddress = true;
                    }

                },function(){
                });
            },
            //获取积分
            getScore:function(){
                jsonp(host+'/jsonp/Point_GetMyPointSsoUserCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    vm.totalScore=rs.Data;
                },function(){
                });
            },
            //判断积分是否超出限制
            calcuteScore:function(){
                if(vm.score >= vm.totalScore){
                    vm.score=vm.totalScore;
                }
            },
            //创建订单
            createOrder:function(){

                if(vm.pickupcode === ''){
                    $.message({
                        msg:'请选择一个取件地址!'
                    });
                    return;
                }

                var json={
                    token:token,
                    SendDayScore:dayDir[vm.SendDayScore],
                    SendTimeScore:timeDir[vm.SendTimeScore],
                    PickAddressCode:vm.pickupcode || '',
                    //送货地址code
                    SendAddressCode:vm.discode,
                    //支付方式
                    PayMethod:vm.paytype,
                    //自提送货上门
                    SendType:vm.distype,
                    //使用积分
                    UsePoint:vm.score,
                    //使用积分券code
                    UseCounponCode:vm.couponCode,
                    //是否有留言
                    HasMessage:false,
                    //留言信息
                    Message:vm.remark,
                    UserMemberCardBalance:vm.showDis,
                    //发票名称
                    BillName:vm.ticketname,
                    //是否需要发票
                    HasNeedBill:true,
                    //发票类型
                    BillType:parseInt($.getUrlParam('invoiceDis')) || '',
                    PickupDate:vm.pickupTime
                };

                vm.skuData.forEach(function(el){
                    json['SkuCodes['+el.Code+']']=el.Num;
                });

                vm.isPaying = true;
                jsonp(sildHost+'/jsonp/Order_JWashCreate_'+vm.version+'.js',json,'callback',function(rs){
                    var result = rs.Data;
                    if(rs.Success){
                        if(result.IsNeedPay){
                            window.location.href = rs.Data.PayUrl;
                            setTimeout(function(){
                                vm.isPaying = false;
                            },1000);
                        }else{
                            window.location.href = '../main/quickbook.html?type=person&code='+result.TradeOrderCode;
                            setTimeout(function(){
                                vm.isPaying = false;
                            },1000);
                        }
                    }else{
                        $.message({
                            msg:rs.Msg,
                            callback:function(){
                                vm.isPaying = false;
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