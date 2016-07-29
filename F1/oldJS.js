/**
 * Created by Sinner on 2016/7/25.
 */
$(document).ready(function(){
    var startX= 0;
    var container=document.getElementById("container");
    const IMGSIZE=$(".img-ul li").size();
    var current=0;
    for(var i=1;i<=IMGSIZE;i++){	//创建图片个数相对应的底部数字个数
        var li="<li>"+i+"</li>";	//创建li标签，并插入到页面中
        $(".num-ul").append(li);
    }
    $(".img-ul li").eq(0).addClass("show");
    $(".num-ul li").eq(0).addClass("show");

    function autoShow() {
        if(current>=(IMGSIZE-1)) {
            current=0;
        } else {
            current++;
        }
        show(current);
    }
    function leftBtnClick() {
        current--;
        if (current <= -1) {
            current = 5;
        }
        show(current);
    }
    function rightBtnClick() {
        if (current < (IMGSIZE-1)) {
            current++;
        } else {
            current=0;
        }
        show(current);
    }
    function show(current) {
        $(".img-ul li").eq(current).addClass("show").siblings().removeClass("show");
        $(".num-ul li").eq(current).addClass("show").siblings().removeClass("show");
    }
    function slideStart(event){
        event.preventDefault();
        var touch=event.touches[0];
        startX=touch.pageX;
        container.addEventListener("touchmove",slideMove,false);
        clearInterval(interval);
    }
    function slideMove(event){
        event.preventDefault();
        var touch=event.touches[0];
        var x=touch.pageX;

        if (x - startX < -5 ) {
            current++;
        }else if (x-startX > 5) {
            current--;
        }
        if (current <= -1){
            current=IMGSIZE-1;
        }else if (current > (IMGSIZE-1)){
            current=0;
        }
        show(current);
        interval=setInterval(autoShow,2000);
        container.removeEventListener("touchmove",slideMove,false);
    }

    var interval=setInterval(autoShow,2000);
    $(".left-btn").bind("click",leftBtnClick);
    $(".right-btn").bind("click",rightBtnClick);
    container.addEventListener("touchstart",slideStart);
    $(".container").hover(function(){
        clearInterval(interval);
    },function(){
        interval=setInterval(autoShow,2000);
    })
    $(".num-ul li").mousemove(function(){
        current=$(this).index();
        show(current);
    })
})
/**
 * Created by Sinner on 2016/7/28.
 */
