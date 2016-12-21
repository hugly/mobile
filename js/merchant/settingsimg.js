/**
 * Created by hulgy on 16/8/23.
 */
(function(){
    'use strict';
    var cropper;

    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:'settingsimg',
            //版本号
            version:0,
            isUpShow:false,
            shopCode: $.getUrlParam('shopCode') || '',
            isSave:true,
            uploading:false,
            defaultImage:'',
            imageList:[],
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getSettingsInfo();
                });
            },
            clearTouch:function(e){
                e.stopPropagation();
            },
            deleImageItem:function($remove){
                $remove();
            },
            deleimage:function(){
                vm.defaultImage = '';
            },
            //获取店铺详情
            getSettingsInfo:function(){
                //http://m.wziwash.com/jsonp/Shop_ShopInfo_9.js?token=3dd9jddd84jwe3&ShopCode=2016052222023923914&callback=jsonp032275929534429304
                jsonp(host+'/jsonp/Shop_ShopInfo_'+vm.version+'.js',{
                    token: token,
                    ShopCode:vm.shopCode
                },'callback',function(rs){
                    vm.defaultImage = rs.BaseInfo.Shop.DefaultImage;
                    var images=rs.BaseInfo.Shop.Images;

                    for(var i = 0,j=images.length;i<j;i++){
                        vm.imageList.push(images[i].Path);
                    }
                },function(){

                });
            },
            saveShopDetail:function(){

                var imageArr = [],
                    json={};

                json={
                    token: token,
                    'Images.DefaultImage':vm.defaultImage
                };


                vm.imageList.forEach(function(el){
                    imageArr.push(el);
                });

                for(var i= 0,j= imageArr.length;i<j;i++){
                    // imageArr[i] = encodeURIComponent(imageArr[i]);
                    json['Images.Images\['+i+'\].Path']= imageArr[i];
                }

                vm.isSave = false;

                jsonp(host+'/jsonp/Shop_UpdateShopImage_'+vm.version+'.js',json,'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'保存成功!',
                            callback:function(){
                                window.location.href = 'mymerchant.html';
                            }
                        });
                    }else{
                        vm.isSave = true;
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            }
        });

        vm.getVersion();
        avalon.scan();

        init();
        function init(){
            var Cropper = window.Cropper;
            var container = document.querySelector('.imgcontainer');
            var image = container.getElementsByTagName('img').item(0);
            var options = {
                aspectRatio: 4/3
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
                vm.uploading = true;
                var data = cropper.getCroppedCanvas().toDataURL('image/jpeg');
                $(inputImage[inputIndex]).val('');

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
                            vm.uploading = false;
                            vm.isUpShow = false;

                            if(inputIndex === 0){
                                vm.defaultImage = result.Data.WebPath;
                            }else if(inputIndex === 1){
                                vm.imageList.push(result.Data.WebPath)
                            }

                        }
                    }
                });

            });
        }

    });

})();