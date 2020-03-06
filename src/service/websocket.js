import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

const ENDPOINT = '/ws'
const CONTRIBUTOR_APP = '/app/contributor/'
const PUBLISH_TOPIC = '/topic/publish/'
const USEREMAIL_USER = '/user/queue/useremail/'
const INVITATION_USER = '/user/queue/invitation/'
const CONTRIBUTOR_USER = '/user/queue/contributor/'

export function connectWSPublish(vue, token, handleData) {
  const channels = [{ name: PUBLISH_TOPIC, handler: handleData }]
  connectWS(vue, token, channels)
}

export function connectWSUseremail(vue, token, handleData) {
  const channels = [{ name: USEREMAIL_USER, handler: handleData }]
  connectWS(vue, token, channels)
}

export function connectWSInvitation(vue, token, handleData) {
  const channels = [
    { name: INVITATION_USER, handler: handleData, sendMessage: true }
  ]
  connectWS(vue, token, channels)
}

export function connectWSContributor(vue, token, handleData, rawId) {
  const channels = [{ name: CONTRIBUTOR_USER + rawId, handler: handleData }]
  connectWS(vue, token, channels)
}

export function sendContributor(vue, token, data) {
  sendMessage(vue, token, CONTRIBUTOR_APP, data)
}

export function disconnectWS(vue) {
  if (vue.stompClient) {
    vue.stompClient.disconnect()
  }
}

function connectWS(vue, token, channels) {
  vue.socket = new SockJS(process.env.VUE_APP_API_DOMAIN + ENDPOINT)
  vue.stompClient = Stomp.over(vue.socket, { debug: false })
  vue.stompClient.connect(
    { AccessToken: token },
    // eslint-disable-next-line no-unused-vars
    frame => {
      channels.forEach(channel => {
        vue.stompClient.subscribe(channel.name, data =>
          channel.handler(data.body)
        )
        if (channel.sendMessage) {
          vue.stompClient.send(CONTRIBUTOR_APP, {}, 'abc')
        }
      })
    }
  )
}

export function sendMessage(vue, token, channel, data) {
  if (vue.stompClient) {
    vue.stompClient.send(channel, { token }, JSON.stringify(data))
  }
}
