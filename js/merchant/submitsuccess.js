/**
 * Created by hulgy on 16/7/3.
 */
(function(){

    'use strict';
    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:"submitsuccess",
            //版本号
            version:0,
            state: '',
            no: '',
            date: '',
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getStatus();
                });
            },
            getStatus:function(){
                //m.wziwash.com/jsonp/SellerApply_GetSellerAppyInfo_9.js?token=3dd9jddd84jwe3&callback=test
                jsonp(host+'/jsonp/SellerApply_GetSellerAppyInfo_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        if(rs.Data){
                            var data = rs.Data;
                            vm.state = data.ShowStatus;
                            vm.no = data.Code;
                            vm.date = data.LastAuditDate;
                        }
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