import axios from '@/plugin/axios'

const URI = '/user'

export function updateUser(account){
  return axios.put(`${URI}`, account)
}

export function login(req) {
  return axios.post(`/login`, req)
}

export function register(req) {
  return axios.post(`/register`, req)
}

export function googleAuth(token) {
  return axios.post(`/google/login`, token)
  // return `/oauth2/authorization/google`
}
