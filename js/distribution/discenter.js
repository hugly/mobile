/**
 * Created by hulgy on 18/11/2016.
 */

(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'discenter',
            version:'',
            isWithdrawing:false,
            personInfo:{
                RealName:'',
                Tel:'',
                BlankName:'微信',
                WeixinPayAccount:'',
                AliPayAccount:'',
                accountName:''
            },
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getPersonInfo();
                });
            },
            //获取用户信息
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
                            }else if(data.BlankName === '支付宝'){
                                vm.personInfo.accountName = data.AliPayAccount;
                            }

                        }
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });

            },
            updateUsrInfo:function(){
                var wechat = '',
                    alipay = '';


                if(vm.personInfo.BlankName === '微信'){
                    wechat = vm.personInfo.accountName;
                }else if(vm.personInfo.BlankName === '支付宝'){
                    alipay = vm.personInfo.accountName;
                }

                if(vm.personInfo.RealName === ''){
                    $.message({
                        msg:'姓名不能为空!'
                    });
                    return;
                }
                if(!/^[1][34578][0-9]{9}/i.test(vm.personInfo.Tel)){
                    $.message({
                        msg:'请输入正确的手机号码!'
                    });
                    return;
                }
                if(vm.personInfo.accountName === ''){
                    $.message({
                        msg:'账号不能为空!'
                    });
                    return;
                }


                vm.isWithdrawing = true;

                jsonp(host+'/jsonp/Distributor_Update_'+vm.version+'.js',{
                    token:token,
                    RealName:vm.personInfo.RealName,
                    Tel:vm.personInfo.Tel,
                    BlankName:vm.personInfo.BlankName,
                    WeixinPayAccount:wechat,
                    AliPayAccount:alipay
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'保存成功',
                            callback:function(){
                                vm.isWithdrawing = false;
                                window.location.href = 'disindex.html';
                            }
                        })
                    }
                },function(){
                    vm.isWithdrawing = false;
                });
            }
        });

        vm.getVersion();
        avalon.scan();
    });

})();