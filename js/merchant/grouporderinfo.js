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
        {key:'WORKACTION',value:9,text:'记录工作'},
        {key:'PRODUCT',value:10,text:'开始工作'},
        {key:'PICKENDACTION',value:11,text:'取件完成'},
        {key:'PICKLOGISTERDACTION',value:12,text:'取件物流'},
        {key:'SENDLOGISTERDACTION',value:13,text:'送货物流'},
        {key:'REFAUNAUDITACTION',value:14,text:'退款审核'},
        {key:'INSERTITEMACTION',value:15,text:'录入商品'}
    ];


    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:'orderinfo',
            //版本号
            version:"",
            //类型
            type: $.getUrlParam('type'),
            //订单是否包含商品
            hasProduct:false,
            //电话号码
            telNum:0,
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
                    SubOrders:[
                        {
                            Item:{}
                        }
                    ],
                    Buyer:{}
                }],
                actionList:[]
            },
            //商品清单
            //proList:[
            //    {name:"干洗熨烫",value:[],num:0,ttprice:0},
            //    {name:"清洗保养",value:[],num:0,ttprice:0},
            //    {name:"奢侈护理",value:[],num:0,ttprice:0},
            //    {name:"裁剪维修",value:[],num:0,ttprice:0}
            //],
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getOderInfo();
                });
            },
            //获取订单详情
            getOderInfo:function(){
                jsonp(host+'/jsonp/Order_JGetOrderDetail_'+vm.version+'.js',{
                    token:token,
                    code:vm.code,
                    isuser:vm.type === 'person'?true:false
                },'callback',function(rs){
                    if(rs.Success){
                        var data=rs.Data;

                        var order=data.Orders[0].SubOrders;
                        data.totalNum=0;
                        data.actionList=[];
                        for(var n= 0,m=order.length;n<m;n++){
                            var index = parseInt(order[n].Item.Other);

                            if(!isNaN(index)){
                                order[n].Item.totalNum = parseInt(order[n].Num);
                                //vm.proList[index-1].value.push(order[n].Item);

                                data.totalNum += parseInt(order[n].Num);
                                data.actionList = vm.getActionList(order[n].Actions);
                                vm.hasProduct = true;
                            }

                        }
                        vm.orderData = data;
                        if(vm.type === 'person'){
                            vm.telNum=vm.orderData.Orders[0].Seller.Phone;
                        }else if(vm.type === 'seller'){
                            vm.telNum=vm.orderData.Buyer.Phone;
                        }
                    }
                },function(){
                });

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
                        window.location.href='refund.html?code='+code;
                        break;
                    //取消
                    case 3:
                        window.location.href='cancelorder.html?code='+code;
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
                        window.location.href='complaint.html?code='+code;
                        break;
                    //评价
                    case 8:
                        window.location.href='evaluate.html?code='+code;
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
                            msg:'签收完成!',
                            callback:function(){
                                window.history.go(-1);
                            }
                        });
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
                            msg:'开始工作!',
                            callback:function(){
                                window.history.go(-1);
                            }
                        });
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
                            msg:'取件完成!',
                            callback:function(){
                                window.history.go(-1);
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