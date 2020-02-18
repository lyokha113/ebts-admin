import axios from '@/plugins/axios'

const URI = '/workspace'

export function getWorkspaces() {
  return axios.get(`${URI}`)
}

export function createWorkspace(workspace) {
  return axios.post(`${URI}`, workspace)
}

export function updateWorkspace(workspace) {
  return axios.put(`${URI}/${workspace.id}`, workspace)
}

export function deleteWorkspace(id) {
  return axios.delete(`${URI}/${id}`)
}
