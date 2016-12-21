/**
 * Created by hulgy on 16/7/10.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'notice',
            //版本号
            version:"",
            //公告内容
            noticeContent:'',
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getNotice();
                });
            },
            //获取公告
            getNotice:function(){
                jsonp(host+'/jsonp/Shop_GetNotice_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    vm.noticeContent = rs.Msg;
                },function(){
                });
            },
            //更新公告
            updateNotice:function(){

                if(vm.noticeContent === ''){
                    $.message({
                        msg:'公告内容不能为空!'
                    });
                    return;
                }

                jsonp(host+'/jsonp/Shop_UpdateNotice_'+vm.version+'.js',{
                    token:token,
                    notice:vm.noticeContent
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'发布公告成功!',
                            callback:function(){
                                window.location.href = 'mymerchant.html';
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