/**
 * Created by hulgy on 16/6/15.
 */
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
            urlData:transUrl2List(),
            totalPrice: parseInt($.getUrlParam('totalPrice')),
            shopCode : $.getUrlParam('shopCode') || '',
            searchData:'',
            //优惠券数据
            couponsData:[],
            loadingImgShow:true,
            IsNeedCoupon:false,
            nowPageIndex:1,
            maxPageNum:1,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getInCou(false);
                    vm.searchData=transList2Url(vm.urlData.$model);
                });
            },
            //获取未使用的优惠券
            getInCou:function(status){
                vm.loadingImgShow = true;
                jsonp(host+'/jsonp/CounponInfo_GetInCouponPageBySsoUserCode_'+vm.version+'.js',{
                    token:token,
                    Page:vm.nowPageIndex,
                    shopCode : vm.shopCode,
                    PageSize:10,
                    status:3
                },'callback',function(rs){
                    if(status){
                        vm.index=1;
                    }else{
                        vm.index=0;
                    }
                    for(var i= 0,j=rs.Data.length;i<j;i++){
                        rs.Data[i].isAcitve=false;
                    }
                    vm.loadingImgShow = false;
                    vm.couponsData=rs.Data;
                    vm.maxPageNum = rs.TotalPages;
                },function(){
                });
            },
            choose:function(index){
                vm.IsNeedCoupon = false;
                if(vm.couponsData[index].LimitMin > vm.totalPrice){
                    $.message({
                        msg:'该优惠券已被领完!'
                    });
                    return;
                }

                if(vm.couponsData[index].HasExpire){
                    $.message({
                        msg:'该优惠券已过期!'
                    });
                    return;
                }

                vm.couponsData.forEach(function(el){
                    el.isAcitve=false;
                });

                vm.couponsData[index].isAcitve=true;

                var json={
                    'couponsCode':vm.couponsData[index].CouponCode
                };

                var name={
                    'couponsName':vm.couponsData[index].CouponName
                };

                var price={
                    'couponsPrice':vm.couponsData[index].Price
                };

                vm.urlData=jsonInList(json,vm.urlData);
                vm.urlData=jsonInList(name,vm.urlData);
                vm.urlData=jsonInList(price,vm.urlData);

                vm.searchData=transList2Url(vm.urlData.$model);
            },
            changeIsNeedCoupon:function(){
                vm.IsNeedCoupon = true;

                if(vm.IsNeedCoupon){
                    vm.couponsData.forEach(function(el){
                        el.isAcitve=false;
                    });
                    vm.urlData=jsonOutList('couponsCode',vm.urlData);
                    vm.urlData=jsonOutList('couponsName',vm.urlData);
                    vm.urlData=jsonOutList('couponsPrice',vm.urlData);

                    vm.searchData=transList2Url(vm.urlData.$model);
                }
            }
        });

        var a = new $.scrollLoad({
            mainDiv: $(".coupon-list"),
            buttonLength: 50,
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