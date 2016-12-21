/**
 * Created by hulgy on 16/8/24.
 */

(function(){

    'use strict';
    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:"trendadd",
            //版本号
            version:0,
            isUpShow:false,
            trendText:'',
            imageArr:[],
            imgPathArr:[],
            isLoading:false,
            isuploading:false,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                });
            },
            clearTouch:function(e){
                e.stopPropagation();
            },
            deleFn:function(remove){
                remove();
            },
            //保存数据
            saveTrendFn:function(){

                if(vm.trendText === '' || vm.imageArr.size() === 0){
                    $.message({
                        msg:'请添加动态文字描述或者图片!'
                    });

                    return;
                }

                vm.isLoading = true;
                var json={
                    token:token,
                    name:vm.trendText,
                    desc:vm.trendText
                };

                vm.imgPathArr.forEach(function(el,$index){
                    json['images['+$index+']'] = el;
                });

                jsonp(host+'/jsonp/ShopMessage_Publish_'+vm.version+'.js',json,'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'动态发布成功!',
                            callback:function(){
                                window.history.back(-1);
                            }
                        });

                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                    vm.isLoading = false;
                },function(){
                    //alert('请检查网络！');
                });
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
                background:false,
                modal:false,
                guides:false,
                autoCropArea:1,
                autoCrop:false
            };
            cropper = new Cropper(image, options);

            // Import image
            var inputImage = document.getElementById('addimage');
            var URL = window.URL || window.webkitURL;
            var blobURL;
            var filename = '';
            var obj=null;
            var inputIndex = 0;

            if (URL) {
                inputImage.onchange = function () {
                    obj = inputImage;
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
                uploadimage();
            });

            function uploadimage(){
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
                            vm.imageArr.push(result.Data.WebPath);
                            vm.imgPathArr.push(result.Data.Path);
                        }
                        vm.isuploading = false;
                    }
                });
            }
        }


    });



})();