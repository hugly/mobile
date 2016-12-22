/**
 * Created by hulgy on 21/12/2016.
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
            brandName:'',
            color:'',
            showLabel:false,
            //获取版本号
            getVersion:function(){
                if(vm.isCheck == 'false'){
                    vm.isCheck = false;
                }else if(vm.isCheck == 'true'){
                    vm.isCheck = true;
                }
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getCheckPer();
                    //vm.getDetailByCode();
                });
            },
            changeFn:function(num){
                vm.left = num;
            },
            checkmoreFn:function(){
                vm.showLabel = !vm.showLabel;
            },
            //获取所有的核实属性
            getCheckPer:function(){
                jsonp(host+'jsonp/Logistics_GetCheckLables_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data;
                        for(var i=0,j=data.length;i<j;i++){
                            var json ={
                                index:i,
                                code:data[i],
                                IsCheckRight:false
                            };
                            vm.perDataModel.push(json);
                        }
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
                jsonp(host+'/jsonp/Logistics_GetCheckByCode_'+vm.version+'.js',{
                    token:token,
                    code:vm.code
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data,
                            checkData = data.CheckLable;

                        //vm.perDataModel = data.Groups;
                        vm.brandName = data.BrandName;
                        vm.remark = data.Remark;
                        vm.color = data.Color;

                        if(checkData){
                            vm.perDataModel.forEach(function(el){
                                for(var i=0,j=checkData.length;i<j;i++){
                                    if(el.code === checkData[i]){
                                        el.IsCheckRight = true;
                                    }
                                }
                            });
                        }

                        init(data.Images);

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
            cancelUploadFn:function(){
                vm.isUpShow = false;
            },
            submitVerFn:function(){
                var obj = $('#roomImgWrap .up-img-list'),
                    imgaArr = [];

                if(vm.brandName === ''){
                    $.message({
                        msg:'衣物品牌名称为必填项!'
                    });
                    return;
                }

                if(vm.color === ''){
                    $.message({
                        msg:'衣物颜色为必填项!'
                    });
                    return;
                }

                var json={
                    token:token,
                    BrandName:vm.brandName,
                    Color:vm.color,
                    Remark:vm.remark,
                    Code:vm.code
                };
                var index = 0;
                vm.perDataModel.forEach(function(ele){
                    if(ele.IsCheckRight){
                        json['CheckLable['+index+']']=ele.code;
                        index ++;
                    }
                });


                obj.find('.up-img').each(function($index){
                    json['Images['+$index+']']= $(this).attr('data-hash');
                });

                // vm.imageList.forEach(function(el,$index){
                //     json['Images['+$index+']']= el;
                // });

                vm.isSubmit = true;
                jsonp(host+'/jsonp/Logistics_UpdateCheckList_'+vm.version+'.js',json,'callback',function(rs){
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

        vm.getVersion();
        avalon.scan();

        function init(data){
            userTouch.compressUpload["#roomImgWrap" || "0"] = new userTouch.CompressUpload({
                wrapperSlter : "#roomImgWrap",
                maxNum       : +"10"   || 10,     // 一共可以上传多少张
                uploadUrl    : 'http://m.wziwash.com/CommonResource/UploadImage',
                maxWidth     : ""  || 640,    // 图片的最大宽度，超出会压缩
                maxHeight    : "" || 640,    // 图片的最大高度，超出会压缩
                onceMaxNum   : "3",           // 一次性最多同时上传多少张
                data:data
            });
        }
    });

})();