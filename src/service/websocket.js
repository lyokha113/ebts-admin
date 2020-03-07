import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

const ENDPOINT = '/ws'
const CONTRIBUTOR_APP = '/app/contributor/'
const PUBLISH_TOPIC = '/topic/publish/'
const USEREMAIL_USER = '/user/queue/useremail/'
const INVITATION_USER = '/user/queue/invitation/'
const RAW_USER = '/user/queue/raw/'

export function connectWSPublish(vue, token, handleData) {
  const channels = [{ name: PUBLISH_TOPIC, handler: handleData }]
  connectWS(vue, token, channels)
}

export function connectWSUseremail(vue, token, handleData) {
  const channels = [{ name: USEREMAIL_USER, handler: handleData }]
  connectWS(vue, token, channels, [])
}

export function connectWSRaw(vue, token, handleData, rawId) {
  const channels = [{ name: RAW_USER + rawId, handler: handleData }]
  connectWS(vue, token, channels, [])
}

export function connectWSInvitation(vue, token, handleData) {
  const channels = [{ name: INVITATION_USER, handler: handleData }]
  connectWS(vue, token, channels, [])
}

export function connectWSDesignSession(vue, token, message) {
  const messages = [{ name: CONTRIBUTOR_APP, data: message }]
  connectWS(vue, token, [], messages)
}

export function disconnectWS(vue) {
  if (vue.stompClient) {
    vue.stompClient.disconnect()
  }
}

function connectWS(vue, token, channels, messages) {
  vue.socket = new SockJS(process.env.VUE_APP_API_DOMAIN + ENDPOINT)
  vue.stompClient = Stomp.over(vue.socket, { debug: false })
  vue.stompClient.connect(
    { AccessToken: token },
    // eslint-disable-next-line no-unused-vars
    frame => {
      channels &&
        channels.forEach(channel => {
          vue.stompClient.subscribe(channel.name, data =>
            channel.handler(data.body)
          )
        })
      messages &&
        messages.forEach(message => {
          vue.stompClient.send(message.name, JSON.stringify(message.data), {})
        })
    }
  )
}

// function sendMessage(vue, message, data) {
//   if (vue.stompClient) {
//     vue.stompClient.send(message, {}, JSON.stringify(data))
//   }
// }
