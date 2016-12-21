/**
 * Created by hulgy on 29/10/2016.
 */

(function(){
    'use strict';

    var stateDir = {
        1:'在线',
        2:'缺纸',
        3:'离线'
    };

    require(['mmRequest','domReady!'],function(avalon){

        var vm=avalon.define({
            $id:"printlist",
            //版本号
            version:"",
            isShow:false,
            loadingImgShow:true,
            listDataModle:[
                // { name:'设备1', isRun:false, code:'0001', isShow:false },
                // { name:'设备2', isRun:true, code:'0002', isShow:false },
                // { name:'设备3', isRun:false, code:'0003', isShow:false },
                // { name:'设备4', isRun:true, code:'0004', isShow:false },
                // { name:'设备5', isRun:false, code:'0005', isShow:false },
                // { name:'设备6', isRun:true, code:'0006', isShow:false },
                // { name:'设备7', isRun:false, code:'0007', isShow:false }
            ],
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getPrintList();
                });
            },
            gobackFn:function(){
                window.location.href = getLocalstorage('printHref');
            },
            getPrintList:function(){
                jsonp(host+'/jsonp/PrintDevice_GetPrintDeviceList_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    vm.loadingImgShow = false;
                    if(rs.Success){
                        var data = rs.Data;
                        for(var i=0,j=data.length;i<j;i++){
                            data[i].statusText = stateDir[data[i].State];
                            data[i].isShow = false;
                        }
                        vm.listDataModle = data;
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            leftFn:function(el){
                el.isShow = true;
            },
            rightFn:function(el){
                el.isShow = false;
            },
            deleFn:function(el,$remove){
                jsonp(host+'/jsonp/PrintDevice_DeletePrintDevice_'+vm.version+'.js',{
                    token:token,
                    code:el.Code
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'删除成功！',
                            callback:function(){
                                $remove();
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