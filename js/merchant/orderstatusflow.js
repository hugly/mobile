/**
 * Created by hulgy on 16/7/2.
 */
(function(){

    'use strict';
    var cropper;

    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:"flow",
            //版本号
            version:0,
            //订单code
            code: $.getUrlParam('code') || '',
            orderType: decodeURI($.getUrlParam('ordertype')) || '',
            status:decodeURI($.getUrlParam('status')) || '',
            //记录信息
            recodeList:[],
            loadingImgShow:true,
            //获取版本号
            getVersion:function(){
                var fontSize=$(window).width()/16;
                $('.flowmain').css({'height':$(window).height()-3.5*fontSize});
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getStatusList();
                });

            },
            //保存数据
            getStatusList:function(){
                jsonp(host+'/jsonp/Order_JGetOrderStatusRecord_'+vm.version+'.js',{
                    token:token,
                    code:vm.code
                },'callback',function(rs){
                    vm.loadingImgShow = false;
                    vm.recodeList = rs;
                },function(){
                });
            }

        });

        vm.getVersion();
        avalon.scan();

    });



})();