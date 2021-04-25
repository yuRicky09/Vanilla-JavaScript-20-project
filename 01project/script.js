const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

// show input error message
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = "form-control error";
  // 注意! querySelector只會選到想選取的名子的第一個
  // 不過這邊的formControl是根據input.parentElement來決定
  // 所以剛好可以選到每個不同input的不同父層的元素
  const errorMessage = formControl.querySelector("small");
  errorMessage.innerText = message;
}

// show input success outline
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}

// check email
function checkEmail(input) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(input.value.trim())) {
    showSuccess(input);
  } else {
    showError(input, "Email is not vaild");
  }
}

// console.log([username, email, password, password2]);
// check required fields
function checkRequired(inputArr) {
  inputArr.forEach(function (input) {
    if (input.value.trim() === "") {
      showError(input, `${getFieldName(input)} is required`);
    } else {
      showSuccess(input);
    }
  });
}

// Get fieldName
function getFieldName(input) {
  // return `${input.id.slice(0, 1).toUpperCase()}${input.id.slice(1)}`;
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// Check input length
function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters`
    );
  } else if (input.value.length > max) {
    showError(
      input,
      `${getFieldName(input)} must be less than ${max} characters`
    );
  } else {
    showSuccess(input);
  }
}

// Check PasswordsMatch

function checkPasswordsMatch(input1, input2) {
  if (input1.value !== input2.value) {
    showError(input2, `Password do not match`);
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  checkRequired([username, email, password, password2]);

  checkLength(username, 5, 20);
  checkLength(password, 5, 25);
  checkEmail(email);
  checkPasswordsMatch(password, password2);
});

// Event listeners
// DRY!!!!! refactor
// form.addEventListener("submit", function (e) {
//   e.preventDefault();

//   if (username.value === "") {
//     showError(username, "Username is required");
//   } else {
//     showSuccess(username);
//   }

//   if (email.value === "") {
//     showError(email, "email is required");
//   } else if (!validateEmail(email.value)) {
//     showError(email, "email is not valid");
//   } else {
//     showSuccess(email);
//   }

//   if (password.value === "") {
//     showError(password, "Password is required");
//   } else {
//     showSuccess(password);
//   }

//   if (password2.value === "") {
//     showError(password2, "Password Confirm is required");
//   } else {
//     showSuccess(password2);
//   }
// });
