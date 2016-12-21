/**
 * Created by hulgy on 22/09/2016.
 */
(function(){

    'use strict';

    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:"newaddress",
            //code
            code: $.getUrlParam('code') || '',
            //收货人姓名
            ReceiverName:decodeURIComponent($.getUrlParam('ReceiverName')) || '',
            //收货人联系方式
            Phone:decodeURIComponent($.getUrlParam('Phone')) || '',
            //所在地区
            area:'',
            //所在地区的code集合数据模型
            codeList:[],
            //最后一级地区code
            areaCode:'',
            FromAreaCode:decodeURIComponent($.getUrlParam('addresscode')) || '',
            nowAddress:decodeURIComponent($.getUrlParam('address')) || '',
            shortAddress:decodeURIComponent($.getUrlParam('shortaddress')) || '',
            //详细地址
            DetailAddress:decodeURIComponent($.getUrlParam('DetailAddress')) === 'undefined'?'':decodeURIComponent($.getUrlParam('DetailAddress')) || '',
            //地址详细信息
            addressDetail:{},
            //是否是默认地址
            isDefalute:decodeURIComponent($.getUrlParam('isDefalute')) || false,
            //版本号
            version:0,
            addressId:'',
            //地址id
            addID:'',
            //是否正在加载
            isLoading:false,
            //获取版本号
            getVersion:function(){
                vm.isDefalute === 'false'?vm.isDefalute = false:vm.isDefalute = true;
                getBaseVersion(function(rs){
                    vm.version=rs;
                    if(vm.code){
                        vm.getDetailByCode();
                    }
                });
            },
            //根据code获取地址详细信息
            getDetailByCode:function(){
                var code= $.getUrlParam('code');

                jsonp(host+'/jsonp/ReceiveAddress_GetByCode_'+vm.version+'.js',{
                    token:token,
                    code:code
                },'callback',function(rs){
                    if(rs.Success){
                        var data=rs.Data;
                        if(vm.ReceiverName === '') vm.ReceiverName=data.ReceiverName;
                        if(vm.Phone === '') vm.Phone=data.Phone;
                        if(vm.nowAddress === '') vm.nowAddress = data.DetailAddress;
                        if(vm.shortAddress === '') vm.shortAddress = data.ShortAddress;
                        if(vm.DetailAddress === '') vm.DetailAddress=data.Address;
                        vm.isDefalute=data.IsDefault;
                        if(vm.rightCode === '') vm.rightCode=data.CityCode;
                        if(vm.leftCode === '') vm.leftCode=data.ProvinceCode;
                        if(vm.FromAreaCode === '') vm.FromAreaCode = data.FromAreaCode;

                        // for(var i= 0,j=data.AreaModels.length;i<j;i++){
                        //     vm.area+=data.AreaModels[i].Name+' ';
                        //     if(i>0){
                        //         vm.currentArr.push({
                        //             Code:data.AreaModels[i].ID,
                        //             Name:data.AreaModels[i].Name,
                        //             ParenCode:data.AreaModels[i].ParentID,
                        //             Type:data.AreaModels[i].AreaType
                        //         });
                        //     }
                        // }
                        if(vm.areaCode === '') vm.areaCode = data.AreaModels[3].ID;
                        if(vm.addID === '') vm.addID=data.ID;
                        if(vm.addressDetail === '') vm.addressDetail=rs.Data;
                    }else{
                        $.message({
                            msg:rs.Msg
                        })
                    }
                },function(){
                });
            },
            //修改默认地址状态
            changestatus:function(){
                vm.isDefalute=!vm.isDefalute;
                vm.addressDetail.IsDefault=vm.isDefalute;
            },
            //修改显示状态
            changeShow:function(){
            },
            //新增或者修改收货地址
            addOrSavaFn:function(){
                var Latitude=decodeURIComponent($.getUrlParam('Lat')) || '',
                    Longitude=decodeURIComponent($.getUrlParam('Lng')) || '';


                if(vm.ReceiverName === ''){
                    $.message({
                        msg:'收货人姓名必填!'
                    });

                    return;
                }
                if(!/^[1][2345678][0-9]{9}$/.test(vm.Phone)){
                    $.message({
                        msg:'请输入正确的联系方式!'
                    });

                    return;
                }
                if(vm.nowAddress === ''){
                    $.message({
                        msg:'收件人所在地区必选!'
                    });

                    return;
                }
                if(vm.DetailAddress === ''){
                    $.message({
                        msg:'详细地址必填!'
                    });

                    return;
                }

                vm.isLoading = true;

                //收货地址数据模型
                var json={
                    token:token,
                    ReceiverName:vm.ReceiverName,
                    Phone:vm.Phone,
                    DetailAddress:vm.nowAddress,
                    Area:'',
                    Address:vm.DetailAddress,
                    ShortAddress:vm.shortAddress,
                    IsDefault:vm.isDefalute,
                    // TownCode:vm.areaCode,
                    CountyCode:'',
                    CountryCode:'',
                    CityCode:'',
                    ProvinceCode:'',
                    Latitude:Latitude,
                    Longitude:Longitude,
                    FromAreaCode:vm.FromAreaCode
                };

                if(vm.code === ''){
                    vm.addAddress(json);
                }else{
                    json.Code=vm.code;
                    vm.modifyAddress(json);
                }
            },
            //新增收货地址
            addAddress:function(data){

                jsonp(host+'jsonp/ReceiveAddress_Insert_'+vm.version+'.js',data,'callback',function(rs){
                    if(rs.Success){
                        window.location.href = getLocalstorage('preAddHerf');
                        //window.history.go(-3);
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                    vm.isLoading = false;
                },function(){
                });

            },
            //保存收货地址
            modifyAddress:function(data){

                jsonp(host+'jsonp/ReceiveAddress_Update_'+vm.version+'.js',data,'callback',function(rs){
                    if(rs.Success){
                        window.location.href = getLocalstorage('preAddHerf');
                        //window.history.go(-3);
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                    vm.isLoading = false;
                },function(){
                });
            }

        });


        vm.getVersion();
        avalon.scan();
    });

})();