import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

const ENDPOINT = '/ws'
const PUBLISH_TOPIC = '/topic/publish'
const WUSEREMAIL_USER = '/user/useremail'

export function connectWSPublish(vue, handleData) {
  connectWS(vue, PUBLISH_TOPIC, handleData)
}

export function connectWSUseremail(vue, token, user, handleData) {
  connectUserWS(vue, WUSEREMAIL_USER, handleData)
}

export function disconnectWS(vue) {
  if (vue.stompClient) {
    vue.stompClient.disconnect()
  }
}

export function sendMessage(vue, app, data) {
  if (vue.stompClient) {
    vue.stompClient.send(app, {}, JSON.stringify(data))
  }
}

function connectWS(vue, topic, handleData) {
  vue.socket = new SockJS(process.env.VUE_APP_API_DOMAIN + ENDPOINT)
  vue.stompClient = Stomp.over(vue.socket, { debug: false })
  vue.stompClient.connect(
    {},
    // eslint-disable-next-line no-unused-vars
    frame => {
      vue.wsConnected = true
      vue.stompClient.subscribe(topic, data =>
        handleData(JSON.parse(data.body))
      )
    }
  )
}

function connectUserWS(vue, token, , handleData) {
  vue.socket = new SockJS(process.env.VUE_APP_API_DOMAIN + ENDPOINT)
  vue.stompClient = Stomp.over(vue.socket, { debug: false })
  vue.stompClient.connect(
    {},
    // eslint-disable-next-line no-unused-vars
    frame => {
      vue.wsConnected = true
      vue.stompClient.subscribe(topic, data =>
        handleData(JSON.parse(data.body))
      )
    }
  )
}
