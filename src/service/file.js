import axios from '@/plugin/axios'

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

export function deleteFile(id) {
  return axios.delete(`${URI}/${id}`)
}
