/**
 * Created by hulgy on 16/6/9.
 **/
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"coupons",
            index:0,
            //版本号
            version:0,
            num1:0,
            num2:0,
            num3:0,
            //优惠券数据
            couponsData:[],
            loadingImgShow:true,
            nowPageIndex:1,
            maxPageNum:0,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getCouponsTotal();
                    vm.getCouponByStatus(3,false);
                });
            },
            //获取所有优惠券的总数
            getCouponsTotal:function(){
                jsonp(host+'/jsonp/CounponInfo_GetInCounponCountBySsoUserCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    vm.num1=rs.Data.UnUserdInCouponCount;
                    vm.num2=rs.Data.ExpiredInCouponCount;
                    vm.num3=rs.Data.UserdInCouponCount;
                },function(){
                });
            },
            //获取未使用的优惠券
            getInCou:function(status){
                if(status){
                    vm.index=1;
                }else{
                    vm.index=0;
                }
                vm.loadingImgShow = true;
                vm.couponsData = [];

                jsonp(host+'/jsonp/CounponInfo_GetInCouponPageBySsoUserCode_'+vm.version+'.js',{
                    token:token,
                    HasExpire:status
                },'callback',function(rs){
                    vm.loadingImgShow = false;
                    vm.couponsData=rs.Data;
                },function(){
                });

            },
            //获取已使用的优惠券
            getOutCou:function(){
                vm.loadingImgShow = true;
                vm.couponsData = [];
                vm.index=2;

                jsonp(host+'/jsonp/CounponInfo_GetOutCouponPageBySsoUserCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    vm.loadingImgShow = false;
                    vm.couponsData=rs.Data;
                },function(){
                });

            },
            //根据类型获取优惠券
            getCouponByStatus:function(status,type){
                vm.loadingImgShow = true;
                vm.couponsData = [];
                if(!type){
                    vm.index=status;
                }

                jsonp(host+'/jsonp/CounponInfo_GetInCouponPageBySsoUserCode_'+vm.version+'.js',{
                    token:token,
                    status:vm.index,
                    Page:vm.nowPageIndex,
                    PageSize:10
                },'callback',function(rs){
                    var data = rs.Data;

                    if(data){
                        for(var i= 0,j=data.length;i<j;i++){
                            if(vm.index === 2 || vm.index === 1){
                                data[i].used = true;
                            }else{
                                data[i].used = false;
                            }

                            if(type){
                                vm.couponsData.push(data[i]);
                            }
                        }
                    }
                    vm.loadingImgShow = false;
                    vm.maxPageNum = rs.TotalPages;
                    if(!type){
                        vm.couponsData=data;
                    }
                },function(){
                });

            }
        });


        var a = new $.scrollLoad({
            mainDiv: $(".coupon-list"),
            buttonLength: 50,
            ajaxFn: function (){
                vm.nowPageIndex++;

                if(vm.nowPageIndex <= vm.maxPageNum){
                    vm.getCouponByStatus(1,true);
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