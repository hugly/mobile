/**
 * Created by hulgy on 16/7/26.
 */

(function(){
    'use strict';

    require(['domReady!'],function(avalon){
        var vm = avalon.define({
            $id:'strategyindex',
            version:'',
            nowPageIndex:1,
            maxPageNum:1,
            loadingImgShow:true,
            strategy:[],
            opacity:0,
            guideTypeList:[
                {Name:'',Code:''},
                {Name:'',Code:''},
                {Name:'',Code:''},
                {Name:'',Code:''}
            ],
            //获取版本号
            getVersion:function(){
                getBaseVersion(function(rs){

                    var normalTop = $(window).scrollTop(),
                        fontSize=$(window).width()/16;

                    vm.version=rs;
                    vm.getBriefInfo(true);
                    vm.getBannerData();
                    vm.getStrateType();

                    if(normalTop >= fontSize*3){
                        vm.opacity = 1;
                    }

                    $(window).scroll(function(){
                        var top=$(window).scrollTop();

                        vm.opacity = (top/fontSize)/3;
                    });
                });
            },
            //获取攻略分类
            getStrateType:function(){
                jsonp(host+'/jsonp/Guide_GetCategory_'+vm.version+'.js',{
                    token:token
                },'callback',function(rs){
                    if(rs.Success){
                        vm.guideTypeList = rs.Data;
                    }
                },function(){
                });
            },
            //获取攻略信息
            getBriefInfo:function(type){
                if(type){
                    vm.strategy = [];
                    vm.loadingImgShow = true;
                }

                jsonp(host+'/jsonp/Guide_GetByPage_'+vm.version+'.js',{
                    token:token,
                    Page:vm.nowPageIndex,
                    PageSize:10
                },'callback',function(rs){
                    var data = rs.Data;
                    if(type){
                        vm.strategy = rs.Data;
                    }else{
                        for(var i= 0,j=data.length;i<j;i++){
                            vm.strategy.push(data[i]);
                        }
                    }
                    vm.loadingImgShow = false;
                    vm.maxPageNum = rs.TotalPages;
                },function(){
                });
            },
            //获取banner数据
            getBannerData:function() {
                jsonp(host + '/jsonp/Guide_Banner_' + vm.version + '.js', {
                    token: token
                }, 'callback', function (rs) {
                    vm.bannerData = rs;
                    vm.bannerInit();
                }, function () {
                }, 'getBannnerFn');
            },
            //banner初始化函数
            bannerInit:function(){
                var list = [];

                vm.bannerData.forEach(function(el){
                    var json={};
                    json.content='<a href="'+el.Href+'"><img src="'+el.Src+'"></a>';
                    list.push(json);
                });

                var opts = {
                    type: 'dom',
                    data: list,
                    dom: document.getElementById("banner"),
                    isLooping: true
                };
                var	islider = new iSlider(opts);
                islider.addDot();
                $("#banner").append($(".islider-dot-wrap"));

            }

        });

        var a = new $.scrollLoad({
            mainDiv: $(".strategylist ul"),
            buttonLength: 50,
            ajaxFn: function (){
                vm.nowPageIndex++;

                if(vm.nowPageIndex <= vm.maxPageNum){
                    vm.getBriefInfo(false);
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