/**
 * Created by hulgy on 16/8/24.
 */
/**
 * Created by hulgy on 16/6/12.
 */

(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:'trendlist',
            //版本号
            version:0,
            nowPageIndex:1,
            maxPageNum:1,
            loadingImgShow:false,
            trendList:[],
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getListData(true);
                });
            },
            //获取列表数据
            getListData:function(type){

                vm.loadingImgShow = true;

                jsonp(host+'jsonp/ShopMessage_PagingByShopCode_'+vm.version+'.js',{
                    token:token,
                    PageIndex:vm.nowPageIndex,
                    PageSize:10
                },'callback',function(rs){

                    if(rs.Success){
                        if(type){
                            vm.trendList = rs.Data;
                        }else{
                            var data = rs.Data;

                            for(var i=0,j=data.length;i<j;i++){
                                vm.trendList.push(data);
                            }
                        }
                        vm.maxPageNum = rs.Data.TotalPages;
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            }
        });

        $('.trendslist').dropload({
            scrollArea : window,
            loadDownFn : function(me){
                vm.nowPageIndex++;

                if(vm.nowPageIndex <= vm.maxPageNum){
                    vm.getListData(false);
                }else{
                    vm.nowPageIndex = vm.maxPageNum;
                }
                me.resetload();
            }
        });

        vm.getVersion();
        avalon.scan();
    });

})();