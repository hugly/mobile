/**
 * Created by hulgy on 23/09/2016.
 */

(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"figures",
            //版本号
            version:0,
            nowNaver:0,
            dateArr:[
                {
                    link: '/bi/BITotalIncomeAndOutByWeek',
                    text:'近七天',
                    isSelect:true
                },
                {
                    link: '/bi/BITotalIncomeAndOutByNowMonth',
                    text:'本月',
                    isSelect:false
                },

                {
                    link: '/bi/BITotalIncomeAndOutByNowYear',
                    text:'本年',
                    isSelect:false
                },
                {
                    link: '/bi/BITotalIncomeAndOutByAll',
                    text: '所有',
                    isSelect: false
                }

            ],
            totalNum: 0,
            nowDate:new Date(),
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version = rs;
                    $.ajax({
                        url: '/bi/BITotalIncome',
                        type: 'get',
                        success: function (rs) {
                            vm.totalNum = rs;
                        }
                    });
                });
            },
            changeDateFn:function(el){
                vm.dateArr.forEach(function(ele){
                    ele.isSelect = false;
                });
                el.isSelect = true;
                $("#maind").attr("echart_ajaxurl", el.link);

                ///bi/BITotalIncome
                wziChart.init("maind");
            },
            changeNaver:function(num){
                vm.nowNaver = num;
            }
        });

        vm.getVersion();
        avalon.scan();
    });
})();