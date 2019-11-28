/* eslint-disable no-useless-escape */
import html2canvas from 'html2canvas'
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions(['logout']),
    async handleCallAPI(api, args) {
      try {
        return await api(args)
      } catch (error) {
        console.log(error)
        if (error.response.status == 400) {
          this.$vs.notify({
            title: 'Input error',
            text: error.response.data.message,
            color: 'warning',
            icon: 'error',
            position: 'top-right'
          })
          return
        }

        if (error.response.status == 401 || error.response.status == 403) {
          this.$router.push('/login')
          this.$vs.notify({
            title: 'Permission error',
            text: 'Action was denied.',
            color: 'warning',
            icon: 'error',
            position: 'top-right'
          })
          return
        }

        this.$vs.notify({
          title: 'Error',
          text: error.response.data.status,
          color: 'danger',
          icon: 'error',
          position: 'top-right'
        })
      }
    },
    async html2Image(node) {
      const canvas = await html2canvas(node, {
        imageTimeout: 30000,
        useCORS: true,
        backgroundColor: 'white'
      })
      return canvas.toDataURL()
    },
    base64ImageToBlob(str) {
      let pos = str.indexOf(';base64,')
      let type = str.substring(5, pos)
      let b64 = str.substr(pos + 8)

      let imageContent = atob(b64)
      let buffer = new ArrayBuffer(imageContent.length)
      let view = new Uint8Array(buffer)

      for (let n = 0; n < imageContent.length; n++) {
        view[n] = imageContent.charCodeAt(n)
      }

      return new Blob([buffer], { type: type })
    },
    validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    }
  }
}
