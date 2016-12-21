/**
 * Created by hulgy on 16/6/11.
 */
(function(){

    'use strict';

    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:"newaddress",
            //code
            code: $.getUrlParam('code') || '',
            //收货人姓名
            ReceiverName:'',
            //收货人联系方式
            Phone:'',
            //所在地区
            area:'',
            //所在地区的code集合数据模型
            codeList:[],
            //最后一级地区code
            areaCode:'',
            //详细地址
            DetailAddress:'',
            //地址详细信息
            addressDetail:{},
            //是否是默认地址
            isDefalute:false,
            //左侧数据模型
            leftSilderData:[],
            //右侧数据模型
            rightSilderData:[],
            //地区导航数据模型
            currentArr:[],
            //是否显示地址弹出层
            isShow:false,
            //右侧code
            rightCode:'',
            //左侧code
            leftCode:'',
            //是否是第一次进入
            isFirst:true,
            //版本号
            version:0,
            addressId:'',
            //地址id
            addID:'',
            //是否正在加载
            isLoading:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    if(vm.code){
                        vm.getDetailByCode();
                    }
                });
            },
            //根据code获取地址详细信息
            getDetailByCode:function(){
                var code= $.getUrlParam('code');

                jsonp(host+'/jsonp/ReceiveAddress_GetByCode_'+vm.version+'.js',{
                    token:token,
                    code:code
                },'callback',function(rs){
                    var data=rs.Data;
                    vm.ReceiverName=data.ReceiverName;
                    vm.Phone=data.Phone;
                    vm.DetailAddress=data.DetailAddress;
                    vm.isDefalute=data.IsDefault;
                    vm.rightCode=data.CityCode;
                    vm.leftCode=data.ProvinceCode;

                    for(var i= 0,j=data.AreaModels.length;i<j;i++){
                        vm.area+=data.AreaModels[i].Name+' ';
                        if(i>0){
                            vm.currentArr.push({
                                Code:data.AreaModels[i].ID,
                                Name:data.AreaModels[i].Name,
                                ParenCode:data.AreaModels[i].ParentID,
                                Type:data.AreaModels[i].AreaType
                            });
                        }
                    }
                    vm.areaCode = data.AreaModels[3].ID;
                    vm.addID=data.ID;
                    vm.addressDetail=rs.Data;
                },function(){
                });
            },
            //修改默认地址状态
            changestatus:function(){
                vm.isDefalute=!vm.isDefalute;
                vm.addressDetail.IsDefault=vm.isDefalute;
            },
            //修改显示状态
            changeShow:function(){
                vm.area='';
                vm.isShow=!vm.isShow;


                if(vm.code){
                    if(vm.isShow && vm.isFirst){
                        vm.getNextAreaData('left',vm.leftCode,2,'',function(){
                            vm.getNextAreaData('right',vm.rightCode,3);
                        });
                        vm.isFirst=false;
                    }
                }else{
                    if(vm.isShow && vm.isFirst){
                        vm.leftCode='ZB150000';
                        vm.getNextAreaData('left','','',true,function(){
                            vm.getNextAreaData('right','ZB150000',2);
                        });
                        //ZB150000
                        vm.isFirst=false;
                    }
                }
            },
            //获取下一级数据
            getNextAreaData:function(silder,code,type,state,callFn,afterFn){
                jsonp(resoureHost+'/jsonp/Area_GetArea_'+vm.version+'.js',{
                    token: token,
                    parentCode:code || "ZA000001",
                    type:type || 1
                },'callback',function(rs){
                    callFn && callFn(rs);
                    if(rs.length === 0) return;
                    for(var i= 0,j=rs.length;i<j;i++){
                        rs[i].isCurrent=false;
                    }

                    if(silder === 'left'){
                        vm.leftSilderData=rs;

                        if(state){
                            vm.leftSilderData[0].isCurrent=true;
                            vm.currentArr.push(vm.leftSilderData[0]);
                        }
                    }else if(silder === 'right'){
                        vm.rightSilderData=rs;
                    }

                    afterFn && afterFn();

                },function(){
                    //alert('请检查网络！');
                });
            },
            //修改左侧数据
            changeLeftFn:function(index){
                var code=avalon(this).data('code'),
                    type=parseInt(avalon(this).data('type')),
                    data=vm.leftSilderData[index];

                vm.leftSilderData.forEach(function(el){
                    el.isCurrent=false;
                });

                data.isCurrent=true;
                vm.currentArr.set(type-1,data);
                vm.rightSilderData=[];

                vm.getNextAreaData('right',code,type+1)
            },
            //修改右侧数据
            changeRightFn:function(index){
                var code=avalon(this).data('code'),
                    type=parseInt(avalon(this).data('type'));

                //vm.currentArr.push(vm.rightSilderData[index]);

                if(type < 3){
                    vm.currentArr.push(vm.rightSilderData[index]);
                    vm.rightSilderData[index].isCurrent=true;
                    vm.leftSilderData=vm.rightSilderData;
                    vm.rightSilderData=[];

                    vm.getNextAreaData('right',code,type+1,'',function(rs){
                    });

                }else if(type === 3){

                    if(vm.currentArr.size() === 3){
                        vm.currentArr.removeAt(2);
                    }

                    vm.currentArr.push(vm.rightSilderData[index]);

                    vm.currentArr.forEach(function(el){
                        vm.area+=el.Name+' ';
                    });
                    vm.addressId=vm.rightSilderData[index].Code;
                    vm.isShow=false;
                    vm.areaCode=vm.rightSilderData[index].Code;
                }


            },
            //当前位置
            currentFn:function(index){
                var data=vm.currentArr[index],
                    type=parseInt(data.Type);


                vm.currentArr=vm.currentArr.slice(0,index+1);
                vm.getNextAreaData('left',data.ParenCode,type,'',function(){},function(){
                    vm.leftSilderData.forEach(function(el){
                        if(data.Code === el.Code){
                            el.isCurrent=true;
                        }
                    });
                });
                vm.getNextAreaData('right',data.Code,type+1);
            },
            //新增或者修改收货地址
            addOrSavaFn:function(){

                if(vm.ReceiverName === ''){
                    $.message({
                        msg:'收货人姓名必填!'
                    });

                    return;
                }
                if(!/^[1][2345678][0-9]{9}$/.test(vm.Phone)){
                    $.message({
                        msg:'请输入正确的联系方式!'
                    });

                    return;
                }
                if(vm.currentArr.size() === 0){
                    $.message({
                        msg:'收件人所在地区必选!'
                    });

                    return;
                }
                if(vm.DetailAddress === ''){
                    $.message({
                        msg:'详细地址必填!'
                    });

                    return;
                }

                vm.isLoading = true;

                //收货地址数据模型
                var json={
                    token:token,
                    ReceiverName:vm.ReceiverName,
                    Phone:vm.Phone,
                    DetailAddress:vm.DetailAddress,
                    Area:vm.areaCode,
                    IsDefault:vm.isDefalute,
                    // TownCode:vm.areaCode,
                    CountyCode:vm.currentArr[2].Code,
                    CountryCode:'ZA000001',
                    CityCode:vm.currentArr[1].Code,
                    ProvinceCode:vm.currentArr[0].Code
                };

                if(vm.code === ''){
                    vm.addAddress(json);
                }else{
                    json.Code=vm.code;
                    vm.modifyAddress(json);
                }
            },
            //新增收货地址
            addAddress:function(data){

                jsonp(host+'jsonp/ReceiveAddress_Insert_'+vm.version+'.js',data,'callback',function(rs){
                    if(rs.Success){
                        window.location.href = getLocalstorage('preAddHerf');
                        //window.history.back(-1);
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                    vm.isLoading = false;
                },function(){
                });

            },
            //保存收货地址
            modifyAddress:function(data){

                jsonp(host+'jsonp/ReceiveAddress_Update_'+vm.version+'.js',data,'callback',function(rs){
                    if(rs.Success){
                        window.location.href = getLocalstorage('preAddHerf');
                        //window.history.back(-1);
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                    vm.isLoading = false;
                },function(){
                });
            }

        });


        vm.getVersion();
        avalon.scan();
    });

})();