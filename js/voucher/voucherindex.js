/**
 * Created by hulgy on 16/9/7.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'voucherindex',
            version:'',
            price:$.getUrlParam('price'),
            isLoading:false,
            phone:'',
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                });
            },
            //领取现金券
            getVoucher:function(){
                if(!/^[1][34578][0-9]{9}$/.test(vm.phone)){
                    $.message({
                        msg:'请输入正确的手机号码'
                    });

                    return;
                }
                vm.isLoading = true;
                jsonp(host+'/jsonp/RewardActivity_GetCash_'+vm.version+'.js',{
                    token:token,
                    phone:vm.phone,
                    price:vm.price
                },'callback',function(rs){
                    if(rs.Success){
                        if(rs.Data){
                            $.message({
                                msg:'领取成功!',
                                callback:function(){
                                    window.location.href = '../../html/voucher/voucherresult.html?phone='+vm.phone+'&price='+vm.price;
                                }
                            });
                        }
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                        vm.isLoading = false;
                    }
                },function(){
                });

            }
        });
        vm.getVersion();
        avalon.scan();
    });

})();