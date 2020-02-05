/* eslint-disable no-unused-vars */
import axios from 'axios'
import store from '@/store/store'
import { getToken } from '@/plugin/auth'

const api_local = process.env.VUE_APP_API_DOMAIN_LOCAL
const api_aws = process.env.VUE_APP_API_DOMAIN_AWS

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
