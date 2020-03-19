import axios from '@/plugins/axios'

const URI = '/notification'

export function getNewNotifications() {
  return axios.get(`${URI}`)
}

export function getAllNotifications() {
  return axios.get(`${URI}/all`)
}

export function loadNotification(id) {
  return axios.post(`${URI}/${id}`)
}
