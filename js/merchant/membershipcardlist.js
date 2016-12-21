/**
 * Created by hulgy on 16/8/15.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'membershipcardlist',
            //版本号
            version:"",
            cardList:[],
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getCardList();
                });
            },
            getCardList:function(){
                jsonp(host+'/jsonp/MemberCard_GetCardTypeByShopOwner_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        vm.cardList = rs.Data;
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