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

function validateUsername(username) {
    const usernameMessage = document.getElementById("usernameMessage");
    const usernameInput = document.getElementById("username");

    usernameMessage.innerHTML = "";

    if (username.length < 3) {
        appendMessage("Username should be at least 3 characters long", usernameMessage);
        usernameInput.classList.add("invalid");
    } else {
        usernameInput.classList.remove("invalid");
    }

    return username.trim().length >= 3; // Return whether the username meets the requirement
}
function validatePassword(password, confirmPassword) {
    const passwordRequirements = document.getElementById("passwordRequirements");
    const confirmPasswordMessage = document.getElementById("confirmPasswordMessage");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("cpassword");

    passwordRequirements.innerHTML = "";
    confirmPasswordMessage.innerHTML = "";

    let isValid = true; // Flag to track if password meets all requirements

    if (password.length < 10 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
        isValid = false; // Set flag to false if any requirement is not met
    }

    if (isValid) {
        passwordInput.classList.remove("invalid"); // Remove "invalid" class if all requirements are met
    } else {
        passwordInput.classList.add("invalid");
        if (password.length < 10) {
            appendMessage("Password should be at least 10 characters long", passwordRequirements);
        }
        if (!/[A-Z]/.test(password)) {
            appendMessage("Password should contain at least one uppercase letter", passwordRequirements);
        }
        if (!/[a-z]/.test(password)) {
            appendMessage("Password should contain at least one lowercase letter", passwordRequirements);
        }
        if (!/\d/.test(password)) {
            appendMessage("Password should contain at least one number", passwordRequirements);
        }
        if (!/[^a-zA-Z0-9]/.test(password)) {
            appendMessage("Password should contain at least one special character", passwordRequirements);
        }
    }

    if (password !== confirmPassword) {
        appendMessage("Passwords do not match", confirmPasswordMessage);
        confirmPasswordInput.classList.add("invalid");
    } else {
        confirmPasswordInput.classList.remove("invalid");
    }

    // Add red border to confirm password input only when it's invalid and interacted with
    if (confirmPasswordInput.classList.contains("invalid") && confirmPasswordInput.value !== "") {
        confirmPasswordInput.classList.add("error");
    } else {
        confirmPasswordInput.classList.remove("error");
    }

    // Check if all password requirements are met and enable/disable register button
    const registerButton = document.getElementById("registerButton");
    registerButton.disabled = !(
        isValid && // Check if isValid flag is true
        password === confirmPassword &&
        validateUsername(document.getElementById("username").value)
    );
}

function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("cpassword").value;

    const isUsernameValid = validateUsername(username);
    const isPasswordValid = validatePassword(password, confirmPassword);

    let form = document.getElementById("formR");

    if (isUsernameValid && isPasswordValid) {
        form.action = "/register";
    } else {
        form.action = "/passwordError";
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

        // Set different color for the account number
        span.style.color = '#f7c331'; // Example color (change as needed)

        // Append the span to the "des" div
        div.innerHTML = `Account Balance - #`;
        div.appendChild(span);
    });

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

function appendMessage(message, targetElement) {
    const paragraph = document.createElement("p");
    paragraph.innerHTML = `<i class="fa fa-exclamation-circle"></i> <span class="message">${message}</span>`;
    targetElement.appendChild(paragraph);
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

        // Set different color for the account number
        span.style.color = '#f7c331'; // Example color (change as needed)

        // Append the span to the "des" div
        div.innerHTML = `Account Balance - #`;
        div.appendChild(span);
    });

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