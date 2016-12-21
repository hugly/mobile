/**
 * Created by hulgy on 16/6/9.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:'accountmanage',
            //版本号
            version:0,
            //用户信息
            userInfo:{
                HeadImage:'',
                Name:'',
                Sex:'',
                BirthDay:'',
                Tel:'',
                NickName:''
            },
            showCode:false,
            isUpShow:false,
            uploading:false,
            isloading:false,
            hreflink:window.location.href,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getUserInfo();
                });
            },
            changeShowCode:function(){
                vm.showCode = !vm.showCode;
            },

            clearTouch:function(e){
                e.stopPropagation();
            },
            //获取用户详细信息
            getUserInfo:function(){
                jsonp(host+'/jsonp/User_GetUserInfoBySsoUserCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        vm.userInfo=rs.Data;
                        vm.userInfo.Tel = rs.Data.Tel;

                        var oDate=new Date();
                        document.getElementById('birdate').valueAsDate = time2stamp(rs.Data.BirthDay);
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            goBindFn:function(){
                window.location.href = 'bindPhone.html';
            },
            //更新用户信息
            saveUserFn:function(){
                vm.isloading = true;
                var json=JSON.parse(JSON.stringify(vm.$model)).userInfo;

                json.Sex = parseInt(json.Sex);
                json.BirthDay = document.getElementById('birdate').value;
                json.token = token;
                json.HeadImage = $('.spec img').attr('pathsrc') || JSON.parse(JSON.stringify(vm.$model)).userInfo.HeadImage;

                jsonp(host+'/jsonp/User_Update_'+vm.version+'.js',json,'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'保存成功!',
                            callback:function(){
                                window.location.href = 'person.html';
                            }
                        });
                    }else{
                        $.message({
                            msg:rs.Msg
                        })
                        vm.isLoading = false;
                    }
                },function(){
                });
            }
        });

        init();
        vm.getVersion();
        avalon.scan();

        var cropper;
        function init(){
            var Cropper = window.Cropper;
            var container = document.querySelector('.imgcontainer');
            var image = container.getElementsByTagName('img').item(0);
            var options = {
                aspectRatio: 1/1
            };
            cropper = new Cropper(image, options);

            // Import image
            var inputImage = document.getElementById('headimg');
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
                vm.uploading = true;
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
                            vm.uploading = false;
                            vm.HeadImage = result.Data.WebPath;
                            vm.userInfo.HeadImage = result.Data.WebPath;
                            $(inputImage).val('');
                            $('.spec img').attr({
                                src:result.Data.WebPath,
                                pathsrc:result.Data.Path
                            });
                        }
                    }
                });

            });
        }

    });
})();