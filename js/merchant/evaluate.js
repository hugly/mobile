/**
 * Created by hulgy on 16/6/26.
 */
(function(){
    'use strict';
    var cropper;

    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:'evaluate',
            //版本号
            version:0,
            //质量分数
            qualitiScore:5,
            //物流分数
            logistScore:5,
            //服务分数
            severiceScore:5,
            //评价详情
            cancelResult:'',
            isUpShow:false,
            //订单code
            orderCode: $.getUrlParam('code'),
            imageList:[],
            imgPathList:[],
            isuploading:false,
            clearTouch:function(e){
                e.stopPropagation();
            },
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                });
            },
            //设置质量分数
            chooseQualityFn:function(index){
                vm.qualitiScore=index;
            },
            //设置物流分数
            chooselogistFn:function(index){
                vm.logistScore=index;
            },
            //设置服务分数
            choosesevericeFn:function(index){
                vm.severiceScore=index;
            },
            deleFn:function($remove){
                $remove();
            },
            //提交评价
            submitCancel:function(){
                if(vm.cancelResult === ''){
                    $.message({
                        msg:'还是说点什么吧!'
                    });
                    return;
                }
                var imageArr = [],
                    json={};

                    json={
                        token: token,
                        OrderCode:vm.orderCode,
                        desc:vm.cancelResult,
                        IsAnonymous:false,
                        qualityScore:vm.qualitiScore,
                        logistScore:vm.logistScore,
                        serviceScore:vm.severiceScore
                    };

                vm.imgPathList.forEach(function(el){
                    imageArr.push(el);
                });

                for(var i= 0,j= imageArr.length;i<j;i++){
                    // imageArr[i] = encodeURIComponent(imageArr[i]);
                    json['images['+i+']']= imageArr[i];
                }


                jsonp(host+'/jsonp/Order_InsertComment_'+vm.version+'.js',json,'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'提交评价成功!',
                            callback:function(){
                                window.history.back(-1);
                            }
                        });
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
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
                aspectRatio: 1/1
            };
            cropper = new Cropper(image, options);

            // Import image
            var inputImage = document.getElementById('imgfile');
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
                            vm.imageList.push(result.Data.WebPath);
                            vm.imgPathList.push(result.Data.Path);
                        }
                        vm.isuploading = false;
                    }
                });

            });
        }

    });

})();