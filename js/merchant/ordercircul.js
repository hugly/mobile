/**
 * Created by hulgy on 24/09/2016.
 */

(function(){
    'use strict';
    var cropper;

    require(['domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"ordercircul",
            //版本号
            version:0,
            code: $.getUrlParam('code') || '',
            leftTime:0,
            tiempercent:0,
            processpercent:0,
            itemLength:0,
            signalwidth:16,
            ProduceProgress:[],
            nowIndex:0,
            h:0,
            m:0,
            s:0,
            nowstatus:'',
            orderDataModel:null,
            r:0,
            fontsize:$(window).width()/16,
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                    vm.getOderInfo();
                });
            },
            //获取订单详情
            getOderInfo:function(){
                jsonp(host+'/jsonp/Order_JGetOrderDetail_'+vm.version+'.js',{
                    token:token,
                    code:vm.code,
                    isuser:true
                },'callback',function(rs){
                    if(rs.Success) {
                        var index = 0,
                            data = rs.Data;

                        vm.orderDataModel = data;
                        vm.leftTime = data.NeedTime;

                        setInterval(function(){
                            data.NeedTime --;
                            vm.daoTime(data.NeedTime);

                            if(data.NeedTime <= 0){
                                data.NeedTime = 0;
                            }
                        },1000);

                        vm.itemLength = data.ProduceProgress.length;
                        vm.signalwidth = 14/data.ProduceProgress.length
                        vm.ProduceProgress = data.ProduceProgress;

                        vm.ProduceProgress[vm.nowIndex].ShowStatus.forEach(function(el){
                            if(el.IsSelected){
                                index ++;
                            }
                        });
                        vm.processpercent = index/vm.ProduceProgress[vm.nowIndex].ShowStatus.length;
                        vm.nowstatus = vm.ProduceProgress[vm.nowIndex].ShowStatus[index-1].Text;
                        setTimeout(function(){
                            vm.render();
                        },100)
                        // vm.createDom(data.ProduceProgress[0].ShowStatus);
                    }
                },function(){
                });

            },
            changeNowindexFn:function(num){
                vm.nowIndex = num;
                vm.getOderInfo();
            },
            daoTime:function(s){
                vm.h=parseInt(s/3600);
                s%=3600;

                vm.m=parseInt(s/60);
                s%=60;

                if(s <= 0){
                    s = 0;
                }
                vm.s = s;

            },
            render:function(){
                $('.circle').each(function(index, el) {
                    var num = vm.processpercent*100 * 3.6;
                    if (num<=180) {
                        $(this).find('.right').css('transform', "rotate(" + num + "deg)");
                    } else {
                        $(this).find('.right').css('transform', "rotate(180deg)");
                        $(this).find('.left').css('transform', "rotate(" + (num - 180) + "deg)");
                    };
                });
                $('.circle1').each(function(index, el) {
                    var num = (259200-vm.leftTime)/2592 * 3.6;
                    if (num<=180) {
                        $(this).find('.right1').css('transform', "rotate(" + num + "deg)");
                    } else {
                        $(this).find('.right1').css('transform', "rotate(180deg)");
                        $(this).find('.left1').css('transform', "rotate(" + (num - 180) + "deg)");
                    };
                });
            },
            createDom:function(data){
                console.log(data)
                var oDiv=document.getElementById('circlebox');

                vm.r=6;

                var n=data.length;
                for(var i=0;i<n;i++){
                    var oSpan=document.createElement('span');
                    oSpan.innerHTML = data[i].Text;
                    oDiv.appendChild(oSpan);
                    startMove(oSpan,0);
                }

                var aSpan=oDiv.children;
                var c=0;
                for(var i=0;i<aSpan.length;i++){
                    startMove(aSpan[i],{marginTop:-1,opacity:100},{type:'linear',time:1000,fn:function(){
                        c++;
                        for(var j=0;j<aSpan.length;j++){
                            var a=parseInt(360*(j/n));
                            if(c==aSpan.length){
                                vm.move(aSpan[j],a);
                            }
                        }
                    }});
                }

            },
            d2a:function(n){
                return n*Math.PI/180;
            },
            move:function(obj,iTarget,fn){
                obj.a=obj.a||0;
                clearInterval(obj.timer);

                obj.timer=setInterval(function(){
                    var iSpeed=(iTarget-obj.a)/8;
                    iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);

                    obj.a+=iSpeed;
                    var l=vm.r+Math.sin(vm.d2a(obj.a))*vm.r;
                    var t=vm.r-Math.cos(vm.d2a(obj.a))*vm.r;

                    obj.style.left=l+'rem';
                    obj.style.top=t+'rem';

                    if(obj.a==iTarget){
                        clearInterval(obj.timer);
                        fn && fn();
                    }
                },30);
            }
        });
        vm.getVersion();
        avalon.scan();

    });

})();