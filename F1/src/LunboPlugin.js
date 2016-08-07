;(function($){

    var inner = function(container) {   //内层函数，插件逻辑

        var $container = container;//轮播主容器

        var imgSize = 0;           //需要轮播的图片张数
        var startX = 0;            //开始触屏或鼠标拖拽图片时的初始坐标
        var stopX = 0;             //结束触屏或鼠标拖拽图片时时的X坐标
        var current = 0;           //当前正在播放的图片的索引号
        var last = 0;              //上一张被播放的图片的索引号
        var $imgList = null;       //需要轮播的图片<li>节点数组
        var $numContainer = null;  //示数栏父容器节点
        var containerJS = null;    //图片节点的JS原生父节点
        var $btnContainer = null;  //按钮父容器节点
        var isInited = false;      //插件是否已被初始化


        this.lunbo = function () {
            var method = arguments[0];
            if(methods[method] && isInited) {          //当传入方法存在时调用指定方法
                method = methods[method];
                return method.apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (!isNaN(method) && isInited){     //传入数字则转跳的指定索引号的图片
                return methods.gotoImg(method);         //转跳到指定图片的函数
            } else if ((typeof method === "object") || !method){  //未设置参数 或传入对象调用init
                method = methods.init;
                return method.apply(this, Array.prototype.slice.call(arguments, 0));
            }
            else {                        //参数错误 方法不存在
                $.error("函数: " + method + "不存在或未输入参数！");
            }
        };

        var privateMethods = {

            show : function() {  //显示当前需要播放的图片+设置当前播放的图片对应示数栏内的标签样式
                //处理回调函数
                if ($.isFunction($container.data("onSwitchStart"))) {   //判断传入的是否是函数
                    $container.data("onSwitchStart")(event,current);
                }
               switch($container.data("switchEffect")){         //插件支持不同的切换动画，这里对动画进行选择显示
                   case "card" : {          //卡片式切换动画
                       if(current < last){  //卡片切换动画是由两组animation配合共同完成的，所以需根据当前播放的图片和上一张的先后关系播放动画
                           $imgList.removeClass("card-right-in card-in card-out").eq(current).addClass("card-right-in");
                           $imgList.removeClass("card-right-out card-in card-out").eq(last).addClass("card-right-out");
                       } else {
                           $imgList.removeClass("card-in card-right-in card-right-out").eq(current).addClass("card-in");
                           $imgList.removeClass("card-out card-right-in card-right-out").eq(last).addClass("card-out");
                          }}break;
                   case "none" : {      //无特效
                       $imgList.eq(current).addClass("show").siblings().removeClass("show");}break;
                   case "fade" :        //默认切换特效  渐变
                   default : {
                       $imgList.eq(current).addClass("fade").fadeIn("slow").siblings().removeClass("fade").fadeOut("slow");

                   }
               }
                //设置示数栏active样式，这里先判断一下是否有示数栏
                if($numContainer) {
                    $numContainer.find(".num-list").eq(current).addClass("active").fadeOut(0).fadeIn("slow").siblings().removeClass("active");
                }
                //处理回调函数
                if ($.isFunction($container.data("onSwitchEnd"))) {
                    $container.data("onSwitchEnd")(event,current+1);
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
                methods.stop(); //移动端不支持hover暂停 所以在触屏的时候暂停自动轮播
            },
            touchMove : function(event){        //触摸滑动时触发
                event.preventDefault();
                var touch = event.touches[0];      //获取滑动的第一点，记录X坐标
                stopX = touch.pageX;
            },
            touchEnd : function() {
                setTimeout(methods.resume,$container.data("interval")); //停止滑动的时候恢复自动轮播
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
                    last = current;               //记录当前正在播放的图片索引号，并将其赋给last
                    current++;
                    if (current > (imgSize-1)){current = 0;}    //若当前已经播放到最后一张图片则回到第一张图片
                }else if (stopX-startX > 20) {    //右滑距离>5切换到下一张
                    last = current;
                    current--;
                    if (current <= -1){current = imgSize-1;}    //当向左滑动时若已经滑到第一张图片则显示最后一张图片
                }
                privateMethods.show();
            },
        }

        var defaults = {
            button : true,          //是否显示按钮
            number : true,          //是否显示示数栏
            interval : 3000,        //图片播放间隔
            swipeSwitch : true,     //是否支持触屏切图
            dragSwitch : true,      //是否支持拖拽切图
            switchEffect : "fade",  //切图动画特效 有card/none/fade可选，默认fade
            autoShow : true,        //是否自动轮播，此项如果选false则图片不会自动轮播
            hoverStop : true,       //是否当鼠标悬浮在图片上时暂停播放
            numStyle : "rect",       //样式栏风格 预设rect,circle两项可选，可自定义，传入css样式名字即可
            onSwitchStart : null,    //开始切换图片时的回调函数
            onSwitchEnd : null,      //结束切换图片时的回调函数
        }
        var methods = {

            init: function() {     //初始化

                if(isInited){ return this };//插件只允许初始化一次 如果支持初始化多次会增加很多代码 意义不大
                $imgList = $container.find(".image-container li");  //找到图片
                imgSize = $imgList.size();
                $container.data($.extend({},defaults,arguments[0]));    //合并默认参数，保存在$container data函数中
                //如果找不到图片列表则警告
                if (imgSize == 0) {
                    $.error("找不到图片列表！插件初始化失败！")
                }
                //控制图片大小
              $imgList.find("img").css({"width":$imgList.parent().css("width"),"height":$imgList.parent().css("height"),"overflow":"hidden"});
                //获取图片父级原生的js节点，处理触屏时使用
              containerJS = $imgList.parent()[0];
                //初始化执行函数
              methods.setButton($container.data("button"));
              methods.setNumber($container.data("number"));
              methods.setSwipeSwitch($container.data("swipeSwitch"));
              methods.setDragSwitch($container.data("dragSwitch"));
              methods.setHoverStop($container.data("hoverStop"));
                //以动画效果显示第一张图片
              if($container.data("switchEffect") === "card"){
                 $imgList.eq(current).addClass("card-in");
              } else if ($container.data("switchEffect") === "none"){
                  $imgList.eq(current).addClass("show");
              } else {
                  $imgList.eq(current).addClass("fade").fadeIn("slow");
              }
              methods.startShow();  //初始化完成，开始轮播
              isInited = true;      //已初始化

              return this;
            },
            setNumber: function (opt) {       //设置示数栏
                if (opt === false && $numContainer) {   //传入false并且已存在示数栏，则移除示数栏
                    $numContainer.find(".num-list").off("mouseenter").end().remove();
                    $numContainer = null;
                } else if (opt || opt === undefined) {    //未传入参数或者传入true添加示数栏
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
            setNumStyle : function(opt) {       //设置示数栏样式
                if (!$numContainer) {return this}   //不存在示数栏则不执行
                if(typeof opt === "string"){
                    var oldStyle =  $container.data("numStyle");
                    $container.data("numStyle",opt)
                }
                $numContainer.find(".num-list").removeClass(oldStyle).addClass($container.data("numStyle")).eq(current).addClass("active").siblings().removeClass("active");
                return this;
            },
            setButton : function(opt) {     //设置按钮
                if (opt === false && $btnContainer) {
                    $btnContainer.find(".btn").off("click").end().remove();
                    $btnContainer = null
                } else if (opt || opt === undefined) {
                    if ($btnContainer) {return this};  //防止重复设置按钮
                    $btnContainer = $("<div class='btn-container'><button class='btn btn-left'></button><button class='btn btn-right'></button></div>");
                    $container.append($btnContainer);
                    $btnContainer.find(".btn-left").on("click",methods.prev).next().on("click",methods.next);
                }
                return this;
            },
            startShow: function () {     //开始自动轮播
                setTimeout( function() { privateMethods.autoShow(); methods.startShow() }, $container.data("interval"));
                return this;
            },
            stop : function() {     //暂停轮播
                $container.data("autoShow",false);
                return this;
            },
            resume : function() {       //恢复轮播
                $container.data("autoShow",true);
                return this;
            },
            setSwipeSwitch : function (opt) {       //设置触屏滑动切换图片
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
            setInterval : function(opt) {       //设置轮播间隔
                if (!isNaN(opt)) { $container.data("interval",opt);}
                return this;
            },
            current : function() {      //返回当前正在播放的图片索引号
                return current;
            },
            gotoImg : function(index) {     //转跳到指定图片
                if ( isNaN(index) || (index < 0 || index >(imgSize - 1))) {    //传入非数字或数字对应的图片不存在，不执行
                    return this;
                };
                last = current;
                current = index;
                privateMethods.show();
                methods.stop();    //切换到指定图片后在setInterval的时长内暂停轮播
                setTimeout(methods.resume,$container.data("interval"));
                return this;
            },
            setHoverStop : function(opt) {      //设置鼠标悬浮时是否停止轮播
                if (opt || opt === undefined) {  //传入ture或未差传入参数时默认设置鼠标进入时停止轮播
                     $container.hover( methods.stop,methods.resume);
                } else {
                    $container.off('mouseenter').unbind('mouseleave');   //传入false解绑 鼠标滑入后将不再停止轮播
                }
                return this;
            }
        }
    }

    $.fn.createLunbo = function() {     //初始化插件的外层函数，返回一个新的inner内层函数，实现多例化
        var newLunbo = new inner(this)
        newLunbo.lunbo(arguments[0]);
        return newLunbo;
    }
})(jQuery);
