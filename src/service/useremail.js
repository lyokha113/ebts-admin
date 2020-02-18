import axios from '@/plugins/axios'

const URI = '/useremail'

const URI_CONFIRM = '/useremail/confirm'

export function getUserEmails() {
  return axios.get(`${URI}`)
}

export function addUserEmail(userEmail) {
  return axios.post(`${URI}`, userEmail)
}

export function updateUserEmail(userEmail) {
  return axios.put(`${URI}/${userEmail.id}`, userEmail)
}

export function deleteUserEmail(id) {
  return axios.delete(`${URI}/${id}`)
}

export function confirmUserEmail(token) {
  return axios.get(`${URI_CONFIRM}?${token}`)
}
