/**
 * Created by hulgy on 16/6/10.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"manage",
            //版本号
            version:0,
            //所有地址数据
            addressList:[],
            loadingImgShow:true,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getAllAddress();
                });
            },
            //获取所有收货地址
            getAllAddress:function(){
                jsonp(host+'jsonp/ReceiveAddress_GetALLBySsoUserCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    vm.loadingImgShow = false;
                    vm.addressList=rs.Data;
                },function(){
                });

            },
            //设置默认收货地址
            setDefaultAddress:function(index){
                var code=avalon(this).data('code');

                if(vm.addressList[index].IsDefault){
                    $.message({
                        msg:'当前地址已是默认地址!'
                    });
                    return;
                }

                jsonp(host+'jsonp/ReceiveAddress_UpdateIsDefaultByCodeAndSsoUserCode_'+vm.version+'.js',{
                    token:token,
                    code:code
                },'callback',function(rs){
                    if(rs.Success){
                        vm.addressList.forEach(function(el){
                            el.IsDefault=false;
                        });
                        vm.addressList[index].IsDefault=true;
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });

            },
            //编辑收货地址
            editAddress:function(el){
                setLocalstorage('preAddHerf',window.location.href);
                window.location.href = 'newaddress.html?code='+el.Code;
            },
            //删除收货地址
            deleAddress:function(index,el){
                var _this = this;
                $.dialog({
                    msg:'确定要删除当前收货地址?',
                    sureFn:function(){
                        var code=avalon(_this).data('code');

                        jsonp(host+'/jsonp/ReceiveAddress_DeleteByCode_'+vm.version+'.js',{
                            token:token,
                            code:el.ID
                        },'callback',function(rs){
                            if(rs.Success){
                                $.message({
                                    msg:'删除成功!',
                                    callback:function(){
                                        vm.addressList.removeAt(index);
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
            addressFn:function(){
                setLocalstorage('preAddHerf',window.location.href);
                window.location.href = '../personal/newaddress.html';
            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();