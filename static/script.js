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
document.addEventListener('DOMContentLoaded', function() {
    // Test account numbers
    const accountNumbers = ['6789', '4321', '3579'];

    // Gets all "des" div elements
    const desDivs = document.querySelectorAll('.des');

    // Loop through each "des" div and set the account number with span
    desDivs.forEach((div, index) => {
        // Create a span element for the account number
        const span = document.createElement('span');
        span.id = `accountNumber${index + 1}`; // Set the id for the span
        span.textContent = accountNumbers[index]; // Set the account number text
        span.style.color = '#f7c331';

        // Append the span to "des" div
        div.innerHTML = `Account Balance - #`;
        div.appendChild(span);
    });
});
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