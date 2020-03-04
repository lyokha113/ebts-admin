import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

const ENDPOINT = '/ws'
const PUBLISH_TOPIC = '/topic/publish/'
const WUSEREMAIL_USER = '/user/queue/useremail/'

export function connectWSPublish(vue, token, handleData) {
  const channels = [{ name: PUBLISH_TOPIC, handler: handleData }]
  connectWS(vue, token, channels)
}

export function connectWSUseremail(vue, token, handleData) {
  const channels = [{ name: WUSEREMAIL_USER, handler: handleData }]
  connectWS(vue, token, channels)
}

export function disconnectWS(vue) {
  if (vue.stompClient) {
    vue.stompClient.disconnect()
  }
}

export function sendMessage(vue, channel, data) {
  if (vue.stompClient) {
    vue.stompClient.send(channel, {}, JSON.stringify(data))
  }
}

function connectWS(vue, token, channels) {
  vue.socket = new SockJS(process.env.VUE_APP_API_DOMAIN + ENDPOINT)
  vue.stompClient = Stomp.over(vue.socket, { debug: false })
  vue.stompClient.connect(
    { AccessToken: token },
    // eslint-disable-next-line no-unused-vars
    frame => {
      vue.wsConnected = true
      channels.forEach(channel => {
        vue.stompClient.subscribe(channel.name, data =>
          channel.handler(JSON.parse(data.body))
        )
      })
    }
  )
}
