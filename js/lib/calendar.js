/**
 * Created by hulgy on 16/3/12.
 */
$.calendar=function(settings){
    return this.each(function(){
        this.body=data.body || $('body');
        this.type=data.type || 'get';
        this.url=data.url || "";
        this.disPre=data.disPre || true;
        this.disNext=data.disNext || true;
        this.ticketNum=data.ticketNum || 10;
        this.callback=data.clickFun;
        this.call=data.callback;

        var calendar={
            //父级
            oParent:$("<div class='calendar_plugin'></div>"),
            //日历计数器
            iNowTime:0,
            //初始化
            init:function(){
                this.createCalendarTitle();
            },
            //获取api数据
            getApiData:function(oPre,oTheday,oNext,oHead){
                var _this=this,
                    oDate=new Date(),
                    nowYear= 0,
                    nowMouth= 0;
                oDate.setMonth(oDate.getMonth()+this.iNowTime);

                nowYear=oDate.getFullYear();
                nowMouth=oDate.getMonth()+1;

                this.zoomFun("block");
                //this.createCalendar(null,oPre,oTheday,oNext,oHead);
                if(this.url){
                    $.ajax({
                        type:_this.type,
                        url: $.getUrlData(_this.url,{
                            "year":nowYear,
                            "month":nowMouth
                        }),
                        contentType:"application/json",
                        dataType:"json",
                        success:function(rs){
                            _this.zoomFun("none");
                            var data=rs.Data;
                            data.sort($.compareArrObject("StartTime"));

                            _this.createCalendar(data,oPre,oTheday,oNext,oHead);
                        },
                        error:function(e){
                            _this.zoomFun("none");
                            var state= e.status,
                                msg="";
                            if(state == "404" || state == "500"){
                                msg="服务器繁忙，请稍后再试!";
                            }else{
                                msg="无法连接服务器，请检查网络设置!";
                            }
                            alert(msg);
                            _this.createCalendar(null,oPre,oTheday,oNext,oHead);

                        }
                    });
                }else{
                    _this.zoomFun("none");
                    alert("请输入合法的url!");
                }

            },
            //事件绑定
            bindEvent:function(oPre,oNext,cells){
                var _this=this;
                //上一个月
                oPre.on('click',function(){
                    if(_this.iNowTime>0){
                        _this.iNowTime--;
                        _this.createCalendarTitle();
                    }
                });

                //下一个月
                oNext.on('click',function(){
                    _this.iNowTime++;
                    _this.createCalendarTitle();
                    oPre.addClass("hasPre");

                });

                //日历每天的点击事件
                cells.find(".hasEvent").on('click',function(){
                    cells.find(".hasEvent").removeClass("icon");
                    $(this).addClass("icon");

                    var data={};
                    data.StartTime=$(this).attr("data");
                    data.LeftAmount=$(this).attr("ticket");
                    data.Price=$(this).attr("price");
                    _this.callback($(this),data);
                });

            },
            //创建日历头部以及选择月份部分
            createCalendarTitle:function(data){
                var oDate=new Date(),
                    oHead=$('<div class="operations"></div>'),
                    oTitle=$('<div class="title"></div>'),
                    oRemote=$('<div class="remotes fullword"></div>'),
                    oWeeks=$('<div class="weeks fullword"></div>'),
                    oPre=$('<div class="preMouth"></div>'),
                    oTheday=$('<span class="theday"></span>'),
                    oNext=$('<div class="nextMouth"></div>');

                this.oParent.html("");

                if(this.iNowTime==0){
                    oPre.removeClass('hasPre');
                }else{
                    oPre.addClass('hasPre');
                }

                for(var i= 0;i<7;i++){
                    if(i==6){
                        oWeeks.append($('<div class="weekDays sunday">'+week[i]+'</div>'));
                    }else if(i==5){
                        oWeeks.append($('<div class="weekDays saturday">'+week[i]+'</div>'));
                    }else{
                        oWeeks.append($('<div class="weekDays">'+week[i]+'</div>'));
                    }
                }

                oTheday.html(oDate.getFullYear()+'年'+(oDate.getMonth()+1)+'月');

                oTitle.append(oPre);
                oRemote.append(oTheday);

                oTitle.append(oRemote);
                oRemote.append(oWeeks);
                oTitle.append(oNext);

                this.oParent.append(oTitle);
                this.body.append(this.oParent);

                this.getApiData(oPre,oTheday,oNext,oHead);
                //this.createCalendar(null,oPre,oTheday,oNext,oHead);

            },
            //创建日历
            createCalendar:function(data,oPre,oTheday,oNext,oHead){
                var m=this.getFirstDay(),
                    d=this.getMonthDay(),
                    nowDay=this.getNowDay(),
                    lastDays=this.getPreDays(),
                    cells=$('<div class="cells"></div>'),
                    oCalendar=$('<div class="calendar_con"></div>'),
                    hasPriceArr=[],
                    num= 0,
                    height=this.body.height()-oHead.height()-1,
                    width=this.body.width()-2;

                if(data){
                    for(var i= 0,j=data.length;i<j;i++){
                        var day=data[i].StartTime;
                        day = day.replace(new RegExp("-", "g"), "/");
                        oDate = new Date(day);

                        hasPriceArr.push(oDate.getDate());
                    }
                }

                if(m==0) m=7;
                //m--;
                //插入上个月的天数
                if(m==6 && d>29 || m==5 && d==31){
                    for(var i= 0;i<m;i++){
                        if(this.disPre) {
                            oCalendar.prepend($('<div class="pastDay"><span class="past">' + (lastDays - i) + '</span></div>'));
                        }else{
                            oCalendar.prepend($('<div class="pastDay"><span class="past"></span></div>'));
                        }
                    }
                }else{
                    for(var i= 0;i<m+7;i++){
                        if(this.disPre){
                            oCalendar.prepend($('<div class="pastDay"><span class="past">'+(lastDays-i)+'</span></div>'));
                        }else{
                            oCalendar.prepend($('<div class="pastDay"><span class="past"></span></div>'));
                        }
                    }
                }

                //插入本月的天数
                for(var i= 1;i<d+1;i++){
                    var str="";
                    if(this.iNowTime==0 && i<nowDay){
                        oCalendar.append($('<div class="nowDay"><span class="asap">'+i+'</span></div>'));
                    }else{
                        if(data && hasPriceArr.indexOf(i)!=-1){
                            if(i==nowDay && this.iNowTime==0){
                                if(data[num].LeftAmount>this.ticketNum){
                                    oCalendar.append($('<div class="nowDay hasEvent" data="'+data[num].StartTime+'" ticket="'+data[num].LeftAmount+'" price="'+data[num].Price+'"><span class="today">今天</span><span class="price">￥'+data[num].Price+'</span></div>'));
                                }else{
                                    oCalendar.append($('<div class="nowDay hasEvent" data="'+data[num].StartTime+'" ticket="'+data[num].LeftAmount+'" price="'+data[num].Price+'"><span class="today">今天</span><span class="price">￥'+data[num].Price+'</span></div>'));
                                }
                            }else{
                                oCalendar.append($('<div class="nowDay hasEvent" data="'+data[num].StartTime+'" ticket="'+data[num].LeftAmount+'" price="'+data[num].Price+'"><span class="asap">'+i+'</span><span class="price">￥'+data[num].Price+'起</span></div>'));
                            }
                            num++;
                        }else{
                            oCalendar.append($('<div class="nowDay"><span class="asap">'+i+'</span></div>'));
                        }
                    }
                }
//        this.searchData(oCalendar,hasPriceArr,nowDay);
                oCalendar.find(".hasEvent").first().addClass('icon');
                this.dateInit(oCalendar);

                var oDate=new Date(),
                    len=oCalendar.children().length;

                //插入下个月的天数
                if(len<42){
                    for(var i=1;i<=42-len;i++){
                        if(this.disNext) {
                            oCalendar.append($('<div class="futureDay"><span class="past">' + i + '</span></div>'));
                        }else{
                            oCalendar.append($('<div class="futureDay"><span class="past"></span></div>'));
                        }
                    }
                }

                oDate.setMonth(oDate.getMonth()+this.iNowTime);
                oTheday.html(oDate.getFullYear()+'年'+(oDate.getMonth()+1)+'月');

                cells.append(oCalendar);
                this.oParent.append(cells);
                this.body.append(this.oParent);
                this.bindEvent(oPre,oNext,cells);
            },
            //寻找最近有价格的日期
            searchData:function(oParent,arr,now){
                var aDays=oParent.find(".nowDay");
                if(arr.indexOf(now)!=-1){
                    $(aDays[now-1]).addClass("icon");
                }else{

                }
            },
            //获取上个月有多少天
            getPreDays:function(){
                var oDate=new Date();

                oDate.setMonth(oDate.getMonth());
                oDate.setDate(0);

                return oDate.getDate();
            },
            //获取每个月的第一天是星期几
            getFirstDay:function(){
                var oData=new Date();

                oData.setMonth(oData.getMonth()+this.iNowTime);
                oData.setDate(1);
                return oData.getDay();
            },
            //获取本月的天数
            getMonthDay:function(){
                var oDate=new Date();

                oDate.setMonth(oDate.getMonth()+this.iNowTime);
                oDate.setMonth(oDate.getMonth()+1);
                oDate.setDate(0);

                return oDate.getDate();
            },
            //获取今天的号数
            getNowDay:function(){
                var oDate=new Date();
                oDate.setMonth(oDate.getMonth()+this.iNowTime);

                return oDate.getDate();
            },
            //日历日期价格初始化
            dateInit:function(oParent){
                var data={},
                    oIcon=oParent.find(".icon");
                data.StartTime=oIcon.attr("data");
                data.LeftAmount=oIcon.attr("ticket");
                data.Price=oIcon.attr("price");
                this.call(data);
            },
            //遮罩层
            zoomFun:function(val){
                var oZoom=$("#zoom"),
                    oLoad=$("#load");

                oZoom.css({
                    display:val
                });
                oLoad.css({
                    display:val
                });
            }
        };

        calendar.init();

    });
};



week={
    0:"日",
    1:"一",
    2:"二",
    3:"三",
    4:"四",
    5:"五",
    6:"六"
};