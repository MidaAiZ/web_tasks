/**
 * Created by Sinner on 2016/8/2.
 */

;(function($){


    var inner = function(container) {

        var $container = container;     //轮播容器

        var imgSize = 0;           //需要轮播的图片张数
        var startX = 0;            //开始滑动屏幕时的初始坐标
        var stopX = 0;
        var current = 0;           //当前正在轮播的图片的索引号
        var last = 0;
        var $imgList = null;       //需要轮播的图片<li>节点数组
        var $numContainer = null;  //示数栏父容器
        var containerJS = null;    //图片<li>节点的JS原生父节点
        var $btnContainer = null;
        var isInited = false;


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
                   case "card" : {
                       if(current < last){
                           $imgList.removeClass("card-in card-right-in card-right-out").eq(current).addClass("card-in");
                           $imgList.removeClass("card-out card-right-in card-right-out").eq(last).addClass("card-out");
                       } else {
                           $imgList.removeClass("card-right-in card-in card-out").eq(current).addClass("card-right-in");
                           $imgList.removeClass("card-right-out card-in card-out").eq(last).addClass("card-right-out");}}break;
                   case "none" : {
                       $imgList.eq(current).addClass("show").siblings().removeClass("show");}break;
                   case "fade" :    //默认切换特效
                   default : {
                       $imgList.eq(current).addClass("fade").fadeIn("slow").siblings().removeClass("fade").fadeOut("slow");

                   }
               }
                //这里先判断一下是否有示数栏
                if($numContainer) {
                    $numContainer.find(".num-list").eq(current).addClass("active").fadeOut(0).fadeIn("slow").siblings().removeClass("active");
                }
            },
            autoShow : function() {      //自动轮播函数 包含图片切换逻辑， 被startShow()通过setInterval调用
                if (!$container.data("autoShow")) { return };
                last = current;
                if(current >= (imgSize-1)) {     //如果当前显示到了最后一张则下一张即切换到第一张
                    current = 0;
                } else {
                    current++;
                }
                privateMethods.show(current);
            },

            //移动端触屏事件处理
            touchStart : function (event) {      //屏幕触摸开始时触发
                event.preventDefault();
                var touch = event.touches[0];     //开始触摸，获取第一个触摸点
                startX=touch.pageX;             //记录X坐标
                methods.stopShow(true); //移动端不支持hover暂停 所以在触屏的时候暂停自动轮播
            },
            touchMove : function(event){        //触摸滑动时触发
                event.preventDefault();
                var touch = event.touches[0];      //获取滑动的第一点，记录X坐标
                stopX = touch.pageX;
            },
            touchEnd : function() {
                setTimeout(function() {methods.stopShow(false)},$container.data("setInterval")); //停止滑动的时候恢复自动轮播
                privateMethods.eventEnd();     //切换图片 endEvent()是触摸结束后图片切换的逻辑函数，函数在下方
            },
            //PC端拖拽切图事件处理
            // 值得注意的是各主流浏览器对图片拖拽的处理都不一样 360浏览器甚至会在拖拽后打开新网页 暂时无法阻止类似行为
            onDragStart : function(event) {     //拖拽开始时触发
                startX = event.clientX;          //开始拖拽，获取开始坐标;
            },
            onDragEnd : function(event) {      //拖拽结束时触发
                event.preventDefault();
                stopX = event.clientX;           //结束拖拽，获取结束坐标
                privateMethods.eventEnd();
            },
            eventEnd : function() {             //触摸或拖拽结束时触发 负责图片的切换逻辑
                if (stopX - startX < -20 ) {     //左滑距离>5切换到上一张
                    last = current;
                    current++;
                    if (current > (imgSize-1)){current = 0;}
                    privateMethods.show("prev");
                }else if (stopX-startX > 20) {    //右滑距离>5切换到下一张
                    last = current;
                    current--;
                    if (current <= -1){current = imgSize-1;}
                    privateMethods.show();
                }
            },

            //PC端拖拽事件处理


        }

        var defaults = {
            setNumber : true,
            setButton : true,
            setInterval : 3000,
            touchSwitch : true,
            dragSwitch : true,
            switchEffect : "fade",
            autoShow : true,
            hoverStop : true,
            numStyle : "rect"
        }
        var methods = {

            init: function() {     //初始化，获取图片父级容器和位于图片底部用于显示图片数量的示数栏父级容器

                if(isInited){ alert("has");return this};
                $imgList = $container.find(".image-container li");
                imgSize = $imgList.size();
                console.log(imgSize);
                $container.data($.extend({},defaults,arguments[0]));
                //如果找不到图片列表则报错  咱大图片轮播插件都找不到图片了还怎么玩
                if (imgSize == 0) {
                    $.error("找不到图片列表！请确认list节点是否正确设置属性：class = 'image-list'")
                }

              $imgList.find("img").css({"width":$imgList.parent().css("width"),"height":$imgList.parent().css("height"),"overflow":"hidden"}); //控制图片大小

              containerJS = $imgList.parent()[0];

              methods.setButton($container.data("setButton"));
              methods.setNumber($container.data("setNumber"));
              methods.setSlideSwitch($container.data("touchSwitch"));
              methods.setDragSwitch($container.data("dragSwitch"));
              methods.hoverStop($container.data("hoverStop"));

              if($container.data("switchEffect") === "card"){
                 $imgList.eq(current).addClass("card-right-in");
              } else if ($container.data("switchEffect") === "none"){
                  $imgList.eq(current).addClass("show");
              } else {
                  $imgList.eq(current).addClass("fade").fadeIn("slow");
              }
              methods.startShow();
              isInited = true;

              return this;
            },
            setNumber: function (opt) {       //设置示数栏样式
                if (!opt && $numContainer) {
                    $numContainer.find(".num-list").off("mouseenter").end().remove();
                    $numContainer = null;
                } else {
                    if ($numContainer) { return this};  //防止重复设置示数栏
                    $numContainer = $("<div class='num-container'><ul class='num-ul'></ul></div>");
                    for (var i = 0 ; i < imgSize ; i++){
                        $numContainer.find(".num-ul").append($("<li class='num-list'></li>"));
                    }
                    $container.append($numContainer);
                    methods.setNumStyle();
                    $container.find(".num-list").on("mouseenter",function(event) {
                        last = current;
                        current =  $(event.target).index();
                        privateMethods.show(current);
                    });
                }
                return this;
            },
            setNumStyle : function(opt) {
                if (!$numContainer) {return this}
                if(typeof opt === "string"){
                    var oldStyle =  $container.data("numStyle");
                    $container.data("numStyle",opt)
                }
                $numContainer.find(".num-list").removeClass(oldStyle).addClass($container.data("numStyle")).eq(current).addClass("active").siblings().removeClass("active");
                return this;
            },
            setButton : function(opt) {
                if (!opt && $btnContainer) {
                    $btnContainer.find(".btn").off("click").end().remove();
                    $btnContainer = null
                } else {
                    if ($btnContainer) {return this};  //防止重复设置按钮
                    $btnContainer = $("<div class='btn-container'><button class='btn btn-left'><</button><button class='btn btn-right'>></button></div>");
                    $container.append($btnContainer);
                    $btnContainer.find(".btn-left").on("click",
                        function () {methods.prev()}).next().on("click", function () {methods.next()});
                }
                return this;
            },
            startShow: function () {     //开始自动轮播
                setTimeout( function() { privateMethods.autoShow(); methods.startShow() }, $container.data("setInterval"));
                return this;
            },
            stopShow: function (opt) {              //停止自动轮播
                if (opt || opt === undefined) {     //传入true或未传入参数默认停止图片轮播
                    $container.data("autoShow",false);
                } else {                            //当传入false时继续图片轮播
                    $container.data("autoShow",true);
                }
            },
            setSlideSwitch : function (opt) {       //设置触屏滑动切换图片
                //jQuery不支持绑定屏幕触摸事件  采用js原生语法和节点进行绑定
                if (containerJS && (opt || opt === undefined)) {    //传入true或未传入参数默认设置触屏切图
                    containerJS.addEventListener("touchstart", privateMethods.touchStart,false);
                    containerJS.addEventListener("touchmove", privateMethods.touchMove,false);
                    containerJS.addEventListener("touchend", privateMethods.touchEnd,false);
                } else if(containerJS !== null) {   //传入false停止触屏切图
                    try{    //包裹在try-catch中 防止用户未绑定事件企图就解绑的情况
                    containerJS.removeEventListener("touchstart",privateMethods.touchStart);
                    containerJS.removeEventListener("touchmove",privateMethods.touchMove);
                    containerJS.removeEventListener("touchend",privateMethods.touchEnd);
                    } catch (error){ console.warn(error)}
                }
                return this;
            },
            setDragSwitch : function(opt) {
                if (containerJS !== null && (opt || opt === undefined)) {     //传入true或未传入参数默认设置拖拽切图
                    containerJS.ondragstart = privateMethods.onDragStart;
                    containerJS.ondragend = privateMethods.onDragEnd;
                } else if (containerJS !== null){   //传入false停止拖拽切图
                    containerJS.ondragstart = {};
                    containerJS.ondragend = {};
                }
                return this;
            },
            prev: function () {      //切换到上一张
                last = current;
                current--;
                if (current < 0) {
                    current = imgSize - 1;
                }
                privateMethods.show();
                return this;
            },
            next: function () {      //切换到下一张
                last = current;
                current++;
                if (current > (imgSize - 1)) {
                    current = 0;
                }
                privateMethods.show();
                return this;
            },
            setInterval : function(opt) {
                if (!isNaN(opt)) { $container.data("setInterval",opt);}
                return this;
            },
            getCurrent : function() {
                return current;     //返回当前正在播放的图片索引号
            },
            gotoImg : function(index) {
                if ( isNaN(index) || (index < 0 || index >(imgSize - 1))) {    //传入非数字或数字对应的图片不存在，不执行
                    return this;
                };
                last = current;
                current = index;
                privateMethods.show();
                methods.stopShow(true);     //切换到指定图片后在setInterval的时长内暂停轮播
                setTimeout(function() {methods.stopShow(false)} , $container.data("setInterval"));
                return this;
            },
            hoverStop : function(opt) {
                if (opt || opt === undefined) {  //传入ture或未差传入参数时默认设置鼠标进入时停止轮播
                     $container.hover(
                        function (){$container.data("autoShow",false);},
                        function() {$container.data("autoShow",true);});
                } else {
                    $container.off('mouseenter').unbind('mouseleave');   //传入false解绑 鼠标滑入后将不再停止轮播
                }
                return this;
            }
        }
    }

    $.fn.createLunbo = function() {
        var newLunbo = new inner(this)
        if(typeof arguments[0] === "object"){
            newLunbo.lunbo(arguments[0]);
            return newLunbo;
        } else {
            newLunbo.lunbo();
            return newLunbo;
        }

    }
})(jQuery);
