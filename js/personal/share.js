/**
 * Created by hulgy on 16/9/2.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'share',
            version:'',
            code:$.getUrlParam('code'),
            phoneNum:'',
            isRight:false,
            showDiabox:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                });
            },
            checkPhoneNum:function(){
                if(/^[1][34578][0-9]{9}$/i.test(vm.phoneNum)){
                    vm.isRight = true;
                }else{
                    vm.isRight = false;
                }
            },
            //[1][34578][0-9]{9}
            getCashCoupon:function(){
                if(!vm.isRight) return;

                vm.isRight = false;
                jsonp(host+'/jsonp/RecommendFriend_GetCash_'+vm.version+'.js',{
                    token:token,
                    phone:vm.phoneNum,
                    userCode:vm.code
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'领取成功!',
                            callback:function(){
                                vm.showDiabox = true;
                            }
                        });
                    }else{
                        vm.isRight = true;
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