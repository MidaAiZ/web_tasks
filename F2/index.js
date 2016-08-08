/**
 * Created by Sinner on 2016/8/8.
 */

function onFocus(event) {       //点击输入框周边或者输入框获取焦点，变大
    switch(event.target){
        case document.getElementById("id-panel") :      //id输入框
        case document.getElementById("email-id") :
        {
            //添加动画class属性
            addClass(document.getElementById("label-id"),"change-label");
            addClass(document.getElementById("email-id"),"change-input");
            document.getElementById("email-id").focus();
        };break;

        case document.getElementById("pwd-panel") :     //密码输入框
        case document.getElementById("email-pwd") :
        {
            addClass(document.getElementById("label-pwd"),"change-label");
            addClass(document.getElementById("email-pwd"),"change-input");
            document.getElementById("email-pwd").focus();
        };break;
    }
}
function onBlur(event) {    //输入框失去焦点  这时如果输入框内有文字输入框不会变小 如果没文字输入框会变小
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
document.onload=function() {
    document.getElementById("label-id").addEventListener("touchstart",function(event) {onFocus(event)})
    document.getElementById("label-pwd").addEventListener("touchstart",function(event) {onFocus(event)})
}

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

function checkForm() {
    var idCheckModal = document.getElementById("email-id").getAttribute("data");
    var pwdCheckModal = document.getElementById("email-pwd").getAttribute("data");
    var idValue = document.getElementById("email-id").value;
    var pwdValue = document.getElementById("email-pwd").value;
    if(check(idCheckModal,idValue) && check(pwdCheckModal,pwdValue)) {  //id输入框只允许输入数字，密码框允许数字 字母 下划线  故分别验证
        var success = document.getElementById("submit-success");
        var checkMark = document.getElementById("check-mark");
        addClass(success,"success");
        addClass(checkMark,"success");
        // document.getElementById("form").submit(); //提交表单
    } else {
        var wrong = document.getElementById("submit-wrong");
        addClass(wrong,"wrong")
        setTimeout(function(){removeClass(wrong,"wrong")},3000);
    }
}
function check(checkModal,str){     //表单验证 提供四种验证规则，只需要在input后面写上data属性即可

    var onlyNumber = /^\d{6,20}$/;                      //只允许数字
    var Num_Lower = /^[0-9a-z\_]{6,20}$/;               //允许数字 小写 下划线
    var Num_Upper = /^[0-9A-Z\_]{6,20}$/;               //允许数字 大写 下划线
    var Num_Lower_Upper = /^[0-9a-zA-Z\_]{6,20}$/;      //允许数字 小写大写下划线

    switch (checkModal){
        case "onlyNumber" : { return onlyNumber.test(str)}
        case "Num_Lower" : { return Num_Lower.test(str) }
        case "Num_Upper" : { return Num_Upper.test(str) }
        case "Num_Lower_Upper" :    //数字 字母 下划线是默认验证方式
        default : { return Num_Lower_Upper.test(str) };
    }
}
function enter(event) {     //监听密码框的回车键
    if(event.keyCode === 13) {
        checkForm();
    }
}

