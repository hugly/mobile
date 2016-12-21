/**
 * Created by hulgy on 16/4/13.
 */
(function($){
    $.setLocalstorage=function(para,val){
        //localStorage[para]=val;
        localStorage.setItem(para,val);
    };
    $.getLocalstorage=function(para){
        //return localStorage[para];
        return localStorage.getItem(para);
    };
})(zepto);