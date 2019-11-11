import axios from '@/plugin/axios'

const URI = '/category'

export function getCategories() {
  return axios.get(`${URI}`)
}

export function createCategory(category) {
  return axios.post(`${URI}`, category)
}

export function updateCategory(category) {
  return axios.put(`${URI}/${category.id}`, category)
}
