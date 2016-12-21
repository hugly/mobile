/**
 * Created by hulgy on 16/7/12.
 */
(function(){
    'use strict';

    require(["domReady!"],function(avalon){

        var vm=avalon.define({
            $id:"commonedperson",
            //版本号
            version:0,
            //推荐的用户数据模型
            personModel:[],
            nowPageIndex:1,
            totalPage:0,
            loadingImgShow:true,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getRecommendFriend();
                });
            },
            //获取用户详细信息
            getRecommendFriend:function(){
                jsonp(host+'/jsonp/RecommendFriend_GetPageBySsoUserCode_'+vm.version+'.js',{
                    token:token,
                    PageIndex:vm.nowPageIndex,
                    PageSize:10
                },'callback',function(rs){
                    if(rs.Success){
                        vm.loadingImgShow = false;
                        vm.personModel = rs.Data;
                        vm.totalPage = rs.TotalPages;
                    }
                },function(){
                });
            }
        });

        var a = new $.scrollLoad({
            mainDiv: $(".order-box"),
            buttonLength: 50,
            ajaxFn: function (){
                vm.nowPageIndex++;

                if(vm.nowPageIndex <= vm.totalPage){
                    vm.getRobOrderList();
                }else{
                    vm.nowPageIndex = vm.totalPage;
                }
                a.ajaxSuccess();
            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();