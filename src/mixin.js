export default {
  methods: {
    async handleCallAPI(api, args) {
      try {
        return await api(args)
      } catch (error) {
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
    base64ImageToBlob(str) {
      let pos = str.indexOf(';base64,')
      let type = str.substring(5, pos)
      let b64 = str.substr(pos + 8)

      let imageContent = atob(b64)
      let buffer = new ArrayBuffer(imageContent.length)
      let view = new Uint8Array(buffer)

      for (let i = 0; i < imageContent.length; i++) {
        view[i] = imageContent.charCodeAt(i)
      }

      return new Blob([buffer], { type })
    },
    validateEmail(email) {
      // eslint-disable-next-line no-useless-escape
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    }
  }
}
