/**
 * Created by hulgy on 16/5/23.
 */
//对avalon.js  ajax的封装
AJAX={};
define("O2O",["avalon"],function(avalon){
    AJAX={
        //ajax 主地址
        url:"http://m.wziwash.com/",
        sideurl:"http://www.wziwash.com/",

        //ajax 主体函数
        ajax:function(opt){
            var url         =   this.url+opt.url,
                data        =   opt.data || {},
                type        =   opt.type || "jsonp",
                obj         =   opt.body || $("body"),
                line        =   opt.line || 1,
                success     =   opt.callback || null,
                failFn      =   opt.failFn || null;

            if(line === 2){
                url=this.sideurl + opt.url;
            }

            //ajax loading 展现
            //$.loadShow(obj);
            //ajax loading 移除
            //$.loadHide(obj);

            //avalon ajax 主体函数
            avalon.ajax({
                type:type,
                cache: false,
                crossDomain: false,
                url:url+'/jsonp',
                data:data,
                dataType:"json",
                timeout:60000
            }).done(function(rs){   //成功
                consle.log(rs);
                //成功获取数据
            }).fail(function(rs){  //失败
                //console.log(rs);
            });
        },
        //获取商家列表

        //获取商家详情
        getProDetail:function(data){
            var url = "/jsonp/Shop_ShopInfo_4.js",
                success = $.getFunction(data.callback);

            this.ajax({
                body:data.body,
                src:url,
                callback:success,
                type:"get",
                data:data.data
            });
        }
    };
});
