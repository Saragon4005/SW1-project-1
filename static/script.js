function reload(value){
    if(value === "login"){
        location.assign("/static/login.html");
    }
    else if(value === "register"){
        location.assign("/static/registration.html");
    }
    else if(value === "adminlogin"){
        location.assign("/static/adminlogin.html");
    }
    else if(value === "transfer"){
        location.assign("/static/transferPage.html");
    }
    else if(value === "member") {
        location.assign("/static/member.html");
    }
}


function passwordvalidate(){
    //Learned how to change form action from https://stackoverflow.com/a/5361776
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("cpassword").value;
    let form = document.getElementById("formR");
    if(password.length < 10){
        let numberOfmissing = 10-password.length;
        alert("password too short by " + numberOfmissing + " characters");
        form.action="/passwordError";
    }
    
    else if(password != confirmPassword){
        alert("passwords do not match");
        form.action="/passwordError";
    }
    else{
       form.action= "/register";
    }
}
function getAccountID() {

}
async function updateBalance() {
    // fetch setup code from https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   var response = await fetch('/balance'); //Wait until the fetch request returns a promise
   var balance = await response.json(); //Wait until we get a response.json promise
   var string = JSON.stringify(balance);
   document.getElementById("balance").innerHTML = string.substring(2, string.length -2);
}
async function getAccountID() {
    var response = await fetch('/accountID');
    var accountID = await response.json();
    var string = JSON.stringify(accountID);
    document.getElementById("number").innerText = string.substring(2, string.length -2);
}

 function validate() {
    let  form = document.getElementById("formB");
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("cpassword").value;
    if(password != confirmPassword) {
        alert("Passwords do not match")
        form.action = "/openError"
    }
    else {
        form.action = "/openAccount"
    }
    

}
function pin() {
    let pin = document.getElementById("Pin").value;
    let cpin = document.getElementById("Pin2").value;
    if(pin != cpin) {
        alert("pins do not match");
        form.action="/pinError";
    }
    else if(pin.length != 4) {
        alert("pins are not 4 digits long");
        form.action ="/pinError";
    }
    else if(isNaN(parseInt(pin))) {
        alert("pins are not digits between 0-9");
        form.action="/pinError";
    }
    else if(parseInt(pin) <= 1000) {
        alert("pins must be number greater than 1000")
        form.action="/pinError"
    }
    else {
        form.action = "/pin";
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const menuBtn = document.querySelector('.menu-btn');
    menuBtn.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        document.body.classList.toggle('blur');
    });
    document.addEventListener('click', function(event) {
        const isSidebarClicked = sidebar.contains(event.target);
        const isMenuBtnClicked = menuBtn.contains(event.target);

        if (!isSidebarClicked && !isMenuBtnClicked) {
            sidebar.classList.remove('active');
            document.body.classList.remove('blur');
        }
    });

});