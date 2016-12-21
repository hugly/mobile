/**
 * Created by hulgy on 16/7/12.
 */
(function(){
    'use strict';

    require(["domReady!"],function(avalon){

        var vm=avalon.define({
            $id:"footprint",
            //版本号
            version:0,
            //集合信息
            scanHistoryList:[],
            loadingImgShow:true,
            nowPageIndex:1,
            maxPageNum:0,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getScanHistoryList(false);
                });
            },
            //获取用户详细信息
            getScanHistoryList:function(type){
                jsonp(host+'/jsonp/Shop_PagingScanHistory_'+vm.version+'.js',{
                    token:token,
                    PageIndex:vm.nowPageIndex,
                    PageSize:10
                },'callback',function(rs){
                    var data = rs.Data;

                    vm.loadingImgShow = false;
                    for(var i= 0,j=data.length;i<j;i++){
                        data[i].width = data[i].Score*3/5;
                        if(type){
                            vm.scanHistoryList.push(data[i]);
                        }
                    }
                    if(!type){
                        vm.scanHistoryList = rs.Data;
                    }
                    vm.maxPageNum = rs.TotalPages;
                },function(){
                });
            }
        });

        var a = new $.scrollLoad({
            mainDiv: $(".footitem"),
            buttonLength: 50,
            ajaxFn: function (){
                vm.nowPageIndex++;
                if(vm.nowPageIndex <= vm.maxPageNum){
                    vm.getScanHistoryList(true);
                }else{
                    vm.nowPageIndex = vm.maxPageNum;
                }
                a.ajaxSuccess();
            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();