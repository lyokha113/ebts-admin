import axios from '@/plugins/axios'

const URI = '/session'

export function createSession(request) {
  return axios.post(`${URI}/raw`, request)
}
