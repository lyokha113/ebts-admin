import axios from '@/plugin/axios'

const URI = '/email'

export function makeDraftGMail(request) {
  return axios.post(`${URI}/draft/gmail`, request)
}

export function makeDraftYahoo(request) {
  return axios.post(`${URI}/draft/yahoo`, request)
}

export function makeDraftOutlook(request) {
  return axios.post(`${URI}/draft/outlook`, request)
}

export function sendEmail(request) {
  return axios.post(`${URI}/send`, request)
}
