import axios from '@/plugin/axios'

export function login(req) {
  return axios.post(`/login`, req)
}

export function loginGoogle() {
  return '/oauth2/authorize/google?redirect_uri=http://localhost:8080/oauth2/'
}
