<template>
  <div
    class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center"
    id="page-login"
  >
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter justify-center items-center">
            <div class="vx-col hidden lg:block lg:w-1/2">
              <img
                src="@/assets/images/pages/login.png"
                alt="login"
                class="mx-auto cursor-pointer mb-5"
                @click="$router.push('/').catch(err => {})"
              />
              <vs-button
                class="flex m-auto"
                @click="$router.push('/').catch(err => {})"
                type="border"
                >Home Page</vs-button
              >
            </div>
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
              <div class="p-8">
                <div class="vx-card__title mb-8">
                  <h4 class="mb-4">Login</h4>
                  <p>Welcome back, please login to your account.</p>
                </div>
                <vs-input
                  name="email"
                  icon="icon icon-mail"
                  icon-pack="feather"
                  label-placeholder="Email"
                  v-model="email"
                  class="w-full no-icon-border"
                />

                <vs-input
                  type="password"
                  name="password"
                  icon="icon icon-lock"
                  icon-pack="feather"
                  label-placeholder="Password"
                  v-model="password"
                  class="w-full mt-6 no-icon-border"
                />

                <div class="flex flex-wrap justify-between mt-5">
                  <!-- <router-link to="#">Forgot Password?</router-link> -->
                </div>

                <vs-button type="border" @click="$router.push('/register')"
                  >Register</vs-button
                >

                <vs-button class="float-right" @click="handleLogin"
                  >Login</vs-button
                >

                <div
                  class="bg-google pt-3 pb-2 px-4 rounded-lg cursor-pointer mr-4 float-right"
                  v-google-signin-button="googleClientId"
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    class="text-white h-4 w-12 svg-inline--fa fa-google fa-w-16"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                  >
                    <path
                      fill="currentColor"
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import GoogleSignInButton from 'vue-google-signin-button-directive'
import { mapActions } from 'vuex'
export default {
  directives: {
    GoogleSignInButton
  },
  data() {
    return {
      googleClientId: process.env.VUE_APP_GOOGLE_CLIENT_ID,
      email: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(['login', 'googleAuth']),
    async OnGoogleAuthSuccess(token) {
      const loginInfo = { string: token, page: this.$route.query.return }
      await this.handleCallAPI(this.googleAuth, loginInfo)
    },
    OnGoogleAuthFail(error) {
      if (error.error !== 'popup_closed_by_user') {
        this.$vs.notify({
          title: 'Login Error',
          text: error.error.toUpperCase(),
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
      }
    },
    async handleLogin() {
      if (!this.email || !this.password) {
        this.$vs.notify({
          title: 'Warning',
          text: 'Please enter email and password',
          color: 'warning',
          position: 'top-right'
        })
        return
      }
      this.handleloginConfirm()
    },
    async handleloginConfirm() {
      const loginInfo = {
        email: this.email,
        password: this.password,
        page: this.$route.query.return
      }
      await this.handleCallAPI(this.login, loginInfo)
    }
  }
}
</script>

<style lang="scss" scoped>
.bg-google {
  background-color: #bf3b2d;
}
</style>
