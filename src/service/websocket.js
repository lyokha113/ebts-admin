import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

const ENDPOINT = '/ws'
const CONTRIBUTOR_APP = '/app/contributor/'
const CONTENT_APP = '/app/content/'
const PUBLISH_TOPIC = '/topic/publish/'
const PUBLISH_USER = '/user/queue/publish/'
const USEREMAIL_USER = '/user/queue/useremail/'
const INVITATION_USER = '/user/queue/invitation/'
const RAW_USER = '/user/queue/raw/'
const NOTIFICATION_USER = '/user/queue/notification/'

export function connectWSNotification(vue, token, handleData) {
  const channels = [{ name: NOTIFICATION_USER, handler: handleData }]
  connectWS(vue, token, channels)
}

export function connectWSPublishAdmin(vue, token, handleData) {
  const channels = [{ name: PUBLISH_TOPIC, handler: handleData }]
  connectWS(vue, token, channels)
}

export function connectWSPublish(vue, token, handleData) {
  const channels = [{ name: PUBLISH_USER, handler: handleData }]
  connectWS(vue, token, channels)
}

export function connectWSUseremail(vue, token, handleData) {
  const channels = [{ name: USEREMAIL_USER, handler: handleData }]
  connectWS(vue, token, channels, [])
}

export function connectWSInvitation(vue, token, handleData) {
  const channels = [{ name: INVITATION_USER, handler: handleData }]
  connectWS(vue, token, channels, [])
}

export function connectWSRaw(vue, token, handleData, rawId, message) {
  const channels = [{ name: RAW_USER + rawId, handler: handleData }]
  const messages = [{ name: CONTRIBUTOR_APP, data: message }]
  connectWS(vue, token, channels, messages)
}

export function sendOfflineSession(vue, message) {
  sendMessage(vue, CONTRIBUTOR_APP, message)
}
export function sendDesignContent(vue, message) {
  sendMessage(vue, CONTENT_APP, message)
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

function sendMessage(vue, app, message) {
  if (vue.stompClient && vue.stompClient.connected) {
    vue.stompClient.send(app, JSON.stringify(message), {})
  }
}
