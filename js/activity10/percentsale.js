/**
 * Created by hulgy on 16/10/2016.
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
            //获取版本号
            getVersion:function(){
                var fontSize=$(window).width()/16;
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getSaleList(true);
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

                }
                //10点到13点
                else if(hours >= 10 && hours < 13){

                    vm.dataHours = '1000';

                }
                //13点到16点
                else if(hours >= 13 && hours < 16){
                    vm.dataHours = '1300';

                }
                //16点之后
                else if(hours >= 16){

                    vm.dataHours = '1600';
                }

                setInterval(function(){
                    time --;
                    if(time <= 0) return;
                    vm.daoTime(time);
                },1000);
            },
            //去结算
            settlementFn:function(code){
                var arr = [{
                    code:code,
                    num:1
                }];
                window.location.href="../main/fillorder.html?"+serializaDataOther(arr,"codes");
            },
            //补位方法
            fillSeat:function(s){
                return s<=9?'0'+s:s;
            },
            //获取抢购列表
            getSaleList:function(state){
                if(state){
                    vm.saleDataModel = [];
                }
                var oDate = new Date();
                //DiscountActivity_GetProductsByCodeAndDate?type=1&dateCode=
                jsonp(host+'/jsonp/DiscountActivity_GetProductsByCodeAndDate_'+vm.version+'.js',{
                    token:token,
                    type:2,
                    PageIndex:vm.nowPageIndex,
                    PageSize:10,
                    // dateCode: oDate.getFullYear()+''+vm.fillSeat(oDate.getMonth()+1)+''+vm.fillSeat(oDate.getDate())+vm.dataHours
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