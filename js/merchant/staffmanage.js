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
            //当前页码
            nowPageIndex:1,
            maxPageNum:0,
            loadingImgShow:true,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getStaffList();
                });
            },
            //获取员工列表数据
            getStaffList:function(){
                vm.loadingImgShow = true;

                jsonp(host+'jsonp/Staff_PagingStaff_'+vm.version+'.js',{
                    token:token,
                    PageIndex:vm.nowPageIndex,
                    PageSize:10
                },'callback',function(rs){
                    if(rs.Success){
                        for(var i= 0,j=rs.Data.length;i<j;i++){
                            rs.Data[i].isShowDele=false;
                        }
                        vm.maxPageNum = rs.TotalPages;
                        vm.loadingImgShow = false;
                        vm.staffModel=rs.Data;
                    }
                },function(){
                });
            },
            //显示删除按钮
            showDele:function(index,$event){
                vm.staffModel[index].isShowDele = true;
                //$event.stopPropagation();
            },
            hideDele:function(index,$event){
                vm.staffModel[index].isShowDele = false;
                //$event.stopPropagation();
            },
            //删除会员
            deleStaff:function(index,code,$remove){
                jsonp(host+'jsonp/Staff_DeleteStaff_'+vm.version+'.js',{
                    token:token,
                    Code:code
                },'callback',function(rs){
                    if(rs.Success){
                        $remove();
                        $.message({
                            msg:'删除员工成功!'
                        });
                        //vm.staffModel[index].remove();
                    }
                },function(){
                });
            }
        });

        var a = new $.scrollLoad({
            mainDiv: $(".staff-box"),
            buttonLength: 50,
            ajaxFn: function (){
                vm.nowPageIndex++;

                if(vm.nowPageIndex <= vm.maxPageNum){
                    vm.getStaffList();
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