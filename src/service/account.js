import axios from '@/plugins/axios'

const URI = '/account'

export function getAccounts() {
  return axios.get(`${URI}`)
}

export function createAccount(account) {
  return axios.post(`${URI}`, account)
}

export function updateAccount(account) {
  return axios.put(`${URI}/${account.id}`, account)
}

export function updateAccountStatus(id, active) {
  return axios.patch(`${URI}/${id}`, null, {
    params: { active }
  })
}
