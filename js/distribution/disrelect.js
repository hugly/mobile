/**
 * Created by hulgy on 18/11/2016.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'disrelect',
            version:'',
            isWithdrawing:false,
            personInfo:{
                RealName:'',
                Tel:'',
                BlankName:'99',
                WeixinPayAccount:'',
                AliPayAccount:'',
                accountName:''
            },
            withdrawModel:{
                Balance:'',
                FeePercent:'',
                LimitAmount:'',
                Amount:0
            },
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getPersonInfo();
                });
            },
            getPersonInfo:function(){
                jsonp(host+'jsonp/Distributor_GetBySSOUserCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        if(rs.hasOwnProperty('Data')){
                            var data = rs.Data;
                            vm.personInfo = data;
                            if(data.BlankName === '微信'){
                                vm.personInfo.accountName = data.WeixinPayAccount;
                                vm.personInfo.BlankName = '99';
                            }else if(data.BlankName === '支付宝'){
                                vm.personInfo.accountName = data.AliPayAccount;
                                vm.personInfo.BlankName = '100';
                            }

                            vm.getApplyInfo();
                        }
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });

            },
            checkValueFn:function(){
                $(this).val($(this).val().replace(/[^\d]/g,''));
            },
            //获取体现用户信息
            getApplyInfo:function(){
                jsonp(host+'/jsonp/CashApply_ApplyInfo_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data;

                        vm.withdrawModel.Balance = data.Balance;
                        vm.withdrawModel.FeePercent = data.FeePercent;
                        vm.withdrawModel.LimitAmount = data.LimitAmount;
                    }
                },function(){
                });
            },
            //提交提现信息
            submitWithdraw:function(){
                if(vm.personInfo.RealName === ''){
                    $.message({
                        msg:'提现人姓名不能为空!'
                    });

                    return;
                }

                if(!/^[1][34578][0-9]{9}/i.test(vm.personInfo.Tel)){
                    $.message({
                        msg:'请输入正确的手机号码!'
                    });

                    return;
                }

                if(vm.withdrawModel.CardNum === ''){
                    $.message({
                        msg:'提现人银行卡号不能为空!'
                    });

                    return;
                }

                if( vm.withdrawModel.Amount > vm.withdrawModel.Balance ){
                    $.message({
                        msg:'申请提现金额不能超过当前余额!'
                    });

                    return;
                }

                if(vm.withdrawModel.Amount === '' || vm.withdrawModel.Amount > vm.withdrawModel.LimitAmount || vm.withdrawModel.Amount <= 0){
                    $.message({
                        msg:'请输入正确的提现金额!'
                    });

                    return;
                }


                vm.isWithdrawing = true;

                jsonp(host+'/jsonp/CashApply_InsertApply_'+vm.version+'.js',{
                    token:token,
                    Amount:vm.withdrawModel.Amount,
                    CardNum:vm.personInfo.accountName,
                    CardBank:vm.personInfo.BlankName,
                    Phone:vm.personInfo.Tel,
                    Name:vm.personInfo.RealName
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'申请提现成功!',
                            callback:function(){
                                vm.isWithdrawing = false;
                                window.location.href = 'disrelectaudit.html';
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