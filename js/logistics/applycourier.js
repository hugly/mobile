/**
 * Created by hulgy on 20/10/2016.
 */
(function(){

    'use strict';
    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:"applycourier",
            //版本号
            version:0,
            area:'',
            //是否显示地址弹出层
            isShow:false,
            //是否是第一次进入
            isFirst:true,
            //地区导航数据模型
            currentArr:[],
            cityCurrentArr:[],
            //左侧数据模型
            leftSilderData:[],
            //右侧数据模型
            rightSilderData:[],
            topIsTwo:false,
            //服务城市
            serverCity:'',
            //右侧code
            rightCode:'',
            //左侧code
            leftCode:'',
            rightSerCode:'',
            leftSerCode:'',
            //店铺信息数据模型
            shopInfoModel:{
                token: token,
                ContactName:'',
                CertNo:'',
                Phone:'',
                Email:'',
                CertImage:'',
                HalfBodyImage:'',
                BackImage:''
            },
            isUpShow:false,
            areaCode:'',
            cityAreaCode:'',
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                });

                var now = new Date(),
                    max = new Date(now.getFullYear()-18, now.getMonth(), now.getDate());

                $('#brithDay').mobiscroll().date({
                    theme: 'mobiscroll',
                    display: 'bottom',
                    lang: 'zh',
                    maxDate: max,
                    onClose:function(valueText,inst){
                        console.log(valueText);
                        console.log(inst);
                    }
                });
            },
            clearTouch:function(e){
                e.stopPropagation();
            },
            closeFn:function(){
                vm.isShow = false;

                if(vm.topIsTwo){
                    vm.serverCity='';
                }else{
                    vm.area='';
                }
            },
            //修改显示状态
            changeShow:function(){
                vm.topIsTwo = false;
                vm.area='';
                vm.isShow=!vm.isShow;

                if(vm.leftCode !== ''){
                    if(vm.isShow){
                        vm.getNextAreaData('left',vm.leftCode,2,'',function(){
                            vm.getNextAreaData('right',vm.rightCode,3);
                        });
                        vm.isFirst=false;
                    }
                }else{
                    if(vm.isShow){
                        vm.leftCode='ZB110000';
                        vm.getNextAreaData('left','','',true,function(){
                            vm.getNextAreaData('right','ZB110000',2);
                        });
                        //ZB150000
                        vm.isFirst=false;
                    }
                }
            },
            //修改服务城市
            changeCity:function(){
                vm.topIsTwo = true;
                vm.serverCity='';
                vm.isShow=!vm.isShow;

                if(vm.leftSerCode !== ''){
                    if(vm.isShow){
                        vm.getNextAreaData('left','',1,'',function(){
                            vm.getNextAreaData('right',vm.rightSerCode,2);
                        });
                        vm.isFirst=false;
                    }
                }else {
                    if(vm.isShow){
                        vm.leftSerCode='ZB110000';
                        vm.getNextAreaData('left','','',true,function(){
                            vm.getNextAreaData('right','ZB110000',2);
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
                            if(vm.topIsTwo){
                                vm.cityCurrentArr.push(vm.leftSilderData[0]);
                            }else{
                                vm.currentArr.push(vm.leftSilderData[0]);
                            }
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

                if(vm.topIsTwo){
                    vm.leftSerCode = data.Code;
                }else{
                    vm.leftCode = data.Code;
                }

                if(vm.topIsTwo){
                    vm.cityCurrentArr.set(type-1,data);
                }else{
                    vm.currentArr.set(type-1,data);
                }



                vm.getNextAreaData('right',code,type+1)
            },
            //修改右侧数据
            changeRightFn:function(index){
                var code=avalon(this).data('code'),
                    type=parseInt(avalon(this).data('type'));

                if(vm.topIsTwo){
                    if(type < 2){
                        vm.getNextAreaData('right',code,type+1,'',function(rs){
                            if(rs.length > 0){

                                vm.cityCurrentArr.push(vm.rightSilderData[index]);
                                vm.rightSilderData[index].isCurrent=true;
                                vm.leftSilderData=vm.rightSilderData;
                                vm.rightSilderData=[];
                            }else{
                                vm.cityCurrentArr.forEach(function(el){
                                    vm.serverCity+=el.Name+' ';
                                });
                                vm.serverCity+=vm.rightSilderData[index].Name;
                                vm.addressId=vm.rightSilderData[index].Code;
                                vm.isShow=false;
                                vm.shopInfoModel.serTownCode = vm.rightSilderData[index].Code;
                            }
                        });

                    }else if(type === 2){
                        vm.cityCurrentArr.forEach(function(el){
                            vm.serverCity+=el.Name+' ';
                        });
                        vm.serverCity+=vm.rightSilderData[index].Name;
                        vm.addressId=vm.rightSilderData[index].Code;
                        vm.isShow=false;
                        vm.cityAreaCode=vm.rightSilderData[index].Code;
                        vm.rightSerCode = vm.rightSilderData[index].ParenCode;
                        vm.shopInfoModel.serTownCode = vm.rightSilderData[index].Code;
                    }
                }else{
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
                        vm.rightCode = vm.rightSilderData[index].ParenCode;
                        vm.shopInfoModel.TownCode = vm.rightSilderData[index].Code;
                    }
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
            //保存数据
            saveModel:function(){
                console.log(vm.shopInfoModel);
                // if(vm.shopInfoModel.ContactName === ''){
                //     $.message({
                //         msg:'请填写掌柜名称!'
                //     });
                //     return;
                // }
                //
                // if(!/^[1][34578][0-9]{9}$/.test(vm.shopInfoModel.Phone)){
                //     $.message({
                //         msg:'请填写正确的电话!'
                //     });
                //     return;
                // }
                //
                // if(vm.shopInfoModel.CertNo === ''){
                //     $.message({
                //         msg:'请填写掌柜身份证号码!'
                //     });
                //     return;
                // }
                // if($('.imgbox img').eq(1).attr('src') === ''){
                //     $.message({
                //         msg:'请上传掌柜身份证正面图片!'
                //     });
                //     return;
                // }
                //
                // vm.shopInfoModel.CertImage = $('.imgbox img').eq(1).attr('path');
                // vm.shopInfoModel.HalfBodyImage = $('.imgbox img').eq(0).attr('path');
                // vm.shopInfoModel.BackImage = $('.imgbox img').eq(2).attr('path');
                //
                // jsonp(host+'/jsonp/SellerApply_SellerApplyRegister_'+vm.version+'.js',vm.shopInfoModel,'callback',function(rs){
                //     if(rs.Success){
                //         var data=rs.Data.Data;
                //         window.location.href = 'submitsuccess.html?code='+data.Code+'&date='+data.LastAuditDate+'&state='+data.ShowStatus;
                //     }else{
                //         $.message({
                //             msg:rs.Msg
                //         });
                //     }
                // },function(){
                //     //alert('请检查网络！');
                // });
            },
            deleImg:function(){
                var obj = $(this),
                    mainobj = $(this).closest('.upload-item');

                mainobj.find('.uploadbox').show();
                mainobj.find('.imgbox').hide();
                mainobj.find('.imgbox img').attr({
                    src:''
                });
                mainobj.find('.fileinput').val('');
            }
        });

        vm.getVersion();
        avalon.scan();

        init();
        var cropper;
        function init(){
            var Cropper = window.Cropper;
            var container = document.querySelector('.imgcontainer');
            var image = container.getElementsByTagName('img').item(0);
            var options = {
                // aspectRatio: 4/3,
                background:false,
                modal:false,
                guides:false,
                autoCropArea:1,
                autoCrop:false
            };
            cropper = new Cropper(image, options);

            // Import image
            var inputImage = document.getElementsByClassName('fileinput');
            var URL = window.URL || window.webkitURL;
            var blobURL;
            var filename = '';
            var obj=null;
            var inputIndex = 0;

            if (URL) {
                for(var i= 0,j=inputImage.length;i<j;i++){
                    (function(index){
                        inputImage[index].onchange = function () {
                            obj = inputImage[index];
                            inputIndex = index;
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
                    })(i);
                }
            } else {
                inputImage.disabled = true;
                inputImage.parentNode.className += ' disabled';
            }

            $(".submitimg").on("touchstart", function(e) {
                var data = cropper.getCroppedCanvas().toDataURL('image/jpeg');

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
                            $('.upload-item').eq(inputIndex).find('.uploadbox').hide();
                            $('.upload-item').eq(inputIndex).find('.imgbox').show();
                            $('.upload-item').eq(inputIndex).find('.imgbox img').attr({
                                src:result.Data.WebPath,
                                path:result.Data.Path
                            });
                        }
                    }
                });

            });
        }


    });



})();