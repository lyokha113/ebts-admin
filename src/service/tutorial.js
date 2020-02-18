import axios from '@/plugins/axios'

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

export function updateTutorial(id, tutorial) {
  return axios.put(`${URI}/${id}`, tutorial)
}

export function updateStatusTutorial(id, active) {
  return axios.patch(`${URI}/${id}`, null, {
    params: { active }
  })
}
