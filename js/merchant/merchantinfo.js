/**
 * Created by hulgy on 16/6/11.
 */
(function(){

    'use strict';
    var cropper;


    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:"maininfo",
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
            //上传图片
            uploadImg:'',
            //是否弹出遮罩层
            isUpShow:false,
            hasImage:false,
            //是否上传成功
            isUploadSuccess:false,
            isuploading:false,
            //店铺信息数据模型
            shopInfoModel:{
                token: token,
                CompanyName:'',
                TownCode:'',
                CompanyAddress:'',
                RegistrationNumber:'',
                RegistrationImage:'',
                CompanyNature:'1',
                EmployeeNum:'10-20人',
                CompanyType:'民营',
                Tel:'',
                WashSaleType:''
            },
            isNexting:false,
            clearTouch:function(e){
                e.stopPropagation();
            },
            washTypeList:[
                {id:'1',name:'干洗熨烫',isSelect:false},
                {id:'2',name:'清洗保养',isSelect:false},
                {id:'3',name:'奢侈护理',isSelect:false},
                {id:'4',name:'裁剪维修',isSelect:false}
            ],
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    if(vm.code){
                        vm.getDetailByCode();
                    }
                });
            },
            changeWashTypeFn:function(el){
                el.isSelect = !el.isSelect;

                var arr=[];
                vm.washTypeList.forEach(function(el){
                    if(el.isSelect){
                        arr.push(el.id);
                    }
                });

                vm.shopInfoModel.WashSaleType = arr.join(',');

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
                    vm.rightCode=data.TownCode;
                    vm.leftCode=data.CityCode;

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
                        vm.getNextAreaData('left',vm.leftCode,3,'',function(){
                            vm.getNextAreaData('right',vm.rightCode,4);
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

                vm.getNextAreaData('right',code,type+1)
            },
            //修改右侧数据
            changeRightFn:function(index){
                var code=avalon(this).data('code'),
                    type=parseInt(avalon(this).data('type'));

                if(type < 3){
                    vm.getNextAreaData('right',code,type+1,'',function(rs){
                        if(rs.length > 0){

                            vm.currentArr.push(vm.rightSilderData[index]);
                            vm.rightSilderData[index].isCurrent=true;
                            vm.leftSilderData=vm.rightSilderData;
                            vm.rightSilderData=[];
                        }else{
                            vm.currentArr.forEach(function(el){
                                vm.area+=el.Name+' ';
                            });
                            vm.area+=vm.rightSilderData[index].Name;
                            vm.addressId=vm.rightSilderData[index].Code;
                            vm.isShow=false;
                            vm.areaCode=vm.rightSilderData[index].Code;
                            vm.shopInfoModel.TownCode = vm.rightSilderData[index].Code;
                        }
                    });

                }else if(type === 3){
                    vm.currentArr.forEach(function(el){
                        vm.area+=el.Name+' ';
                    });
                    vm.area+=vm.rightSilderData[index].Name;
                    vm.addressId=vm.rightSilderData[index].Code;
                    vm.isShow=false;
                    vm.areaCode=vm.rightSilderData[index].Code;
                    vm.shopInfoModel.TownCode = vm.rightSilderData[index].Code;
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
            deleimage:function(){
                vm.uploadImg = '';
                vm.hasImage = false;
                vm.shopInfoModel.RegistrationImage = '';
            },
            //保存数据
            saveModel:function(){
                //shopInfoModel:{
                //    token: token,
                //        CompanyName:'',
                //        TownCode:'',
                //        CompanyAddress:'',
                //        RegistrationNumber:'',
                //        RegistrationImage:'',
                //        CompanyNature:'1',
                //        EmployeeNum:'10-20人',
                //        CompanyType:'民营',
                //        Tel:''
                //},

                if(vm.shopInfoModel.CompanyName === ''){
                    $.message({
                        msg:'请填写店铺名称!'
                    });

                    return;
                }

                if(vm.shopInfoModel.TownCode === ''){
                    $.message({
                        msg:'请选择店铺地址!'
                    });

                    return;
                }

                if(vm.shopInfoModel.CompanyAddress === ''){
                    $.message({
                        msg:'请填写详细地址信息!'
                    });

                    return;
                }

                if(vm.shopInfoModel.Tel === ''){
                    $.message({
                        msg:'店铺电话必填!'
                    });

                    return;
                }

                if(!/^(?:0?1)[34578]\d{9}$|^(0[1-9]\d{1,2}\-?)?[1-9]\d{6,7}$/.test(vm.shopInfoModel.Tel)){
                    $.message({
                        msg:'请填写正确的店铺电话!'
                    });

                    return;
                }

                if(vm.shopInfoModel.RegistrationNumber === ''){
                    $.message({
                        msg:'请填写营业执照编号!'
                    });

                    return;
                }

                if(vm.shopInfoModel.RegistrationImage === ''){
                    $.message({
                        msg:'请上传营业执照照片!'
                    });

                    return;
                }

                if(vm.shopInfoModel.WashSaleType === ''){
                    $.message({
                        msg:'请选择销售属性!'
                    });

                    return;
                }

                vm.isNexting = true;
                jsonp(host+'/jsonp/SellerApply_ToNext_'+vm.version+'.js',vm.shopInfoModel,'callback',function(rs){
                    if(rs.Success){
                        window.location.href = 'ownerinfo.html';
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                    vm.isNexting = false;
                },function(){
                    //alert('请检查网络！');
                });
            }

        });

        init();
        vm.getVersion();
        avalon.scan();

        function init(){
            var Cropper = window.Cropper;
            var container = document.querySelector('.imgcontainer');
            var image = container.getElementsByTagName('img').item(0);
            var options = {
                // aspectRatio: 1/1
                background:false,
                modal:false,
                guides:false,
                autoCropArea:1,
                autoCrop:false
            };
            cropper = new Cropper(image, options);

            // Import image
            var inputImage = document.getElementById('fileinput');
            var URL = window.URL || window.webkitURL;
            var blobURL;
            var filename = '';

            if (URL) {
                inputImage.onchange = function () {
                    var files = this.files;
                    var file;
                    if (cropper && files && files.length) {
                        file = files[0];
                        filename = file.name;

                        if (/^image\/\w+/.test(file.type)) {
                            blobURL = URL.createObjectURL(file);
                            cropper.reset().replace(blobURL);
                            inputImage.value = null;

                            vm.isUpShow=!vm.isUpShow;
                        } else {
                            //window.alert('Please choose an image file.');
                            $.dialog({
                                msg:'请选择正确的图片类型!'
                            });
                        }
                    }
                };
            } else {
                inputImage.disabled = true;
                inputImage.parentNode.className += ' disabled';
            }

            $(".submitimg").on("touchstart", function(e) {
                var data = cropper.getCroppedCanvas().toDataURL('image/jpeg');
                vm.isuploading = true;
                $.ajax({
                    type: "POST",
                    url: "http://m.wziwash.com/Home/ImageUpload", //跨域URL
                    dataType: "json",
                    data: {
                        file: data.split(',')[1] ,
                        fileName:filename
                    },
                    success: function (result) {
                        if(result.Success){
                            vm.isUpShow = false;
                            vm.shopInfoModel.RegistrationImage = result.Data.Path;
                            vm.uploadImg = result.Data.WebPath;
                            vm.hasImage = true;
                            vm.isuploading = false;
                        }
                    }
                });

            });
        }

    });



})();