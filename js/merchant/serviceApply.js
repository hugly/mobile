/**
 * Created by hulgy on 16/6/27.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:'service',
            //版本号
            version:0,
            //服务数据模型
            serviceData:{
                Code: $.getUrlParam('Code'),
                Content: decodeURI($.getUrlParam('Content')),
                Desc:'',
                Image: $.getUrlParam('Image'),
                Logo: $.getUrlParam('Logo'),
                Name: decodeURI($.getUrlParam('Name')),
                Type: $.getUrlParam('Type'),
                Value: $.getUrlParam('Value'),
                IsApply: parseInt($.getUrlParam('IsApply'))
            },
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.Desc = decodeURI($.getUrlParam('Desc'));
                    if(vm.Desc === undefined){
                        vm.Desc = '';
                    }
                });
            },
            //提交服务
            sumbitFn:function(){
                jsonp(host+'jsonp/Shop_SubmitBusinessApply_'+vm.version+'.js',{
                    token: token,
                    Type:vm.serviceData.Type,
                    Value:vm.serviceData.Value
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'提交服务成功!',
                            callback:function(){
                                window.location.href='fnservice.html';
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