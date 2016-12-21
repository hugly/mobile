/**
 * Created by hulgy on 22/09/2016.
 */
(function(){
    'use strict';

    require(['mmRequest','domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"city",
            //版本号
            version:"",
            //关键字
            keyword:"",
            //城市键值
            cityCode:"ZC510100",
            //城市名称
            cityname:"",
            //详细地址数据模型
            addressList:[],
            //地址类型
            addType: $.getUrlParam('addType'),
            //历史地址的数据模型
            historyList:JSON.parse(getLocalstorage("historyAddress")) || [],
            //搜索城市和详细地址切换
            tabQue:true,
            //显示历史记录
            showhistory:1,
            //城市列表数据
            nowLat:0,
            nowLng:0,
            //将url参数转化为arr
            urlData:transUrl2List(),
            //url参数数据模型
            searchData:'',
            //详细地址
            localAddress:'',
            address:"",
            shortaddress:'',
            addressCode:'',
            //判断搜索数据是否已经回来
            isGoback:true,
            oldValue:'',
            //城市数据模型
            cityDataModel:[],
            citySilderModel:[],
            isScroll:false,
            loadingImgShow:true,
            //获取版本号
            getVersion:function(){
                vm.searchData=transList2Url(vm.urlData);

                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getNowLocation();
                    vm.getGroupArea();
                });
            },
            getNowLocation:function(){
                $.getAddress({
                    callback:function(data){
                        vm.addressCode = data.adcode;
                        vm.cityname=data.city;

                        if(data.addr === ''){
                            vm.shortaddress = data.city;
                        }else{
                            vm.shortaddress = data.addr;
                        }
                        vm.localAddress=data.province+data.city+data.addr;

                        vm.nowLat=data.lat;
                        vm.nowLng=data.lng;
                    }
                });
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

                vm.showhistory = 1;

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
                },function(){
                    //alert('请检查网络！');
                });

            },
            //改变显示状态
            changeState:function(index){
                var height=$(window).height();
                $(".slider-content,.slider-nav").height(height);
                vm.showhistory=index;
            },
            focusFn:function(){
                vm.showhistory=1;
                setInterval(function(){
                    if(vm.keyword !== vm.oldValue){
                        vm.getAddressByKeyword();
                    }
                },100);
            },
            //根据关键字搜索
            getAddressByKeyword:function(){
                if(!vm.isGoback) return;
                vm.isGoback = false;
                vm.showhistory=1;
                jsonp(sildHost+'/jsonp/Poi_Search_'+vm.version+'.js',{
                    token: token,
                    cityCode:vm.cityCode,
                    keyword:vm.keyword
                },'callback',function(rs){
                    vm.loadingImgShow = false;
                    vm.oldValue = vm.keyword;
                    vm.addressList=rs;
                    vm.showhistory=2;
                    vm.isGoback = true;
                },function(){
                    //alert('请检查网络！');
                });
            },
            //选择地址
            chooseAddress:function(type){
                var avobj=avalon(this),
                    code=avobj.data("code"),
                    name=avobj.data("name"),
                    address=avobj.data("address"),
                    lon=avobj.data("lng"),
                    lat=avobj.data("lat");

                if(type === 0){
                    var json={
                        code:code,
                        name:name,
                        address:address,
                        lon:lon,
                        lat:lat
                    };

                    if(vm.historyList.size() === 0){
                        vm.historyList.push(json);
                        setLocalstorage('historyAddress',JSON.stringify(vm.historyList.$model));
                    }else{
                        var codeArr = [];

                        vm.historyList.forEach(function(el){
                            codeArr.push(el.code);
                        });

                        if($.inArray(code,codeArr) == -1){
                            vm.historyList.push(json);
                            vm.checkhistory();
                            setLocalstorage('historyAddress',JSON.stringify(vm.historyList.$model));
                        }
                    }
                }



                vm.address=address || vm.localAddress;
                vm.nowLat=lat || vm.nowLat;
                vm.nowLng=lon || vm.nowLng;
                vm.shortaddress = name || vm.shortaddress;
                vm.addressCode = code || vm.addressCode;

                vm.urlData=jsonInList({'Lat':vm.nowLat},vm.urlData);
                vm.urlData=jsonInList({'Lng':vm.nowLng},vm.urlData);
                vm.urlData=jsonInList({'address':vm.address},vm.urlData);
                vm.urlData=jsonInList({'shortaddress':vm.shortaddress},vm.urlData);
                vm.urlData=jsonInList({'addresscode':vm.addressCode},vm.urlData);

                vm.searchData=transList2Url(vm.urlData.$model);

                window.location.href = "newaddress.html?"+vm.searchData;
            },
            //检测历史记录是否超长,并作出处理
            checkhistory:function(){
                var size=vm.historyList.size();
                if(size > 10){
                    vm.historyList=vm.historyList.splice(size-10,10);
                }
            }

        });

        vm.getVersion();
        avalon.scan();
    });
})();