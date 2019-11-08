import axios from '@/plugin/axios'

const URI = '/account'

export function getAccounts() {
  return axios.get(`${URI}`)
}
