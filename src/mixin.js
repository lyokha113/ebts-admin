export default {
  methods: {
    async handleCallAPI(api, args, loading = true) {
      let loader = null
      try {
        if (!loading) {
          return await api(args)
        }

        loader = this.$loading.show({
          color: '#7367f0',
          loader: 'spinner',
          width: 64,
          height: 64,
          backgroundColor: '#ffffff',
          opacity: 0.8,
          zIndex: 110000
        })

        const response = await api(args)
        loader.hide()
        loader = null
        return response
      } catch (error) {
        console.log(error)

        if (loading) {
          loader.hide()
          loader = null
        }

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
    strToArrayBuffer(str) {
      let buf = new ArrayBuffer(str.length)
      let view = new Uint8Array(buf)
      for (var i = 0; i != str.length; ++i) view[i] = str.charCodeAt(i) & 0xff
      return buf
    },
    validateEmail(email) {
      // eslint-disable-next-line no-useless-escape
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    }
  }
}
