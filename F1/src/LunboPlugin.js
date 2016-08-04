/**
 * Created by Sinner on 2016/8/2.
 */

;(function($){


    var inner = function(container) {

        var $container = container;

        var imgSize = 0;           //需要轮播的图片张数
        var startX = 0;            //开始滑动屏幕时的初始坐标
        var stopX = 0;
        var current = -1;           //当前正在轮播的图片的索引号
        var last = 0;
        var $imgList = null;       //需要轮播的图片<li>节点数组
        var $numContainer = null;  //示数栏父容器
        var containerJS = null;    //图片<li>节点的JS原生父节点
        var $btnContainer = null;

        var index = 0;
        this.lunbo = function () {
            var method = arguments[0];
            if(methods[method]) {          //当传入方法存在时调用指定方法
                method = methods[method];
                return method.apply(this, Array.prototype.slice.call(arguments, 1));
            } else if ((typeof method === "object") || !method){  //未设置参数 或传入JSON对象转跳  调用init
                method = methods.init;
                return method.apply(this, Array.prototype.slice.call(arguments, 0));
            } else {                        //参数错误 方法不存在
                $.error("函数: " + method + "不存在或未输入参数！");
            }

        };

        var privateMethods = {
            show : function() {  //显示当前需要播放的图片+设置当前播放的图片对应示数栏内的标签样式
               switch($container.data("switchEffect")){
                   case "cardX" : {
                       if(current > last){
                           console.log("left"+"last:"+last+"  current:"+current)
                           $imgList.eq(current).addClass("effect-cardX-in").siblings().removeClass("effect-cardX-in effect-cardX-right-in effect-cardX-right-out");
                           $imgList.eq(last).addClass("effect-cardX-out").siblings().removeClass("effect-cardX-out effect-cardX-right-in effect-cardX-right-out");
                       } else {
                           $imgList.eq(current).addClass("effect-cardX-right-in").siblings().removeClass("effect-cardX-right-in effect-cardX-in effect-cardX-out");
                           $imgList.eq(last).addClass("effect-cardX-right-out").siblings().removeClass("effect-cardX-right-out effect-cardX-in effect-cardX-out");}}break;
                   case "none" : {
                       $imgList.eq(current).addClass("show").siblings().removeClass("show");}break;
                   case "fade" :    //默认切换特效
                   default : {
                       $imgList.eq(current).addClass("effect-fade").fadeIn("slow").siblings().removeClass("effect-fade").fadeOut("slow");

                   }
               }
                //这里先判断一下是否有示数栏
                if($numContainer) {
                    $numContainer.find(".num-ul .num-list").eq(current).addClass("active").fadeOut(0).fadeIn("slow").siblings().removeClass("active");
                }
            },
            autoShow : function() {      //自动轮播函数 包含图片切换逻辑， 被startShow()通过setInterval调用
                last = current;
                if(current >= (imgSize-1)) {     //如果当前显示到了最后一张则下一张即切换到第一张
                    current = 0;
                } else {
                    current++;
                }
                privateMethods.show(current);
            },

            //移动端触屏事件处理
            touchStart : function (event) {      //屏幕触摸开始时调用的函数  在安卓上可以不用监听touchstart事件，但是ios必须要，否则无法触发滑动事件
                event.preventDefault();
                var touch = event.touches[0];     //开始触摸，获取第一个触摸点
                startX=touch.pageX;             //记录X坐标
            },
            touchMove : function(event){        //滑动切换图片的函数
                event.preventDefault();
                var touch = event.touches[0];      //获取滑动的第一点，记录X坐标
                stopX = touch.pageX;
            },
            eventEnd : function() {
                if (stopX - startX < -20 ) {     //左滑距离>5切换到上一张  不要我问我为什么不是下一张^O^
                    last = current;
                    current++;
                    if (current > (imgSize-1)){current = 0;}
                }else if (stopX-startX > 20) {    //右滑距离>5切换到下一张
                    last = current;
                    current--;
                    if (current <= -1){current = imgSize-1;}
                }
                privateMethods.show(current);
            },

            //PC端拖拽事件处理

            onDragStart : function(event) {
                startX = event.clientX;
            },
            onDragOver : function(event) {
                stopX = event.clientX;
                privateMethods.eventEnd();
            }
        }

        var defaults = {
            setNumber : true,
            setButton : true,
            setInterval : 3000,
            touchSwitch : true,
            dragSwitch : true,
            switchEffect : "cardX",
            autoShow : true,
            hoverStop : true
        }
        var methods = {

            init: function() {     //初始化，获取图片父级容器和位于图片底部用于显示图片数量的示数栏父级容器
                $imgList = $container.find(".image-container .img-ul li");
                imgSize = $imgList.size();
                console.log(imgSize);
                $container.data($.extend({},defaults,arguments[0]));
                //如果找不到图片列表则报错  咱大图片轮播插件都找不到图片了还怎么玩
                if (imgSize == 0) {
                    $.error("找不到图片列表！请确认list节点是否正确设置属性：class = 'image-list'")
                }

              //$imgList.find("img").css({"width":$container.css("width"),"height":$container.css("height"),"overflow":"hidden"}); //控制图片大小

                if ($imgList.parent().attr("id") == undefined) {
                    $imgList.parent().attr("id", "imgList-father")
                }
                var slideNodeId = $imgList.parent().attr("id");
                containerJS = $('#'+slideNodeId)[0];

              if (defaults.setButton) { methods.setButton(); };
              if (defaults.setNumber) { methods.setNumber(); };
              if (defaults.touchSwitch) { methods.setSlideSwitch(); };
              if (defaults.dragSwitch) {methods.setDragSwitch()};
              //if (defaults.gotoHover) {methods.setGotoHover()};
              if (defaults.hoverStop) {methods.hoverStop()};

              if($container.data("switchEffect") === "cardX"){
                 $imgList.eq(current).addClass("effect-cardX-in");
              } else if ($container.data("switchEffect") === "none"){
                  $imgList.eq(current).addClass("show");
              } else {
                  $imgList.eq(current).addClass("effect-fade");
              }

              methods.startShow();

              return this;
            },
            setNumber: function () {       //设置示数栏样式
                $numContainer = $("<div class='num-container'><ul class='num-ul'></ul></div>");
                for (var i = 0 ; i < imgSize ; i++){
                    $numContainer.find(".num-ul").append($("<li class='num-list'></li>"));
                    console.log( i+":"+$numContainer.find(".num-ul").length);
                }
                $numContainer.find(".num-ul .num-list").eq(current).addClass("active").siblings().removeClass("active");
                $container.append($numContainer);

                $container.find(".num-list").on("mouseenter",function(event) {
                    last = current;
                    current =  $(event.target).index();
                    privateMethods.show(current);
                });

                return this;
            },
            setNumberStyle : function() {
                //
            },
            setButton : function() {
                $btnContainer = $("<div class='btn-container'><button class='btn btn-left'><</button><button class='btn btn-right'>></button></div>");
                $container.append($btnContainer);
                $btnContainer.find(".btn-left").on("click",function(){methods.prev()}).next().on("click",function(){methods.next()});
                return this;
            },
            startShow: function () {     //开始自动轮播

                if ($container.data("autoShow")) {setTimeout(privateMethods.autoShow(), $container.data("setInterval"));};
                setTimeout(methods.startShow, $container.data("setInterval"));
                return this;
            },
            stopShow: function () {     //停止自动轮播
                $container.data("autoShow",false); //WWW  热死宝宝了
            },
            setSlideSwitch : function () {       //设置触屏滑动切换图片
                //jQuery不支持绑定屏幕触摸事件  采用js原生语法和节点进行绑定
                if (containerJS != null) {
                    containerJS.addEventListener("touchstart", privateMethods.touchStart);
                    containerJS.addEventListener("touchmove", privateMethods.touchMove);
                    containerJS.addEventListener("touchup",function(){console.log("touchup")});
                    containerJS.addEventListener("touchend", privateMethods.eventEnd);
                } else {
                    $.error("滑动事件绑定监听失败，获取不到目标节点");
                }
                return this;
            },
            setDragSwitch : function() {
                if (containerJS != null) {
                    containerJS.ondragstart = function(event) { privateMethods.onDragStart(event) };
                    containerJS.addEventListener("drag",function(event) {
                        event.preventDefault();
                    });
                    containerJS.ondragend = function(event) {
                        event.preventDefault();
                        privateMethods.onDragOver(event)};
                }
            },
            prev: function () {      //上一张
                last = current;
                current--;
                if (current < 0) {
                    current = imgSize - 1;
                }
                privateMethods.show(current);
                return this;
            },
            next: function () {      //下一张
                last = current;
                current++;
                if (current > (imgSize - 1)) {
                    current = 0;
                }
                privateMethods.show(current);
                return this;
            },
            gotoImg: function (index) {   //跳转到指定张数的图片
                if ((index >= 0) && index < imgSize) {
                    last = current;
                    current = index;           //重新定位当前播放的图片
                    privateMethods.show(index);
                }
                return this;
            },
            getIndex: function() {      //获取当前标签在同辈里的索引号
                return this.index();
            },
            hoverStop : function() {
                $container.hover(
                    //function() { methods.stopShow() },
                    function (){$container.data("autoShow",false);},
                    function() {$container.data("autoShow",true);}
                )
            }
        }
    }

    $.fn.createLunbo = function() {
        var newLunbo = new inner(this)
        if(arguments[0] === "object"){
            newLunbo.lunbo(arguments[0]);
            return newLunbo;
        } else {
            newLunbo.lunbo();
            return newLunbo;
        }

    }
})(jQuery);
/**
 * Created by Sinner on 2016/8/3.
 */
