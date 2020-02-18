import axios from '@/plugins/axios'

const URI = '/rating'

export function rate(req) {
  return axios.post(`${URI}`, req)
}
