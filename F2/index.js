/**
 * Created by Sinner on 2016/8/8.
 */

window.onload = function() {        //获取dom节点赋给全局变量form，供函数使用
    window.form = {
        idLabel : document.getElementById("label-id"),
        pwdLabel : document.getElementById("label-pwd"),
        emailId : document.getElementById("email-id"),
        emailPwd : document.getElementById("email-pwd"),
        idPanel : document.getElementById("id-panel"),
        pwdPanel : document.getElementById("pwd-panel"),
        successPanel :  document.getElementById("submit-success"),
        checkMark : document.getElementById("check-mark"),
        wrongPanel : document.getElementById("submit-wrong"),
        //表单验证
        onlyNumber : /^\d{6,18}$/,                      //只允许数字
        Num_Lower : /^[0-9a-z\_]{6,18}$/,               //允许数字 小写 下划线
        Num_Upper : /^[0-9A-Z\_]{6,18}$/,               //允许数字 大写 下划线
        Num_Lower_Upper : /^[0-9a-zA-Z\_]{6,18}$/       //允许数字 小写大写下划线
    }
    //刷新页面的时候判断输入框内是否有内容 有则打开输入框
    if (form.emailId.value.length > 0) { form.emailId.focus() };
    if (form.emailPwd.value.length > 0) { form.emailPwd.focus() };
}

function onFocus(event) {       //点击输入框周边或者输入框获取焦点，变大
    switch(event.target){
        case form.idPanel :      //id输入框
        case form.emailId :
        {
            //添加动画class属性
            removeClass(form.emailId, "close-input");
            removeClass(form.idLabel, "close-label");
            addClass(form.idLabel,"open-label");
            addClass(form.emailId,"open-id");
            form.emailId.focus();
        };break;

        case form.pwdPanel :     //密码输入框
        case form.emailPwd :
        {
            removeClass(form.emailPwd, "close-input");
            removeClass(form.pwdLabel, "close-label");
            addClass(form.pwdLabel,"open-label");
            addClass(form.emailPwd,"open-pwd");
            form.emailPwd.focus();
        };break;
    }
}
function onBlur(event) {    //输入框失去焦点  这时如果输入框内有文字输入框不会变小 如果没文字输入框会变小
    switch(event.target){
        case form.emailId :
        {
            if(event.target.value.length === 0) {
                removeClass(form.idLabel, "open-label");
                removeClass(form.emailId, "open-id");
                addClass(form.emailId, "close-input");
                addClass(form.idLabel, "close-label");
            }
        };break;

        case form.emailPwd :
        {
            if(event.target.value.length === 0) {
                removeClass(form.pwdLabel, "open-label");
                removeClass(form.emailPwd, "open-pwd");
                addClass(form.emailPwd, "close-input");
                addClass(form.pwdLabel, "close-label");
            }
        };break;
    }
}
//添加class属性
function addClass(ele,newClass){
    if (ele.className.indexOf(" "+newClass) === -1) {   //防止重复添加属性
        ele.className += " "+newClass;
    }
}
//移除class属性
function removeClass(ele,oldClass){
    if (ele.className.indexOf(" "+oldClass) !== -1) {    //如果属性存在才移除
        ele.className =  ele.className.replace(" "+oldClass,"");
    }
}

function checkForm() {
    var idCheckModal =  form.emailId.getAttribute("data");
    var pwdCheckModal = form.emailPwd.getAttribute("data");
    var idValue = form.emailId.value;
    var pwdValue = form.emailPwd.value;
    var isPass = true;
    var wrongTip = "";

    //id输入框只允许输入数字，密码框允许数字 字母 下划线  故分别验证
    if (check(idCheckModal,idValue)) {          //验证ID
        wrongTip += "ID"+check(idCheckModal,idValue)+"</br>";
        isPass = false;
    }
    if (check(pwdCheckModal,pwdValue)) {        //验证PWD
        wrongTip += "Password"+check(pwdCheckModal,pwdValue)+"</br>";
        isPass = false;
    }
    if (isPass) {   //验证通过
        addClass(form.successPanel,"success");
        addClass(form.checkMark,"success");
        // document.getElementById("form").submit(); //提交表单
    } else {   //验证失败
        document.getElementById("submit-wrong").innerHTML = wrongTip;
        removeClass(form.wrongPanel,"wrong")        //先移除后增加以应对迅速重复提交错误表单的情况
        setTimeout(function(){  addClass(form.wrongPanel,"wrong") },10);    //得隔一段时间再添加属性才会有动画效果
    }
}
function check(checkModal,str){     //表单验证 提供四种验证规则，只需要在input后面写上data属性即可

    if (str.length < 6) { return " should more than 6 character!" }
    if (str.length > 18) { return " should less than 6 character!" }

    switch (checkModal){
        case "onlyNumber" : { if (!form.onlyNumber.test(str)) { return " only allows number!"} }
        case "Num_Lower" : { if (!form.Num_Lower.test(str)) { return " only allows number/lowercase/'_'"} }
        case "Num_Upper" : { if (!form.Num_Upper.test(str)) { return " only allows number/uppercase/'_'"} }
        case "Num_Lower_Upper" :    //数字 字母 下划线是默认验证方式
        default : { if (!form.Num_Lower_Upper.test(str)) { return " only allows number/lower-uppercase/'_'"} };
    }
}
function enter(event) {     //监听密码框的回车键
    if(event.keyCode === 13) {
        checkForm();
    }
}

