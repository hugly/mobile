/**
 * Created by hulgy on 16/6/9.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"coupons",
            index:0,
            //版本号
            version:0,
            //领取中得优惠券
            ReceiveIngCount:0,
            //已领完的优惠券
            HasPickUpCouponCount:0,
            //已过期的优惠券
            ExpiredCouponCount:0,
            //优惠券数据
            couponsData:[],
            isShow:false,
            //当前页码
            nowPageIndex:1,
            maxPageNum:0,
            loadingImgShow:true,
            isScroll:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getAllCoupons();
                    vm.getCouponsList(0,false);
                });
            },
            //获取优惠券总数
            getAllCoupons:function(){
                jsonp(host+'/jsonp/CounponInfo_GetCounponCountByShopCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        vm.ReceiveIngCount=rs.Data.ReceiveIngCount;
                        vm.HasPickUpCouponCount=rs.Data.HasPickUpCouponCount;
                        vm.ExpiredCouponCount=rs.Data.ExpiredCouponCount;
                    }
                },function(){
                });
            },
            //删除优惠券
            deleFn:function(el,$remove){
                jsonp(host+'/jsonp/CounponInfo_DeleteByCode_'+vm.version+'.js',{
                    token:token,
                    code:el.Code
                },'callback',function(rs){
                    if(rs.Success){
                        $remove();
                        $.message({
                            msg:'删除成功!'
                        });
                    }
                },function(){
                });
            },
            //获取优惠券数据
            getCouponsList:function(index,type){
                vm.loadingImgShow = true;
                vm.index=index;
                vm.isShow = false;

                if(!type){
                    vm.nowPageIndex = 1;
                    vm.maxPageNum = 0;
                    vm.couponsData = [];
                    $('body').scrollTop(0);

                }

                jsonp(host+'/jsonp/CounponInfo_GetCouponPageByShopCode_'+vm.version+'.js',{
                    token:token,
                    Page:vm.nowPageIndex,
                    PageSize:10,
                    status:index
                },'callback',function(rs){
                    if(rs.Success){
                        var data=rs.Data;

                        if(data){
                            for(var n= 0,m=data.length;n<m;n++){
                                if(data[n].HasExpire || data[n].Num === data[n].Occupy){
                                    data[n].linkhref = 'javascript:;';
                                }else{
                                    data[n].linkhref = 'couponscreate.html?code='+data[n].Code+'&id='+data[n].Code.ID;
                                }
                            }
                        }

                        if(data && type){
                            for(var i= 0,j=data.length;i<j;i++){
                                vm.couponsData.push(data[i]);
                            }
                        }

                        if(!type){
                            vm.couponsData = data;
                        }

                        if(data){
                            vm.maxPageNum = rs.TotalPages;
                        }

                        if(data === undefined){
                            vm.couponsData = [];
                            vm.isShow = true;
                        }

                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                    vm.loadingImgShow = false;
                },function(){
                });
            }
        });

        var a = new $.scrollLoad({
            mainDiv: $(".coupon-list"),
            buttonLength: 100,
            ajaxFn: function (){
                if(vm.nowPageIndex < vm.maxPageNum){
                    vm.nowPageIndex++;
                    vm.getCouponsList(vm.index,true);
                }else{
                    vm.nowPageIndex = vm.maxPageNum
                }

                a.ajaxSuccess();
            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();