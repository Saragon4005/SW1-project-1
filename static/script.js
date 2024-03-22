function reload(value){
    if(value === "login"){
        location.assign("/static/login.html");
    }
    else if(value === "register"){
        location.assign("/static/registration.html")
    }
    else if(value === "adminlogin"){
        location.assign("/static/adminlogin.html")
    }
}
document.querySelector('.menu-btn').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
    document.querySelector('.content').classList.toggle('active');
});