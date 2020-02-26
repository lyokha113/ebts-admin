import axios from 'axios'
import store from '@/store/store'
import { getToken } from '@/plugins/auth'

// eslint-disable-next-line no-undef
const api_local = 'http://18.140.138.198/'

const service = axios.create({
  baseURL: api_local,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Content-Type': 'application/json'
})

service.interceptors.request.use(
  config => {
    if (store.getters.accessToken) {
      config.headers['AUTHORIZATION'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
