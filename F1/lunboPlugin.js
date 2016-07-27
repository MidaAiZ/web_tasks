/**
 * Created by Sinner on 2016/7/25.
 */
;
(function($){

    var imgSize = 0;
    var interval = null;
    var startX = 0;
    var current = 0;
    var newCSS = null;
    var $imgList = null;
    var $numContainer = null;
    var containerJS = null;

//定义私有函数  供内部调用
    var privateMethods={
        show : function(current) {
            if($imgList != null) {
                $imgList.eq(current).css("display","list-item").siblings().css("display","none");
            }
            if($numContainer != null) {
                try {
                    $numContainer.children("li").eq(current).css(newCSS.activeCSS).siblings().css(newCSS.normalCSS);
                } catch (e) {
                    console.warn("样式初始化出错,传入格式有误！");
                }
            }
        },
        autoShow : function() {
            if(current>=(imgSize-1)) {
                current=0;
            } else {
                current++;
            }
            privateMethods.show(current);
        },
        slideStart : function (event){
            event.preventDefault();
            var touch=event.touches[0];
            startX=touch.pageX;
            containerJS.addEventListener("touchmove",privateMethods.slideMove,false);
            clearInterval(interval);
        },
        slideMove : function(event){
            event.preventDefault();
            var touch=event.touches[0];
            var x=touch.pageX;

            if (x - startX < -5 ) {
                current++;
            }else if (x-startX > 5) {
                current--;
            }
            if (current <= -1){
                current=imgSize-1;
            }else if (current > (imgSize-1)){
                current=0;
            }
            privateMethods.show(current);
            interval=setInterval(privateMethods.autoShow,2000);
            containerJS.removeEventListener("touchmove",privateMethods.slideMove,false);
        }
    }

//插件函数及默认数据
    var methods={
        defaultsCSS : {
            "normalCSS": {"list-style" : "none",   //设置图片为未显示状态下图片底部显示数量的标签CSS
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
            "activeCSS" : {"background":"red"}   //设置图片为显示状态下底部示数标签CSS
        },

        init : function() {
                //初始化，获取图片父级容器和位于图片底部显示图片数量的标签父级容器
                $imgList=this.find("[data-role ~= image-list]");
                $numContainer=this.find("[data-role ~= number-container]");
                imgSize = $imgList.size();

                //以下非空判断无效 待解决  因为即使未找到节点$imgList和$numContainer也会被赋予object类型和属性
                if($imgList == null) {$.error("找不到图片列表！请确认list节点是否正确设置属性：data-role = 'image-list'") }
                if($numContainer == null) {console.warn("找不到属性含data-role = 'number-container'的ul节点，无法设置图片轮播的示数标签！") }

                if($numContainer != null) {
                    for (var i = 1; i <= imgSize; i++) {	//创建图片个数相对应的底部数字个数
                        var li = $("<li></li>").attr("data-role", "number-list");//创建li标签，并插入到页面中
                        $numContainer.append(li);
                    }
                }
                $imgList.eq(0).css("display","list-item").siblings().css("display","none");
                if($numContainer != null) {methods.setNumStyle();}

            return this;
        },
        setNumStyle: function() {
            if($numContainer != null){
                if(typeof arguments[0] === "object"){   //当传入CSS样式参数
                    this.style = arguments[0];
                    newCSS = $.extend({},methods.defaultsCSS,this.style);
                    $numContainer.find("[data-role ~= number-list]").css(newCSS.normalCSS);
                } else {                                //未传入CSS样式参数  使用默认
                    newCSS = methods.defaultsCSS;
                    $numContainer.find("[data-role ~= number-list]").css(methods.defaultsCSS.normalCSS);
                }

                $numContainer.find("[data-role ~= number-list]").eq(current).css(newCSS.activeCSS);
            }
            return this;
        },
        startShow : function() {                    //
            if ( !isNaN(arguments[0])){   //判断传入参数是否为数字
                interval=setInterval(privateMethods.autoShow,arguments[0]);
            } else {
                interval=setInterval(privateMethods.autoShow,2000);
            }
            return this;
        },
        stopShow: function() {                      //
            return this.each(clearInterval(interval));
        },
        onSlide: function() {
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
            current=index;           //重新定位当前播放的图片
            privateMethods.show(index);
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
