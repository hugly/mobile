/**
 * Created by hulgy on 16/7/11.
 */
(function(){
    'use strict';

    var dayDir={
        1:'随时',
        2:'周一至周五',
        3:'周末'
    };
    var timeDir={
        1:'随时',
        2:'早上',
        3:'中午',
        4:'晚上'
    };

    var washTypeDir={
        1:'干洗熨烫',
        2:'清洗保养',
        3:'奢侈护理',
        4:'裁剪维修'
    };


    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:'robdetail',
            //版本号
            version:"",
            //是否显示
            isShow:false,
            //用户详情
            memberDetail:{},
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getRobOrderDetail()
                });
            },
            //获取商家抢单列表
            getRobOrderDetail:function(){
                jsonp(host+'jsonp/Booking_GetByCode_'+vm.version+'.js',{
                    token:token,
                    code: $.getUrlParam('code')
                },'callback',function(rs){
                    var substr = '';
                    for(var n= 0,m=rs.Data.products.length;n<m;n++){
                        var str=rs.Data.products[n].SubCategoryName+rs.Data.products[n].Number+'件,';
                        substr += str;
                    }

                    rs.Data.proList=substr;
                    vm.memberDetail=rs.Data;

                    vm.memberDetail.WashSaleType=washTypeDir[vm.memberDetail.WashSaleType];
                    vm.memberDetail.sendTime=dayDir[vm.memberDetail.SendDateRangeType]+" "+timeDir[vm.memberDetail.SendTimeRangeType];

                    $.setQQMap({
                        obj:"mapbox",
                        zoom:16,
                        imgsrc:"../../data-images/tag.png",
                        lon:rs.Data.PickLongitude,
                        lat:rs.Data.PickLatitude
                    });
                },function(){
                });

            },
            //修改详情展示状态
            changeShow:function(){
                vm.isShow=!vm.isShow;
            },
            //确认接单
            takeOrder:function(){
                jsonp(host+'jsonp/Booking_ReceivedByCode_'+vm.version+'.js',{
                    token:token,
                    code: $.getUrlParam('code')
                },'callback',function(rs){
                    if(rs.Success){
                        window.location.href='roborder.html'
                    }
                },function(){
                });
            }
        });

        vm.getVersion();

        avalon.scan();
    });
})();