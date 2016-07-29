
$(document).ready(function(){

        $("#container").lunbo() //初始化  无默认参数
                       .lunbo("setNumStyle")
                       .lunbo("startShow" ,2000)//设置自动播放，可以添加播放时间间隔参数，也可不添加，默认2秒
                       .lunbo("onSlide")    //设置屏幕滑动切换图片
                        //设置当鼠标在图片上时停止轮播 移出时继续轮播↓
                       .hover(function(){$.fn.lunbo("stopShow")} , function(){$.fn.lunbo("startShow",2000)});
        /*给按钮监听点击事件  播放上一张 下一张
          * 之所以不对点击切换图片的事件进行封装是为了增加用户对插件的可控性
        */
        $(".left-btn").bind("click" , function(){$.fn.lunbo("prev")});
        $(".right-btn").bind("click" , function(){$.fn.lunbo("next")});
        $(".num-ul li").bind("mousemove" , function(){$.fn.lunbo("gotoImg",$(this).lunbo("getIndex")); });

        //$("#container").lunbo("setNumStyle",{
        //    "defaultsCSS" : {
        //        "width" : "10px",
        //        "height" : "10px",
        //        "border-radius" : "0px",
        //        "background" : "yellow"
        //        //...其它你想更改或增加的样式
        //    },
        //    "activeCSS" : {
        //        "border-radius" : "0px",
        //        "background":"blue"
        //        //...其它你想更改或增加的样式
        //    }
        //});
    });

        /**
         * PS：
         * 当宝宝把 lunbo("startShow" ,1）的参数设置成1之后我懵逼了  这哪是轮播插件...
         * 只要html不写图片示数的父容器标签 再配上声音  设置一下图片解码方式这就是电影插件了
         * 太感人了  T_T   WWW
         */
