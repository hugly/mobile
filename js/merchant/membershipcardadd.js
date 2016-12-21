/**
 * Created by hulgy on 16/8/15.
 */
(function(){
    'use strict';

    var colorDictor={
        1:'55c1db',
        2:'ea4407',
        3:'730371',
        4:'bf0a5f',
        5:'5157da'
    };

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'membershipcardadd',
            //版本号
            version:"",
            temindex:1,
            name:'',
            title:'',
            tabtitle:'新增会员卡类型',
            image:'',
            price:'',
            discount:'',
            isLoading:false,
            cardId: $.getUrlParam('cardid'),
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;

                    if(vm.cardId){
                        vm.getCardInfo();
                        vm.tabtitle = '修改会员卡类型';
                    }
                });
            },
            //选择会员卡模板
            chooseTem:function(num){
                vm.temindex = num;
            },
            //获取会员卡信息
            getCardInfo:function(){
                jsonp(host+'/jsonp/MemberCard_GetCardTypeByCode_'+vm.version+'.js',{
                    token:token,
                    code:vm.cardId
                },'callback',function(rs){
                    if(rs.Success){
                        var data =rs.Data;
                        vm.name = data.Name;
                        vm.title = data.Title;
                        vm.price = data.RechargePrice;
                        vm.discount = data.Discount;

                        for(var name in colorDictor){
                            if(colorDictor[name] === data.Image){
                                vm.temindex = parseInt(name);
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
            //新增会员卡
            addCard:function(){
                jsonp(host+'/jsonp/MemberCard_InsertCardType_'+vm.version+'.js',{
                    token:token,
                    name:vm.name,
                    title:vm.title,
                    image:colorDictor[parseInt(vm.temindex)],
                    price:vm.price,
                    discount:vm.discount
                },'callback',function(rs){
                    vm.isLoading = false;
                    if(rs.Success){
                        $.message({
                            msg:'新增会员卡类型成功!',
                            callback:function(){
                                window.location.href = 'membershipcardlist.html';
                            }
                        });
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            //修改会员卡
            modifyCard:function(){
                jsonp(host+'/jsonp/MemberCard_UpdateCardType_'+vm.version+'.js',{
                    token:token,
                    name:vm.name,
                    title:vm.title,
                    image:colorDictor[vm.temindex],
                    price:vm.price,
                    code:vm.cardId,
                    discount:vm.discount
                },'callback',function(rs){
                    vm.isLoading = false;
                    if(rs.Success){
                        $.message({
                            msg:'修改会员卡类型成功!',
                            callback:function(){
                                window.location.href = 'membershipcardlist.html';
                            }
                        });
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            //提交会员卡信息
            submitCardinfoFn:function(){

                if(vm.name === ''){
                    $.message({
                        msg:'会员卡名称必填!'
                    });
                    return;
                }

                if(vm.title === ''){
                    $.message({
                        msg:'会员卡标题必填!'
                    });
                    return;
                }

                if(!/^\d+(\.\d+)?$/.test(vm.price)){
                    $.message({
                        msg:'请输入正确的最低充值金额(正整数)!'
                    });
                    return;
                }

                if(parseFloat(vm.discount) < 0 || parseFloat(vm.discount) > 1 || vm.discount === ''){
                    $.message({
                        msg:'请输入正确的会员卡折扣!(0-1之间)'
                    });
                    return;
                }

                vm.isLoading = true;
                if(vm.cardId){
                    vm.modifyCard()
                }else{
                    vm.addCard();
                }
            }
        });

        vm.getVersion();
        avalon.scan();
    });

})();