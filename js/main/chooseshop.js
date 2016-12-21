/**
 * Created by hulgy on 16/6/19.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:'chooseshop',
            //版本号
            version:"",
            //商家列表数据
            shopDataList:[],
            //是否可以确定
            isOk:false,
            //是否显示排序
            isShow:false,
            //排序字段
            selected:"CreateTime",
            //显示状态
            state:1,
            //订单code
            orderCode:'',
            subCode:'',
            subHerf:'',
            code:'',
            SortColumn:'',
            //预约code
            bookCode:$.getUrlParam('code'),
            //每次去检测当前ajax是否完成
            isLoaded:false,
            nowPageIndex:1,
            maxPageNum:0,
            bookIsLoadSuccess:true,
            pollingDataModel:[],
            beginTime:'',
            showTips:false,
            totalNum:0,
            loadingImgShow:true,
            timer:null,
            m:15,
            s:0,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getBusinessList();
                });
                var timer = null,
                    time = 900;
                timer = setInterval(function(){
                    time --;
                    vm.daoTime(time);

                    if(time <= 0){
                        vm.cancelOrder();
                        clearInterval(timer);
                    }

                },1000);
            },
            daoTime:function(s){
                vm.m=parseInt(s/60);
                s%=60;

                vm.s = s;

            },
            //获取商家的确认订单
            getBusinessList:function(isReload){
                //vm.isLoaded=false;
                jsonp(host+'jsonp/Booking_GetBookApplyByPage_'+vm.version+'.js',{
                    token:token,
                    SortType:1,
                    Page:vm.nowPageIndex,
                    PageSize:4,
                    SortColumn:vm.SortColumn,
                    bookingRequestCode: $.getUrlParam('code') || '2016053122073873889'
                },'callback',function(rs){
                    var data = rs.Data;
                    vm.isOk=false;
                    vm.loadingImgShow = false;

                    if(data.length > 0){
                        for(var i= 0,j=data.length;i<j;i++){
                            data[i].isSelect=false;
                            data[i].BusinessBeginTime=data[i].BusinessBeginTime.replace("时",":").replace("分","");
                            data[i].BusinessEndTime=data[i].BusinessEndTime.replace("时",":").replace("分","");

                            if(!isReload){
                                vm.shopDataList.push(data[i]);
                                vm.subCode = data[0].ThirdCode;
                                vm.subHerf = 'quickbook.html?type=person&code='+vm.subCode
                            }
                        }

                        //vm.totalNum += data.length || 0;
                    }else{
                        vm.beginTime = rs.NowDateTime;

                        vm.timer = setInterval(function(){
                            if(vm.isLoaded){
                                vm.getPollingData();
                            }
                        },5000);
                    }

                    if(isReload){
                        vm.shopDataList = data;
                        vm.subCode = data[0].ThirdCode;
                        vm.subHerf = 'quickbook.html?type=person&code='+vm.subCode
                    }

                    vm.isLoaded=true;
                },function(){

                });
            },
            //轮询接口
            getPollingData:function(){
                vm.bookIsLoadSuccess = false;
                jsonp(host+'jsonp/Booking_GetBookApplyListBybookingRequestCodeAndBeginTime_'+vm.version+'.js',{
                    token:token,
                    beginTime:vm.beginTime,
                    bookingRequestCode: $.getUrlParam('code') || '2016053122073873889'
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data;
                        if(data){
                            // for(var i= 0,j=data.length;i<j;i++){
                            //     data[i].isSelect=false;
                            //     vm.pollingDataModel.push(data[i]);
                            // }
                            if(data.length > 0){
                                // vm.shopDataList = data;
                                // vm.subCode = data[0].ThirdCode;
                                // vm.subHerf = 'quickbook.html?type=person&code='+vm.subCode;
                                vm.getBusinessList();
                                clearInterval(vm.timer);
                            }
                        }else{
                            vm.isLoaded = false;
                        }
                        vm.beginTime = rs.NowDateTime;
                        vm.totalNum += data.length || 0;

                        if(vm.totalNum > 0){
                            vm.showTips = true;
                        }
                    }
                    vm.bookIsLoadSuccess = true;
                },function(){
                });

            },
            //插入预约数据
            unshiftFn:function(){
                $('body').scrollTop(0);

                if(vm.shopDataList.size() > 0){
                    vm.pollingDataModel.forEach(function(el){
                        vm.shopDataList.forEach(function(ele){
                            if(el.Code !== ele.Code){
                                vm.shopDataList.unshift(el);
                            }
                        });
                    });
                }else{
                    vm.pollingDataModel.forEach(function(el){
                        vm.shopDataList.unshift(el);
                    });
                }
                vm.showTips = false;
                vm.totalNum = 0;
            },
            //选择商家
            chooseShop:function(index){
                vm.shopDataList.forEach(function(el){
                    el.isSelect=false;
                });
                vm.isOk=true;
                vm.shopDataList[index].isSelect=true;
                vm.orderCode=vm.shopDataList[index].BookingRequestCode;
                vm.code=vm.shopDataList[index].Code;
            },
            //确定下单
            sureOrder:function(state){
                if(state){
                    jsonp(host+'jsonp/Booking_UpdateCBBooingRequestStatusToFinish_'+vm.version+'.js',{
                        token:token,
                        code:vm.bookCode,
                        bookingRequestApplyCode:vm.code
                    },'callback',function(rs){
                        if(rs.Success){
                            $.message({
                                msg:'订单确认成功!',
                                callback:function(){
                                    window.location.href = '../main/quickbook.html?code='+rs.Data
                                }
                            });
                        }else{
                            $.message({
                                msg:rs.Msg
                            });
                        }
                    },function(){

                    });
                }
            },
            //改变显示排序
            changeShow:function(){
                vm.isShow=!vm.isShow;
            },
            //修改排序
            changestate:function(index){
                vm.selected=avalon(this).data('sort');
                vm.state=index;
                vm.isShow=!vm.isShow;
            },
            //排序规则选择
            sortData:function(index,name,type){
                //vm.selected=avalon(this).data('sort');
                vm.sortType=index;
                vm.sortName=name;
                vm.SortColumn = type;
                vm.isShow=!vm.isShow;

                vm.getBusinessList(true);
            },
            goOrderDetail:function(){
                window.location.href = 'quickbook.html?type=person&code='+vm.shopDataList[0].ThirdCode;
            },
            //取消预约订单
            cancelOrder:function(){
                jsonp(host+'jsonp/Booking_UpdateCBBooingRequestStatusToCancelByCode_'+vm.version+'.js',{
                    token:token,
                    code:vm.bookCode
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'预约取消成功!',
                            callback:function(){
                                window.location.href='book.html';
                            }
                        });
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){

                });
            }

        });

        var a = new $.scrollLoad({
            mainDiv: $(".shoplistbox"),
            buttonLength: 50,
            ajaxFn: function (){
                vm.nowPageIndex++;

                if(vm.nowPageIndex <= vm.maxPageNum){
                    vm.getBusinessList();
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