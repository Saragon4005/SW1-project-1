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

  // Get the dropdown element
  const accountSelect = document.getElementById('accountSelect');

  // Populate the dropdown menu with test account numbers
  accountNumbers.forEach((number, index) => {
    const option = document.createElement('option');
    option.value = `Account ${index + 1}`;
    option.textContent = `Account ${index + 1} - #${number}`;
    accountSelect.appendChild(option);
  });

  // Get the "des" div element
  const desDiv = document.querySelector('.des');

  // INSERT PROPER CODE HERE: Update balance based on selected account

  //////////////THIS IS TEST CODE DELETE WHEN REPLACED/////////////
       accountSelect.addEventListener('change', function() {
    const selectedOption = accountSelect.options[accountSelect.selectedIndex];
     const accountIndex = parseInt(selectedOption.value.charAt(selectedOption.value.length - 1)) - 1;
         const selectedAccountNumber = accountNumbers[accountIndex];
        desDiv.innerHTML = `Account Balance - #<span style="color: #f7c331">${selectedAccountNumber}</span>`;
       });

            // Initially set the balance for the first account
    accountSelect.dispatchEvent(new Event('change'));
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