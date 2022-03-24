function codeVerif(email, password) {
  email = email.slice(0, 3)
  password = password.slice(password.length-3)

  return `${email}${password}`
}

module.exports = codeVerif