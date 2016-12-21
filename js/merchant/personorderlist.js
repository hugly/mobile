/**
 * Created by hulgy on 16/6/25.
 */
(function(){
    'use strict';

    /// <summary> /// 洗衣 /// </summary> Wash = 1,
    /// <summary> /// 商城市场 /// </summary> MallMarket = 2,
    /// <summary> /// 团购市场 /// </summary> GroupMarket = 3,
    /// <summary> /// 团购市场 /// </summary> Book = 3

    var ordertype={
        1:'洗衣',
        2:'商城市场',
        3:'团购市场',
        4:'预约'
    };

    var marketDir={
        // 1:'在线预订',
        1:'在线预订',
        2:'商城订单',
        3:'团购订单',
        4:'预约订单'
    };

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
            $id:'orderlist',
            //版本号
            version:0,
            //订单数据模型
            orderData:[],
            //订单状态
            orderState:[
                {code:1,name:'待支付',isActive:true},
                {code:19,name:'待取送',isActive:false},
                {code:18,name:'处理中',isActive:false},
                {code:4,name:'退款/售后',isActive:false}
            ],
            //显示更多内容
            showMore:false,
            nowPageIndex:1,
            maxPageNum:0,
            loadingImgShow:true,
            marketName:'全部',
            marketIndex: parseInt($.getUrlParam('market')) || -1,
            marketIsShow:false,
            ShowStatus: parseInt($.getUrlParam('status')) || 1,
            hasTimeDataModel:[],
            //初始化
            init:function(){
                if(vm.marketIndex === -1){
                    vm.marketName = '全部';
                }else{
                    vm.marketName = marketDir[vm.marketIndex];
                }
                vm.getListData(false);
            },
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    //vm.getListData(false);
                    vm.init();
                });

                if(vm.ShowStatus !== ''){
                    vm.orderState.forEach(function(el){
                        el.isActive = false;
                        if(el.code === vm.ShowStatus){
                            el.isActive = true;
                        }
                    })
                }
            },
            changeMarketShow:function(){
                vm.marketIsShow = !vm.marketIsShow;
            },
            changeMarketFn:function(index,name){
                vm.marketIndex = index;
                vm.marketName = name;
                vm.getListData(true);
                vm.changeMarketShow();
            },
            //获取列表数据
            getListData:function(status){
                if(status){
                    vm.nowPageIndex = 1;
                    vm.maxPageNum = 0;
                    vm.orderData = [];
                    $('body').scrollTop(0);
                }

                vm.loadingImgShow = true;
                //http://m.wziwash.com/jsonp/Order_JShopSearch_9.js?callback=jsonp0553329182875671&token=3dd9jddd84jwe3&PageIndex=1
                jsonp(host+'jsonp/Order_JUserSearch_'+vm.version+'.js',{
                    token:token,
                    PageIndex:vm.nowPageIndex,
                    Market:vm.marketIndex,
                    PageSize:10,
                    ShowStatus:vm.ShowStatus
                },'callback',function(rs){
                    if(rs.Success){
                        var data=rs.Data.Data;

                        vm.loadingImgShow = false;
                        for(var i= 0,j=data.length;i<j;i++){
                            var order=data[i].Orders[0].SubOrders;
                            data[i].totalNum=0;

                            data[i].actionList=[];
                            data[i].actionList=vm.getActionList(data[i].Orders[0].Actions);

                            for(var n= 0,m=order.length;n<m;n++){
                                data[i].totalNum += parseInt(order[n].Num);
                            }

                            data[i].orderType = marketDir[data[i].Market];

                            if(data[i].Market === 3){
                                data[i].linkhref='grouporderdetail.html?type=person&code='+ data[i].Orders[0].Code;
                            }else{
                                data[i].linkhref='../main/quickbook.html?type=person&code='+ data[i].Orders[0].Code;
                            }

                            var nextStatusData = data[i].Orders[0].NextOrderStatus;

                            var json = {
                                timer:null,
                                code:data[i].Orders[0].Code,
                                RemainTime:nextStatusData.NextStatusInter,
                                totalTime:nextStatusData.TotalInter
                            };

                            vm.hasTimeDataModel.push(json);

                            if(!status){
                                vm.orderData.push(data[i]);
                            }

                        }

                        if(status){
                            vm.orderData = data;
                            vm.nowPageIndex = 1;
                        }

                        vm.maxPageNum = rs.Data.TotalPages;

                        vm.timerFn();
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            timerFn:function(){
                var obj = $('.order-box ul');
                vm.hasTimeDataModel.forEach(function(item){
                    clearInterval(item.timer);
                    item.timer = setInterval(function(){
                        item.RemainTime --;


                        if(item.totalTime <= 0){
                            item.scale = 100;
                        }else{
                            item.scale = (1-(item.RemainTime/item.totalTime))*100;
                        }

                        obj.find('li').each(function(){
                            var _this = this,
                                code = $(_this).attr('code');

                            if(code === item.code){
                                $(_this).find('.result-time').text(dao2time(parseInt(item.RemainTime)));
                                $(_this).find('.probar').css({width:item.scale+'%'});
                            }

                        });

                        if(item.RemainTime <= 0){
                            clearInterval(item.timer);
                        }

                    },1000);
                });
            },
            sumNum:function(num){
                num = parseInt(num);
                return num>9?num:'0'+num;
            },
            //左移动
            leftMoveFn:function(){
                vm.showMore = !vm.showMore;
            },
            //右移动
            rightMoveFn:function(){
                vm.showMore = !vm.showMore;
            },
            //修改订单状态
            changeState:function(index){

                if(index === 999){
                    vm.orderState.forEach(function(el){
                        el.isActive=false;
                    });
                    vm.ShowStatus = '';
                }else{
                    vm.orderState.forEach(function(el){
                        el.isActive=false;
                    });
                    vm.orderState[index].isActive=true;
                    vm.ShowStatus = vm.orderState[index].code;
                }

                vm.getListData(true);
                avalon.scan();
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
                        $.dialog({
                            msg:'确定要取消该订单?',
                            sureFn:function(){
                                window.location.href='cancelorder.html?code='+code;
                            }
                        });
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
                            msg:'签收成功!'
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
                            msg:'开始工作成功!'
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
                            msg:'取件完成!'
                        });
                    }
                },function(){
                });
            }
        });

        // $('.order-box').dropload({
        //     scrollArea : window,
        //     loadDownFn : function(me){
        //         vm.nowPageIndex++;
        //
        //         if(vm.nowPageIndex <= vm.maxPageNum){
        //             vm.getListData(false);
        //         }else{
        //             vm.nowPageIndex = vm.maxPageNum;
        //         }
        //         me.resetload();
        //     }
        // });

        var a = new $.scrollLoad({
           mainDiv: $(".order-box ul"),
           buttonLength: 200,
           ajaxFn: function (){
               vm.nowPageIndex++;
               if(vm.nowPageIndex <= vm.maxPageNum){
                   vm.getListData(false);
               }else{
                   vm.nowPageIndex = vm.maxPageNum;
               }
               a.ajaxSuccess();
           }
        });

        vm.getVersion();
        avalon.scan();
    });

})();