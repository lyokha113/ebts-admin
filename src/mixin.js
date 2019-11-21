export default {
  methods: {
    async handleCallAPI(api, args) {
      try {
        await api(args)
      } catch (error) {
        console.log(error.response)
        this.$vs.notify({
          title: 'Error',
          text: error.response.data.status,
          color: 'danger',
          position: 'top-right'
        })
      }
    }
  }
}
