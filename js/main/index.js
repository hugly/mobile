/**
 * Created by hulgy on 16/6/4.
 */
(function(){
    'use strict';

    require(['mmRequest','domReady!'],function(avalon){

        var vm=avalon.define({
            $id:"index",
            //版本号
            version:"",
            //banner数据
            bannerData:[],
            //商家列表数据
            listData:[],
            WashSaleType:"1,2",
            //选择商家
            hasActive:0,
            //城市名称
            currentAddress:getLocalstorage('addDetail') || "成都市",
            //经纬度
            Lat: getLocalstorage('lat') || 0,
            Lon: getLocalstorage('lon') || 0,
            opacity:0,
            loadingImgShow:true,
            nowPageIndex:1,
            maxPageNum:0,
            //时
            h:'00',
            //分
            m:'00',
            //秒
            s:'00',
            //获取版本号
            getVersion:function(){
                vm.getLocation();
                getBaseVersion(function(rs){
                    var normalTop = $(window).scrollTop(),
                        fontSize=$(window).width()/16;

                    vm.version=rs;
                    vm.getBannerData();
                    vm.hasRedPackage();

                    if(normalTop >= fontSize*3){
                        vm.opacity = 1;
                    }

                    $(window).scroll(function(){
                        var top=$(window).scrollTop();

                        vm.opacity = (top/fontSize)/3;
                    });
                });

                // var oDate = new Date(),
                //     hours = oDate.getHours(),
                //     nowTime = oDate.getTime(),
                //     time = 0;
                //
                // //上午10点之前
                // if(hours < 10){
                //
                //     oDate.setHours(10,0,0,0);
                //     time = parseInt((oDate.getTime()-nowTime)/1000);
                //
                // }
                // //10点到13点
                // else if(hours >= 10 && hours < 13){
                //
                //     oDate.setHours(13,0,0,0);
                //     time = parseInt((oDate.getTime()-nowTime)/1000);
                //
                // }
                // //13点到16点
                // else if(hours >= 13 && hours < 16){
                //
                //     oDate.setHours(16,0,0,0);
                //     time = parseInt((oDate.getTime()-nowTime)/1000);
                //
                // }
                // //16点之后
                // else if(hours >= 16){
                //
                //     oDate.setDate(oDate.getDate()+1);
                //     oDate.setHours(10,0,0,0);
                //     time = parseInt((oDate.getTime()-nowTime)/1000);
                // }
                //
                // setInterval(function(){
                //     time --;
                //     if(time <= 0) return;
                //     vm.daoTime(time);
                // },1000);

            },
            getLocation:function(){
                if(vm.Lat !== 0 && vm.Lon !== 0){
                    setLocalstorage('lat',vm.Lat);
                    setLocalstorage('lon',vm.Lon);
                    //vm.getRecommendData(true);
                }else{
                    $.getAddress({
                        callback:function(rs){
                            if(rs){
                                vm.Lat=rs.lat;
                                vm.Lon=rs.lng;
                                vm.currentAddress = rs.addr;

                                setLocalstorage('lat',rs.lat);
                                setLocalstorage('lon',rs.lng);
                                setLocalstorage('addDetail',rs.addr);
                            }
                            //vm.getRecommendData(true);
                        },
                        errorFn:function(){
                            vm.currentAddress = '成都市';
                            //vm.getRecommendData(true);
                        }
                    });

                    // var options = {timeout: 8000};
                    // var geolocation = new qq.maps.Geolocation("OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77", "myapp");
                    // geolocation.getLocation(showPosition, showErr, options);
                }

                // function showPosition(position) {
                //     console.log(position);
                //
                //     vm.Lat=position.lat;
                //     vm.Lon=position.lng;
                //     vm.currentAddress = position.addr;
                //
                //     setLocalstorage('lat',position.lat);
                //     setLocalstorage('lon',position.lng);
                // }
                //
                // function showErr(){}


            },
            //倒计时
            daoTime:function(s){
                vm.h=vm.fillSeat(parseInt(s/3600));
                s%=3600;

                vm.m=vm.fillSeat(parseInt(s/60));
                s%=60;

                vm.s = vm.fillSeat(s);
            },
            //补位方法
            fillSeat:function(s){
                return s<=9?'0'+s:s;
            },
            hasRedPackage:function(){
                jsonp(host+'/jsonp/DailyActivity_HasExistByToday_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        if(rs.Data){
                            $.redPackets({
                                url:host+'jsonp/DailyActivity_InsertReward_'+vm.version+'.js'
                            })
                        }
                    }
                },function(){
                });
            },
            //获取banner数据
            getBannerData:function(){
                jsonp(host+'/jsonp/Home_HomeBanner_'+vm.version+'.js',{
                    token: token
                },'callback',function(rs){
                    vm.bannerData=rs;
                    vm.bannerInit();
                },function(){
                },'getBannnerFn');
            },
            //banner初始化函数
            bannerInit:function(){
                var list = [];

                vm.bannerData.forEach(function(el){
                    var json={};
                    json.content='<a href="'+el.Href+'"><img src="'+el.Src+'"></a>';
                    list.push(json);
                });

                var opts = {
                    type: 'dom',
                    data: list,
                    dom: document.getElementById("banner"),
                    isLooping: true,
                    onslideend:function(){
                        echo.init();
                    }
                };
                var	islider = new iSlider(opts);
                islider.addDot();
                $("#banner").append($(".islider-dot-wrap"));

            },
            //获取推荐商户
            getRecommendData:function(type){
                vm.loadingImgShow = true;
                if(vm.nowPageIndex < 1){
                    vm.nowPageIndex = 1;
                }
                jsonp(host+'/jsonp/Shop_Search_'+vm.version+'.js',{
                    token: token,
                    PageIndex:vm.nowPageIndex,
                    PageSize:10,
                    Keyword:"",
                    Lat:vm.Lat || "",
                    Lon:vm.Lon || "",
                    SortColumn:"location",
                    SortType:1,
                    WashSaleType:vm.WashSaleType,
                    Fac:""
                    //Fac:$.transJsonListToString(FacArr,"Fac")
                },'callback',function(rs){
                    var data= rs.Data.Data;
                    vm.loadingImgShow = false;

                    for(var i= 0,j=data.length;i<j;i++){
                        var score = parseFloat(data[i].CommentScore) || 0;

                        data[i].CommentIntScore = (score/5)*3;

                        if(!type){
                            vm.listData.push(data[i]);
                        }
                    }
                    vm.maxPageNum = rs.Data.TotalPages;
                    if(type){
                        vm.listData=data
                    }
                },function(){
                });
            },
            //选商家
            chooseShop:function(){
                var avobj=avalon(this),
                    saleType=avobj.data("saletype");

                vm.WashSaleType=saleType;

                if(saleType == "1,2"){
                    vm.hasActive=0;
                }else if(saleType == "3"){
                    vm.hasActive=1;
                }else if(saleType == "4"){
                    vm.hasActive=2;
                }

                vm.listData = [];
                vm.nowPageIndex = 1;

                //vm.getRecommendData(true);
            }

        });

        // var a = new $.scrollLoad({
        //     mainDiv: $(".recomm-list"),
        //     buttonLength: 50,
        //     ajaxFn: function (){
        //         vm.nowPageIndex++;
        //
        //         if(vm.nowPageIndex <= vm.maxPageNum){
        //             vm.getRecommendData(false);
        //         }else{
        //             vm.nowPageIndex = vm.maxPageNum;
        //         }
        //         a.ajaxSuccess();
        //     }
        // });

        vm.getVersion();
        avalon.scan();

    });
})();