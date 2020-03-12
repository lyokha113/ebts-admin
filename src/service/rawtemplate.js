import axios from '@/plugins/axios'

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

export function updateRawContent(raw) {
  return axios.patch(`${URI}/${raw.rawId}/content`, raw)
}

export function uploadFiles(rawId, file, onUploadProgress) {
  const configToUpload = {
    onUploadProgress: onUploadProgress
  }
  return axios.patch(`${URI}/${rawId}/file`, file, configToUpload)
}

export function deleteRawTemplate(id) {
  return axios.delete(`${URI}/${id}`)
}
