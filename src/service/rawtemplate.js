import axios from '@/plugin/axios'

const URI = '/raw'

export function getRawTemplate(id) {
  return axios.get(`${URI}/${id}`)
}

export function createRawTemplate(raw) {
  return axios.post(`${URI}`, raw)
}

export function updateRawTemplate(raw) {
  return axios.put(`${URI}/${raw.id}`, raw)
}

export function changeVersion(id, versionId) {
  return axios.patch(`${URI}/${id}?versionId=${versionId}`)
}

export function deleteRawTemplate(id) {
  return axios.delete(`${URI}/${id}`)
}
