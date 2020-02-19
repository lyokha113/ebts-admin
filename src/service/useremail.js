import axios from '@/plugins/axios'

const URI = '/useremail'

export function getUserEmails() {
  return axios.get(`${URI}`)
}

export function createUserEmail(userEmail) {
  return axios.post(`${URI}`, userEmail)
}

export function deleteUserEmail(id) {
  return axios.delete(`${URI}/${id}`)
}

export function confirmUserEmail(token) {
  return axios.get(`${URI}/confirm`, {
    params: { token }
  })
}
