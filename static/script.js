function reload(value){
// location assign https://www.w3schools.com/jsref/met_loc_assign.asp
    if(value === "login"){
        location.assign("./static/login.html");
    }
    else if(value === "register"){
        location.assign("./static/registration.html")
    }
    else if(value === "adminlogin"){
        location.assign("./static/adminlogin.html")
    }
}