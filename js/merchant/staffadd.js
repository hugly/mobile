/**
 * Created by hulgy on 16/6/21.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"staffadd",
            //版本号
            version:"",
            //员工code
            staffCode: $.getUrlParam('code') || '',
            //员工数据模型
            staffModel:{
                DepartmentName:'',
                Position:'',
                Degree:'',
                Political:'',
                EmergencyContacter:'',
                CertiNo:'',
                CertiType:0,
                Tel:'',
                birthDate:'',
                FamilyName:'',
                Sex:0,
                Name:''
            },
            isSuccess:false,
            //出生日期
            birthDate:'',
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    if(vm.staffCode){
                        vm.getStaffInfoByCode();
                    }

                    var currYear = new Date().getFullYear();

                    $("#birthDate").mobiscroll().date({
                        theme: 'mobiscroll',
                        lang: 'zh',
                        display: 'bottom',
                        defaultValue: new Date(new Date().setFullYear(currYear - 20)),
                        max: new Date(),
                        min: new Date(new Date().setFullYear(currYear - 120)),
                        onClose:function(valueText,inst){
                            vm.birthDate=valueText;
                        }
                    });
                });
            },
            //根据员工code获取员工基本信息
            getStaffInfoByCode:function(){
                jsonp(host+'jsonp/Staff_GetByCode_'+vm.version+'.js',{
                    token:token,
                    Code:vm.staffCode
                },'callback',function(rs){
                    if(rs.Success){
                        vm.staffModel=rs.Data;
                        vm.birthDate=rs.Data.BirthDay;

                        if(vm.staffModel.Political === 'undefined'){
                            vm.staffModel.Political = '';
                        }
                        if(vm.staffModel.EmergencyContacter === 'undefined'){
                            vm.staffModel.EmergencyContacter = '';
                        }
                    }
                },function(){
                });
            },
            //保存员工信息
            saveData:function(){
                var phoneRule = /^(?:0?1)[34578]\d{9}$/,
                    cardRule = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/ ;

                if(vm.staffModel.Name === ''){
                    $.message({
                        msg:'员工名字必填!'
                    });
                    return;
                }
                if(vm.staffModel.Sex === ''){
                    $.message({
                        msg:'员工性别必填!'
                    });
                    return;
                }
                if(vm.staffModel.FamilyName === ''){
                    $.message({
                        msg:'员工民族必填!'
                    });
                    return;
                }

                if(!phoneRule.test(vm.staffModel.Tel)){
                    $.message({
                        msg:'请输入正确的手机号码!'
                    });
                    return;
                }

                if(!cardRule.test(vm.staffModel.CertiNo)){
                    $.message({
                        msg:'请输入正确的身份证号码!'
                    });
                    return;
                }

                if(vm.staffModel.DepartmentName === ''){
                    $.message({
                        msg:'员工部门必填!'
                    });
                    return;
                }

                vm.isSuccess = true;

                if(vm.staffCode){
                    jsonp(host+'jsonp/Staff_UpdateStaff_'+vm.version+'.js',{
                        token:token,
                        Code:vm.staffCode,
                        Name:vm.staffModel.Name,
                        BirthDay:vm.birthDate,
                        Sex:vm.staffModel.Sex,
                        FamilyName:vm.staffModel.FamilyName,
                        Tel:vm.staffModel.Tel,
                        CertiType:vm.staffModel.CertiType,
                        CertiNo:vm.staffModel.CertiNo,
                        DepartmentName:vm.staffModel.DepartmentName,
                        Position:vm.staffModel.Position,
                        Degree:vm.staffModel.Degree,
                        Political:vm.staffModel.Political,
                        EmergencyContacter:vm.staffModel.EmergencyContacter
                    },'callback',function(rs){
                        if(rs.Success){
                            $.message({
                                msg:'修改员工成功!',
                                callback:function(){
                                    window.location.href='staffmanage.html';
                                }
                            });
                        }else{
                            $.message({
                                msg:rs.Msg
                            });

                            vm.isSuccess = false;
                        }
                    },function(){
                    });
                }else{
                    jsonp(host+'jsonp/Staff_InsertStaff_'+vm.version+'.js',{
                        token:token,
                        Name:vm.staffModel.Name,
                        BirthDay:vm.birthDate,
                        Sex:vm.staffModel.Sex,
                        FamilyName:vm.staffModel.FamilyName,
                        Tel:vm.staffModel.Tel,
                        CertiType:vm.staffModel.CertiType,
                        CertiNo:vm.staffModel.CertiNo,
                        DepartmentName:vm.staffModel.DepartmentName,
                        Position:vm.staffModel.Position,
                        Degree:vm.staffModel.Degree,
                        Political:vm.staffModel.Political,
                        EmergencyContacter:vm.staffModel.EmergencyContacter
                    },'callback',function(rs){
                        if(rs.Success){
                            $.message({
                                msg:'新增员工成功!',
                                callback:function(){
                                    window.history.go(-1);
                                }
                            });
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