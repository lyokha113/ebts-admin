import axios from '@/plugins/axios'

const URI = '/file'

export function getFiles() {
  return axios.get(`${URI}`)
}

export function createFile(file, onUploadProgress) {
  const configToUpload = {
    onUploadProgress: onUploadProgress
  }
  return axios.post(`${URI}`, file, configToUpload)
}

export function changeStatusFile(id, active) {
  return axios.put(`${URI}/${id}`, null, {
    params: { active }
  })
}
