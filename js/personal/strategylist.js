/**
 * Created by hulgy on 16/7/26.
 */

(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'strategylist',
            version:'',
            nowPageIndex:1,
            maxPageNum:1,
            loadingImgShow:true,
            categoryCode: $.getUrlParam('type') || '',
            keyword: $.getUrlParam('keyword') || '',
            strategy:[],
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getBriefInfo(true);
                });
            },
            //获取攻略信息
            getBriefInfo:function(type){
                if(type){
                    vm.strategy = [];
                    vm.loadingImgShow = true;
                }

                jsonp(host+'/jsonp/Guide_GetByPage_'+vm.version+'.js',{
                    token:token,
                    Page:vm.nowPageIndex,
                    categoryCode:vm.categoryCode,
                    keyword:vm.keyword,
                    PageSize:10
                },'callback',function(rs){
                    var data = rs.Data;
                    if(type){
                        vm.strategy = rs.Data;
                    }else{
                        for(var i= 0,j=data.length;i<j;i++){
                            vm.strategy.push(data[i]);
                        }
                    }
                    vm.loadingImgShow = false;
                    vm.maxPageNum = rs.TotalPages;
                },function(){
                });
            },
            //攻略点赞
            addLikeFn:function(el,$event){
                jsonp(sildHost+'/jsonp/Shop_InsertClickLike_'+vm.version+'.js',{
                    token:token,
                    type:1,
                    code:el.Code
                },'callback',function(rs){
                    $.message({
                        msg:rs.Msg
                    });
                },function(){
                });

                $event.stopPropagation();
            }

        });

        var a = new $.scrollLoad({
            mainDiv: $(".strategylist ul"),
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