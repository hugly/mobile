/**
 * Created by hulgy on 22/09/2016.
 */
(function(){
    'use strict';

    var dayDir={
        1:'周一',
        2:'周二',
        3:'周三',
        4:'周四',
        5:'周五',
        6:'周六',
        0:'周日'
    };

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"datetime",
            //版本号
            version:0,
            left:0,
            dateTime:'',
            showDateTime:'',
            endTime:parseInt(new Date().getHours()+1)+':00:00',
            showEndTime:parseInt(new Date().getHours())+':00-'+parseInt(new Date().getHours()+1)+':00',
            dayList:[],
            //将url参数转化为arr
            urlData:transUrl2List(),
            //url参数数据模型
            searchData:'',
            nowDay: parseInt(new Date().getDate()),
            nowHour: parseInt(new Date().getHours()),
            timeArr:[
                {
                    nowTimeIndex:9,
                    endTime:'10:00:00',
                    time:'09:00-10:00',
                    isSelect:false
                },
                {
                    nowTimeIndex:10,
                    endTime:'11:00:00',
                    time:'10:00-11:00',
                    isSelect:false
                },
                {
                    nowTimeIndex:11,
                    endTime:'12:00:00',
                    time:'11:00-12:00',
                    isSelect:false
                },
                {
                    nowTimeIndex:12,
                    endTime:'13:00:00',
                    time:'12:00-13:00',
                    isSelect:false
                },
                {
                    nowTimeIndex:13,
                    endTime:'14:00:00',
                    time:'13:00-14:00',
                    isSelect:false
                },
                {
                    nowTimeIndex:14,
                    endTime:'15:00:00',
                    time:'14:00-15:00',
                    isSelect:false
                },
                {
                    nowTimeIndex:15,
                    endTime:'16:00:00',
                    time:'15:00-16:00',
                    isSelect:false
                },
                {
                    nowTimeIndex:16,
                    endTime:'17:00:00',
                    time:'16:00-17:00',
                    isSelect:false
                },
                {
                    nowTimeIndex:17,
                    endTime:'18:00:00',
                    time:'17:00-18:00',
                    isSelect:false
                },
                {
                    nowTimeIndex:18,
                    endTime:'19:00:00',
                    time:'18:00-19:00',
                    isSelect:false
                },
                {
                    nowTimeIndex:19,
                    endTime:'20:00:00',
                    time:'19:00-20:00',
                    isSelect:false
                },
                {
                    nowTimeIndex:20,
                    endTime:'21:00:00',
                    time:'20:00-21:00',
                    isSelect:false
                }
            ],
            //获取版本号
            getVersion:function(){
                //&& el.nowTimeIndex === nowHour

                if(vm.nowHour > 21 || vm.nowHour < 9){
                    vm.nowHour = 9;
                }

                vm.timeArr.forEach(function(el){
                    if(el.nowTimeIndex === vm.nowHour){
                        el.isSelect = true;
                    }
                });

                if(vm.nowHour > 21){
                    vm.nowHour = -1;
                }

                getBaseVersion(function(rs) {
                    vm.version = rs;
                });
            },
            getDaylist:function(){
                var oData = new Date();
                if(oData.getHours() > 21){
                    for(var n=0,m=7;n<m;n++){

                        oData.setDate(oData.getDate()+1);
                        var dayText = dayDir[oData.getDay()],
                            select = false;

                        if(n == 0 ){
                            dayText = '明天';
                            select = true;
                            vm.dateTime = oData.getFullYear()+'-'+(oData.getMonth()+1)+'-'+oData.getDate();
                            vm.showDateTime = oData.getMonth()+1+'月'+oData.getDate()+'日';
                        }
                        if(n == 1 ) dayText = '后天';

                        var json={
                            datetime:oData.getFullYear()+'-'+(oData.getMonth()+1)+'-'+oData.getDate(),
                            date:oData.getMonth()+1+'月'+oData.getDate()+'日',
                            day:dayText,
                            isSelect:select,
                            dayIndex:oData.getDate()
                        };
                        vm.dayList.push(json);

                    }
                }else{
                    for(var i=0,j=7;i<j;i++){
                        var dayText = dayDir[oData.getDay()],
                            select = false;

                        if(i == 0 ){
                            dayText = '今天';
                            select = true;
                            vm.dateTime = oData.getFullYear()+'-'+(oData.getMonth()+1)+'-'+oData.getDate();
                            vm.showDateTime = oData.getMonth()+1+'月'+oData.getDate()+'日';
                        }
                        if(i == 1 ) dayText = '明天';

                        var json={
                            datetime:oData.getFullYear()+'-'+(oData.getMonth()+1)+'-'+oData.getDate(),
                            date:oData.getMonth()+1+'月'+oData.getDate()+'日',
                            day:dayText,
                            isSelect:select,
                            dayIndex:oData.getDate()
                        };
                        vm.dayList.push(json);

                        oData.setDate(oData.getDate()+1);
                    }
                }
            },
            changeTime:function(ele){
                if(ele.nowTimeIndex < vm.nowHour) return;
                vm.timeArr.forEach(function(el){
                    el.isSelect = false;
                });

                vm.endTime = ele.endTime;
                vm.showEndTime = ele.time;

                ele.isSelect = true;
            },
            tapFn:function(ele,index){
                vm.timeArr.forEach(function(el){
                    el.isSelect = false;
                });
                vm.dayList.forEach(function(el){
                    el.isSelect = false;
                });
                ele.isSelect = true;
                vm.dateTime = ele.datetime;
                vm.showDateTime = ele.date;

                if(ele.dayIndex !== vm.nowDay){
                    vm.nowHour = -1;
                }else{
                    vm.nowHour = parseInt(new Date().getHours());
                }

                switch (index)
                {
                    case 0:
                        vm.left = 0;
                        break;
                    case 1:
                        vm.left = 0;
                        break;
                    case 2:
                        vm.left = -2;
                        break;
                    case 3:
                        vm.left = -5.9;
                        break;
                    case 4:
                        vm.left = -9.8;
                        break;
                    case 5:
                        vm.left = -11.3;
                        break;
                    case 6:
                        vm.left = -11.3;
                        break;
                }
            },
            makesureFn:function(){
                var obj = $('.timelist');

                if(obj.find('.active').length !== 1){
                    $.message({
                        msg:'请选择一个时间'
                    });
                    return;
                }

                var time = vm.dateTime+' '+vm.endTime;

                vm.urlData=jsonInList({'pickupDate':time},vm.urlData);
                vm.urlData=jsonInList({'showpickupDate':vm.showDateTime+''+vm.showEndTime},vm.urlData);

                vm.searchData=transList2Url(vm.urlData.$model);

                window.location.href = "book.html?"+vm.searchData;
            }
        });
        vm.getDaylist();
        vm.getVersion();
        avalon.scan();
    });
})();