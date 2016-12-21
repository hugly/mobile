/**
 * Created by hulgy on 16/8/6.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:'settings',
            //版本号
            version:0,
            shopCode: $.getUrlParam('shopCode') || '',
            shopDetail:{
                BaseInfo:{
                    Shop:{
                        Name:'',
                        Tel:'',
                        Title:''
                    }
                }
            },
            isSave:true,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getSettingsInfo();
                });
            },
            //获取店铺详情
            getSettingsInfo:function(){
                //http://m.wziwash.com/jsonp/Shop_ShopInfo_9.js?token=3dd9jddd84jwe3&ShopCode=2016052222023923914&callback=jsonp032275929534429304
                jsonp(host+'/jsonp/Shop_ShopInfo_'+vm.version+'.js',{
                    token: token,
                    ShopCode:vm.shopCode
                },'callback',function(rs){
                    var beginTime = rs.BaseInfo.Shop.BusinessBeginTime,
                        endTime = rs.BaseInfo.Shop.BusinessEndTime,
                        bHours = parseInt(beginTime.split('时')[0]),
                        bMiunt = parseInt(beginTime.split('时')[1].split('分')[0]),
                        eHours = parseInt(endTime.split('时')[0]),
                        eMiunt = parseInt(endTime.split('时')[1].split('分')[0]);

                    vm.shopDetail = rs;

                    $('#beginTime').val(vm.fixNumber(bHours)+':'+vm.fixNumber(bMiunt));
                    $('#endTime').val(vm.fixNumber(eHours)+':'+vm.fixNumber(eMiunt));

                    $('#beginTime').mobiscroll().time({
                        theme: 'mobiscroll',
                        display: 'bottom',
                        lang: 'zh',
                        headerText: false,
                        defaultValue: new Date(new Date().setHours(bHours, bMiunt)),
                        maxWidth: 90
                    });
                    $('#endTime').mobiscroll().time({
                        theme: 'mobiscroll',
                        display: 'bottom',
                        lang: 'zh',
                        defaultValue: new Date(new Date().setHours(eHours, eMiunt)),
                        headerText: false,
                        maxWidth: 90
                    });
                },function(){
                });
            },
            fixNumber:function(n){
                return n<10?'0'+n:n;
            },
            fixTime:function(str){
                return str.replace(':','时')+'分'
            },
            saveShopDetail:function(){

                if(!/^[1][34578][0-9]{9}$/.test(vm.shopDetail.BaseInfo.Shop.Tel)){
                    $.message({
                        msg:'请填写正确的联系方式!'
                    });
                    return;
                }

                vm.isSave = false;
                jsonp(host+'/jsonp/Shop_WapUpdateShop_'+vm.version+'.js',{
                    token: token,
                    ShopCode:vm.shopCode,
                    Tel:vm.shopDetail.BaseInfo.Shop.Tel,
                    BusinessBeginTime:vm.fixTime($('#beginTime').val()),
                    BusinessEndTime:vm.fixTime($('#endTime').val()),
                    Title:vm.shopDetail.BaseInfo.Shop.Title,
                    IsPlateLogister:vm.shopDetail.BaseInfo.Shop.IsPlateLogister
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'保存成功!',
                            callback:function(){
                                window.location.href = 'mymerchant.html';
                            }
                        });
                    }else{
                        vm.isSave = true;
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            changePlate:function(){
                vm.shopDetail.BaseInfo.Shop.IsPlateLogister = !vm.shopDetail.BaseInfo.Shop.IsPlateLogister;
            }
        });

        vm.getVersion();
        avalon.scan();
    });

})();