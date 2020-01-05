<template>
  <div>
    <h1>Change Password</h1>
    <vs-row class="justify-center align-center">
      <vs-input
        type="password"
        icon="icon icon-lock"
        icon-pack="feather"
        label="New Password"
        v-model="password"
        name="Password"
      />
    </vs-row>
    <vs-row class="justify-center align-center">
      <vs-input
        type="password"
        icon="icon icon-repeat"
        icon-pack="feather"
        label="Confirm Password"
        v-model="confirm"
        name="confirm"
      />
    </vs-row>
    <vs-row class="justify-center align-center mt-4">
      <vs-button @click="handleChange">Change Password</vs-button>
    </vs-row>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'userPassword',
  data() {
    return {
      password: '',
      confirm: ''
    }
  },
  methods: {
    ...mapActions(['updateUser']),
    async handleChange() {
      if (!this.password || !this.confirm) {
        this.$vs.notify({
          title: 'Warning',
          text: 'Please enter password and confirm',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }
      if (this.password != this.confirm) {
        this.$vs.notify({
          title: 'Confirm password not matched',
          text: 'Please re-check confirm password',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }
      this.handleChangeConfirm()
    },
    async handleChangeConfirm() {
      const account = {
        password: this.password
      }
      await this.handleCallAPI(this.updateUser, account)
    }
  }
}
</script>