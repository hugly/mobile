/**
 * Created by hulgy on 16/8/21.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'withdraw',
            version:'',
            isWithdrawing:false,
            withdrawModel:{
                Balance:'',
                Banks:[],
                CashTime:'',
                FeePercent:'',
                LimitAmount:'',
                Name:'',
                Phone:'',
                CardNum:'',
                arrBank:[],
                Amount:0,
                carBank:2
            },
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getApplyInfo();
                });
            },
            //获取体现用户信息
            getApplyInfo:function(){
                jsonp(host+'/jsonp/CashApply_ApplyInfo_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data,
                            arrBanks=[],
                            banks = data.Banks;

                        for(var name in banks){
                            var json={};

                            json.name = name;
                            json.value = banks[name];

                            arrBanks.push(json);
                        }

                        data.arrBank = arrBanks;

                        vm.withdrawModel.Balance = data.Balance;
                        vm.withdrawModel.arrBank = data.arrBank;
                        vm.withdrawModel.FeePercent = data.FeePercent;
                        vm.withdrawModel.LimitAmount = data.LimitAmount;
                        vm.withdrawModel.Name = data.Name;
                        vm.withdrawModel.Phone = data.Phone;
                    }
                },function(){
                });
            },
            checkValueFn:function(){
                $(this).val($(this).val().replace(/[^\d]/g,''));
            },
            //提交提现信息
            submitWithdraw:function(){
                var cardBank = $('#cardType').val();

                if(vm.withdrawModel.Name === ''){
                    $.message({
                        msg:'提现人姓名不能为空!'
                    });

                    return;
                }

                if(vm.withdrawModel.Phone === ''){
                    $.message({
                        msg:'提现人手机号码不能为空!'
                    });

                    return;
                }

                if(cardBank == '-1'){
                    $.message({
                        msg:'请选择提现银行!'
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

                var bankname = '';
                vm.withdrawModel.arrBank.forEach(function(el){
                    if(cardBank == el.value ){
                        bankname = el.name;
                    }
                });

                vm.isWithdrawing = true;

                jsonp(host+'/jsonp/CashApply_InsertApply_'+vm.version+'.js',{
                    token:token,
                    Amount:vm.withdrawModel.Amount,
                    CardNum:vm.withdrawModel.CardNum,
                    CardBank:cardBank,
                    Phone:vm.withdrawModel.Phone,
                    Name:vm.withdrawModel.Name
                },'callback',function(rs){
                    if(rs.Success){
                        vm.isWithdrawing = false;
                        $.message({
                            msg:'申请提现成功!',
                            callback:function(){
                                window.location.href = '../merchant/withdrawsuccess.html?bankname='+bankname+'&cardno='+vm.withdrawModel.CardNum+'&balance='+vm.withdrawModel.Amount+'&FeePercent='+vm.withdrawModel.FeePercent;
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