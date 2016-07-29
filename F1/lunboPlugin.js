/**
 * Created by Sinner on 2016/7/25.
 */
;
(function($){

    var imgSize = 0;            //需要轮播的图片张数
    var interval = null;       //存放setInterval函数的返回值
    var startX = 0;            //开始滑动屏幕时的初始坐标
    var current = 0;           //当前正在轮播的图片的索引号
    var newCSS = null;         //合并用户传入参数后的示数栏的CSS样式
    var $imgList = null;       //需要轮播的图片<li>节点数组
    var $numContainer = null;  //示数栏父容器
    var containerJS = null;    //图片<li>节点的JS原生父节点

//定义私有函数  供内部调用
    var privateMethods={
        show : function(current) {
            $imgList.eq(current).css("display","list-item").siblings().css("display","none");
            //这里先判断一下是否有示数栏
            if($numContainer.length != 0) {
                //放入try-catch中，以防传入的CSS参数有误
                try {
                    $numContainer.children("[data-role ~= number-list]").eq(current).css(newCSS.activeCSS).siblings().css(newCSS.normalCSS);
                } catch (e) {
                    console.warn("CSS样式参数传入有误！");
                }
            }
        },
        autoShow : function() {      //自动轮播函数 包含图片切换逻辑， 被startShow()通过setInterval调用
            if(current>=(imgSize-1)) {     //如果当前显示到了最后一张则下一张即切换到第一张
                current=0;
            } else {
                current++;
            }
            privateMethods.show(current);
        },
        slideStart : function (event){      //屏幕触摸开始时调用的函数  在安卓上可以不用监听touchstart事件，但是ios必须要，否则无法触发滑动事件
            event.preventDefault();
            var touch=event.touches[0];     //开始触摸，获取第一个触摸点
            startX=touch.pageX;             //记录X坐标
            containerJS.addEventListener("touchmove",privateMethods.slideMove,false);   //绑定触摸滑动事件
            clearInterval(interval);        //解除自动轮播
        },
        slideMove : function(event){        //滑动切换图片的函数
            event.preventDefault();
            var touch=event.touches[0];      //获取滑动的第一点，记录X坐标
            var x=touch.pageX;

            if (x - startX < -5 ) {     //左滑距离>5切换到上一张  不要我问我为什么不是下一张^O^
                current++;
            }else if (x-startX > 5) {    //右滑距离>5切换到下一张
                current--;
            }
            if (current <= -1){
                current=imgSize-1;
            }else if (current > (imgSize-1)){
                current=0;
            }
            privateMethods.show(current);       //切换图片
            interval=setInterval(privateMethods.autoShow,2000);     //重新绑定interval自动轮播
            containerJS.removeEventListener("touchmove",privateMethods.slideMove,false);    //移除对触摸滑动的事件监听  为什么要这么做？ ↓↓↓
            /*
                为了手指在滑动屏幕一次的时候只切换一张图片而不是多张图片，当元素监听到了触摸滑动事件并切换一张图片后马上解绑对滑动事件的监听
                这样只要手指没抬起来继续触发touchstart事件即使继续滑动也不会继续切换图片了
                而当手指重新触屏的时候又激发了touchstart事件并通过slideStart（）函数对滑动事件重新注册监听
                这样就实现了滑一次只切换一张图片  如果不这样做滑动一次可能会切换好几张图片 具体是几张要看命
             */
        }
    }

//插件函数及默认数据
    var methods={
        defaultsCSS : {
            "normalCSS" : {       //设置图片为未显示状态下图片底部显示数量的示数栏标签CSS
                "list-style" : "none",
                "display" : "inline-block",
                "width" : "10px",
                "height" : "10px",
                "margin" : "5px",
                "border-radius" : "50%",
                "background" : "black",
                "opacity" : "0.7",
                "color" : "white",
                "text-align" : "center",
                "cursor" : "pointer"},
            "activeCSS" : {"background":"red"}   //设置图片为显示状态下底部示数栏标签CSS
        },

        init : function() {     //初始化，获取图片父级容器和位于图片底部用于显示图片数量的示数栏父级容器
                $imgList=this.find("[data-role ~= image-list]");
                $numContainer=this.find("[data-role ~= number-container]");
                imgSize = $imgList.size();

                //如果找不到图片列表则报错  咱大图片轮播插件都找不到图片了还怎么玩
                if(imgSize == 0) { $.error("找不到图片列表！请确认list节点是否正确设置属性：data-role = 'image-list'") }

                //如果用户添加了示数栏的父容器则根据图片数量添加<li>标签，如果找不到则不添加不报错  没准人家不想要示数栏呢
                if($numContainer.length != 0) {
                    for (var i = 1; i <= imgSize; i++) {	//创建图片个数相对应的底部数字个数
                        var li = $("<li></li>").attr("data-role", "number-list");//创建li标签，并插入到页面中
                        $numContainer.append(li);
                    }
                }
                $imgList.eq(0).css("display","list-item").siblings().css("display","none");
                if($numContainer != null) {methods.setNumStyle();}

            return this;
        },
        setNumStyle: function() {       //设置示数栏样式
            if($numContainer != null){
                if(typeof arguments[0] === "object"){   //当传入CSS样式参数
                    this.style = arguments[0];
                    newCSS = $.extend({},methods.defaultsCSS,this.style);
                    $numContainer.find("[data-role ~= number-list]").css(newCSS.normalCSS);
                } else {                                //未传入CSS样式参数  使用默认
                    newCSS = methods.defaultsCSS;
                    $numContainer.find("[data-role ~= number-list]").css(methods.defaultsCSS.normalCSS);
                }
                //给当前正在显示的图片对应示数栏标签设置activeCSS，如果不设置则在页面刚打开时正在显示的图片示数栏标签没法显示ActiveyangCSS样式
                $numContainer.find("[data-role ~= number-list]").eq(current).css(newCSS.activeCSS);
            }
            return this;
        },
        startShow : function() {     //开始自动轮播
            if ( !isNaN(arguments[0])){   //判断传入参数是否为数字
                interval=setInterval(privateMethods.autoShow,arguments[0]);
            } else {
                interval=setInterval(privateMethods.autoShow,2000);
            }
            return this;
        },
        stopShow: function() {     //停止自动轮播
            return this.each(clearInterval(interval));   //WWW  热死宝宝了
        },
        onSlide: function() {       //设置触屏滑动切换图片
            //jQuery不支持绑定屏幕触摸事件  采用js原生语法和节点进行绑定
            if($imgList.parent().attr("id") == undefined){
                $imgList.parent().attr("id","imgList-father")
            }
            var slideNodeId =  $imgList.parent().attr("id");
            containerJS=document.getElementById(slideNodeId);     //根据唯一ID设置监听屏幕滑动的节点
            if(containerJS != null){
                containerJS.addEventListener("touchstart",privateMethods.slideStart);
            } else {
                $.error("滑动事件绑定监听失败，获取不到目标节点");
            }
            return this;
        },
        prev: function() {      //上一张
            current--;
            if (current < 0) {
                current = 5;
            }
            privateMethods.show(current);
            return this;
        },
        next: function() {      //下一张
            current++;
            if (current > (imgSize-1)) {
                current=0;
            }
            privateMethods.show(current);
            return this;
        },
        gotoImg: function(index) {   //跳转到指定张数的图片
            if((index >=0) && index <imgSize) {
                current = index;           //重新定位当前播放的图片
                privateMethods.show(index);
            }
            return this;
        },
        getIndex : function() {      //获取当前标签在同辈里的索引号
            return this.index();
        },
        //destroy : function() {
        //    try{
        //    alert("destroyed!");
        //    imgSize = null;
        //    startX = null;
        //    current = null;
        //    $imgList = null;
        //    $numContainer = null;
        //    if(interval != null){
        //        clearInterval(interval);
        //        interval = null;
        //    }
        //    containerJS.removeEventListener("touchstart",privateMethods.slideStart);
        //    containerJS = null;
        //    }catch(e){}
        //    return this;
        //}
    }

    $.fn.lunbo=function(){
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

})(jQuery);
