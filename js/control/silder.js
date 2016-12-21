/**
 * Created by hulgy on 15/4/2.
 */
//所有js初始化以及一些小动作比如input框的默认值
var Init=function(){
    this.init();
};
Init.prototype={
    //入口函数
    init:function(){
        if($("#banner").length>=1){
            this.silderInit();
        }
    },
    //silder初始化
    silderInit:function(){
        var list = [
            //{content: '<a href="javascript:;"><img src="../../data-images/b1.jpg"></a>'},
            //{content: '<a href="javascript:;"><img src="../../data-images/b1.jpg"></a>'},
            //{content: '<a href="javascript:;"><img src="../../data-images/b1.jpg"></a>'},
            //{content: '<a href="javascript:;"><img src="../../data-images/b1.jpg"></a>'},
            //{content: '<a href="javascript:;"><img src="../../data-images/b1.jpg"></a>'}
        ];
        $("#temp-data").find("li").each(function(){
            var json={};
            json.content=$(this).html();
            list.push(json);
        });
        //<a href="javascript:;"><img src="../../data-images/b1.jpg"></a>
        var opts = {
            type: 'dom',
            data: list,
            dom: document.getElementById("banner"),
            isLooping: true,
            onslideend:function(){
                echo.init();
            }
        };
        var	islider = new iSlider(opts);
        islider.addDot();
        $("#banner").append($(".islider-dot-wrap"));
    }
};

