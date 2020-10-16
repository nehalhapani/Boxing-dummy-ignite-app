const validateName = (name) => {
  var regName = /^[a-zA-Z ]{2,40}$/

  if (name.length == 0) {
    return "Please Enter User Name"
  } else if (!regName.test(name)) {
    return "Please Enter Valid User Name"
  } else {
    return ""
  }
}

const validateEmail = (email) => {
  var regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.([a-zA-Z]{2,5}|[a-zA-z]{2,5}\.[a-zA-Z]{2,5})$/
  if (email.length <= 0) {
    return "Please Enter Email"
  } else if (!regEmail.test(email)) {
    return "Please Enter Valid Email"
  } else {
    return ""
  }
}

const validatePassword = (password) => {
  // var regPassword = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  var regAlphanumeric = /\w+/
  var regSpecialChar = /[*$@!#%&()^~{}]+/

  let errors = []
  if (password.length == 0) {
    errors.push("Please Enter Password")
  }
  if (password.length <= 7) {
    errors.push("! 8+ characters long")
  }
  if (!regAlphanumeric.test(password)) {
    errors.push("! alphanumeric")
  }
  if (!regSpecialChar.test(password)) {
    errors.push("! atleast one special character")
  }
  return errors
}

const validateConfirmPassword = (password, confirmPassword) => {
  if (confirmPassword.length == 0) {
    return "Please Enter Password"
  } else if (password != confirmPassword) {
    return "Password mismatch"
  } else {
    return ""
  }
}

const validateSelect = (value) => {
  if (value.length == 0) {
    return "Please Select Option"
  } else {
    return ""
  }
}

const validateDate = (date) => {
  if (date.length == 0) {
    return "Please Select Date"
  } else {
    return ""
  }
}

const validateSwitch = (isEnable) => {
  if (isEnable == false) {
    return "Please accept agreement to proceed further"
  } else {
    return ""
  }
}

export {
  validateName,
  validateEmail,
  validatePassword,
  validateSelect,
  validateDate,
  validateSwitch,
  validateConfirmPassword,
}
