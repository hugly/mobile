/**
 * Created by hulgy on 16/4/13.
 */
!function(t,e){"function"==typeof define&&define.amd?define(function(){return e(t)}):"object"==typeof exports?module.exports=e:t.echo=e(t)}(this,function(t){"use strict";var e,n,o,r,c,a={},d=function(){},u=function(t,e){var n=t.getBoundingClientRect();return n.right>=e.l&&n.bottom>=e.t&&n.left<=e.r&&n.top<=e.b},l=function(){(r||!n)&&(clearTimeout(n),n=setTimeout(function(){a.render(),n=null},o))};return a.init=function(n){n=n||{};var u=n.offset||0,i=n.offsetVertical||u,f=n.offsetHorizontal||u,s=function(t,e){return parseInt(t||e,10)};e={t:s(n.offsetTop,i),b:s(n.offsetBottom,i),l:s(n.offsetLeft,f),r:s(n.offsetRight,f)},o=s(n.throttle,250),r=n.debounce!==!1,c=!!n.unload,d=n.callback||d,a.render(),document.addEventListener?(t.addEventListener("scroll",l,!1),t.addEventListener("load",l,!1)):(t.attachEvent("onscroll",l),t.attachEvent("onload",l))},a.render=function(){for(var n,o,r=document.querySelectorAll("img[data-echo], [data-echo-background]"),l=r.length,i={l:0-e.l,t:0-e.t,b:(t.innerHeight||document.documentElement.clientHeight)+e.b,r:(t.innerWidth||document.documentElement.clientWidth)+e.r},f=0;l>f;f++)o=r[f],u(o,i)?(c&&o.setAttribute("data-echo-placeholder",o.src),null!==o.getAttribute("data-echo-background")?o.style.backgroundImage="url("+o.getAttribute("data-echo-background")+")":o.src=o.getAttribute("data-echo"),c||o.removeAttribute("data-echo"),d(o,"load")):c&&(n=o.getAttribute("data-echo-placeholder"))&&(null!==o.getAttribute("data-echo-background")?o.style.backgroundImage="url("+n+")":o.src=n,o.removeAttribute("data-echo-placeholder"),d(o,"unload"));l||a.detach()},a.detach=function(){document.removeEventListener?t.removeEventListener("scroll",l):t.detachEvent("onscroll",l),clearTimeout(n)},a});
//rem单位初始化
(function(){
    var rootHtml=$(':root');
    var rootResize=function(){
        var fontSize=$(window).width()/16;
        if(fontSize>67.6) fontSize=67.5;
        rootHtml.css('font-size',fontSize);
    };

    rootResize();
    $(window).resize(function(){
        rootResize();
    });
})();

/*返回上一页*/
function return_prepage()
{
    if( window.document.referrer == "" || window.document.referrer == window.location.href ){
        var href = window.location.href;
        if(href.indexOf('logistics') != -1){
            window.location.href = '../../html/logistics/index.html';
        }else{
            window.location.href="../../html/main/index.html";
        }
    }else
    {
       window.history.back();
    }

}

function and_return_prepage()
{
    window.android.goBack();
}
var WEIXINSHARE={
    title: 'Hi朋友，送您10元洗护代金券',
    desc: '洗衣之家精选优质商家,提供干洗,裁剪,护理,保养。让您快捷,方便,安心, 邀您一起来体验!', // 分享描述
    link: 'http://m.wziwash.com/Html/html/main/index.html', // 分享链接：
    imgUrl: 'http://m.wziwash.com/Html/data-images/share1.png' // 分享图标
};
var ACTIVITYSHARE={
    title: '邀您帮助TA免费领取Iphone6s,已经有',
    desc: '洗衣之家精选优质商家,提供干洗,裁剪,护理,保养。让您快捷,方便,安心, 邀您一起来体验!', // 分享描述
    link: 'http://m.wziwash.com/Html/html/main/index.html', // 分享链接：
    imgUrl: 'http://m.wziwash.com/Html/data-images/activi1.png' // 分享图标
};
var ulrData=[],
    token='3dd9jddd84jwe3',
    host='',
    sildHost='',
    resoureHost='http://b2cresource.wziwash.com';

function getBaseVersion(callback){
    //获取版本号
    jsonp("http://m.wziwash.com/"+'jsonp/Account_Config_4.js',{
        token:token
    },'callback',function(json){
        //获取banner信息
        host = json.Host;
        sildHost = json.WWWHost;
        callback(json.Version);

    },function(){
    });
}

//滚动加载....
(function () {

    var zz=null,
        img="../../data-images/loading.gif";

    var show=function(){

        zz=$('<div style="width: 16rem;text-align: center;"><img style="display: inline-block;width: 1rem;height: 1rem;margin-right: .2rem;" src="'+img+'">加载中...</div>');

        $("body").append(zz);
    };

    var hide=function(){
        if(zz){
            zz.remove();
        }
    };

    $.loadShow=show();
    $.loadHide=hide();

    $.scroll_load = function (data) {
        var callback = data.callback || function () { };
        var buttonLength = data.buttonLength || 100;
        var scrollObj = (data.scrollObj)? data.scrollObj.get(0) : null;

        //是否加载中
        var isLoading = false;
        //是否活动（多个加载在一个页面时使用）
        var active = true;

        var scrollFn = null;

        var scroll_load = {
            init: function () {
                this.addEvent();
            },
            //添加事件
            addEvent: function () {
                var _this = this,
                    obj = scrollObj || window;

                $(window).on("scroll",function(){
                    _this.checkLoad();
                });
            },
            //检查是否触发加载事件
            checkLoad: function () {
                var scroll_top,scroll_height,win_height,scroll_button,scroll_offset;

                scroll_offset= parseInt($(scrollObj).offset().top);
                scroll_top = parseInt($(window).scrollTop());
                scroll_height = parseInt($(window).height());
                win_height = parseInt($(scrollObj).height());

                scroll_button = win_height - scroll_top - scroll_height+scroll_offset;

                if (scroll_button < buttonLength) {
                    callback();
                }
            }
        };

        scroll_load.init();
    };
})();

//jsonp
function jsonp(url,data,cbName,fnSucc,fnTime,jpName){
    $.ajax({
        url:url,
        data:data,
        dataType:'jsonp',
        jsonp:cbName,
        jsonpCallback:jpName,
        success:function(rs){
            if(rs.Code == 8001){
                $.message({
                    msg:rs.Msg,
                    callback:function(){
                        window.location.href = '/ssoaccount/login?returnUrl='+window.location.href;
                    }
                });
            }else if(rs.Code == 8002){
                window.location.href="../../html/others/authorization.html";
            }
            else{
                fnSucc && fnSucc(rs);
            }
        }
    });
}



(function () {
    var zz = null,
        zz_main = null,
        load_gif = "../../data-images/loading.gif";

    var show = function (obj) {

        obj = obj || $("body");

        zz = $("<div class='zoom'></div>");
        var css = {
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            "background-color": "rgba(0,0,0,0)",
            "z-index": 99998
        };

        var css2 = {
            position: "absolute",
            left: "50%",
            top: "50%",
            "margin-left": "-1.5rem",
            "margin-top": "-2rem",
            width: "3rem",
            height: "4rem",
            "line-height": "60px",
            opacity: 1,
            "z-index": 99999,
            color: "#333",
            "text-align": "center"
        };

        zz.css(css);

        zz_main = $("<div></div>");
        var img = $("<img src='"+load_gif+"'>");
        img.css({
            float:'left',
            width:"3rem",
            height:"3rem",
            'border-radius':'1.2rem'
        });
        zz_main.css(css2);
        zz_main.append(img).append($('<span style="float:left;width: 3rem; height: 1rem; line-height: 1rem; text-align: center; font-size: 10px;">正在加载中...</span>'));
        zz.append(zz_main);
        if ($('body').find(".zoom").length < 1) {
            obj.append(zz);
        }

        //zz.animate({
        //    "opacity":".4"
        //},1000)
    };
    var hide = function (obj) {
        obj = obj || $("body");
        if (obj.find(".zoom").length > 0) {
            obj.find(".zoom").remove();
            //zz.remove();
            //zz_main.remove();
            //zz = null;
            //zz_main = null;
        }
    };

    $.loadShow = show;
    $.loadHide = hide;
})();


//设置localstorage
setLocalstorage=function(para,val){
    localStorage.setItem(para,val);
};
//获取localstorage
getLocalstorage=function(para){
    return localStorage.getItem(para);
};
//删除localstorage
deleLocalstorage=function(para){
    localStorage.removeItem(para);
};

time2stamp = function (a) {
    var new_str = a.replace(/:/g, '-');
    new_str = new_str.replace(/ /g, '-');
    new_str = new_str.replace(/ /g, '-');
    var arr = new_str.split("-");
    if (arr.length != 6) {
        for (var i = 0, l = 6 - arr.length; i < l; i++) {
            arr.push(0);
        }
    }

    return new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5])).getTime();
};

dao2time = function(time){

    if(time <= 0){
        return '时间已到';
    }

    var t=parseInt(time/(3600*24))
    time%=86400;

    var h=parseInt(time/3600);
    time%=3600;

    var m=parseInt(time/60);
    time%=60;

    return (t>0?(t+'天'):'')+(h>0?(sumNum(h)+'时'):'')+(m>0?(sumNum(m)+'分'):'')+sumNum(time)+'秒';

};

sumNum = function(n){
    return n<=9 ? '0'+n : n;
};

//stamp2time和time2stamp   2个时间转换的毫秒数会被忽略。
stamp2time = function (b) {
    b = b || new Date().getTime();
    var a = new Date(parseInt(b));
    var year = a.getFullYear();
    var month = parseInt(a.getMonth()) + 1;
    month = (month < 10) ? "0" + month : month;
    var date = a.getDate();
    date = (date < 10) ? "0" + date : date;
    var hours = a.getHours();
    hours = (hours < 10) ? "0" + hours : hours;
    var minutes = a.getMinutes();
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    var seconds = a.getSeconds();
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return year + "/" + month + "/" + date + " " + hours + ":" + minutes+ ":" + seconds;
};
stamp2timeline = function (b) {
    b = b || new Date().getTime();
    var a = new Date(parseInt(b));
    var year = a.getFullYear();
    var month = parseInt(a.getMonth()) + 1;
    month = (month < 10) ? "0" + month : month;
    var date = a.getDate();
    date = (date < 10) ? "0" + date : date;
    var hours = a.getHours();
    hours = (hours < 10) ? "0" + hours : hours;
    var minutes = a.getMinutes();
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    var seconds = a.getSeconds();
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return year + "-" + month + "-" + date + " " + hours + ":" + minutes+ ":" + seconds;
};

//ajax+localstorage混合
function getData(url,key,version,data,cbName,fnSucc,fnTime){
    var keyVer=key+version;

    if(getLocalstorage(keyVer)){

        fnSucc(JSON.parse(getLocalstorage(keyVer)));

    }else{
        //$.loadShow();
        jsonp(url,data,cbName,function(rs){
            //$.loadHide();
            deleLocalstorage(key+(parseInt(version)-1));
            setLocalstorage(keyVer,JSON.stringify(rs));
            fnSucc(rs);

        },fnTime);
    }
}


(function($){
    //腾讯地图 插件
    $.setQQMap=function(settings){
        var _this   =   null,
            obj     =   settings.obj,           //@param  装载qq地图的容器
            zoom    =   settings.zoom || 12,    //@param  地图的层级
            imgsrc  =   settings.imgsrc,        //@param  地图标注的图标样式
            lon     =   settings.lon || 0,      //@param  经纬度
            lat     =   settings.lat || 0;      //@param  经纬度

        var mapobj={
            init:function(){
                _this = this;
                if(lon !== 0 && lat !== 0){
                    this.createmap(lon,lat);
                }else{
                    this.getLocation();
                }
            },
            getLocation:function(){
                var _this=this;

                var options = {timeout: 8000};
                var geolocation = new qq.maps.Geolocation("OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77", "myapp");
                geolocation.getLocation(_this.showPosition, _this.showErr, options);

            },
            showPosition:function(position){
                _this.createmap(position.lat,position.lng);
            },
            showErr:function(){

            },
            createmap:function(longitude,latitude){
                //定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
                var center = new qq.maps.LatLng(latitude,longitude);
                var map = new qq.maps.Map(document.getElementById(obj), {
                    center: center,      // 地图的中心地理坐标。
                    zoom:zoom,             // 地图的中心地理坐标。
                    zoomControl:false
                });
                //创建marker
                var marker = new qq.maps.Marker({
                    position: center,
                    map: map
                });

                var anchor = new qq.maps.Point(0, 39),
                    size = new qq.maps.Size(16, 33),
                    origin = new qq.maps.Point(0, 0),
                    markerIcon = new qq.maps.MarkerImage(
                        imgsrc,
                        size,
                        origin,
                        anchor
                    );

                marker.setIcon(markerIcon);
            }
        };
        mapobj.init();
    };
    //根据定位获取详细地址
    $.getAddress=function(settings){
        var callback    =   settings.callback || null,
            errorFn       =   settings.errorFn || null;

        var mapobj={
            init:function(){
                this.getLocation();
            },
            getLocation:function(){
                var _this=this;

                var options = {timeout: 5000};
                var geolocation = new qq.maps.Geolocation("OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77", "xihome");
                geolocation.getLocation(_this.showPosition, _this.showErr, options);
            },
            showPosition:function(position){
                callback && callback(position);
            },
            showErr:function(options){
                errorFn && errorFn(options);
            }
        };
        mapobj.init();
    };
    $.redPackets=function(settings){
        var callback    =   settings.callback || null,
            url         =   settings.url,
            text        =   settings.text || '红包现金奖励',
            data        =   settings.data || {token:token};

        if(!url){
            throw ('必须要有一个获取红包金额的url地址!')
        }

        var zoomer      =   null,
            packet      =   null,
            oOpen       =   null,
            oMoney      =   null,
            oClose      =   null,
            oMoneyDetail=   null,
            oGoNext     =   null,
            isLoading   =   false,
            money       =   0;


        var redPackets = {
            init:function(){
                this.creatDom();
                this.bindEvent();
            },
            creatDom:function(){
                zoomer=$('<div></div>'),
                packet=$('<div>' +
                            '<img style="display: block; width: 8rem; overflow: hidden; margin: 2rem auto 0;" src="../../data-images/logo.png">'+
                            '<h3 style="color: #ffe2b1; width: 15rem; height: 2rem; line-height: 2rem; text-align: center;"></h3>'+
                            '<p style="color: #ffe2b1; width: 15rem; font-size: .6rem; text-align: center;"></p>'+
                            '<h1 style="color: #ffe2b1; width: 15rem; height: 4rem; line-height: 4rem; text-align: center;">'+text+'</h1>'+
                        '</div>'),
                oOpen=$('<div>打开</div>'),
                oMoney= $('<div class="change"></div>'),
                oMoneyDetail=$('<div>￥'+money+'</div>'),
                oGoNext = $('<a href="../../html/personal/account.html">查看红包</a>'),
                oClose=$('<div style="width: 2rem; height: 2rem; position: absolute; left: 0; top: 0; z-index: 12;"></div>');

                var zoomCss={
                        'width':'16rem',
                        'height':'100%',
                        'position':'fixed',
                        'left':0,
                        'top':0,
                        'z-index':10,
                        'background-color':'rgba(0,0,0,.6)'
                    },
                    packetCss={
                        'width':'15rem',
                        'height':'20rem',
                        'position':'fixed',
                        'left':'.5rem',
                        'top':'50%',
                        'margin-top':'-10rem',
                        'background-image':'url("../../style/css/images/redbg.png")',
                        'background-size': 'cover',
                        'z-index':11
                    },
                    openCss={
                        'width':'5rem',
                        'height':'5rem',
                        'line-height':'5rem',
                        'text-align':'center',
                        'position':'absolute',
                        'left':'50%',
                        'bottom':'3.5rem',
                        'margin-left':'-2.5rem',
                        'background-image':'url("../../style/css/images/quan1.png")',
                        'background-size': 'cover',
                        'color': '#3b3b3b',
                        'font-weight': 'bolder',
                        'font-size': '1.2rem',
                        'z-index':'12'
                    },
                    moneyCss={
                        'width':'5rem',
                        'height':'5rem',
                        'line-height':'5rem',
                        'text-align':'center',
                        'position':'absolute',
                        'left':'50%',
                        'bottom':'3.5rem',
                        'margin-left':'-2.5rem',
                        'background-image':'url("../../style/css/images/tongqian.png")',
                        'background-size': 'cover',
                        'color': '#3b3b3b',
                        'font-weight': 'bolder',
                        'font-size': '1.2rem',
                        'z-index':'12'
                    },
                    oGoNextcss={
                        'position': 'absolute',
                        'left': 0,
                        'bottom': '1rem',
                        'width': '15rem',
                        'height': '2rem',
                        'line-height': '2rem',
                        'color': '#fff',
                        'text-align': 'center'
                    },
                    oMoneyDetailcss={
                        'width':'5rem',
                        'height':'5rem',
                        'line-height':'5rem',
                        'text-align':'center',
                        'position':'absolute',
                        'left':'50%',
                        'bottom':'3.5rem',
                        'margin-left':'-2.5rem',
                        'color': '#ffe2b1',
                        'font-weight': 'bolder',
                        'font-size': '1.2rem',
                        'z-index':'12'
                    };

                zoomer.css(zoomCss);
                packet.css(packetCss);
                oOpen.css(openCss);
                oMoney.css(moneyCss);
                oMoneyDetail.css(oMoneyDetailcss);
                oGoNext.css(oGoNextcss);

                oMoney.hide();
                oMoneyDetail.hide();
                oGoNext.hide();

                packet.append(oClose);
                packet.append(oOpen);
                packet.append(oMoney);
                packet.append(oMoneyDetail);
                packet.append(oGoNext);
                zoomer.append(packet);
                $('body').append(zoomer);
            },
            bindEvent:function(){
                var _this=this;
                oOpen.on('click',this,function(e){
                    oOpen.hide();
                    oMoney.show();
                    _this.getRedNum();
                    e.stopPropagation();
                });

                oClose.on('click',this,function(e){
                    zoomer.remove();
                    e.stopPropagation();
                });

                zoomer.on('click',this,function(e){
                    zoomer.remove();
                });

                packet.on('click',this,function(e){
                    e.stopPropagation();
                });
            },
            getRedNum:function(){
                isLoading = true;
                jsonp(url,data,'callback',function(rs){
                    if(rs.Success){
                        oMoney.hide();
                        oMoneyDetail.show();
                        oMoneyDetail.text('￥'+rs.Data.RewardValue);
                        oGoNext.show();
                        callback && callback();
                    }else{
                        $.message({
                            msg:rs.Msg,
                            callback:function(){
                                zoomer.remove();
                            }
                        })
                    }
                    isLoading = false;
                },function(){
                });

            }
        };

        redPackets.init();
    }
})(Zepto);

//序列化数据  //codes[88888]=7&
function serializationData(arr,name,hasLen,len){
    var str="provalue=",
        searchStr='';

    for(var i= 0,j=arr.length;i<j;i++){
        var code=arr[i].code || arr[i].Code;
        str +=name+'['+code+']-'+arr[i].name+'-'+arr[i].num+",";
    }

    if(hasLen){
        str+='prolen-'+len;
    }

    return str;
}

function serializaData(arr,name){
    var str="",
        searchStr='';

    if(arr.length > 0){
        str='?';
    }

    for(var i= 0,j=arr.length;i<j;i++){
        var code=arr[i].code || arr[i].Code;
        str +=name+'['+code+']='+arr[i].num+"&";
    }

    return str;
}

function serializaNormalData(arr,name){
    var str="&skus=";

    for(var i= 0,j=arr.length;i<j;i++){
        var code=arr[i].code || arr[i].Code;
        str +=name+'['+code+'].'+arr[i].num+"-";
    }

    return str;
}


function serializaDataOther(arr,name){
    var str="";

    for(var i= 0,j=arr.length;i<j;i++){
        var code=arr[i].code || arr[i].Code;
        str +=name+'['+code+']='+arr[i].num+"&";
    }

    return encodeURIComponent(str);
}

//将对象集合数据转换成表单提交的数据格式   eg: arr = [{name:value},{name:value}]  ->  arr[0].name1=value1&arr[1].name=value
$.transJsonListToString=function(arr,arrName){
    var str="";
    if(arr.length>0){
        for(var i= 0,j=arr.length;i<j;i++){
            var json=arr[i],
                normalStr="";
            for(var name in json){
                normalStr=arrName+"["+i+"]."+name+"="+ json[name]+"&";
            }
            str+=normalStr;
        }
    }

    return str;
};

//将url地址的参数转化为对象list
var transUrl2List=function(json){
    var search=decodeURIComponent(window.location.search),
        listArr=[],
        dataArr=[];

    if($.trim(search)){
        dataArr=search.split('?')[1].split('&');

        for(var i= 0,j=dataArr.length;i<j;i++){
            var json={},
                data=dataArr[i].split('=');

            json[data[0]]=data[1];

            if(data[0]){
                listArr.push(json);
            }
        }
    }else if(json){
        listArr.push(json);
    }

    return listArr;
};
var transUrl2ListWithSearch=function(str){
    var search=str,
        listArr=[],
        dataArr=[];

    if($.trim(search)){
        dataArr=search.split('&');

        for(var i= 0,j=dataArr.length;i<j;i++){
            var json={},
                data=dataArr[i].split('=');

            json[data[0]]=data[1];

            if(data[0]){
                listArr.push(json);
            }
        }
    }
    return listArr;
};
//将对象list转化为querystring
var transList2Url=function(data){
    var str='';

    for(var i= 0,j=data.length;i<j;i++){
        for(var name in data[i]){
            str +=name+'='+data[i][name]+"&";
        }
    }

    return str.replace("?","");
};

//将json对象push到list里面
var jsonInList=function(json,data){
    if(data.length > 0){
        for(var i= 0,j=data.length;i<j;i++){
            for(var name in json){
                for(var a in data[i]){
                    if(name === a){
                        data[i][a]=json[name];
                        return data;
                    }
                }
            }
        }
    }

    data.push(json);

    return data;
};



var jsonOutList=function(name,data){
    if(data.length > 0){
        for(var i= 0,j=data.length;i<j;i++){
            for(var a in data[i]){
                if(name === a){
                    data.splice(i,1);
                }
            }
        }
    }
    return data;
};

function getStyle(obj,name){
    return (obj.currentStyle || getComputedStyle(obj,false))[name];
}
function startMove(obj,json,options){
    options=options || {};
    options.time=options.time || 700;
    options.type=options.type || 'ease-out';

    var count=Math.floor(options.time/30);

    var start={};
    var dis={};

    for(var name in json){
        if(name=='opacity'){
            start[name]=Math.round(parseFloat(getStyle(obj,name))*100);
        }else{
            start[name]=parseInt(getStyle(obj,name));
        }
        dis[name]=json[name]-start[name];
    }

    var n=0;
    clearInterval(obj.timer);
    obj.timer=setInterval(function(){
        n++;
        for(var name in json){
            switch(options.type){
                case 'linear':
                    var a=n/count;
                    var iCur=start[name]+dis[name]*a;
                    break;
                case 'ease-out':
                    var a=1-n/count;
                    var iCur=start[name]+dis[name]*(1-a*a*a);
                    break;
                case 'ease-in':
                    var a=1-n/count;
                    var iCur=start[name]+dis[name]*(a*a*a);
                    break;
            }

            if(name=='opacity'){
                obj.style.opacity=iCur/100;
                obj.style.filter='alpha(opacity='+iCur+')';
            }else{
                obj.style[name]=iCur+'rem';
            }
        }
        if(n==count){
            clearInterval(obj.timer);
            options.fn && options.fn();
        }
    },30);
}


//滚动加载....
//var a = new $.scrollLoad({
//    mainDiv: $("#scroll_comment"),
//    buttonLength: 500,
//    ajaxFn: function (){
//        a.destroy();            //加载完成调用
//        a.ajaxSuccess();        //加载成功调用
//        a.ajaxError();      //加载失败调用
//        a.setActive(false);  //是否激活滚动加载
//    }
//})
(function () {
    var WASH = {};
    WASH.addEvent = function (target, type, func) {
        if (target.addEventListener) {
            target.addEventListener(type, func, false);
        } else if (target.attachEvent) {
            target.attachEvent("on" + type, func);
        } else {
            target["on" + type] = func;
        }
    };
    WASH.removeEvent = function (target, type, func) {
        if (target.removeEventListener) {
            target.removeEventListener(type, func, false);
        } else if (target.detachEvent) {
            target.detachEvent("on" + type, func);
        } else {
            delete target["on" + type];
        }
    };


    var scroll_load = function (data) {
        this.ajaxFn = data.ajaxFn || function () { };
        this.buttonLength = data.buttonLength || 100;
        this.scrollObj = (data.scrollObj) ? data.scrollObj.get(0) : null;

        //是否加载中
        this.isLoading = false;
        //是否活动（多个加载在一个页面时使用）
        this.active = true;

        this.scrollFn = null;

        this.init();
    };
    scroll_load.prototype = {
        init: function () {
            this.addEvent();
        },
        //添加事件
        addEvent: function () {
            var _this = this,
                obj = this.scrollObj || window;

            WASH.addEvent(obj, "scroll", this.scrollFn = function () {
                _this.checkLoad();
            });
        },
        //检查是否触发加载事件
        checkLoad: function () {
            var scroll_top, scroll_height, win_height, scroll_button;

            if (this.scrollObj) {
                scroll_top = parseInt(this.scrollObj.scrollTop);
                scroll_height = parseInt(this.scrollObj.scrollHeight);
                win_height = parseInt(this.scrollObj.style.height);
                scroll_button = scroll_height - scroll_top - win_height;
            } else {
                scroll_top = parseInt($(window).scrollTop());
                scroll_height = parseInt($("body").prop("scrollHeight"));
                win_height = parseInt($(window).height());
                scroll_button = scroll_height - scroll_top - win_height;
            }


            if (scroll_button < this.buttonLength && !this.isLoading && this.active) {
                this.ajaxFn();
            }
        },
        //销毁
        destroy: function () {
            WASH.removeEvent(window, "scroll", this.scrollFn);
        }
    };


    WASH.scrollLoad = function (data) {
        var _this = this;

        this.buttonLength = data.buttonLength || 200;
        this.mainDiv = data.mainDiv;
        this.showLoading = data.showLoading || true;
        this.ajaxFn = data.ajaxFn;
        this.scrollObj = data.scrollObj;

        this.loadObj = null;

        this.scrollFn = new scroll_load({
            ajaxFn: function () {
                //_this.ajaxStart.call(_this);
                _this.ajaxStart();
            },
            buttonLength: _this.buttonLength,
            scrollObj: _this.scrollObj
        });

    };
    WASH.scrollLoad.prototype = {
        ajaxStart: function () {
            var _this = this;
            _this.scrollFn.isLoading = true;

            if (_this.showLoading) {
                _this.showLoad();
            }

            _this.ajaxFn();

        },
        //显示loading
        showLoad: function () {
            var div = $("<div>加载中，请稍后！</div>");
            div.css({
                width: "100%",
                height: "2rem",
                "line-height": "2rem",
                "text-align": "center",
                color: "#000"
            });
            this.mainDiv.append(div);

            this.loadObj = div;
        },
        //隐藏loading
        hideLoad: function () {
            if (this.loadObj && this.loadObj.find("a").length != 0) {
                this.loadObj.find("a").unbind("click").unbind("hover");
            }

            if (this.loadObj && this.loadObj.length != 0) {
                this.loadObj.remove();
            }

            this.loadObj = null;
        },
        //加载失败显示loading
        reShowLoad: function () {
            var _this = this,
                div = $("<div>加载失败，<a>点击重试</a></div>");


            div.css({
                width: "100%",
                height: "30px",
                "line-height": "30px",
                "text-align": "center",
                color: "#000"
            });
            div.find("a").click(function () {
                _this.hideLoad();
                _this.ajaxStart();
            }).hover(function () {
                $(this).css({ color: "#999" });
            }, function () {
                $(this).css({ color: "#000" });
            });

            this.mainDiv.append(div);
            this.loadObj = div;
        },
        //ajax调用成功回调
        ajaxSuccess: function () {
            this.hideLoad();
            this.scrollFn.isLoading = false;
        },
        //ajax调用失败回调
        ajaxError: function () {
            this.hideLoad();
            this.reShowLoad();
        },
        //ajax 加载完数据
        destroy: function () {
            this.hideLoad();
            this.scrollFn.destroy();
            this.scrollFn = null;

            this.mainDiv = null;
            this.showLoading = null;
            this.ajaxFn = null;
        },
        //设置是否触发滚动加载
        setActive: function (state) {
            if (this.scrollFn) {
                this.scrollFn.active = state;
            }
        }
    };

    $.scrollLoad = WASH.scrollLoad;
})();





