/**
 * Created by hulgy on 16/6/23.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:'couponorder',
            //版本号
            version:"",
            //团购券数据模型
            groupData:{
                ShopSkus:[{
                    Shop:{
                        Shop:{
                            Code:"",
                            Name:""
                        }
                    },
                    Skus:[]
                }]
            },
            //团购券总数量
            countNum:1,
            //团购券库存
            count:0,
            //手机号码
            phoneNum:'',
            isLoading:false,
            //团购券code
            couponCode: $.getUrlParam('code') || '',
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getCouponDetailByCode();
                });
            },
            //根据code获取团购券详细信息
            getCouponDetailByCode:function(){
                var json={},
                    data=window.location.search.substring(1,window.location.search.length-1),
                    dataArr=data.split("&");

                json.token=token;
                for(var i= 0,j=dataArr.length;i<j;i++){
                    var arr=dataArr[i].split("=");

                    json[arr[0]]=arr[1];

                }

                jsonp(sildHost+'/jsonp/Order_GetGroupCouponCreateOrderInfo_'+vm.version+'.js',json,'callback',function(rs){
                    if(rs.Success){
                        vm.groupData=rs.Data;
                        vm.count=vm.groupData.ShopSkus[0].Skus[0].Stock;
                        vm.phoneNum=vm.groupData.ExtraUserInfo.Phone;
                    }
                },function(){
                });
            },
            //对数量减操作
            subFn:function(){
                vm.countNum --;
                if(vm.countNum <= 1){
                    vm.countNum = 1;
                }

            },
            //对数量加操作
            addFn:function(){
                vm.countNum ++;

                if(vm.countNum >= vm.count){
                    vm.countNum = vm.count;
                }

            },
            //提交订单
            submitOrder:function(){
                vm.isLoading = true;
                var json={
                    /// 联系人手机
                    ContactPhone:vm.phoneNum,
                    /// 支付方式
                    PayMethod:1
                };
                json.token=token;

                if(vm.ContactPhone === ''){
                    $.message({
                        msg:'请输入联系人手机号码!'
                    });
                    return;
                }

                vm.groupData.ShopSkus[0].Skus.forEach(function(el){
                    json['SkuCodes['+el.Code+']']=vm.countNum;
                });

                jsonp(sildHost+'/jsonp/Order_GroupCouponCreate_'+vm.version+'.js',json,'callback',function(rs){
                    if(rs.Success){
                        window.location.href=rs.Data.PayUrl;
                    }else{
                        $.message({
                            msg:rs.Msg,
                            callback:function(){
                                vm.isLoading = false;
                            }
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