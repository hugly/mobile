/**
 * Created by hulgy on 16/8/14.
 */
(function(){
    'use strict';
    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"grouplist",
            //版本号
            version:"",
            //店铺code
            ShopCode: $.getUrlParam('dataid'),
            //团购券数据模型
            grouponsList:[],
            loadingImgShow2:true,
            nowPageIndex2:1,
            maxPageNum2:1,
            hasGroupsList:false,
            //选择部分定位
            boxPosition:function(){
                $(window).scrollTop(10000);
            },
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getgroupon(true,true);
                });
            },
            //获取商家的团购券
            getgroupon:function(type,isFirst){
                if(isFirst){
                    vm.nowPageIndex2 = 1;
                }
                vm.tabindex=2;
                vm.loadingImgShow2 = true;

                if(type){
                    vm.grouponsList = [];
                }
                var arr=[{
                    'ShopCode':$.getUrlParam("dataid")
                }];

                if(vm.nowPageIndex2 < 1) return;

                jsonp(host+'/jsonp/GroupCoupon_PagingByShop_'+vm.version+'.js',{
                    token: token,
                    PageIndex:vm.nowPageIndex2,
                    PageSize:10,
                    'ShopCode':$.getUrlParam("dataid")
                },'callback',function(rs){
                    var data = rs.Data;
                    if(data){

                        for(var i= 0,j=data.length;i<j;i++){

                            if(!type){
                                vm.grouponsList.push(data[i]);
                            }
                        }

                        if(type){
                            vm.grouponsList=data;
                        }

                        vm.maxPageNum2 = rs.TotalPages;
                    }else{
                        vm.hasGroupsList = true;
                    }
                    vm.loadingImgShow2 = false;
                },function(){
                });
            }
        });

        var b = new $.scrollLoad({
            mainDiv: $(".groupon"),
            buttonLength: 50,
            ajaxFn: function (){
                vm.nowPageIndex2++;

                if(vm.nowPageIndex2 <= vm.maxPageNum2){
                    vm.getgroupon(false,false);
                }else{
                    vm.nowPageIndex2 = vm.maxPageNum2;
                }
                b.ajaxSuccess();
            }
        });


        vm.getVersion();
        avalon.scan();
    });
})();
