/**
 * Created by hulgy on 17/12/2016.
 */
(function(){
    'use strict';
    var cropper;

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"verify",
            //版本号
            version:0,
            loadingImgShow:true,
            //集合信息
            account:{},
            perDataModel:[],
            tCode:$.getUrlParam('tcode'),
            oCode:$.getUrlParam('ocode'),
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getCheckPer();
                });
            },
            //获取所有的核实属性
            getCheckPer:function(){
                jsonp(host+'jsonp/Logistics_GetCheckListByOCode_'+vm.version+'.js',{
                    token:token,
                    ocode:vm.oCode
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data;
                        vm.loadingImgShow = false;

                        for(var i=0,j=data.length;i<j;i++){
                            data[i].CheckLableStr = '';
                            if(data[i].CheckLable){
                                for(var n=0,m=data[i].CheckLable.length;n<m;n++){
                                    data[i].CheckLableStr += data[i].CheckLable[n]+' ';
                                }
                            }
                        }

                        vm.perDataModel = data;
                    }
                },function(){
                });
            },
            deleProFn:function(el,$remove){
                $.dialog({
                    msg:'确认删除商品?商品删除后货款将退回客户账户！',
                    sureFn:function(){
                        jsonp(host+'jsonp/Order_RemoveItem_'+vm.version+'.js',{
                            token:token,
                            code:el.Code
                        },'callback',function(rs){
                            if(rs.Success){
                                $remove();
                                $.message({
                                    msg:'删除成功!',
                                    callback:function(){

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
            },
            //取件完成
            pickupSucc:function(code){
                var href = getLocalstorage('verifyLink');

                if(href.indexOf('orderlist.html') != -1){
                    jsonp(host+'jsonp/Order_Complete_'+vm.version+'.js',{
                        token:token,
                        code:vm.oCode
                    },'callback',function(rs){
                        if(rs.Success){
                            $.message({
                                msg:'核实成功!',
                                callback:function(){
                                    window.location.href = getLocalstorage('verifyLink');
                                }
                            });
                        }else{
                            $.message({
                                msg:rs.Msg
                            });
                        }
                    },function(){
                    });
                }else{
                    jsonp(host+'jsonp/Logistics_UpdateHasCheck_'+vm.version+'.js',{
                        token:token,
                        OCode:vm.oCode
                    },'callback',function(rs){
                        if(rs.Success){
                            $.message({
                                msg:'核实成功!',
                                callback:function(){
                                    window.location.href = href;
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

            },
            makesureFn:function(){
                var isGo = true;
                vm.perDataModel.forEach(function(el){
                    if(!el.IsCheckRight){
                        isGo = false;
                        $.message({
                            msg:'您有未核实的商品'
                        });
                        return;
                    }
                });

                if(isGo){
                    $.dialog({
                        msg:'已确认用户商品数量和完好无损?',
                        sureFn:function(){
                            vm.pickupSucc();
                        }
                    });
                }
            }
        });

        vm.getVersion();
        avalon.scan();

    });

})();