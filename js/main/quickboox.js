/**
 * Created by hulgy on 16/7/2.
 */
(function(){
    'use strict';

    var btnDir=[
        {key:'PAYACTION',value:1,text:'支付'},
        {key:'REFUNDACTION',value:2,text:'退款'},
        {key:'CANCELACTION',value:3,text:'取消'},
        {key:'PICKACTION',value:4,text:'取件'},
        {key:'LOGISTERACTION',value:5,text:'送货'},
        {key:'SIGNACTION',value:6,text:'签收'},
        {key:'COMPLAINTACTION',value:7,text:'投诉'},
        {key:'COMMENTACTION',value:8,text:'评价'},
        {key:'WORKACTION',value:9,text:'记录工作'}
    ];

    var dayDir={
        0:'随时',
        1:'周一至周五',
        2:'周末'
    };
    var timeDir={
        0:'随时',
        1:'早上',
        2:'中午',
        3:'晚上'
    };

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:'orderinfo',
            //版本号
            version:"",
            //订单code
            code: $.getUrlParam('code') || '',
            //order的数据模型
            orderData:{
                Contacter:{
                    Name:'',
                    Phone:''
                },
                LogistPicker:{
                    Name:'',
                    Phone:''
                },
                Orders:[{
                    Seller:{
                        Phone:''
                    },
                    IsPickup:'',
                    IsLogist:'',
                    ShowStatusFlows:[]
                }],
                actionList:[]
            },
            //操作数据模型
            actionList:[],
            statusFlowsList:[],
            //判断商品数据模型
            hasPro:false,
            //商品清单
            proList:[
                {name:"干洗熨烫",value:[],num:0,ttprice:0},
                {name:"清洗保养",value:[],num:0,ttprice:0},
                {name:"奢侈护理",value:[],num:0,ttprice:0},
                {name:"裁剪维修",value:[],num:0,ttprice:0}
            ],
            proDataModel:[],
            proTotalPrice:0,
            proTotalNum:0,
            //取件时间
            LogistAddress:'',
            //取件数据模型
            pickupModel:{},
            //送货数据模型
            containModel:{},
            isShowMore:false,
            showFixed:false,
            timeLeft:'00:00:00',
            time2Left:'00:00',
            timer:null,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getOderInfo();
                });
            },
            caculateHeight:function(){

                function commbo(){
                    var oBodyTop = $('body').scrollTop(),
                        oComboxTop = $('.combox').offset().top-$(window).height();

                    if(oComboxTop < oBodyTop){
                        vm.showFixed = false;
                    }else{
                        vm.showFixed = true;
                    }
                }

                commbo();

                $(window).scroll(function(){
                    commbo();
                });
            },
            //获取取件人信息
            getPickupInfo:function(code){
                jsonp(host+'jsonp/Order_JGetPickRecord_'+vm.version+'.js',{
                    token:token,
                    code:code
                },'callback',function(rs){
                    //if(rs.Success){
                    vm.pickupModel = rs.PickupUser;
                    //}
                },function(){
                });
            },
            //获取送货人信息
            getConInfo:function(code){
                jsonp(host+'jsonp/Order_JGetDelivery_'+vm.version+'.js',{
                    token:token,
                    code:code
                },'callback',function(rs){
                    //if(rs.Success){
                        vm.containModel = rs.LogisticsRecords[0];
                    //}
                },function(){
                });
            },
            //获取订单详情
            getOderInfo:function(){
                jsonp(host+'/jsonp/Order_JGetOrderDetail_'+vm.version+'.js',{
                    token:token,
                    code:vm.code,
                    isuser:true
                },'callback',function(rs){
                    if(rs.Success){
                        var data=rs.Data;

                        if(data.Orders[0].Status === 6){
                            vm.getPickupInfo(data.Orders[0].Code);
                        }else if(data.Orders[0].Status === 10){
                            vm.getConInfo(data.Orders[0].Code);
                        }

                        var order=data.Orders[0].SubOrders;
                        if(order.length > 0){
                            data.totalNum=0;
                            //data.actionList=[];
                            for(var n= 0,m=order.length;n<m;n++){
                                var index=parseInt(order[n].Item.Other);

                                order[n].Item.totalNum=parseInt(order[n].Num);
                                if(index){
                                    vm.proList[index-1].value.push(order[n].Item);
                                }

                                vm.proDataModel.push(order[n].Item);
                                vm.proTotalNum += parseInt(order[n].Num);

                                data.totalNum += parseInt(order[n].Num);
                                vm.orderData.actionList=vm.getActionList(order[n].Actions);
                                vm.actionList = vm.getActionList(order[n].Actions);
                            }
                            vm.hasPro = true;
                        }

                        data.Orders[0].Seller.ShopHours = data.Orders[0].Seller.ShopHours.replace('时',':').replace('时',':');
                        data.Orders[0].Seller.ShopHours = data.Orders[0].Seller.ShopHours.replace('分','').replace('分','');

                        var time = data.Orders[0].NextOrderStatus.NextStatusInter;
                        if(data.Orders[0].NextOrderStatus.HasNext){
                            if(data.Orders[0].NextOrderStatus.IsShowInter){
                                vm.caculateTimer(data.Orders[0].NextOrderStatus.TotalInter/60,(data.Orders[0].NextOrderStatus.TotalInter-time)/(data.Orders[0].NextOrderStatus.TotalInter/60));

                                vm.timer = setInterval(function(){
                                    time--;

                                    var h=parseInt(time/3600);
                                    var m=parseInt(time/60);

                                    vm.timeLeft = vm.sumNum(h)+':'+vm.sumNum(m%60)+':'+vm.sumNum(time%60);
                                    vm.time2Left = vm.sumNum(m)+':'+vm.sumNum(time%60);

                                    if(time <= 0){
                                        vm.timeLeft = '00:00:00';
                                        vm.time2Left = '00:00';
                                        clearInterval(vm.timer);
                                    }
                                },1000);

                            }else{
                                var totalTime = parseInt((new Date(data.Orders[0].NextOrderStatus.GuessCompleteDate).getTime() - new Date(data.Orders[0].CreateTime).getTime())/1000),
                                    leftTime = parseInt((new Date(data.Orders[0].NextOrderStatus.GuessCompleteDate).getTime() - new Date().getTime())/1000);

                                vm.caculateTimer(totalTime/60,(totalTime-leftTime)/(totalTime/60));


                                vm.timer = setInterval(function(){
                                    leftTime--;

                                    var h=parseInt(leftTime/3600);
                                    var m=parseInt(leftTime/60);

                                    vm.timeLeft = vm.sumNum(h)+':'+vm.sumNum(m)+':'+vm.sumNum(leftTime%60);
                                    vm.time2Left = vm.sumNum(h)+':'+vm.sumNum(m%60);

                                    if(leftTime <= 0){
                                        vm.timeLeft = '00:00:00';
                                        vm.time2Left = '00:00';
                                        clearInterval(vm.timer);
                                    }
                                },1000);

                            }
                        }

                        vm.actionList = vm.getActionList(data.Orders[0].Actions);
                        vm.orderStausList(data.Orders[0].ShowStatusFlows);
                        vm.orderData=data;
                        vm.calcuteNumAndPrice();

                        if(!vm.orderData.LogistPicker) return;
                        var address=vm.orderData.LogistPicker.ThirdCode;

                        if(address){
                            var addressArr=address.split(',');

                            var dayStr=dayDir[parseInt(addressArr[0])] || '',
                                timeStr=timeDir[parseInt(addressArr[1])] || '';

                            vm.LogistAddress = dayStr+" "+timeStr;
                        }

                        if(vm.orderData.Orders[0].Status === 10){
                            $.setQQMap({
                                obj:"map",
                                zoom:17,
                                lon:getLocalstorage('lon'),
                                lat:getLocalstorage('lat'),
                                imgsrc:"../../data-images/tag.png"
                            });
                        }
                        vm.caculateHeight();
                    }

                },function(){
                });

            },
            caculateTimer:function(t,n){
                var timer = null,
                    num = parseInt(n) || 0;

                if(num <= 30){
                    $('.right-part').css({'transform':'rotateZ('+(180+num*6)+'deg)','-webkit-transform':'rotateZ('+(180+num*6)+'deg)'});
                }else if(num < 60){
                    $('.right-part').css({'transform':'rotateZ(360deg)','-webkit-transform':'rotateZ(360deg)'});
                    $('.left-part').css({'transform':'rotateZ('+(-180+(num-30)*6)+'deg)','-webkit-transform':'rotateZ('+(-180+(num-30)*6)+'deg)'});
                }

                if(num >= 60){
                    $('.right-part').css({'transform':'rotateZ(360deg)','-webkit-transform':'rotateZ(360deg)'});
                    $('.left-part').css({'transform':'rotateZ(0deg)','-webkit-transform':'rotateZ(0deg)'});
                    clearInterval(timer);
                }

               timer = setInterval(function(){
                   num ++;

                   if(num <= 30){
                       $('.right-part').css({'transform':'rotateZ('+(180+num*6)+'deg)','-webkit-transform':'rotateZ('+(180+num*6)+'deg)'});
                   }else if(num < 60){
                       $('.right-part').css({'transform':'rotateZ(360deg)','-webkit-transform':'rotateZ(360deg)'});
                       $('.left-part').css({'transform':'rotateZ('+(-180+(num-30)*6)+'deg)','-webkit-transform':'rotateZ('+(-180+(num-30)*6)+'deg)'});
                   }

                   if(num >= 60){
                       $('.right-part').css({'transform':'rotateZ(360deg)','-webkit-transform':'rotateZ(360deg)'});
                       $('.left-part').css({'transform':'rotateZ(0deg)','-webkit-transform':'rotateZ(0deg)'});
                       clearInterval(timer);
                   }
               },t*1000);
            },
            sumNum:function(num){
                num = parseInt(num);
                return num>9?num:'0'+num;
            },
            checkMoreFn:function(){
                var obj = $('.pro-box ul');

                obj.css({height:vm.proDataModel.length * 3.05+'rem'});
                vm.isShowMore = true;

                vm.caculateHeight();
            },
            checkMoreOtherFn:function(){
                var obj = $('.pro-box ul');

                obj.css({height:'9.2rem'});
                vm.isShowMore = false;

                vm.caculateHeight();
            },
            orderStausList:function(data){
                var index = 0;
                for(var i=0,j=data.length;i<j;i++){
                    if(!data[i].IsSelected){
                        index = i-1;
                        break;
                    }else{
                        index = data.length-1;
                    }
                }
                for(var n=0,m=data.length;n<m;n++){
                    if(n<index){
                        data[n].Value = 0;
                    }else if(n === index){
                        data[n].Value = 1;
                    }else{
                        data[n].Value = 2;
                    }
                }
                vm.statusFlowsList = data;
            },
            //根据返回的数据获取actionlist
            getActionList:function(arr){
                var actionArr=[];

                if(arr.length > 0){
                    for(var i= 0,j=btnDir.length;i<j;i++){
                        for(var n= 0,m=arr.length;n<m;n++){
                            if(arr[n] === btnDir[i].key){
                                actionArr.push(btnDir[i]);
                            }
                        }
                    }
                }
                return actionArr;
            },
            //计算单类物品的总价和总数量
            calcuteNumAndPrice:function(){
                vm.proList.forEach(function(el){
                    el.num=0;
                    el.ttprice=0;

                    el.value.forEach(function(target){
                        el.num += parseInt(target.totalNum);
                        el.ttprice += target.totalNum * target.Price;
                    });

                    vm.proTotalPrice += el.ttprice;
                    el.ttprice = el.ttprice.toFixed(2);
                });
            },
            //订单操作
            operateFn:function(index,code,el){
                var porLen=el.Orders[0].SubOrders.length;
                switch (index){
                    //支付
                    case 1:
                        vm.payOrder(code);
                        break;
                    //申请退款
                    case 2:
                        window.location.href='../merchant/refund.html?code='+code;
                        break;
                    //取消
                    case 3:
                        window.location.href='../merchant/cancelorder.html?code='+code;
                        break;
                    //取件
                    case 4:
                        window.location.href='choosestaff.html?type=pick&code='+code;
                        break;
                    //送货
                    case 5:
                        window.location.href='choosestaff.html?type=send&code='+code;
                        break;
                    //签收
                    case 6:
                        $.dialog({
                            msg:'请确定用户已支付!',
                            sureFn:function(){
                                vm.signFn(code);
                            }
                        });
                        break;
                    //投诉
                    case 7:
                        window.location.href='../merchant/complaint.html?code='+code;
                        break;
                    //评价
                    case 8:
                        window.location.href='../merchant/evaluate.html?code='+code;
                        break;
                    //记录工作
                    case 9:
                        window.location.href='recordwork.html?code='+code;
                        break;
                    //开始工作
                    case 10:
                        $.dialog({
                            msg:'确定要开始工作吗?',
                            sureFn:function(){
                                vm.startWrokFn(code);
                            }
                        });
                        break;
                    //取件完成
                    case 11:
                        if(porLen === 0){
                            window.location.href='pickchooseclassical.html?ordercode='+code;
                        }else{
                            $.dialog({
                                msg:'已确认用户商品数量和完好无损?',
                                sureFn:function(){
                                    vm.pickupSucc(code);
                                }
                            });
                        }
                        break;
                    //退款审核
                    case 14:
                        window.location.href='refundaudit.html?code='+code;
                        break;
                }

            },
            //支付订单
            payOrder:function(code){
                window.location.href='http://m.wziwash.com/order/payment?code='+code;
            },
            //签收
            signFn:function(code){
                jsonp(host+'jsonp/Order_LogisticRecevie_'+vm.version+'.js',{
                    token:token,
                    code:code
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'签收完成!'
                        })
                    }
                },function(){
                });
            },
            //开始工作
            startWrokFn:function(code){
                jsonp(host+'jsonp/Order_Produce_'+vm.version+'.js',{
                    token:token,
                    code:code
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'开始工作!'
                        })
                    }
                },function(){
                });
            },
            //取件完成
            pickupSucc:function(code){
                jsonp(host+'jsonp/Order_Complete_'+vm.version+'.js',{
                    token:token,
                    code:code
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'取件完成!'
                        })
                    }
                },function(){
                });
            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();