function reload(value) {
  if (value === "login") {
    location.assign("/static/login.html");
  } else if (value === "register") {
    location.assign("/static/registration.html");
  } else if (value === "adminlogin") {
    location.assign("/static/adminlogin.html");
  } else if (value === "deposit") {
    location.assign("/static/depositingCheck.html");
  } else if (value === "transfer") {
    location.assign("/static/transferPage.html");
  } else if (value === "member") {
    location.assign("/static/member.html");
  } else if (value === "atm") {
        location.assign("/static/atmLogin.html");
  }
}

function validateUsername(username) {
  const usernameMessage = document.getElementById("usernameMessage");
  const usernameInput = document.getElementById("username");

  usernameMessage.innerHTML = "";

  if (username.length < 3) {
    appendMessage(
      "Username should be at least 3 characters long",
      usernameMessage
    );
    usernameInput.classList.add("invalid");
  } else {
    usernameInput.classList.remove("invalid");
  }

  return username.trim().length >= 3; // Return whether the username meets the requirement
}
function validatePassword(password, confirmPassword) {
  const passwordRequirements = document.getElementById("passwordRequirements");
  const confirmPasswordMessage = document.getElementById(
    "confirmPasswordMessage"
  );
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("cpassword");

  passwordRequirements.innerHTML = "";
  confirmPasswordMessage.innerHTML = "";

  let isValid = true; // Flag to track if password meets all requirements

  if (
    password.length < 10 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/\d/.test(password) ||
    !/[^a-zA-Z0-9]/.test(password)
  ) {
    isValid = false; // Set flag to false if any requirement is not met
  }

  if (isValid) {
    passwordInput.classList.remove("invalid"); // Remove "invalid" class if all requirements are met
  } else {
    passwordInput.classList.add("invalid");
    if (password.length < 10) {
      appendMessage(
        "Password should be at least 10 characters long",
        passwordRequirements
      );
    }
    if (!/[A-Z]/.test(password)) {
      appendMessage(
        "Password should contain at least one uppercase letter",
        passwordRequirements
      );
    }
    if (!/[a-z]/.test(password)) {
      appendMessage(
        "Password should contain at least one lowercase letter",
        passwordRequirements
      );
    }
    if (!/\d/.test(password)) {
      appendMessage(
        "Password should contain at least one number",
        passwordRequirements
      );
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      appendMessage(
        "Password should contain at least one special character",
        passwordRequirements
      );
    }
  }

  if (password !== confirmPassword) {
    appendMessage("Passwords do not match", confirmPasswordMessage);
    confirmPasswordInput.classList.add("invalid");
  } else {
    confirmPasswordInput.classList.remove("invalid");
  }

  // Add red border to confirm password input only when it's invalid and interacted with
  if (
    confirmPasswordInput.classList.contains("invalid") &&
    confirmPasswordInput.value !== ""
  ) {
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
  event.target.action = "/register";
}
function appendMessage(message, targetElement) {
  const paragraph = document.createElement("p");
  paragraph.innerHTML = `<i class="fa fa-exclamation-circle"></i> <span class="message">${message}</span>`;
  targetElement.appendChild(paragraph);
}
async function updateBalance() {
  // fetch setup code from https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  var response = await fetch("/balance"); //Wait until the fetch request returns a promise
  var balance = await response.json(); //Wait until we get a response.json promise
  var string = JSON.stringify(balance);
  document.getElementById("balance").innerHTML = string.substring(
    2,
    string.length - 2
  );
}
async function getAccountID() {
  var response = await fetch("/accountID");
  var accountID = await response.json();
  var string = JSON.stringify(accountID);
  document.getElementById("number").innerText = string.substring(
    2,
    string.length - 2
  );
}

function validate() {
  let form = document.getElementById("formB");
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("cpassword").value;
  const errorMessage = document.getElementById("errorMessage");

  if (password != confirmPassword) {
    errorMessage.innerHTML = "Passwords do not match";
    document.getElementById("cpassword").classList.add("error");
    form.action = "/openError";
    return false; // Preventssubmission
  } else {
    errorMessage.innerHTML = ""; 
    document.getElementById("cpassword").classList.remove("error"); 
    return true; 
  }
}
function pin(pin, cpin) {
  const pinInput = document.getElementById("pin");
  const cpinInput = document.getElementById("pin2");
  const pinRequirements = document.getElementById("pinRequirements");
  const cpinRequirements = document.getElementById("cpinRequirements");

  pinRequirements.innerHTML = "";
  cpinRequirements.innerHTML = "";

  let isValid = true;
  
  if (pin.length !== 4) {
    appendMessage("PIN must ONLY be four digits long", pinRequirements);
    isValid = false;
    pinInput.classList.add("error");
  } else {
    pinInput.classList.remove("error");
  }
  
  if (isNaN(parseInt(pin))) {
    appendMessage("PIN should only contain numerical values (0 to 9)", pinRequirements);
    isValid = false;
    pinInput.classList.add("error"); 
  } else {
    pinInput.classList.remove("error");
  }
  
  if (parseInt(pin) < 0 || parseInt(pin) > 9999) {
    appendMessage("PIN can only be between '0000' and '9999'", pinRequirements);
    isValid = false;
    pinInput.classList.add("error");
  } else {
    pinInput.classList.remove("error");
  }

  if (pin !== cpin) {
    appendMessage("PINs do not match", cpinRequirements);
    isValid = false;
    cpinInput.classList.add("error");
  } else {
    cpinInput.classList.remove("error");
  }

  return isValid;
}

// Validate function for the form submission
function validatePIN(event) {
  event.preventDefault(); // Prevent form submission

  const pinInput = document.getElementById("pin").value;
  const cpinInput = document.getElementById("pin2").value;
  
  const isValidPIN = pin(pinInput, cpinInput);

  // Get the submit button
  const submitButton = document.getElementById("submitButton");

  // Enable or disable the submit button based on the PIN validation result
  if (isValidPIN) {
    submitButton.removeAttribute("disabled");
  } else {
    submitButton.setAttribute("disabled", "disabled");
  }
  //return pin(pinInput, cpinInput);
}

async function account(num) {
  if (num === "1") {
    let value1 = document.getElementById("accountNumber1");
    //uploading json post request from https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    var response = await fetch("/setCheckCookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value1.innerText),
    });
  } else if (num === "2") {
    let value2 = document.getElementById("accountNumber2");
    var response = await fetch("/setCheckCookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value2.innerText),
    });
  } else {
    let value3 = document.getElementById("accountNumber3");
    var response = await fetch("/setCheckCookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value3.innerText),
    });
  }
  var string = await response.json();

  location.assign("/static/depositingCheck.html");
}
function depositValidate() {
  let pin = document.getElementById("Pin").value;
}
async function getAccounts() {
  // fetch setup code from https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  var response = await fetch("/balance"); //Wait until the fetch request returns a promise
  var balance = await response.json(); //Wait until we get a response.json promise
  var string = JSON.stringify(balance);
  var result = string.substring(2, string.length - 2);
  var accountsF = [];
  if (result === "No account exists") {
    accountsF[0] = "NA";
    accountsF[1] = "NA";
    accountsF[2] = "NA";
  }
  else {
    var accounts = result.split(" ");
    if (accounts.length === 1) {
      accountsF[0] = accounts[0];
      accountsF[1] = "NA";
      accountsF[2] = "NA";
    } else if (accounts.length === 2) {
      accountsF[0] = accounts[0];
      accountsF[1] = accounts[1];
      accountsF[2] = "NA";
    } else {
      accountsF[0] = accounts[0];
      accountsF[1] = accounts[1];
      accountsF[2] = accounts[2];
    }
  }
  return accountsF;
}
document.addEventListener("DOMContentLoaded", async function () {
  var accounts = await getAccounts();
  var accountNumbers = [];
  for(let i = 0; i < accounts.length; i++) {
     let string = "balance" + (i+1)
    if(accounts[i] != "NA") {  
       document.getElementById(string).innerHTML = accounts[i].substring(2);
       accountNumbers[i] = accounts[i].substring(0,1);
    }
    else {
      document.getElementById(string).innerHTML = "NA";
      accountNumbers[i] = "NA";
    }
  }
  // Gets all "des" div elements
  const desDivs = document.querySelectorAll(".des");

  // Loop through each "des" div and set the account number with span
  desDivs.forEach((div, index) => {
    // Create a span element for the account number
    const span = document.createElement("span");
    span.id = `accountNumber${index + 1}`; // Set the id for the span
    span.textContent = accountNumbers[index]; // Set the account number text

    // Set different color for the account number
    span.style.color = "#f7c331"; // Example color (change as needed)

    // Append the span to the "des" div
    div.innerHTML = `Account Balance - #`;
    div.appendChild(span);
  });
});
document.addEventListener("DOMContentLoaded", async function () {
  var accounts = await getAccounts();
  var accountNumbers = [];
  for(let i = 0; i < accounts.length; i++) {
     if(accounts[i] != "NA") {
      accountNumbers[i] = accounts[i].substring(0,1);
     }
  }
  // Get the dropdown element
  var accountSelect = document.getElementById("accountSelect");

  // Populate the dropdown menu with test account numbers
  accountNumbers.forEach((number, index) => {
    var option = document.createElement("option");
    option.value = `${number}`;
    option.textContent = `Account ${index + 1} - #${number}`;
    accountSelect.appendChild(option);
  });

  // Get the "des" div element
  const desDiv = document.querySelector(".des");

  //Get the balance 
  var div = document.getElementById("balance");

  // Update balance based on selected account
  accountSelect.addEventListener("change", function () {
    const selectedOption = accountSelect.options[accountSelect.selectedIndex];
    const selectedAccountNumber = selectedOption.value;
    desDiv.innerHTML = `Account Balance - #<span style="color: #f7c331">${selectedAccountNumber}</span>`;
    div.innerHTML = accounts[accountSelect.selectedIndex].substring(2);
  });

  // Initially set the balance for the first account
  accountSelect.dispatchEvent(new Event("change"));
});
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const menuBtn = document.querySelector(".menu-btn");

  menuBtn.addEventListener("click", function () {
    sidebar.classList.toggle("active");
    document.body.classList.toggle("blur");
  });
  document.addEventListener("click", function (event) {
    const isSidebarClicked = sidebar.contains(event.target);
    const isMenuBtnClicked = menuBtn.contains(event.target);

    if (!isSidebarClicked && !isMenuBtnClicked) {
      sidebar.classList.remove("active");
      document.body.classList.remove("blur");
    }
  });
});

//For file upload field without DOMContentLoaded event listener
const fileLabel = document.getElementById("file-label");
const fileInput = document.getElementById("file-input");

  // Add event listener for file user input change event
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    handleFileUpload(file);
  });

  // Handles file upload
  function handleFileUpload(file) {
    console.log("File uploaded:", file);

    // Display the uploaded image
    const reader = new FileReader();
    reader.onload = function (event) {
      const imageUrl = event.target.result;
      const uploadedImage = document.createElement("img");
      uploadedImage.src = imageUrl;

      // Remove any existing image from the label
      const existingImage = fileLabel.querySelector("img");
      if (existingImage) {
        fileLabel.removeChild(existingImage);
      }

      // Append the uploaded image to the label
      fileLabel.appendChild(uploadedImage);
    };
    reader.readAsDataURL(file);
  }
