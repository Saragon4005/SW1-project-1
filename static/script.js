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
  else if(value === "atm") {
     location.assign("/static/atmLogin.html")
  }
}

function validateUsername(username) {
  const usernameMessage = document.getElementById("usernameMessage");
  const usernameInput = document.getElementById("username");

  usernameMessage.innerHTML = "";

  const hasSymbols = /[^\w]/.test(username); // sCheck for symbols

  if (username.length < 3 || hasSymbols) {
    appendMessage(
      "Username should be at least 3 characters long and contain only letters, numbers, or underscores",
      usernameMessage
    );
    usernameInput.classList.add("invalid");
  } else {
    usernameInput.classList.remove("invalid");
  }

  return username.trim().length >= 3 && !hasSymbols; // Return whether the username meets the requirement and has no symbols
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

function withdrawValidate() {
   var form = document.getElementById("formW");
   //validation
   form.action = "/withdraw"

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
    form.action = "/openAccount"
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
function validateForm() {
  const fileInput = document.getElementById("file-input");
  const amountInput = document.getElementById("ammttp");

  if (fileInput.files.length === 0) {
    alert("Please upload a photo for check deposit.");
    return false;
  }

  if (!validateAmountInput()) {
    return false;
  }

  return true;
}

function formatAmount(input) {
  let errorDisplayed = false; // Flag to track if error message has been displayed
  
  // Remove non-numeric characters except the dot
  input.addEventListener('input', function(event) {
    // Remove any non-numeric characters
    this.value = this.value.replace(/[^\d.]/g, '');
  });

  // Check if input is a valid number
  if (isNaN(input.value) || input.value.trim() === '') {
    input.value = '';
    // Display error message only if it hasn't been displayed before
    if (!isFinite(input.value) && !errorDisplayed) {
      appendMessage("Amount should be a valid number.", document.getElementById("amountErrorMessage"));
      errorDisplayed = true; // Set flag to true to indicate that error message has been displayed
    }
  } else {
    input.value = parseFloat(input.value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    // If input becomes valid, reset error flag
    errorDisplayed = false;
  }
}

// Function to ensure user input allows only numbers
function transferAcctRec(input) {
  input.addEventListener('input', function(event) {
    // Remove any non-numeric characters
    this.value = this.value.replace(/[^\d]/g, '');
  });
}

// Apply transferAcctRec to the input field in transferPage.html
document.addEventListener("DOMContentLoaded", function () {
  const recipientAcctNumInput = document.getElementById("recipientacctnum");
  transferAcctRec(recipientAcctNumInput);
});

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
async function getCheck() {
   var res = await fetch('/getCheckData');
   var result = await res.json();
   var string =  JSON.stringify(result);
   var data = string.substring(2, string.length -2).split(",");
   document.getElementById("accNum").innerText = data[0];
   document.getElementById("amount").innerText = data[1];
} 
async function getTransferData() {
  var res = await fetch('/getTransferData');
  var result = await res.json();
  var string =  JSON.stringify(result);
  var data = string.substring(2, string.length -2).split(",");
  document.getElementById("accId").innerText = data[0];
  document.getElementById("amount").innerText = data[1];
}
async function getWithdrawData(parameter) {
   var res = await fetch('/getWithdrawBalance')
   var result = await res.json()
   var obj = JSON.parse(result)
   if(parameter === "before") {
   document.getElementById("number").innerText = "Account Balance #" + obj.accountNumber
   document.getElementById("ammt").innerHTML =  "$" + obj.balance
   }
   else {
    document.getElementById("ammt").innerHTML =  "$" + obj.balance
   }
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

async function getCustomerData() {
   var response = await fetch("/getCustomerData")
   var result = await response.json();
   var arr = result.split(";");
   var table = document.getElementById("database")
   for(let i = 0; i < arr.length-1; i++) {
      //using json parse https://www.w3schools.com/js/js_json_parse.asp
       var obj = JSON.parse(arr[i])
       var accounts = obj.accounts.split(" ")
       for(let j = 0; j < accounts.length; j++) {
       var accountNumber = accounts[j].substring(1,2)   
       var balance = accounts[j].substring(3,accounts[j].length-1)
        //using insert Row https://www.w3schools.com/jsref/met_table_insertrow.asp#:~:text=The%20insertRow()%20method%20creates,method%20to%20remove%20a%20row.
       var row = table.insertRow(-1)
       var aN = row.insertCell(0)
       var bal = row.insertCell(1)
       var user = row.insertCell(2)
       aN.innerHTML = accountNumber
       bal.innerHTML = balance
       user.innerHTML = obj.username
       }
       var tRow = table.insertRow(-1)
       var userTotalBalance =  tRow.insertCell(0)
       var userTotalAccounts = tRow.insertCell(1)
       userTotalAccounts.innerHTML = "User accounts: " + obj.totals.substring(1,2)
       userTotalBalance.innerHTML = "User Balance: " + obj.totals.substring(3,obj.totals.length-1)
   }
      var constantsObj = JSON.parse(arr[arr.length-1])
      document.getElementById("totalBalance").innerText = constantsObj.totalBalance
      document.getElementById("largest").innerText = constantsObj.largestAccountNum
      document.getElementById("totalAccounts").innerText = constantsObj.numOfaccounts
   
}

document.addEventListener("DOMContentLoaded", async function () {
  var accounts = await getAccounts();
  var accountNumbers = [];
  for(let i = 0; i < accounts.length; i++) {
     let string = "balance" + (i+1)
     let transfer = "transfer" + (i+1)
     let deposit = "deposit" + (i+1)
    if(accounts[i] != "NA") {  
       document.getElementById(string).innerHTML = accounts[i].substring(2);
       document.getElementById(transfer).style.display = "block";
      document.getElementById(deposit).style.display = "block";
       accountNumbers[i] = accounts[i].substring(0,1);
    }
    else {
      document.getElementById(string).innerHTML = "NA";
      document.getElementById(transfer).style.display = "none";
      document.getElementById(deposit).style.display = "none";
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
  var desDiv = document.querySelector(".des");

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
  var form =  document.getElementById("formT");
  var transfer = document.getElementById("transfer");
  var cancel = document.getElementById("cancel");
  transfer.addEventListener('click', function() {
        form.action = "/transfer";
  });
  cancel.addEventListener('click', function() {
        form.action = "/cancelTransfer";
  });
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

