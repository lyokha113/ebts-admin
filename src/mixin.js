export default {
  methods: {
    async handleCallAPI(api, args) {
      try {
        await api(args)
      } catch (error) {
        this.$vs.notify({
          title: 'Error',
          text: 'Something was wrong',
          color: 'danger',
          position: 'top-right'
        })
      }
    }
  }
}
