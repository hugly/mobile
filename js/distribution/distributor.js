/**
 * Created by hulgy on 18/11/2016.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'distributor',
            version:'',
            loadingImgShow:true,
            isShowTypebox:false,
            account:[],
            nowPageIndex:1,
            maxPageNum:1,
            SSOCode:'',
            minValue:0,
            maxValue:0,
            isBinding:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getBriefInfo(true);
                });
            },
            clooseFn:function(){
                vm.minValue = 0;
                vm.maxValue = 0;
                vm.isShowTypebox = false;
            },
            showTypeboxFn:function(el){
                vm.SSOCode = el.SSOCode;
                vm.isShowTypebox = true;
            },
            //获取简略信息
            getBriefInfo:function(type){
                jsonp(host+'jsonp/Distributor_Paging_'+vm.version+'.js',{
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
            },
            bindCardFn:function(){

                if(parseInt(vm.minValue) >= parseInt(vm.maxValue)){
                    $.message({
                        msg:'最小值不能小于或者等于最大值'
                    })
                    return;
                }

                vm.isBinding = true;
                jsonp(host+'jsonp/Distributor_BindNumber_'+vm.version+'.js',{
                    token:token,
                    userCode:vm.SSOCode,
                    minValue:vm.minValue,
                    maxValue:vm.maxValue
                },'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'绑定成功!',
                            callback:function(){
                                vm.clooseFn();
                                vm.isBinding = false;
                            }
                        })
                    }else{
                        $.message({
                            msg:rs.Msg,
                            callback:function(){
                                vm.isBinding = false;
                            }
                        })
                    }
                },function(){
                });
            }

        });

        var a = new $.scrollLoad({
            mainDiv: $(".order-con"),
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