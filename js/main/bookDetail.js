/**
 * Created by hulgy on 13/11/2016.
 */
(function(){
    'use strict';

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
        var vm = avalon.define({
            $id:'book',
            //版本号
            version:"",
            isNeedPay:false,
            code:$.getUrlParam('code'),
            LogistTime:'',
            orderData:{},
            hasProduct:false,
            //商品清单
            proList:[
                {name:"干洗熨烫",value:[],num:0,ttprice:0},
                {name:"清洗保养",value:[],num:0,ttprice:0},
                {name:"奢侈护理",value:[],num:0,ttprice:0},
                {name:"裁剪维修",value:[],num:0,ttprice:0}
            ],
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getOderInfo();
                });
            },//获取订单详情
            getOderInfo:function(){
                jsonp(host+'/jsonp/Order_JGetOrderDetail_'+vm.version+'.js',{
                    token:token,
                    code:vm.code,
                    isuser:true
                },'callback',function(rs){
                    if(rs.Success){
                        var data=rs.Data.Orders[0];

                        var order=data.SubOrders;
                        data.totalNum=0;
                        data.actionList=[];
                        for(var n= 0,m=order.length;n<m;n++){
                            var index = parseInt(order[n].Item.Other);

                            if(!isNaN(index)){
                                order[n].Item.totalNum = parseInt(order[n].Num);
                                vm.proList[index-1].value.push(order[n].Item);

                                data.totalNum += parseInt(order[n].Num);
                                vm.hasProduct = true;
                            }

                        }

                        for(var i=0,j=data.Actions.length;i<j;i++){
                            if(data.Actions[i] === 'PAYACTION'){
                                vm.isNeedPay = true;
                            }
                        }

                        vm.orderData = data;
                        vm.calcuteNumAndPrice();

                        if(!vm.orderData.LogistPicker) return;
                        var address=vm.orderData.LogistPicker.ThirdCode;

                        if(address){
                            var addressArr=address.split(',');

                            var dayStr=dayDir[parseInt(addressArr[0])] || '',
                                timeStr=timeDir[parseInt(addressArr[1])] || '';

                            vm.LogistTime = dayStr+" "+timeStr;
                        }
                    }
                },function(){
                });

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
            //支付订单
            payOrder:function(){
                window.location.href='http://m.wziwash.com/order/payment?code='+vm.code;
            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();