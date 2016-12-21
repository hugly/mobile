/**
 * Created by hulgy on 16/7/24.
 */
(function(){
    'use strict';

    require(['mmRequest','domReady!'],function(avalon){
        var vm=avalon.define({
            $id:"search",
            version:'',
            keyword:'',
            oldValue:'',
            isGoback:true,
            shopList:[],
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){
                    vm.version=rs;
                });
            },
            focusFn:function(){
                setInterval(function(){
                    if(vm.keyword !== vm.oldValue){
                        vm.checkInfoFn();
                    }
                },100);
            },
            //获取列表数据
            checkInfoFn:function(){
                if(!vm.isGoback) return;
                vm.isGoback = false;

                jsonp(sildHost+'/jsonp/Shop_AutoSearch_'+vm.version+'.js',{
                    token: token,
                    keyword:vm.keyword
                },'callback',function(rs){
                    vm.shopList = rs;

                    vm.oldValue = vm.keyword;
                    vm.isGoback = true;
                },function(){
                });

            },
            tapFn:function(name){
                var arr=JSON.parse(getLocalstorage("key")) || [];

                var val=name,
                    json={};
                json.name='keyword';
                json.val=val;

                if(!val) return;

                for(var i= 0,j=arr.length;i<j;i++){
                    if(val === arr[i].val){
                        return;
                    }
                }

                if(arr.length>=10){
                    arr.shift();
                    arr.push(json);
                }else{
                    arr.push(json);
                    $('<li><a href="list.html?key='+val+'">'+val+'</a></li>').insertBefore($("li.espc"));
                }

                setLocalstorage("key",JSON.stringify(arr));

                window.location.href="list.html?key="+val;
            }
        });

        vm.getVersion();
        avalon.scan();
    });

})();