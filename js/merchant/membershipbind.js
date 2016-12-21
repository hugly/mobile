/**
 * Created by hulgy on 16/8/16.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'membershipbind',
            //版本号
            version:"",
            timeleft:120,
            codeType:1,
            Discount:1,
            isLoading:false,
            typeList:[],
            userName:'',
            cardTypeCode:'',
            phoneNumber:'',
            valiudateCode:'',
            cash:'',
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getCardTypeList();
                });
            },
            //获取会员卡类型
            getCardTypeList:function(){
                jsonp(host+'/jsonp/MemberCard_GetCardTypeByShopOwner_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        vm.typeList = rs.Data;
                        vm.cardTypeCode = rs.Data[0].Code;
                        vm.Discount = rs.Data[0].Discount * 10;
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }

                },function(){
                });
            },
            changeCardTypeFn:function(){
                vm.typeList.forEach(function(el){
                    if(el.Code === vm.cardTypeCode){
                        vm.Discount = el.Discount * 10;
                    }
                })
            },
            sendCodeFn:function(){
                if(!/^[1][34578][0-9]{9}$/.test(vm.phoneNumber)){
                    $.message({
                        msg:'请输入正确的手机号码!'
                    });

                    return;
                }
                vm.codeType = 2;
                jsonp(host+'/jsonp/MemberCard_SendPhone_'+vm.version+'.js',{
                    token:token,
                    phone:vm.phoneNumber
                },'callback',function(rs){
                    if(rs.Success){
                        vm.codeType = 3;
                        var timer = null;

                        timer = setInterval(function(){
                            vm.timeleft --;
                            if(vm.timeleft <= 0){
                                vm.codeType = 1;
                                vm.timeleft = 120;
                                clearInterval(timer);
                            }
                        },1000)
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                        vm.codeType = 1;
                    }
                },function(){
                });
            },
            //绑定会员
            bindMemberFn:function(){
                if(vm.userName === ''){
                    $.message({
                        msg:'会员名称不能为空!'
                    });

                    return;
                }
                if(!/^[1][34578][0-9]{9}$/.test(vm.phoneNumber)){
                    $.message({
                        msg:'请输入正确的手机号码!'
                    });

                    return;
                }

                if(!/^[0-9]{6}$/.test(vm.valiudateCode)){
                    $.message({
                        msg:'请输入正确的验证码!'
                    });

                    return;
                }

                if(!/^\d+(\.\d+)?$/.test(vm.cash)){
                    $.message({
                        msg:'请输入正确的充值金额(正整数)!'
                    });

                    return;
                }

                vm.isLoading = true;
                jsonp(host+'/jsonp/MemberCard_BindUser_'+vm.version+'.js',{
                    token:token,
                    phone:vm.phoneNumber,
                    name:vm.userName,
                    cardTypeCode:vm.cardTypeCode,
                    amount:vm.cash,
                    code:vm.valiudateCode
                },'callback',function(rs){
                    vm.isLoading = false;
                    if(rs.Success){
                        $.message({
                            msg:'绑定成功!',
                            callback:function(){
                                window.history.back();
                            }
                        });
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