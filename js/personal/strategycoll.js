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

                jsonp(host+'/jsonp/Guide_GetPageBySsoUserCodeAndType_'+vm.version+'.js',{
                    token:token,
                    PageIndex:vm.nowPageIndex,
                    categoryCode:vm.categoryCode,
                    keyword:vm.keyword,
                    PageSize:10
                },'callback',function(rs){
                    var data = rs.Data;
                    if(type){
                        for(var i= 0,j=data.length;i<j;i++){
                            data[i].showCancelBtn = false;
                        }
                        vm.strategy = rs.Data;
                    }else{
                        for(var i= 0,j=data.length;i<j;i++){
                            data[i].showCancelBtn = false;
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
                jsonp(host+'/jsonp/Shop_InsertClickLike_'+vm.version+'.js',{
                    token:token,
                    type:1,
                    code:el.Code
                },'callback',function(rs){
                },function(){
                });

                $event.stopPropagation();
            },
            changeShowleftFn:function(el,$event){
                el.showCancelBtn = true;
                $event.preventDefault();
            },
            changeShowRightFn:function(el,$event){
                el.showCancelBtn = false;
                $event.preventDefault();
            },
            //移除关注
            deleFn:function(el,$remove){
                jsonp(host+'/jsonp/Guide_CancelCollection_'+vm.version+'.js',{
                    token:token,
                    code:el.Code
                },'callback',function(rs){
                    if(rs.Success){
                        $remove();
                        $.message({
                            msg:'删除成功!'
                        });
                    }else{
                        $.message({
                            msg:rs.Msg
                        })
                    }
                },function(){
                });
            }

        });

        var a = new $.scrollLoad({
            mainDiv: $(".strategylist ul"),
            buttonLength: 500,
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