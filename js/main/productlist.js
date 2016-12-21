/**
 * Created by hulgy on 16/9/5.
 */
(function(){

    var saleTypeDir={
        1:'干洗熨烫',
        2:'清洗保养',
        3:'奢侈护理',
        4:'裁剪维修'
    };

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"productlist",
            //版本号
            version:"",
            //sku数据
            skuData:[],
            TotalNum:0,
            //url参数
            searchData:window.location.search,
            urlData:transUrl2List(),
            loadingImgShow:true,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getOrderInfo();
                });
            },
            //获取整个订单信息
            getOrderInfo:function(){
                var json={},
                    data=window.location.search.substring(1,window.location.search.length),
                    dataArr=data.split("&");

                json.token=token;
                for(var i= 0,j=dataArr.length;i<j;i++){
                    var arr=dataArr[i].split("=");

                    json[arr[0]]=arr[1];

                }
                jsonp(sildHost+'/jsonp/Order_GetWashCreateOrderInfo_'+vm.version+'.js',json,'callback',function(rs){

                    vm.loadingImgShow = false;
                    if(rs.Code === 110){
                        $.message({
                            msg:rs.Msg
                        });
                        return;
                    }

                    vm.TotalNum = rs.Data.TotalNum;
                    var sku=rs.Data.Skus;

                    for(var i= 0,j=sku.length;i<j;i++){
                        sku[i].index = i+1;
                        sku[i].saleTypeName = saleTypeDir[sku[i].SaleType];
                    }

                    vm.skuData=sku;
                },function(){
                });

            }
        });

        vm.getVersion();
        avalon.scan();
    });

})();