/**
 * Created by hulgy on 16/8/14.
 */
(function(){
    'use strict';
    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"couponlist",
            //版本号
            version:"",
            //店铺code
            ShopCode: $.getUrlParam('dataid'),
            //优惠券数据模型
            couponsList:[],
            loadingImgShow1:true,
            nowPageIndex1:1,
            maxPageNum1:1,
            hasCouponsList:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getCoupons(true,true);
                });
            },
            //获取商家的优惠券
            getCoupons:function(type,isFirst){
                if(isFirst){
                    vm.nowPageIndex1 = 1;
                }

                vm.loadingImgShow1 = true;
                if(type){
                    vm.couponsList = [];
                }

                if(vm.nowPageIndex1 < 1) return;
                //if(vm.couponsList.size() == 0){
                jsonp(host+'/jsonp/CounponInfo_GetUnExpireCouponPageByShopCode_'+vm.version+'.js',{
                    token: token,
                    PageIndex:vm.nowPageIndex1,
                    PageSize:10,
                    shopCode:$.getUrlParam("dataid")
                },'callback',function(rs){
                    var data = rs.Data;
                    if(data){
                        for(var i= 0,j=data.length;i<j;i++){
                            if(!type){
                                vm.couponsList.push(data[i]);
                            }
                        }
                        if(type){
                            vm.couponsList=data;
                        }
                        vm.maxPageNum1 = rs.TotalPages;
                    }else{
                        vm.hasCouponsList = true;
                    }
                    vm.loadingImgShow1 = false;
                },function(){
                });
                //}
            },
            //领取优惠券
            getCoupon:function(){
                var code=avalon(this).data('code');

                jsonp(sildHost+'/jsonp/Shop_ReceiveCounpon_'+vm.version+'.js',{
                    token: token,
                    code:code
                },'callback',function(rs){
                    if(rs.Code == 110){
                        window.location.href='http://m.wziwash.com/SSOAccount/Login?returnUrl=http%3a%2f%2fm.wziwash.com%2f';
                    }else{
                        if(rs.Success){
                            $.message({
                                msg:'领取成功!'
                            });
                        }else{
                            $.message({
                                msg:rs.Msg
                            });
                        }
                    }
                },function(){
                });
            }
        });

        var a = new $.scrollLoad({
            mainDiv: $(".coupons"),
            buttonLength: 100,
            ajaxFn: function (){
                vm.nowPageIndex1++;

                if(vm.nowPageIndex1 <= vm.maxPageNum1){
                    vm.getCoupons(false,false);
                }else{
                    vm.nowPageIndex1 = vm.maxPageNum1
                }
                a.ajaxSuccess();
            }
        });


        vm.getVersion();
        avalon.scan();
    });
})();
