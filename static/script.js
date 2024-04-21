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
document.addEventListener('DOMContentLoaded', async function() {
    // fetch setup code from https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    var response = await fetch('/balance'); //Wait until the fetch request returns a promise
    var balance = await response.json(); //Wait until we get a response.json promise
    var string = JSON.stringify(balance);
    var result = string.substring(2, string.length-2);
    var accountNumbers = [];
    if(result === "No account exists") {
      accountNumbers[0] = "NA";
      accountNumbers[1] = "NA";
      accountNumbers[2] = "NA";
      for(let i = 1; i <= 3; i++) {
        let string = "balance" + i;
        document.getElementById(string).innerHTML = "NA";
      }
   }
   else {
       var accounts = result.split(" ")
        if(accounts.length === 1) {
            accountNumbers[0] = accounts[0].substring(0,1);
            accountNumbers[1] = "NA";
            accountNumbers[2] = "NA";
            for(let i = 1; i <= 3; i++) {
               let string = "balance" + i;
               if(i == 1) {
               document.getElementById(string).innerHTML = accounts[i-1].substring(2);
               }
               else {
                document.getElementById(string).innerHTML = "NA";
               }
            }
        }
        else if(accounts.length === 2) {
            accountNumbers[0] = accounts[0].substring(0,1);
            accountNumbers[1] = accounts[1].substring(0,1);
            accountNumbers[2] = "NA"
            for(let i = 1; i <= 3; i++) {
                let string = "balance" + i;
                if(i == 1 || i==2) {
                document.getElementById(string).innerHTML = accounts[i-1].substring(2);
                }
                else {
                 document.getElementById(string).innerHTML = "NA";
                }
             }
        }
        else {
            accountNumbers[0] = accounts[0].substring(0,1);
            accountNumbers[1] = accounts[1].substring(0,1);
            accountNumbers[2] = accounts[2].substring(0, 1);
            for(let i = 1; i <= 3; i++) {
                let string = "balance" + i;
                document.getElementById(string).innerHTML = accounts[i-1].substring(2);
             }
        }
    }
    // Gets all "des" div elements
    const desDivs = document.querySelectorAll('.des');

    // Loop through each "des" div and set the account number with span
    desDivs.forEach((div, index) => {
        // Create a span element for the account number
        const span = document.createElement('span');
        span.id = `accountNumber${index + 1}`; // Set the id for the span
        span.textContent = accountNumbers[index]; // Set the account number text

        // Set different color for the account number
        span.style.color = '#f7c331'; // Example color (change as needed)

        // Append the span to the "des" div
        div.innerHTML = `Account Balance - #`;
        div.appendChild(span);
    });

    // Get the dropdown element
    var accountSelect = document.getElementById('accountSelect');

    // Populate the dropdown menu with test account numbers
    accountNumbers.forEach((number, index) => {
        var option = document.createElement('option');
        option.value = `Account ${index + 1}`;
        option.textContent = `Account ${index+1} - #${number}`;
        accountSelect.appendChild(option);
    });

    // Get the "des" div element
    const desDiv = document.querySelector('.des');

    // Update balance based on selected account
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