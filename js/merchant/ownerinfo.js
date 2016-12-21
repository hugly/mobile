/**
 * Created by hulgy on 16/6/11.
 */
(function(){

    'use strict';
    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:"ownerinfo",
            //版本号
            version:0,
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
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                });
            },
            clearTouch:function(e){
                e.stopPropagation();
            },
            //保存数据
            saveModel:function(){
                if(vm.shopInfoModel.ContactName === ''){
                    $.message({
                        msg:'请填写掌柜名称!'
                    });
                    return;
                }

                if(!/^[1][34578][0-9]{9}$/.test(vm.shopInfoModel.Phone)){
                    $.message({
                        msg:'请填写正确的电话!'
                    });
                    return;
                }

                if(vm.shopInfoModel.CertNo === ''){
                    $.message({
                        msg:'请填写掌柜身份证号码!'
                    });
                    return;
                }
                if($('.imgbox img').eq(1).attr('src') === ''){
                    $.message({
                        msg:'请上传掌柜身份证正面图片!'
                    });
                    return;
                }

                vm.shopInfoModel.CertImage = $('.imgbox img').eq(1).attr('path');
                vm.shopInfoModel.HalfBodyImage = $('.imgbox img').eq(0).attr('path');
                vm.shopInfoModel.BackImage = $('.imgbox img').eq(2).attr('path');

                jsonp(host+'/jsonp/SellerApply_SellerApplyRegister_'+vm.version+'.js',vm.shopInfoModel,'callback',function(rs){
                    if(rs.Success){
                        var data=rs.Data.Data;
                        window.location.href = 'submitsuccess.html?code='+data.Code+'&date='+data.LastAuditDate+'&state='+data.ShowStatus;
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                    //alert('请检查网络！');
                });
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