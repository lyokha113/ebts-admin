import axios from '@/plugin/axios'

const URI = '/email'

export function makeDraftEmail(request) {
  return axios.post(`${URI}/draft`, request)
}

export function sendEmail(request) {
  return axios.post(`${URI}/send`, request)
}
