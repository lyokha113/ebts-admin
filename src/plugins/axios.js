import axios from 'axios'
import store from '@/store/store'
// import pako from 'pako'
import { getToken } from '@/plugins/auth'

const api_local = process.env.VUE_APP_API_DOMAIN || 'https://etbs.ml'

const service = axios.create({
  baseURL: api_local,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Content-Type': 'application/json'
  // transformRequest: axios.defaults.transformRequest.concat(function(
  //   data,
  //   headers
  // ) {
  //   if (data && data.length > 1024) {
  //     headers['Content-Encoding'] = 'gzip'
  //     return pako.gzip(data)
  //   } else {
  //     headers['Content-Encoding'] = undefined
  //     return data
  //   }
  // })
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
