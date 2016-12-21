/**
 * Created by hulgy on 16/7/30.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'valudategroup',
            version:'',
            nowPageIndex:1,
            loadingImgShow:true,
            raider:[],
            result:'',
            checking:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    //vm.getBriefInfo();
                });
            },
            //验证团购券
            checkgroup:function(){
                vm.checking = true;
                //jsonp/GroupCoupon_Verify_7.js?Code=22
                jsonp(host+'/jsonp/GroupCoupon_Verify_'+vm.version+'.js',{
                    token: token,
                    Code: vm.result.replace(/\s/g, "")
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'验证成功!'
                        });
                        vm.result = '';
                    }else{
                        $.message({
                            msg: rs.Msg
                        });
                    }
                    vm.checking = false;
                },function(){
                });
            },
            changStr:function(val){
                if(vm.result.length >= 19){
                    $.message({
                        msg:'优惠券编号固定长度为16位!'
                    });
                    return;
                }
                vm.result += val;

                if(vm.result.length === 4 || vm.result.length === 9 || vm.result.length === 14){
                    vm.result += ' ';
                }
            },
            clearFn:function(){
                vm.result = '';
            },
            deleFn:function(){
                vm.result = vm.result.substr(0,vm.result.length-1);
            }

        });

        vm.getVersion();
        avalon.scan();
    });

})();