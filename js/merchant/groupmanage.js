/**
 * Created by hulgy on 16/6/21.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:'group',
            //版本号
            version:"",
            //团购券数量数据模型
            groupNum:[],
            //当前团购券状态
            Status:0,
            //团购券列表数据模型
            groupModel:[],
            //当前页码
            nowPageIndex:1,
            //最大页码数
            maxPageNum:0,
            loadingImgShow:true,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getGroupData();
                });
            },
            //获取团购券数量集合
            getGroupData:function(){
                jsonp(host+'jsonp/GroupCoupon_GetCountList_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        vm.groupNum=rs.Data;

                        vm.Status=rs.Data[0].Status;
                        vm.getGroupList(false);
                    }
                },function(){
                });
            },
            //修改团购券的显示状态
            changeStatus:function(index){
                vm.Status=vm.groupNum[index].Status;
                vm.groupModel = [];
                vm.nowPageIndex = 1;
                vm.getGroupList(false);
            },
            //根据状态获取团购券数据
            getGroupList:function(type){

                vm.loadingImgShow = true;
                if(!type){
                    vm.groupModel = [];
                }

                jsonp(host+'jsonp/GroupCoupon_PagingBySellStatus_'+vm.version+'.js',{
                    token:token,
                    PageIndex:vm.nowPageIndex,
                    PageSize:8,
                    Status:vm.Status
                },'callback',function(rs){
                    if(rs.Success){
                        vm.loadingImgShow = false;
                        if(type){
                            for(var i= 0,j=rs.Data.length;i<j;i++){
                                vm.groupModel.push(rs.Data[i]);
                            }
                        }else{
                            vm.groupModel = rs.Data;
                        }
                        vm.maxPageNum = rs.TotalPages;
                    }
                },function(){
                });
            },
            //修改团购券的状态
            changeGroupState:function(el,index){
                var status='';

                if(el.Status === 1){
                    status=2;
                }else if(el.Status === 2){
                    status=1;
                }

                jsonp(host+'jsonp/GroupCoupon_UpdateGroupCouponStatus_'+vm.version+'.js',{
                    token:token,
                    code:el.Code,
                    Status:status
                },'callback',function(rs){
                    if(rs.Success){
                        vm.groupModel[index].Status=status;
                    }
                },function(){
                });
            },
            //修改团购券
            modify:function(el){
                window.location.href='groupcreate.html?code='+el.Code;
            }
        });

        var a = new $.scrollLoad({
            mainDiv: $(".group-con"),
            buttonLength: 50,
            ajaxFn: function (){
                vm.nowPageIndex++;
                if(vm.nowPageIndex <= vm.maxPageNum){
                    vm.getGroupList(true);
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