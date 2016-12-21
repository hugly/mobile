/**
 * Created by hulgy on 16/8/17.
 */

(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'activityrank',
            version:'',
            nowPageIndex:1,
            maxPageNum:1,
            prevRankList:[],
            rankList:[],
            allDataModel:[],
            d:0,
            h:0,
            m:0,
            s:0,
            total:0,
            nowDataModel:null,
            firstData:[],
            secondData:[],
            thirdData:[],
            isFirst:true,
            nowIndex:0,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getPrevList();
                    vm.getNowActivity();
                    vm.getNowList(true);
                });
            },
            getPrevList:function(){
                jsonp(host+'/jsonp/StudentActivity_GetAllActivity_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        var data = rs.Data;

                        for(var i=0,j=data.length;i<j;i++){
                            data[i].isSelect = false;
                        }

                        vm.allDataModel = data;
                        vm.total = data.length + 1;
                    }else{
                        $.message({
                            msg:rs.Msg
                        });
                    }
                },function(){
                });
            },
            //修改选中状态
            changeStatus:function(type,el,$index){
                var now = $index ;
                if(now <= 0){ now = 0; }
                vm.nowIndex = now;
                if(type){
                    vm.isFirst = false;
                    vm.allDataModel.forEach(function(el){
                        el.isSelect = false;
                    });
                    vm.nowDataModel = vm.allDataModel[$index];
                    el.isSelect = !el.isSelect;
                    vm.sortingData();
                }else{
                    vm.isFirst = true;
                    vm.allDataModel.forEach(function(el){
                        el.isSelect = false;
                    });
                }
            },
            //整理数据
            sortingData:function(){
                vm.firstData = [];
                vm.secondData = [];
                vm.thirdData = [];

                var data = vm.nowDataModel.User;

                if(data.size() === 0) return;
                data.forEach(function(el){
                    el.Phone = el.Phone.substring(0,3)+"****"+el.Phone.substring(7,11);
                    if(el.Level === 1){
                        vm.firstData.push(el);
                    }else if(el.Level === 2){
                        vm.secondData.push(el);
                    }else if(el.Level === 3){
                        vm.thirdData.push(el);
                    }
                });
            },
            //获取当前活动
            getNowActivity:function(){
                jsonp(host+'/jsonp/StudentActivity_GetNowActivity_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        var endTime = parseInt(rs.Data._EndDatetime)*1000;

                        setInterval(function(){
                            var startTime = new Date().getTime(),
                                EndingTime = endTime,
                                time = EndingTime - startTime;
                            vm.daoTime(parseInt(time/1000));
                        },1000);

                    }
                },function(){
                });
            },
            daoTime:function(s){
               vm.d=parseInt(s/86400);
                s%=86400;

                vm.h=parseInt(s/3600);
                s%=3600;

                vm.m=parseInt(s/60);
                s%=60;

                vm.s = s;

            },
            //获取本期记录
            getNowList:function(type){
                jsonp(host+'/jsonp/StudentActivity_PagingNow_'+vm.version+'.js',{
                    token:token,
                    PageIndex:vm.nowPageIndex,
                    PageSize:10
                },'callback',function(rs){
                    if(rs.Success){
                        if(type){
                            var data = rs.Data;
                            for(var i= 0,j=data.length;i<j;i++){
                                data[i].Phone = data[i].Phone.substring(0,3)+"****"+data[i].Phone.substring(7,11);
                            }

                            vm.rankList = data;
                        }else{
                            var data = rs.Data;

                            for(var i= 0,j=data.length;i<j;i++){
                                data[i].Phone = data[i].Phone.substring(0,3)+"****"+data[i].Phone.substring(7,11);
                                vm.rankList.push(data[i]);
                            }
                        }

                        vm.maxPageNum = rs.TotalPages;
                    }
                },function(){
                });
            }
        });


        var a = new $.scrollLoad({
            mainDiv: $(".rankbox ul"),
            buttonLength: 120,
            ajaxFn: function (){
                vm.nowPageIndex++;

                if(vm.nowPageIndex <= vm.maxPageNum){
                    vm.getNowList(false);
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