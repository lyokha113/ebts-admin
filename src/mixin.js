import html2canvas from 'html2canvas'

export default {
  methods: {
    async handleCallAPI(api, args) {
      try {
        await api(args)
      } catch (error) {
        this.$vs.notify({
          title: 'Error',
          text: error.response.data.status,
          color: 'danger',
          position: 'top-right'
        })
      }
    },
    async html2Image(node) {
      const canvas = await html2canvas(node, {
        logging: false,
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
    }
  }
}
