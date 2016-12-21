/**
 * Created by hulgy on 16/7/24.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'yibi',
            version:'',
            allPoint:0,
            scoreList:[],
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getAllScore();
                    vm.getScoreDetail();
                });
            },
            //获取攻略信息
            getAllScore:function(){
                jsonp(host+'/jsonp/Point_GetMyPointSsoUserCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        vm.allPoint = rs.Data;
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            //获取积分详情
            getScoreDetail:function(){
                jsonp(host+'/jsonp/Point_GetPointDetailByPage_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        //vm.allPoint = rs.Data;
                        vm.scoreList = rs.Data;
                    }else{
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
    });

})();