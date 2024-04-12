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
        location.assign("/static/transferPage.html")
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

async function updateBalance() {
    // fetch setup code from https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   var response = await fetch('/balance'); //Wait until the fetch request returns a promise
   var balance = await response.json(); //Wait until we get a response.json promise
   var string = JSON.stringify(balance);
   document.getElementById("balance").innerHTML = string.substring(2, string.length -2);
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