import axios from '@/plugin/axios'

const URI = '/template'

export function getTemplates() {
  return axios.get(`${URI}`)
}

export function getTemplate(id) {
  return axios.get(`${URI}/${id}`)
}
