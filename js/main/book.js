/**
 * Created by hulgy on 16/6/16.
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

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'book',
            //版本号
            version:"",
            //洗衣分类
            washType: parseInt($.getUrlParam('washtype')) || 1,
            //取件时间
            showpickupDate:decodeURI($.getUrlParam('showpickupDate')) || '现在',
            //取件时间
            pickupDate:decodeURI($.getUrlParam('pickupDate')) || '现在',
            //送件时间
            sendDate: decodeURI($.getUrlParam('sendDate')) || "随时 随时",
            //配送方式
            wayType: parseInt($.getUrlParam('sendtype')) || 2,
            //备注信息
            remark:'',
            //商品数量
            proCount:0,
            //类型长度
            washTypeLen:4,
            //取件地址
            pickupAddress: decodeURI($.getUrlParam('pcikupaddress')) || '请选择取件地址',
            PickAddressCode:decodeURI($.getUrlParam('pickAddressCode')),
            //收货地址
            sendAddress: decodeURI($.getUrlParam('sendaddress')) || '请选择收货地址',
            SendAddressCode:decodeURI($.getUrlParam('sendAddressCode')),
            //显示状态
            isShow: $.getUrlParam('isShow') || true,
            //是否显示配送时间和配送地址
            isShowSend:false,
            //url参数
            searchData:'',
            //将url参数转化为arr
            urlData:[],
            //是否发起预约
            isBooking:false,
            canBook:false,
            pickupLon: $.getUrlParam('pcikupnowLng') || '',
            pickupLat: $.getUrlParam('pcikupnowLat') || '',
            //获取版本号
            getVersion:function(){
                // if(vm.pickupAddress !== '请选择取件地址' && vm.sendAddress === '请选择收货地址'){
                //     vm.sendAddress = vm.pickupAddress;
                //     vm.SendAddressCode = vm.PickAddressCode;
                // }

                if(vm.isShow === 'false'){
                    vm.isShow=false;
                }

                if(vm.wayType === 2){
                    vm.isShowSend = true;
                }else{
                    vm.isShowSend = false;
                }

                if(vm.pickupDate === '现在'){
                    var oDate = new Date(),
                        hours = oDate.getHours();

                    if(hours > 21){
                        oDate.setDate(oDate.getDate()+1);
                        vm.pickupDate = oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+oDate.getDate()+' 10:00:00';
                        vm.showpickupDate = (oDate.getMonth()+1)+'月'+oDate.getDate()+'日09:00-10:00';
                    }else if(hours < 9){
                        vm.pickupDate = oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+oDate.getDate()+' 10:00:00';
                        vm.showpickupDate = (oDate.getMonth()+1)+'月'+oDate.getDate()+'日09:00-10:00';
                    }

                }


                //window.location.search+'washtype=1&pickupDate='+stamp2time()+'&sendDate='+stamp2time()
                if(window.location.search){
                    vm.searchData=window.location.search.split('?')[1];
                    vm.getCountByUrl();
                    vm.urlData=transUrl2List();
                }else{
                    //&addType=pickup
                    vm.searchData=window.location.search+'washtype=1&pickupDate='+vm.pickupDate+'&sendDate=随时 随时&sendtype='+vm.wayType+'&addType=pickup';
                    vm.urlData=[
                        {'washtype':1},
                        {'pickupDate':vm.pickupDate},
                        {'sendDate':'随时 随时'},
                        {'sendtype':vm.wayType},
                        {'addType':'pickup'},
                        {'isShow':vm.isShow}
                    ];
                }
                //时间初始化
                $('#time1,#time2').val(vm.pickupDate);
                $('#time3').val('随时 随时');

                var oDate = new Date();
                //日期插件
                $('#time1,#time2').mobiscroll().datetime({
                    theme: 'ios',
                    lang: 'zh',
                    display: 'bottom',
                    headerText: false,
                    monthText:'月',
                    dayText:'日',
                    minuteText:'分',
                    hourText:'时',
                    timeWheels: 'HHii',
                    dateOrder: 'mmdd',
                    stepMinute: 5,
                    showNow: true,
                    minDate: new Date(oDate.getFullYear(),oDate.getMonth(),oDate.getDay(),oDate.getHours(),oDate.getMinutes()+5),
                    rtl: false,
                    onClose:function(event, inst){
                        //$('#time1,#time2').val(event);
                        var json={
                            'pickupDate':event
                        };
                        vm.pickupDate = event;

                        vm.urlData=jsonInList(json,vm.urlData);
                        vm.searchData=transList2Url(vm.urlData.$model);
                    }
                });

                //日期插件
                $('#time3').mobiscroll().treelist({
                    theme: 'mobiscroll',
                    lang: 'zh',
                    display: 'bottom',
                    width: [90, 160],
                    placeholder: decodeURI($.getUrlParam('sendDate')) || '随时 随时',
                    //defaultValue: [2,3],
                    onClose:function(valueText,inst){
                        var json={
                            'sendDate':valueText
                        };

                        vm.urlData=jsonInList(json,vm.urlData);
                        vm.searchData=transList2Url(vm.urlData.$model);

                    }
                });

                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getDefaluteAddress();
                    $("body,.mapbox").height($(window).height());
                });
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
            //获取默认收货地址
            getDefaluteAddress:function(obj){
                jsonp(host+'/jsonp/ReceiveAddress_GetDefaultReceiveAddressBySsoUserCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    var data = rs.Data;
                    if(rs.Success){
                        if(vm.PickAddressCode === ''){
                            vm.pickupAddress = data.ShortAddress;
                            vm.PickAddressCode=data.Code;
                        }

                        if(vm.SendAddressCode === ''){
                            vm.sendAddress = data.ShortAddress;
                            vm.SendAddressCode=data.Code;
                        }
                    }

                    vm.canBook = true;
                },function(){
                });
            },
            //改变显示状态
            changeShow:function(){
                if(vm.isShow === 'false'){
                    vm.isShow = false;
                }

                vm.isShow = !vm.isShow;

                var json={
                    isShow:vm.isShow
                };

                vm.urlData=jsonInList(json,vm.urlData);
                vm.searchData=transList2Url(vm.urlData.$model);

            },
            //选择配送方式
            chooseWays:function(state){
                vm.wayType=state;

                if(vm.wayType === 1){
                    vm.isShowSend = false;
                }else{
                    vm.isShowSend = true;
                }

                var json={
                    sendtype:state
                };

                vm.urlData=jsonInList(json,vm.urlData);
                vm.searchData=transList2Url(vm.urlData.$model);
            },
            //选择洗衣分类
            chooseWashType:function(index){
                vm.washType=index;
                var json={
                    washtype:index
                };

                vm.urlData=jsonInList(json,vm.urlData);
                vm.searchData=transList2Url(vm.urlData.$model);
            },
            //选择类别
            chooseClass:function(){
                //console.log(vm.searchData);
                //window.location.href='choose'
            },
            //选择送货地址
            chooseSend:function(index){
                vm.urlData.forEach(function(el){
                    if(index === 1){
                        el.addType='send';
                    }else{
                        el.addType='pickup';
                    }
                });

                vm.searchData=transList2Url(vm.urlData.$model);

                window.location.href='choosebookaddress.html?'+encodeURIComponent(vm.searchData);
            },
            //立即预订
            orderFn:function(){
                if(!vm.isBooking){
                    vm.createOrder();
                }
            },
            checkFn:function(){
                var prostr= $.getUrlParam('provalue'),
                    json={},
                    type = -1;

                if(vm.pickupDate == '现在'){
                    type = -1;
                    // vm.pickupDate = stamp2time();
                }else{
                    type = 0;
                }

                if(vm.pickupAddress === '请选择取件地址'){
                    $.message({
                        msg:'请选择取件地址!'
                    });
                    return;
                }

                if(vm.wayType === 2 && vm.sendAddress === ''){
                    $.message({
                        msg:'请选择收货地址!'
                    });
                    return;
                }

                if(vm.proCount === 0){
                    $.message({
                        msg:'请选择商品!'
                    });
                    return;
                }

                vm.isBooking = true;
                json={
                    token: token,
                    ///取件地址
                    PickAddressCode: vm.PickAddressCode,
                    /// 送货地址
                    SendAddressCode: vm.SendAddressCode,
                    /// 预计取件时间
                    ExpectPickDateTime: vm.pickupDate,
                    //区分取件时间
                    type:type,
                    /// 取件备注
                    PickDesc: vm.remark,
                    /// 销售类型
                    WashSaleType: vm.washType,
                    /// 取件经度
                    PickLongitude: vm.pickupLon,
                    /// 纬度
                    PickLatitude: vm.pickupLat,
                    /// 送货经度
                    SendLongitude: $.getUrlParam('sendnowLng'),
                    /// 送货维度
                    SendLatitude: $.getUrlParam('sendnowLat'),
                    /// 1：上门取件  2：送货上门
                    SendType: vm.wayType,
                    /// 送货时间范围类型 1:随时  2： 周一-周五  3：周末
                    SendDateRangeType: dayDir[decodeURI($.getUrlParam('sendDate')).split(" ")[0]] || 0,
                    /// 送货时间时间戳范围类型 1：随时 2： 早上  3：中午 4:晚上
                    SendTimeRangeType: timeDir[decodeURI($.getUrlParam('sendDate')).split(" ")[1]] || 0
                };

                if(prostr){
                    var arr=prostr.split(",");
                    for(var i= 0,j=arr.length;i<j;i++){
                        if(arr[i].split('-')[0].indexOf('codes') != -1){
                            json['products['+arr[i].split('-')[0].split('[')[1].split(']')[0]+']']=parseInt(arr[i].split('-')[2]);
                        }
                    }
                }
                jsonp(host+'/jsonp/Booking_InsertBookingRequest_'+vm.version+'.js',json,'callback',function(rs){
                    vm.isBooking = false;
                    if(rs.Success){
                        window.location.href='bookdetail.html?code='+rs.Data.TradeOrderCode+'&isNeedPay='+rs.Data.IsNeedPay;
                    }else{
                        if(rs.Code === 8001){
                            window.location.href = 'http://m.wziwash.com/SSOAccount/Login?returnUrl='+window.location.href;
                        }
                        // else if( rs.Msg == '请绑定手机号'){
                        //     $.dialog({
                        //         msg:'您还没有绑定手机号码，现在前往绑定？',
                        //         sureText:'前往',
                        //         sureFn:function(){
                        //             window.location.href = '../personal/bindPhone.html';
                        //         }
                        //     });
                        // }
                        //
                        else if( rs.Code === 7002 || rs.Msg == '您还有未支付的订单，不能预约' ){
                            $.dialog({
                                msg:'您还有未支付的订单，需要支付后才能发起预约，现在前往支付？',
                                sureText:'前往',
                                sureFn:function(){
                                    window.location.href = '../merchant/personorderlist.html?status=1';
                                }
                            });
                        }else{
                            $.message({
                                msg:rs.Msg
                            });
                        }
                    }
                },function(){
                });

            },

            //创建订单
            createOrder:function(){
                var hasMsg = false;

                var prostr= $.getUrlParam('provalue'),
                    json={},
                    type = -1;

                if(vm.pickupDate == '现在'){
                    type = -1;
                    // vm.pickupDate = stamp2time();
                }else{
                    type = 0;
                }

                if(vm.pickupAddress === '请选择取件地址'){
                    $.message({
                        msg:'请选择取件地址!'
                    });
                    return;
                }

                if(vm.wayType === 2 && vm.sendAddress === ''){
                    $.message({
                        msg:'请选择收货地址!'
                    });
                    return;
                }

                if(vm.proCount === 0){
                    $.message({
                        msg:'请选择商品!'
                    });
                    return;
                }

                vm.isBooking = true;

                if( vm.remark !== ''){
                    hasMsg = true;
                }

                var json={
                    token:token,
                    SendDayScore:dayDir[decodeURI($.getUrlParam('sendDate')).split(" ")[0]],
                    SendTimeScore:timeDir[decodeURI($.getUrlParam('sendDate')).split(" ")[1]],
                    PickAddressCode:vm.PickAddressCode,
                    //送货地址code
                    SendAddressCode:vm.SendAddressCode,
                    //支付方式
                    PayMethod:1,
                    //自提送货上门
                    SendType:vm.wayType,
                    //使用积分
                    UsePoint:'',
                    //使用积分券code
                    UseCounponCode:'',
                    //是否有留言
                    HasMessage:hasMsg,
                    //留言信息
                    Message:vm.remark,
                    UserMemberCardBalance:'',
                    //发票名称
                    BillName:'',
                    //是否需要发票
                    HasNeedBill:false,
                    //发票类型
                    BillType:'',
                    PickupDate:vm.pickupDate
                };


                if(prostr){
                    var arr=prostr.split(",");
                    for(var i= 0,j=arr.length;i<j;i++){
                        if(arr[i].split('-')[0].indexOf('codes') != -1){
                            json['SkuCodes['+arr[i].split('-')[0].split('[')[1].split(']')[0]+']']=parseInt(arr[i].split('-')[2]);
                        }
                    }
                }

                // vm.skuData.forEach(function(el){
                //     json['SkuCodes['+el.Code+']']=el.Num;
                // });

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


            },
            //填写备注
            remarkFn:function(){
                if($.trim(vm.remark)){
                    var json={
                        remark:vm.remark
                    };

                    vm.urlData=jsonInList(json,vm.urlData);
                    vm.searchData=transList2Url(vm.urlData.$model);
                }
            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();