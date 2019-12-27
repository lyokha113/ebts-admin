import axios from '@/plugin/axios'

export function login(req) {
  return axios.post(`/login`, req)
}

export function register(req) {
  return axios.post(`/register`, req)
}

export function googleAuth() {
  return `/oauth2/authorize/google?redirect_uri=${process.env.VUE_APP_DOMAIN_LOCAL}/oauth2`
}
