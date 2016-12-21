/**
 * Created by hulgy on 16/8/16.
 */

(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'cardlist',
            version:'',
            cardlistModel:[],
            loadingImgShow:true,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getPersonCardlist();
                });
            },
            //获取会员卡列表
            getPersonCardlist:function(){
                jsonp(host+'/jsonp/MemberCard_GetByUserCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    vm.loadingImgShow = false;
                    if(rs.Success){
                        vm.cardlistModel = rs.Data;
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