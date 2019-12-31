import axios from '@/plugin/axios'

const URI = '/version'

export function updateVersionContent(version) {
  return axios.patch(`${URI}/${version.rawId}`, { string: version.content })
}
