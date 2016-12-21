/**
 * Created by hulgy on 16/6/21.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"staffmanage",
            //版本号
            version:"",
            //员工列表数据模型
            staffModel:[],
            //取送件code
            type: $.getUrlParam('type'),
            //选择当前员工code
            staffCode:'',
            loadingImgShow:true,
            isLoading:false,
            hasStaff:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getStaffList();
                });
            },
            //获取员工列表数据
            getStaffList:function(){
                jsonp(host+'jsonp/Staff_PagingStaff_'+vm.version+'.js',{
                    token:token,
                    PageIndex:1,
                    PageSize:20
                },'callback',function(rs){
                    for(var i= 0,j=rs.Data.length;i<j;i++){
                        rs.Data[i].isShowDele=false;
                    }
                    vm.loadingImgShow = false;
                    vm.staffModel=rs.Data;
                },function(){
                });
            },
            //选择员工
            changeShowFn:function(index){
                vm.staffModel.forEach(function(el){
                    el.isShowDele=false;
                });
                vm.staffModel[index].isShowDele=true;
                vm.staffCode=vm.staffModel[index].Code;
                vm.hasStaff = true;
            },
            //确定该员工配送或者收件
            sureFn:function(){
                vm.isLoading = true;
                if(vm.type === 'send'){
                    //发货
                    jsonp(host+'jsonp/Order_Delivery_'+vm.version+'.js',{
                        token:token,
                        code: $.getUrlParam('code'),
                        stafCode:vm.staffCode
                    },'callback',function(rs){
                        if(rs.Success){
                            window.location.href='orderlist.html';
                        }else{
                            $.message({
                                msg:rs.Msg
                            });
                            vm.isLoading = false;
                        }
                    },function(){
                    });
                }else if(vm.type === 'pick'){
                    //取件
                    jsonp(host+'jsonp/Order_Arrange_'+vm.version+'.js',{
                        token:token,
                        code:$.getUrlParam('code'),
                        stafCode:vm.staffCode
                    },'callback',function(rs){
                        if(rs.Success){
                            window.location.href='orderlist.html';
                        }else{
                            $.message({
                                msg:rs.Msg
                            });
                            vm.isLoading = false;
                        }
                    },function(){
                    });
                }
            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();