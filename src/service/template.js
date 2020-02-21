import axios from '@/plugins/axios'

const URI = '/template'

export function getTemplates() {
  return axios.get(`${URI}`)
}

export function getTemplate(id) {
  return axios.get(`${URI}/${id}`)
}

export function getTemplatesByAuthor(uuid) {
  return axios.get(`${URI}/author/${uuid}`)
}

export function createTemplate(template) {
  return axios.post(`${URI}`, template)
}

export function updateTemplate(template) {
  return axios.put(`${URI}/${template.id}`, template)
}

export function deleteTemplate(id) {
  return axios.delete(`${URI}/${id}`)
}
