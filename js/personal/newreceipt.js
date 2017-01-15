/**
 * Created by hulgy on 22/09/2016.
 */
(function(){

    'use strict';

    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:"newaddress",
            //收货地址code
            code: $.getUrlParam('code') || '',
            //版本号
            version:0,
            sex:0,
            //是否正在加载
            isLoading:false,
            localDataModel:{
                accuracy:'',
                adcode:'',
                addr:'',
                city:'',
                district:'',
                lat:'',
                lng:'',
                nation:'',
                province:''
            },
            POIDataModel:{
                lon:'',
                lat:'',
                shortAddress:'',
                fromAreaCode:''
            },
            isShowLoading:false,
            //城市数据模型
            cityDataModel:[],
            citySilderModel:[],
            receiptDataModel:{},
            cityCode:'ZC510100',
            cityname:'成都市',
            showZoom:false,
            showCityList:false,
            hasCatchData:false,
            isModify:false,
            showAddress:false,
            showback:true,
            isGoback:true,
            isLocation:false,
            keyword:'',
            addressList:[],
            //获取版本号
            getVersion:function(){
                //
                var height=$(window).height(),
                    fontsize = $(window).width()/16;
                $('.account').height(height-fontsize*2);
                $(".slider-content,.slider-nav,.address-box,.dropload-down").height(height-2*fontsize);
                $('.add-list').height(height-fontsize*7);
                getBaseVersion(function(rs){
                    vm.version=rs;
                    if(vm.code){
                        vm.isModify = true;
                        vm.getDetailByCode();
                    }else{
                        vm.getNowLocation();
                    }
                });
            },
            closeFn:function(){
                vm.showCityList = false;
                vm.showAddress = false;
                vm.showback = true;
            },
            //获取所有城市列表
            getGroupArea:function(){
                var self=$(".slider-content ul");

                jsonp(resoureHost+'/jsonp/area_GetGroupArea_'+vm.version+'.js',{
                    token: token
                },'callback',function(rs){

                    vm.cityDataModel = rs;

                    vm.cityDataModel.forEach(function(el){
                        if(el.AreaList.size() > 0){
                            vm.citySilderModel.push(el.Letter);
                        }
                    });
                    vm.showZoom = false;
                    vm.showCityList = true;
                    vm.hasCatchData = true;
                },function(){
                    //alert('请检查网络！');
                });
            },
            checkCityFn:function(){
                vm.showback = false;

                if(vm.hasCatchData){
                    vm.showCityList = true;
                }else{
                    vm.showZoom = true;
                    vm.getGroupArea();
                }
            },
            //选择城市首字母
            cityCodeFn:function(id){
                var topValue=$('#'+id).position().top;
                $('.slider-content').scrollTop(topValue);
            },
            //选择城市
            chooseCityFn:function(){
                var obj=avalon(this),
                    citycode = obj.data('code'),
                    name = obj.data('name');

                vm.cityCode = citycode;
                vm.cityname = name;

                vm.showCityList = false;

            },
            //根据code获取地址详细信息
            getDetailByCode:function(){
                var code= $.getUrlParam('code');

                jsonp(host+'/jsonp/ReceiveAddress_GetByCode_'+vm.version+'.js',{
                    token:token,
                    code:code
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data;
                        vm.receiptDataModel = data;
                        vm.sex = data.Sex;
                        // vm.receiptDataModel.addr = data.ShortAddress;
                        vm.cityname = data.AreaModels[2].Name;
                        vm.localDataModel.addr = data.DetailAddress;
                        vm.localDataModel.lat = data.Latitude;
                        vm.localDataModel.lng = data.Longitude;
                    }else{
                        $.message({
                            msg:rs.Msg
                        })
                    }
                },function(){
                });
            },
            //获取当前地址
            getNowLocation:function(){
                vm.isShowLoading = true;
                $.getAddress({
                    callback:function(data){
                        vm.isLocation = true;
                        vm.isShowLoading = false;
                        vm.localDataModel = data;
                        vm.receiptDataModel.addr = vm.localDataModel.addr;
                    },
                    errorFn:function(data){
                        // $.message({
                        //     msg:'定位失败，请输入所在地区'
                        // });
                        vm.isShowLoading = false;
                    }
                });
            },
            giveNameFn:function(){
                var obj = $(this);

                vm.showAddress = false;
                vm.localDataModel.addr = $(this).prev().val();
            },
            //修改默认地址状态
            changestatus:function(){
                vm.isDefalute=!vm.isDefalute;
                vm.addressDetail.IsDefault=vm.isDefalute;
            },
            changeSexFn:function(num){
                vm.sex = num;
            },
            showAddressFn:function(){
                $(this).blur();
                vm.showback = false;
                vm.showAddress = true;
                $('#keywordText').focus();
            },
            getAddressByKeyword:function(){
                if(!vm.isGoback) return;
                vm.isGoback = false;
                jsonp(sildHost+'/jsonp/Poi_Search_'+vm.version+'.js',{
                    token: token,
                    cityCode:vm.cityCode,
                    keyword:vm.keyword
                },'callback',function(rs){
                    vm.addressList=rs;
                    vm.isGoback = true;
                },function(){
                    //alert('请检查网络！');
                });
            },
            chooseAddFn:function(el){
                vm.POIDataModel.shortAddress = el.Name;
                vm.POIDataModel.lat = el.Latitude;
                vm.POIDataModel.lon = el.Longitude;
                vm.POIDataModel.fromAreaCode = el.FromAreaCode;
                vm.localDataModel.addr = el.Name;

                vm.showAddress = false;
            },
            chooseOtherAddFn:function(el){
                vm.POIDataModel.shortAddress = el.addr;
                vm.POIDataModel.lat = el.lat;
                vm.POIDataModel.lon = el.lng;
                vm.POIDataModel.fromAreaCode = el.adcode;
                vm.localDataModel.addr = el.addr;
                vm.receiptDataModel.addr = el.addr;

                vm.showAddress = false;
            },
            //新增或者修改收货地址
            addOrSavaFn:function(){

                if(vm.receiptDataModel.ReceiverName === ''){
                    $.message({
                        msg:'收货人姓名必填!'
                    });

                    return;
                }
                if(!/^[1][2345678][0-9]{9}$/.test(vm.receiptDataModel.Phone)){
                    $.message({
                        msg:'请输入正确的联系方式!'
                    });

                    return;
                }
                if(vm.localDataModel.addr === ''){
                    $.message({
                        msg:'收件人所在地区必选!'
                    });

                    return;
                }
                if(vm.receiptDataModel.Address === ''){
                    $.message({
                        msg:'详细地址必填!'
                    });

                    return;
                }

                vm.isLoading = true;

                //收货地址数据模型
                var json={
                    token:token,
                    Sex:vm.sex,
                    ReceiverName:vm.receiptDataModel.ReceiverName,
                    Phone:vm.receiptDataModel.Phone,
                    DetailAddress:vm.localDataModel.addr,
                    Area:'',
                    Address:vm.receiptDataModel.Address,
                    ShortAddress:vm.POIDataModel.shortAddress || vm.localDataModel.addr,
                    IsDefault:false,
                    // TownCode:vm.areaCode,
                    CountyCode:'',
                    CountryCode:'',
                    CityCode:vm.cityCode,
                    ProvinceCode:'',
                    Latitude:vm.POIDataModel.lat || vm.localDataModel.lat,
                    Longitude:vm.POIDataModel.lon || vm.localDataModel.lng,
                    FromAreaCode:vm.POIDataModel.fromAreaCode || vm.localDataModel.fromAreaCode
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