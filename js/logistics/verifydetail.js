/**
 * Created by hulgy on 24/09/2016.
 */
(function(){
    'use strict';
    var cropper;

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"verifydetail",
            //版本号
            version:0,
            //集合信息
            account:{},
            left:0,
            isUpShow:false,
            isuploading:false,
            perDataModel:[],
            imageList:[],
            imgPathList:[],
            code:$.getUrlParam('code'),
            tCode:$.getUrlParam('tcode'),
            oCode:$.getUrlParam('ocode'),
            sCode:$.getUrlParam('scode'),
            verifyDataModel:[],
            isCheck:$.getUrlParam('isCheck'),
            remark:'',
            isSubmit:false,
            //获取版本号
            getVersion:function(){
                if(vm.isCheck == 'false'){
                    vm.isCheck = false;
                }else if(vm.isCheck == 'true'){
                    vm.isCheck = true;
                }
                getBaseVersion(function(rs){
                    vm.version=rs;
                    //vm.getCheckPer();
                    vm.getDetailByCode();
                });
            },
            changeFn:function(num){
                vm.left = num;
            },
            //获取所有的核实属性
            getCheckPer:function(){
                jsonp(host+'/jsonp/Order_GetAllCheckAttr_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data;
                        for(var i=0,j=data.length;i<j;i++){
                            data[i].IsCheckRight = false;
                        }
                        vm.perDataModel = rs.Data;
                        if(vm.isCheck){
                            vm.getDetailByCode();
                        }
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            //根据scode 查询详细信息
            getDetailByCode:function(){
                jsonp(host+'/jsonp/Order_GetCheckListBySubOrderCode_'+vm.version+'.js',{
                    token:token,
                    subOrderCode:vm.sCode,
                    Code:vm.code
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data;

                        vm.perDataModel = data.Groups;
                        vm.remark = data.Remark;

                        vm.imageList = data.ShowImages || [];
                        vm.imgPathList = data.Images || [];
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            checkperFn:function(el){
                el.IsCheckRight = !el.IsCheckRight;
            },
            deleImg:function(remove){
                remove();
            },
            submitVerFn:function(){
                var json={
                    token:token,
                    Remark:vm.remark,
                    Code:vm.code,
                    SubOrderCode:vm.sCode,
                    OCode:vm.oCode,
                    TCode:vm.tCode
                };

                vm.perDataModel.forEach(function(ele){
                    if(ele.CheckItems){
                        ele.CheckItems.forEach(function(el){
                            json['CheckItems['+(el.Code || el.CheckAttrCode)+']']=el.IsCheckRight;
                        });
                    }
                });

                vm.imgPathList.forEach(function(el,$index){
                    json['images['+$index+']']= el;
                });

                vm.isSubmit = true;
                jsonp(host+'/jsonp/Order_InsertCheckList_'+vm.version+'.js',json,'callback',function(rs){
                    if(rs.Success){
                        $.message({
                            msg:'核实成功',
                            callback:function(){
                                window.history.go(-1);
                            }
                        });
                        vm.isSubmit = true;
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                        vm.isSubmit = false;
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
                // aspectRatio: 1 / 1,
                background:false,
                modal:false,
                guides:false,
                autoCropArea:1,
                autoCrop:false
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
                var data = cropper.getCroppedCanvas().toDataURL('image/jpeg',.1);
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