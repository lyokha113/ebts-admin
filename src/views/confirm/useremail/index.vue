<template>
  <div class="parent">
    <img
      src="https://cdn.dribbble.com/users/1061799/screenshots/5749278/phone-successful-dribbble.png"
      class="mt-10"
      width="50%"
    />
    <h2 class="mt-10">
      Your email verified successful.
      <br />Now you can close this window!
    </h2>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {}
  },
  created() {
    this.handleCallAPI(
      this.confirmUserEmail,
      window.location.href.split('?')[1]
    )
  },
  methods: {
    ...mapActions(['confirmUserEmail'])
  }
}
</script>
<style scoped>
div.parent {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  justify-content: center;
  text-align: center;
}
</style>