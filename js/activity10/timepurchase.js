/**
 * Created by hulgy on 13/01/2017.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'timepurchase',
            version:'',
            saleDataModel:[],
            loadingImgShow:true,
            timeState:0,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getSaleList();
                });
            },
            //去结算
            settlementFn:function(code){
                var arr = [{
                    code:code,
                    num:1
                }];
                setLocalstorage('preFillorderHerf',window.location.href);
                window.location.href="../main/fillorder.html?"+serializaDataOther(arr,"codes");
            },
            //补位方法
            fillSeat:function(s){
                return s<=9?'0'+s:s;
            },
            checkMoreFn:function(el,str){
                el.isShowMore = !el.isShowMore;
                el.divHeight = str;
            },
            //获取抢购列表
            getSaleList:function(){

                var oDate = new Date();
                jsonp(host+'/jsonp/DiscountActivity_GetShopProductsByCodeAndDate_'+vm.version+'.js',{
                    token:token,
                    type:1,
                    dateCode: oDate.getFullYear()+''+vm.fillSeat(oDate.getMonth()+1)+''+vm.fillSeat(oDate.getDate())+'1100'
                },'callback',function(rs){
                    if(rs.Success){
                        vm.loadingImgShow = false;
                        if(rs.hasOwnProperty('Data')){
                            var data = rs.Data;
                            for(var i=0,j=data.length;i<j;i++){

                                if(oDate.getHours() < 10){
                                    data[i].canBuy = false;
                                    data[i].timeState = -1;
                                }else if(oDate.getHours() >= 11){
                                    data[i].canBuy = false;
                                    data[i].timeState = 1;
                                }else{
                                    data[i].canBuy = true;
                                }

                                var score = parseFloat(data[i].CommentScore) || 5;
                                data[i].CommentIntScore = (score/5)*3;
                                data[i].isShowMore = false;
                                if(data[i].Products.length > 3){
                                    data[i].divHeight = '10rem';
                                }
                                vm.saleDataModel.push(data[i]);
                            }
                        }
                    }else{
                        vm.loadingImgShow = false;
                        $.message({
                            msg:rs.Msg
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