/**
 * Created by hulgy on 16/6/9.
 */
(function(){
    'use strict';

    require(["domReady!"],function(avalon){

        var vm=avalon.define({
            $id:"person",
            //版本号
            version:0,
            //是否显示
            isShow:false,
            //集合信息
            account:{
                Balance:0,
                CouponCount:0,
                WashingCardCount:0,
                ClothingCoin:0
            },
            //用户信息
            userInfo:{
                NickName:'',
                Name:''
            },
            //用户订单信息
            orderInfo:{
                MemberGrade:0,
                MemberGradeName:'',
                BookingRequestCount:0,
                GroupCouponCount:0,
                WaitingPayCount:0,
                WaitingPickUpCount:0,
                WaitingReceiveCount:0,
                WaitingCommentCount:0,
                RefoundOrderCount:0,
                ShopCount:0
            },
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getBriefInfo();
                    vm.getOrderInfo();
                    vm.getUserInfo();
                });
            },
            //获取用户详细信息
            getUserInfo:function(){
                jsonp(host+'/jsonp/User_GetUserInfoBySsoUserCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        vm.isShow=true;

                        if(rs.Data){
                            vm.userInfo=rs.Data;
                        }
                    }
                },function(){
                });
            },
            //获取个人中心订单信息
            getOrderInfo:function(){
                jsonp(host+'/jsonp/User_GetMobileUserCenterCount_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Data){
                        vm.orderInfo=rs.Data;
                    }
                },function(){
                });
            },
            //获取简略信息
            getBriefInfo:function(){
                jsonp(host+'/jsonp/MyAssets_GetMyAssets_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Data){
                        vm.account=rs.Data;
                    }
                },function(){
                });
            },
            //验证是否是卖家
            checkIsSellerFn:function(){
                jsonp(host+'/jsonp/SellerApply_ValidateIsSeller_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    var data = rs.Data;
                    if(rs.Success){
                        if(rs.Code === 113){
                            window.location.href = '../merchant/shopsettled.html';
                        }else if(rs.Code === 114){
                            window.location.href = '../merchant/mymerchant.html';
                        }else if(rs.Code === 115){
                            window.location.href = '../merchant/submitsuccess.html?code='+data.Code+'&date='+data.LastAuditDate+'&state='+data.ShowStatus;
                        }else{
                            window.location.href = '../merchant/mymerchant.html';
                        }
                    }else{
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