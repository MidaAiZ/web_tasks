/**
 * Created by Sinner on 2016/8/2.
 */

;(function($){


    var inner = function(container) {

        var $container = container;

        var imgSize = 0;           //需要轮播的图片张数
        var interval = null;       //存放setInterval函数的返回值
        var startX = 0;            //开始滑动屏幕时的初始坐标
        var stopX = 0;
        var current = -1;           //当前正在轮播的图片的索引号
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
            show : function(current) {  //显示当前需要播放的图片+设置当前播放的图片对应示数栏内的标签样式
                $imgList.eq(current).addClass("show").siblings().removeClass("show");
                //这里先判断一下是否有示数栏
                if($numContainer) {
                    $numContainer.find(".num-ul .num-list").eq(current).addClass("active").siblings().removeClass("active");
                }
            },
            autoShow : function() {      //自动轮播函数 包含图片切换逻辑， 被startShow()通过setInterval调用
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
                //containerJS.addEventListener("touchend",privateMethods.slideMove,false);   //绑定触摸滑动事件
            },
            touchMove: function(event){        //滑动切换图片的函数
                event.preventDefault();
                var touch = event.touches[0];      //获取滑动的第一点，记录X坐标
                stopX = touch.pageX;
            },
            eventEnd : function() {
                if (stopX - startX < -5 ) {     //左滑距离>5切换到上一张  不要我问我为什么不是下一张^O^
                    current++;
                }else if (stopX-startX > 5) {    //右滑距离>5切换到下一张
                    current--;
                }
                if (current <= -1){
                    current = imgSize-1;
                }else if (current > (imgSize-1)){
                    current = 0;
                }
                privateMethods.show(current);       //切换图片
            },

            //PC端拖拽事件处理

            onDragStart : function(event) {
                startX = event.clientX;
            },
            onDrag : function(event){
                //event.target.style.cursor();
                console.log(event.target+"  is onDrag");
            },
            onDragOver : function(event) {
                stopX = event.clientX;
                //event.target.style.cursor("pointer");
                console.log("dragover");
                privateMethods.eventEnd();
            }
        }

        var defaults = {
            setNumber : true,
            setButton : true,
            setInterval : 2000,
            touchSwitch : true,
            dragSwitch : true,
            switchEffect : "slideX"
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

              $imgList.find("img").css({"width":$container.css("width"),"height":$container.css("height"),"overflow":"hidden"}); //控制图片大小

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
              //if (defaults.stopHover) {methods.startShow()};

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

                $container.find(".num-list").on("mousemove",function(event) {
                    current =  $(event.target).index();
                    privateMethods.show(current);
                });

                return this;
            },
            setNumberStyle : function() {

            },
            setButton : function() {
                $btnContainer = $("<div class='btn-container'></div>");
                var $leftBtn = $("<button class='btn btn-left'><</button>");
                var $rightBtn = $("<button class='btn btn-right'>></button>");
                $btnContainer.append($leftBtn).append($rightBtn);
                $container.append($btnContainer);
                $leftBtn.on("click",function(){methods.prev()})
                $rightBtn.on("click",function(){methods.next()});
                return this;
            },
            startShow: function () {     //开始自动轮播

                privateMethods.autoShow();
                setTimeout(methods.startShow, $container.data("setInterval"));
                //console.log("autoShow2");
                //console.log($container.data("setInterval"));

                return this;
            },
            stopShow: function () {     //停止自动轮播
                return this.each(clearInterval(interval));   //WWW  热死宝宝了
            },
            setSlideSwitch : function () {       //设置触屏滑动切换图片
                //jQuery不支持绑定屏幕触摸事件  采用js原生语法和节点进行绑定
                if (containerJS != null) {
                    containerJS.addEventListener("touchstart", privateMethods.touchStart);
                    containerJS.addEventListener("touchmove", privateMethods.touchMove);
                    containerJS.addEventListener("touchend", privateMethods.eventEnd);
                } else {
                    $.error("滑动事件绑定监听失败，获取不到目标节点");
                }
                return this;
            },
            setDragSwitch : function() {
                if (containerJS != null) {
                    containerJS.ondragstart = function(event) { privateMethods.onDragStart(event) };
                    //containerJS.addEventListener("drag",privateMethods.onDrag(event));
                    containerJS.ondragend = function(event) {
                        event.preventDefault();
                        privateMethods.onDragOver(event)};
                }
            },
            prev: function () {      //上一张
                current--;
                if (current < 0) {
                    current = imgSize - 1;
                }
                privateMethods.show(current);
                return this;
            },
            next: function () {      //下一张
                current++;
                if (current > (imgSize - 1)) {
                    current = 0;
                }
                privateMethods.show(current);
                return this;
            },
            gotoImg: function (index) {   //跳转到指定张数的图片
                if ((index >= 0) && index < imgSize) {
                    current = index;           //重新定位当前播放的图片
                    privateMethods.show(index);
                }
                return this;
            },
            getIndex: function() {      //获取当前标签在同辈里的索引号
                return this.index();
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
