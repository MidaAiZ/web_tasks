/**
 * Created by Sinner on 2016/8/8.
 */

function onFocus(event) {
    switch(event.target){
        case document.getElementById("id-panel") :
        case document.getElementById("email-id") :
        {
            //添加动画版class属性
            addClass(document.getElementById("label-id"),"change-label");
            addClass(document.getElementById("email-id"),"change-input");
            document.getElementById("email-id").focus();
        };break;

        case document.getElementById("pwd-panel") :
        case document.getElementById("email-pwd") :
        {
            addClass(document.getElementById("label-pwd"),"change-label");
            addClass(document.getElementById("email-pwd"),"change-input");
            document.getElementById("email-pwd").focus();
        };break;
    }
}
function onBlur(event) {
    switch(event.target){
        case document.getElementById("email-id") :
        {
            if(event.target.value.length === 0) {
                removeClass(document.getElementById("label-id"), "change-label");
                removeClass(document.getElementById("email-id"), "change-input");
            }
        };break;

        case document.getElementById("email-pwd") :
        {
            if(event.target.value.length === 0) {
                removeClass(document.getElementById("label-pwd"), "change-label");
                removeClass(document.getElementById("email-pwd"), "change-input");
            }
        };break;
    }
}
//绑定移动端触摸事件
document.getElementById("label-id").addEventListener("touchstart",function(event) {onFocus(event)})
document.getElementById("label-pwd").addEventListener("touchstart",function(event) {onFocus(event)})
//添加class属性
function addClass(ele,newClass){
    if (ele.className.indexOf(" "+newClass) === -1) {   //防止重复添加
        ele.className += " "+newClass;
    }
}
//移除class属性
function removeClass(ele,oldClass){
    if (ele.className.indexOf(" "+oldClass) !== -1) {
        ele.className =  ele.className.replace(" "+oldClass,"");
    }
}

function onChange(event) {
//            switchEffect
}

