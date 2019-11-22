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
    }
  }
}
