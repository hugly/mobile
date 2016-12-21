/**
 * Created by hulgy on 16/6/27.
 */
/**
 * Created by hulgy on 16/6/27.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){

        var vm=avalon.define({
            $id:'service',
            //版本号
            version:0,
            //服务数据模型
            serviceData:[],
            baseDataModel:[],
            serviceDataModel:[],
            loadingImgShow:true,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getAllService();
                });
            },
            //提交记录工作
            getAllService:function(){
                jsonp(host+'jsonp/Shop_GetBusiness_'+vm.version+'.js',{
                    token: token
                },'callback',function(rs){
                    vm.loadingImgShow = false;
                    var baseData=rs.BaseBusiness,
                        serData=rs.Service;
                    for(var i= 0,j=baseData.length;i<j;i++){
                        baseData[i].jump=false;
                    }

                    for(var n= 0,m=serData.length;n<m;n++){
                        serData[n].jump=true;
                    }
                    vm.baseDataModel = baseData;
                    vm.serviceDataModel = serData;
                    // vm.serviceData=baseData;
                    // vm.serviceData.pushArray(serData);
                },function(){
                });
            },
            //立即申请
            applyNow:function(index,el){
                jsonp(host+'jsonp/Shop_SubmitBusinessApply_'+vm.version+'.js',{
                    token: token,
                    Type:el.Type,
                    Value:el.Value
                },'callback',function(rs){
                    if(rs.Success){
                        vm.serviceData[index].IsApply=2;
                    }
                },function(){
                });
            },
            //跳转申请
            jumpApply:function(el){
                if(el.IsApply !== 3)return;
                window.location.href='fnservicesApply.html?IsApply='+el.IsApply+'&Code='+el.Code+'&Content='+el.Content+'&Desc='+el.Desc+'&Image='+el.Image+'&Logo='+el.Logo+'&Name='+el.Name+'&Type='+el.Type+'&Value='+el.Value;
            }
        });

        vm.getVersion();
        avalon.scan();
    });

})();