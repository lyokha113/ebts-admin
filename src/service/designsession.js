import axios from '@/plugins/axios'

const URI = '/session'

export function getContributors(id) {
  return axios.get(`${URI}/raw/${id}`)
}

export function createSession(request) {
  return axios.post(`${URI}/raw`, request)
}

export function kickContributors(id) {
  return axios.put(`${URI}/raw/${id}`)
}

export function kickContributor(rawId, contributorId) {
  return axios.put(`${URI}/raw/${rawId}/${contributorId}`)
}

export function getSessionsForUser() {
  return axios.get(`${URI}/user`)
}

export function getSessionForUser(rawId) {
  return axios.get(`${URI}/user/${rawId}`)
}

export function leaveSession(id) {
  return axios.put(`${URI}/user/${id}`)
}
