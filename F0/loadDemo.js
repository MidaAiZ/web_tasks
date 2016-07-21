/**
 * Created by Sinner on 2016/7/21.
 */
function showCode(){
    if (this.forms.password.type="password") {
        document.getElementById("password-container").innerHTML = "<input type=\"text\" id=\"password\" name=\"password\" maxlength='18' placeholder=\"  Password\" value=" + this.forms.password.value + ">"
        document.getElementById("click").innerHTML="<a href=\"javascript:hideCode()\" class=\"showPassword\"></a>"
        document.getElementById("show-text").innerHTML="Show";
    }
}
function hideCode(){
    if (this.forms.password.type="text") {
        document.getElementById("password-container").innerHTML = "<input type=\"password\" id=\"password\" name=\"password\" maxlength='18' placeholder=\"  Password\" value=" + this.forms.password.value + ">"
        document.getElementById("click").innerHTML="<a href=\"javascript:showCode()\" class=\"hidePassword\"></a>"
        document.getElementById("show-text").innerHTML="Hide";
    }
}

function rememberCode(){
    document.getElementById("showCode").innerHTML="<a href=\"javascript:forgetCode()\" class=\"remember-password\"></a>";
    document.getElementById("rem-text").innerHTML="Remember";
}
function forgetCode(){
    document.getElementById("showCode").innerHTML="<a href=\"javascript:rememberCode()\" class=\"forget-password\"></a>";
    document.getElementById("rem-text").innerHTML="Forget";
}

