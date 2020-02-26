import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

const ENDPOINT = '/ws-etbs'
const PUBLISH_TOPIC = '/topic/get-publish'
const WUSEREMAIL_TOPIC = '/topic/get-useremail'

export function connectWSPublish(vueInstance, handleData) {
  connectWS(vueInstance, PUBLISH_TOPIC, handleData)
}

export function connectWSUseremail(vueInstance, handleData) {
  connectWS(vueInstance, WUSEREMAIL_TOPIC, handleData)
}

export function disconnectWS(vueInstance) {
  if (vueInstance.stompClient) {
    vueInstance.stompClient.disconnect()
  }
}

export function sendMessage(vueInstance, app, data) {
  if (vueInstance.stompClient) {
    vueInstance.stompClient.send(app, {}, JSON.stringify(data))
  }
}

function connectWS(vueInstance, topic, handleData) {
  vueInstance.socket = new SockJS(process.env.VUE_APP_API_DOMAIN + ENDPOINT)
  vueInstance.stompClient = Stomp.over(vueInstance.socket, { debug: false })
  vueInstance.stompClient.connect(
    {},
    // eslint-disable-next-line no-unused-vars
    frame => {
      vueInstance.wsConnected = true
      vueInstance.stompClient.subscribe(topic, data => handleData(data))
    }
  )
}
