/**
 * Created by hulgy on 18/11/2016.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'disindex',
            version:'',
            account:0,
            monthIncome:0,
            totalIncome:0,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getTotalInfo();
                    vm.getPersonInfo();
                    vm.getBriefInfo();
                });
            },
            getTotalInfo:function(){
                jsonp(host+'jsonp/BI_GetTotalIncome_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    vm.monthIncome = rs.MonthIncome;
                    vm.totalIncome = rs.TotalIncome;
                },function(){
                });
            },
            getBriefInfo:function(){
                jsonp(host+'/jsonp/MyAssets_GetMyAssets_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    vm.account=rs.Data.Balance;
                },function(){
                });
            },
            getPersonInfo:function(){
                jsonp(host+'jsonp/Distributor_GetBySSOUserCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    console.log(rs);
                    if(rs.Success){
                        if(!rs.hasOwnProperty('Data')){
                            window.location.href = 'discenter.html';
                        }
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