import axios from '@/plugin/axios'

const URI = '/publish'

export function getPublishes() {
  return axios.get(`${URI}`)
}

export function createPublish(publish) {
  return axios.post(`${URI}`, publish)
}

export function updatePublish(id, status) {
  return axios.put(`${URI}/${id}?status=${status}`)
}
