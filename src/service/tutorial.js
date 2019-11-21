import axios from '@/plugin/axios'

const URI = '/tutorial'

export function getTutorials() {
  return axios.get(`${URI}`)
}

export function getTutorial(id) {
  return axios.get(`${URI}/${id}`)
}

export function createTutorial(tutorial) {
  return axios.post(`${URI}`, tutorial)
}

export function updateTutorial(tutorial) {
  return axios.put(`${URI}/${tutorial.id}`, tutorial)
}
