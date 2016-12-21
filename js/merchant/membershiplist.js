/**
 * Created by hulgy on 16/8/16.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'membershiplist',
            //版本号
            version:"",
            cardId: $.getUrlParam('cardid'),
            nowPageIndex:1,
            memberList:[],
            maxPageNum:1,
            loadingImgShow:true,
            hasAdd:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    if(vm.cardId){
                        vm.getMemeberlistByCode(true);
                        vm.hasAdd = true;
                    }else{
                        vm.getAllMemberlist(true);
                        vm.hasAdd = false;
                    }
                });
            },
            //获取所有会员信息
            getAllMemberlist:function(type){
                jsonp(host+'/jsonp/MemberCard_PagingByShopCode_'+vm.version+'.js',{
                    token:token,
                    PageIndex:vm.nowPageIndex,
                    PageSize:10
                },'callback',function(rs){
                    if(rs.Success){

                        vm.loadingImgShow = false;
                        if(type){
                            vm.memberList = rs.Data;
                        }else{
                            for(var i= 0,j=rs.Data.length;i<j;i++){
                                vm.memberList.push(rs.Data[i]);
                            }
                        }
                        vm.maxPageNum = rs.TotalPages;
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            //获取所有会员信息
            getMemeberlistByCode:function(type){
                jsonp(host+'/jsonp/MemberCard_PagingByShopCodeAndTypeCode_'+vm.version+'.js',{
                    token:token,
                    PageIndex:vm.nowPageIndex,
                    PageSize:10,
                    typeCode:vm.cardId
                },'callback',function(rs){
                    if(rs.Success){
                        vm.loadingImgShow = false;
                        if(type){
                            vm.memberList = rs.Data;
                        }else{
                            for(var i= 0,j=rs.Data.length;i<j;i++){
                                vm.memberList.push(rs.Data[i]);
                            }
                        }
                        vm.maxPageNum = rs.TotalPages;
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
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

                if(vm.nowPageIndex <= vm.maxPageNum){
                    if(vm.cardId){
                        vm.getMemeberlistByCode(false);
                    }else{
                        vm.getAllMemberlist(false);
                    }
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