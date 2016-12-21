/**
 * Created by hulgy on 16/7/22.
 */
(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'wallet',
            version:'',
            loadingImgShow:true,
            account:[],
            walletType:-1,
            nowPageIndex:1,
            maxPageNum:1,
            IncomeOutTotal:0,
            IncomeinTotal:0,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getAllPayInfo();
                    vm.getBriefInfo(true);
                });
            },
            getWalletDetail:function(type,hasScroll){
                vm.walletType = type;
                vm.getBriefInfo(hasScroll);
            },
            //获取总支出和总收入
            getAllPayInfo:function(){
                jsonp(host+'/jsonp/PayUser_GetReportBySsoUserCode_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data;

                        if(data){
                            for(var i=0,j=data.length;i<j;i++){
                                if(data[i].IncomeOutType === 1){
                                    vm.IncomeinTotal = data[i].TotalAmount;
                                }else if(data[i].IncomeOutType === 2){
                                    vm.IncomeOutTotal = data[i].TotalAmount;
                                }
                            }

                        }
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            //获取简略信息
            getBriefInfo:function(type){
                jsonp(host+'/jsonp/PayUser_GetPageBySsoUserCode_'+vm.version+'.js',{
                    token:token,
                    incomeOutType:vm.walletType,
                    Page:vm.nowPageIndex,
                    PageSize:12
                },'callback',function(rs){
                    var data = rs.Data;
                    vm.loadingImgShow = false;
                    if(data){
                        for(var i = 0,j=data.length;i<j;i++){
                            if(!type){
                                vm.account.push(data[i]);
                            }
                        }
                        if(type){
                            vm.account=rs.Data;
                        }
                    }

                    vm.maxPageNum = rs.TotalPages;

                },function(){
                });
            }

        });

        var a = new $.scrollLoad({
            mainDiv: $(".walletdetail"),
            buttonLength: 50,
            ajaxFn: function (){
                vm.nowPageIndex++;

                if(vm.nowPageIndex <= vm.maxPageNum){
                    vm.getBriefInfo(false);
                }else{
                    vm.nowPageIndex = vm.maxPageNum;
                }
                a.ajaxSuccess();
            }
        });
        vm.getVersion();
        avalon.scan();
    });

})();