var jwtDecode = require('jwt-decode')

const TOKEN_KEY = 'accessToken'

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  return sessionStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TOKEN_KEY)
}

export function decodeToken(token) {
  const decoded = jwtDecode(token)
  return JSON.parse(decoded.sub)
}
