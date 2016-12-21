/**
 * Created by hulgy on 16/4/13.
 */

var token='3dd9jddd84jwe3',
    host='',
    publicHost='http://119.28.6.194:8300/';

function getBaseVersion(callback){
    //获取版本号
    jsonp("http://m.wziwash.com/"+'jsonp/Account_Config_4.js',{
        token:token
    },'callback',function(json){
        //获取banner信息
        host=json.Host+"/";
        callback(json.Version);

    },function(){
    });
}

function jsonp(url,data,cbName,fnSucc,fnTime,jpName){
    var fnName= jpName || ('jsonp'+Math.random()).replace('.','');

    window[fnName]=function(){
        fnSucc.apply(null,arguments);
        oHead.removeChild(oS);
        clearTimeout(timer);
        window[fnName]=null;
    };
    data[cbName]=fnName;

    var arr=[];
    for(var name in data){
        arr.push(name+'='+data[name]);
    }

    var str=arr.join('&');

    var oS=document.createElement('script');
    oS.src=url+'?'+str;

    var oHead=document.getElementsByTagName('head')[0];
    oHead.appendChild(oS);

    var timer=setTimeout(function(){
        fnTime && fnTime();
    },8000);
}

setLocalstorage=function(para,val){
    localStorage.setItem(para,val);
};
getLocalstorage=function(para){
    return localStorage.getItem(para);
};

deleLocalstorage=function(para){
    localStorage.removeItem(para);
};


//ajax+localstorage混合
function getData(url,key,version,data,cbName,fnSucc,fnTime,fnBegin){
    var keyVer=key+version;

    if(getLocalstorage(keyVer)){

        fnSucc(JSON.parse(getLocalstorage(keyVer)));
    }else{
        //$.loadShow();
        fnBegin && fnBegin();
        jsonp(url,data,cbName,function(rs){
            //$.loadHide();
            deleLocalstorage(key+(parseInt(version)-1));
            setLocalstorage(keyVer,JSON.stringify(rs));
            fnSucc(rs);
        },fnTime);
    }
}




