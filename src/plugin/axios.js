import axios from 'axios'
import store from '@/store/store'
import { getToken } from '@/plugin/auth'

// const API_LOCAL = "http://localhost:5000";
const API_AWS = 'http://18.140.138.198/'

const service = axios.create({
  baseURL: API_AWS,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Content-Type': 'application/json'
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.accessToken) {
      config.headers['AUTHORIZATION'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

export default service
