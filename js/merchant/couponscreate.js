/**
 * Created by hulgy on 16/6/10.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:"couponscreate",
            //类型
            type:1,
            //优惠券名称
            Name:"",
            //优惠券数量
            Num:10,
            //优惠券金额
            Price:1,
            //有无金额限制
            IsLimitMax:false,
            //限制金额
            LimitMin:0,
            //开始时间
            BeginDate:"",
            //过期时间
            ExpireDate:"",
            //版本号
            version:0,
            isSuccess : false,
            isCheck:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    var oDate = new Date(),
                        code= $.getUrlParam("code");
                    if(code){
                        vm.getCouponsDetail(code,function(beginTime,endTime){
                            $('#BeginDate').mobiscroll().date({
                                theme: 'mobiscroll',
                                lang: 'zh',
                                display: 'bottom',
                                minDate: new Date(beginTime.split('-')[0],beginTime.split('-')[1],beginTime.split('-')[2]),
                                dateFormat: 'yy-mm-dd',
                                rtl: false,
                                defaultValue:new Date(beginTime.split('-')[0],beginTime.split('-')[1],beginTime.split('-')[2])
                            });
                            $('#ExpireDate').mobiscroll().date({
                                theme: 'mobiscroll',
                                lang: 'zh',
                                display: 'bottom',
                                minDate: new Date(endTime.split('-')[0],endTime.split('-')[1],endTime.split('-')[2]),
                                dateFormat: 'yy-mm-dd',
                                rtl: false,
                                defaultValue:new Date(endTime.split('-')[0],endTime.split('-')[1],endTime.split('-')[2])
                            });

                        });
                    }else{

                        $('#BeginDate').val(new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate());
                        $('#ExpireDate').val(new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate());
                        $('#BeginDate,#ExpireDate').mobiscroll().date({
                            theme: 'mobiscroll',
                            lang: 'zh',
                            display: 'bottom',
                            dateFormat: 'yy-mm-dd',
                            minDate: new Date(oDate.getFullYear(),oDate.getMonth(),oDate.getDate(),oDate.getHours(),oDate.getMinutes()+5),
                            rtl: false
                        });

                    }
                });


            },
            //获取优惠券详情
            getCouponsDetail:function(code,callback){
                jsonp(host+'/jsonp/CounponInfo_GetCouponDetailByCode_'+vm.version+'.js',{
                    token:token,
                    code:code
                },'callback',function(rs){
                    vm.Name=rs.Data.Name;
                    vm.Num=rs.Data.Num;
                    vm.Price=rs.Data.Price;
                    vm.IsLimitMax=rs.Data.IsLimitMax;
                    vm.LimitMin=rs.Data.LimitMin;

                    if(vm.IsLimitMax){
                        vm.type=1;
                    }else{
                        vm.type=2;
                    }
                    $('#BeginDate').val(rs.Data.BeginDate.split(" ")[0]);
                    $('#ExpireDate').val(rs.Data.ExpireDate.split(" ")[0]);
                    callback && callback(rs.Data.BeginDate.split(" ")[0],rs.Data.ExpireDate.split(" ")[0]);
                },function(){
                });
            },
            //选择优惠券金额使用条件
            choose:function(type){
                vm.isCheck = !vm.isCheck;
                if(vm.isCheck){
                    vm.IsLimitMax = true;
                    vm.type = 1;
                }else{
                    vm.IsLimitMax = false;
                    vm.type = 2;
                }
            },
            //提交优惠券申请
            submitCoupons:function(){
                var code="",
                    id="";

                if(vm.Name === ''){
                    $.message({
                        msg:'优惠券名字不能为空!'
                    });
                    return;
                }
                if(vm.Num === 0){
                    $.message({
                        msg:'优惠券数量不能为空!'
                    });
                    return;
                }
                var expireTime = new Date($('#ExpireDate').val()).getTime(),
                    beginTime  =new Date($('#BeginDate').val()).getTime();
                if(expireTime < beginTime){
                    $.message({
                        msg:'结束时间不能小于开始时间!'
                    });
                    return;
                }

                if($.getUrlParam("code")){
                    code=$.getUrlParam("code");
                    id=$.getUrlParam('id');
                }
                vm.isSuccess = true;
                jsonp(host+'/jsonp/CounponInfo_Insert_'+vm.version+'.js',{
                    token:token,
                    Code:code,
                    ID: id,
                    Name:vm.Name,
                    Num:vm.Num,
                    Price:vm.Price,
                    ForType:0,
                    IsLimitMax:vm.IsLimitMax,
                    LimitMin:vm.LimitMin,
                    ExpireDate:document.getElementById('ExpireDate').value,
                    BeginDate:document.getElementById('BeginDate').value
                },'callback',function(rs){
                    if(rs.Success){
                        window.location.href="coupons.html";
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                        vm.isSuccess = false;
                    }
                },function(){
                });

            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();