import axios from '@/plugins/axios'

const URI = '/publish'

export function getPublishes() {
  return axios.get(`${URI}`)
}

export function createPublish(publish) {
  return axios.post(`${URI}`, publish)
}

export function approvePublish(publish) {
  return axios.put(`${URI}/approve/${publish.id}`, publish)
}

export function denyPublish(id) {
  return axios.put(`${URI}/deny/${id}`)
}
