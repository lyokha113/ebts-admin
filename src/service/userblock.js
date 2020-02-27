import axios from '@/plugins/axios'

const URI = '/userblock'

export function getUserBlocks() {
  return axios.get(`${URI}`)
}

export function createUserBlock(block) {
  return axios.post(`${URI}`, block)
}

export function updateUserBlock(block) {
  return axios.put(`${URI}/${block.id}`, block)
}

export function updateUserBlockContent(block) {
  return axios.patch(`${URI}/${block.id}`, block.content)
}

export function deleteUserBlock(id) {
  return axios.delete(`${URI}/${id}`)
}

export function synchronizeContent(request) {
  return axios.post(`${URI}/sync`, request)
}
