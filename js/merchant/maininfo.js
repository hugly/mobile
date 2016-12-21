/**
 * Created by hulgy on 16/6/24.
 */
(function(){
    'use strict';
    var cropper;

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:'maininfo',
            //上传图片
            uploadImg:'',
            //是否弹出遮罩层
            isShow:false,
            //是否上传成功
            isUploadSuccess:false,
            clearTouch:function(e){
                e.stopPropagation();
            },
            submitImageFn:function(){

                var data=cropper.getData();

            }
        });
        init();
        avalon.scan();

        function init(){
            var Cropper = window.Cropper;
            var container = document.querySelector('.imgcontainer');
            var image = container.getElementsByTagName('img').item(0);
            var options = {
                // aspectRatio: 1 / 1
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

            if (URL) {
                inputImage.onchange = function () {
                    var files = this.files;
                    var file;

                    if (cropper && files && files.length) {
                        file = files[0];

                        if (/^image\/\w+/.test(file.type)) {
                            blobURL = URL.createObjectURL(file);
                            cropper.reset().replace(blobURL);
                            inputImage.value = null;

                            vm.isShow=!vm.isShow;
                        } else {
                            window.alert('Please choose an image file.');
                        }
                    }
                };
            } else {
                inputImage.disabled = true;
                inputImage.parentNode.className += ' disabled';
            }

            //$(".submitimg").on("touchstart", function(e) {
            //
            //    var data=cropper.getData();
            //
            //    console.log(data);
            //
            //    return false;
            //});
        }
    });
})();