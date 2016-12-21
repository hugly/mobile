/**
 * Created by hulgy on 16/7/22.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'disrelectrecods',
            version:'',
            loadingImgShow:true,
            account:[],
            nowPageIndex:1,
            maxPageNum:1,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getBriefInfo(true);
                });
            },
            //获取简略信息
            getBriefInfo:function(type){
                jsonp(host+'jsonp/CashApply_PagingByUserCode_'+vm.version+'.js',{
                    token:token,
                    Page:vm.nowPageIndex,
                    PageSize:12
                },'callback',function(rs){
                    var data = rs.Data;
                    vm.loadingImgShow = false;
                    if(data){
                        for(var i = 0,j=data.length;i<j;i++){
                            if(!type){
                                vm.account.push(data[i]);
                            }
                        }
                        if(type){
                            vm.account=rs.Data;
                        }
                    }

                    vm.maxPageNum = rs.TotalPages;

                },function(){
                });
            }

        });

        var a = new $.scrollLoad({
            mainDiv: $(".walletdetail"),
            buttonLength: 50,
            ajaxFn: function (){
                vm.nowPageIndex++;

                if(vm.nowPageIndex <= vm.maxPageNum){
                    vm.getBriefInfo(false);
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