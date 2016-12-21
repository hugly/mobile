/**
 * Created by hulgy on 16/6/21.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:'addgroup',
            //版本号
            version:"",
            //团购券数据模型
            groupData:{
                Name:'',
                Type:1,
                ActivePrice:0,
                Price:0,
                StartTime:'',
                EndTime:'',
                IssueNum:10,
                Desc:''
            },
            //开始时间
            benginTime:new Date(),
            //结束时间
            endTime:new Date(),
            isSuccess:false,
            isShowTime:false,
            //团购券code
            groupcode: $.getUrlParam('code') || '',
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;

                    if(vm.groupcode){
                        vm.getGroupDetail();
                    }
                });

                var oDate = new Date();
                $("#benginTime").mobiscroll().date({
                    theme: 'mobiscroll',
                    lang: 'zh',
                    display: 'bottom',
                    defaultValue: new Date(),
                    minDate: new Date(oDate.getFullYear(),oDate.getMonth(),oDate.getDay(),oDate.getHours(),oDate.getMinutes()+5),
                    onClose:function(valueText,inst){
                        vm.benginTime=valueText;
                        vm.groupData.StartTime=valueText;
                    }
                });
                $("#endTime").mobiscroll().date({
                    theme: 'mobiscroll',
                    lang: 'zh',
                    display: 'bottom',
                    defaultValue: new Date(),
                    max: new Date(),
                    minDate: new Date(oDate.getFullYear(),oDate.getMonth(),oDate.getDay(),oDate.getHours(),oDate.getMinutes()+5),
                    onClose:function(valueText,inst){
                        vm.endTime=valueText;
                        vm.groupData.EndTime=valueText;
                    }
                });
            },
            requireTime:function(){
                vm.isShowTime = !vm.isShowTime;
            },
            //根据code获取团购券详细信息
            getGroupDetail:function(){

                jsonp(host+'jsonp/GroupCoupon_GetGroupCouponDetail_'+vm.version+'.js',{
                    token:token,
                    Code:vm.groupcode
                },'callback',function(rs){
                    if(rs.Success){
                        rs.Data.readonly=true;
                        vm.groupData=rs.Data;
                    }
                },function(){
                });
            },
            //添加或者修改团购券数据
            modifyOrAddGroup:function(){
                if(vm.groupcode){
                    vm.isSuccess = true;
                    jsonp(host+'jsonp/GroupCoupon_UpdateGroupCoupon_'+vm.version+'.js',{
                        token:token,
                        Code:vm.groupcode,
                        StartTime:vm.groupData.StartTime,
                        EndTime:vm.groupData.EndTime
                    },'callback',function(rs){
                        if(rs.Success){
                            window.location.href='groupmanage.html';
                        }else{
                            $.message({
                                msg:rs.Msg
                            });
                            vm.isSuccess = false;
                        }
                    },function(){
                    });
                }else{
                    if(vm.groupData.Name === ''){
                        $.message({
                            msg:'团购券名称不能为空!'
                        });
                        return;
                    }
                    if(vm.groupData.ActivePrice == 0){
                        $.message({
                            msg:'请填写团购券面值!'
                        });
                        return;
                    }
                    if(vm.groupData.Price == 0){
                        $.message({
                            msg:'请填写团购券折后价!'
                        });
                        return;
                    }
                    if(vm.isShowTime && vm.groupData.StartTime === ''){
                        $.message({
                            msg:'团购券开始时间不能为空!'
                        });
                        return;
                    }
                    if(vm.isShowTime && vm.groupData.EndTime === ''){
                        $.message({
                            msg:'团购券结束时间不能为空!'
                        });
                        return;
                    }
                    var expireTime = new Date(vm.groupData.EndTime).getTime(),
                        beginTime  =new Date(vm.groupData.StartTime).getTime();
                    if(expireTime < beginTime){
                        $.message({
                            msg:'结束时间不能小于开始时间!'
                        });
                        return;
                    }

                    if(vm.groupData.IssueNum === 0){
                        $.message({
                            msg:'团购券总发行量不能为空!'
                        });
                        return;
                    }
                    vm.isSuccess = true;
                    jsonp(host+'jsonp/GroupCoupon_CreateGroupCoupon_'+vm.version+'.js',{
                        token:token,
                        Name:vm.groupData.Name,
                        Type:vm.groupData.Type,
                        ActivePrice:vm.groupData.ActivePrice,
                        Price:vm.groupData.Price,
                        StartTime:vm.groupData.StartTime,
                        EndTime:vm.groupData.EndTime,
                        IssueNum:vm.groupData.IssueNum,
                        Desc:vm.groupData.Desc,
                        Status:1,
                        IsLimitTime:vm.isShowTime
                    },'callback',function(rs){
                        if(rs.Success){
                            window.location.href='groupmanage.html';
                        }else{
                            $.message({
                                msg:rs.Msg
                            });
                            vm.isSuccess = false;
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