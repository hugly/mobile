/**
 * Created by hulgy on 14/10/2016.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'flashsale',
            version:'',
            isFix:false,
            //时
            h:'00',
            //分
            m:'00',
            //秒
            s:'00',
            dataHours:'',
            nowHours:0,
            nowIndex:1,
            texttype1:'',
            texttype2:'',
            texttype3:'',
            saleDataModel:[],
            loadingImgShow:true,
            nowPageIndex:1,
            maxPageNum:0,
            nextTime:0,
            nowTime:0,
            canOrder:true,
            //获取版本号
            getVersion:function(){
                var fontSize=$(window).width()/16,
                    oDate = new Date();

                vm.nowTime = oDate.getFullYear()+''+vm.fillSeat(oDate.getMonth()+1)+''+vm.fillSeat(oDate.getDate())+''+vm.fillSeat(oDate.getHours())+''+vm.fillSeat(oDate.getMinutes());
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getSaleList(true);
                });
                $(window).scroll(function(){
                    var top = $(window).scrollTop();

                    if(top > fontSize*6){
                        vm.isFix = true;
                    }else{
                        vm.isFix = false;
                    }
                });
                vm.calcuteTime();
            },
            //计算时间
            calcuteTime:function(){
                var oDate = new Date(),
                    hours = oDate.getHours(),
                    nowTime = oDate.getTime(),
                    time = 0;

                vm.nowHours = hours;

                //上午10点之前
                if(hours < 10){

                    oDate.setHours(10,0,0,0);
                    time = parseInt((oDate.getTime()-nowTime)/1000);
                    vm.dataHours = '1000';

                    vm.texttype1 = '即将开始';
                    vm.texttype2 = '即将开始';
                    vm.texttype3 = '即将开始';

                }
                //10点到13点
                else if(hours >= 10 && hours < 13){

                    oDate.setHours(13,0,0,0);
                    time = parseInt((oDate.getTime()-nowTime)/1000);
                    vm.nowIndex = 1;
                    vm.dataHours = '1000';

                    vm.texttype1 = '抢购进行中';
                    vm.texttype2 = '即将开始';
                    vm.texttype3 = '即将开始';

                }
                //13点到16点
                else if(hours >= 13 && hours < 16){

                    oDate.setHours(16,0,0,0);
                    time = parseInt((oDate.getTime()-nowTime)/1000);
                    vm.nowIndex = 2;
                    vm.dataHours = '1300';

                    vm.texttype1 = '已结束';
                    vm.texttype2 = '抢购进行中';
                    vm.texttype3 = '即将开始';

                }
                //16点之后
                else if(hours >= 16){

                    oDate.setDate(oDate.getDate());
                    oDate.setHours(24,0,0,0);
                    time = parseInt((oDate.getTime()-nowTime)/1000);
                    vm.nowIndex = 3;
                    vm.dataHours = '1600';

                    vm.texttype1 = '已结束';
                    vm.texttype2 = '已结束';
                    vm.texttype3 = '抢购进行中';
                }

                setInterval(function(){
                    time --;
                    if(time <= 0) return;
                    vm.daoTime(time);
                },1000);
            },
            changeIndex:function(index,str,text){
                vm.nowPageIndex = 1;
                $(window).scrollTop(0);
                vm.nowIndex = index;
                vm.dataHours = str;
                vm.getSaleList(true,text);
            },
            //倒计时
            daoTime:function(s){
                vm.h=vm.fillSeat(parseInt(s/3600));
                s%=3600;

                vm.m=vm.fillSeat(parseInt(s/60));
                s%=60;

                vm.s = vm.fillSeat(s);
            },
            //补位方法
            fillSeat:function(s){
                return s<=9?'0'+s:s;
            },
            //去结算
            settlementFn:function(code){
                var arr = [{
                    code:code,
                    num:1
                }];
                window.location.href="../main/fillorder.html?"+serializaDataOther(arr,"codes");
            },
            //获取抢购列表
            getSaleList:function(state,text){
                if(text == '已结束'){
                    vm.canOrder = false;
                }else{
                    vm.canOrder = true;
                }
                if(state){
                    vm.saleDataModel = [];
                }
                var oDate = new Date();

                vm.nextTime = oDate.getFullYear()+''+vm.fillSeat(oDate.getMonth()+1)+''+vm.fillSeat(oDate.getDate())+vm.dataHours;
                //DiscountActivity_GetProductsByCodeAndDate?type=1&dateCode=
                jsonp(host+'/jsonp/DiscountActivity_GetProductsByCodeAndDate_'+vm.version+'.js',{
                    token:token,
                    type:1,
                    PageIndex:vm.nowPageIndex,
                    PageSize:10,
                    // dateCode:201611041600
                    dateCode: oDate.getFullYear()+''+vm.fillSeat(oDate.getMonth()+1)+''+vm.fillSeat(oDate.getDate())+vm.dataHours
                },'callback',function(rs){
                    if(rs.Success){
                        vm.loadingImgShow = false;
                        if(rs.hasOwnProperty('Data')){
                            var data = rs.Data;
                            for(var i=0,j=data.length;i<j;i++){
                                var arr = String(parseFloat(data[i].Discount/10)).split('.');
                                data[i].intDiscount = arr[0];
                                data[i].decDiscount = arr[1] || '0';

                                if(!state){
                                    vm.saleDataModel.push(data[i]);
                                }

                            }
                            if(state){
                                vm.saleDataModel = data;
                            }
                        }
                        vm.maxPageNum=rs.TotalPages;
                    }else{
                        vm.loadingImgShow = false;
                        $.message({
                            msg:rs.Msg
                        });
                    }

                    vm.isSureing = false;
                },function(){
                });
            }
        });

        var a = new $.scrollLoad({
            mainDiv: $(".salelist"),
            buttonLength: 50,
            ajaxFn: function (){
                vm.nowPageIndex++;

                if(vm.nowPageIndex <= vm.maxPageNum){
                    vm.getSaleList(false);
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