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
                class="mx-auto"
              />
            </div>
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
              <div class="p-8">
                <div class="vx-card__title mb-8">
                  <h4 class="mb-4">Register</h4>
                  <p>Enter your details and sign-up to be a member</p>
                </div>
                <vs-input
                  name="email"
                  icon="icon icon-user"
                  icon-pack="feather"
                  label-placeholder="Email"
                  v-model="email"
                  :disable="loading"
                  class="w-full no-icon-border"
                />

                <vs-input
                  type="password"
                  name="password"
                  icon="icon icon-lock"
                  icon-pack="feather"
                  label-placeholder="Password"
                  v-model="password"
                  :disable="loading"
                  class="w-full mt-6 no-icon-border"
                />

                <vs-button type="border" @click="$router.push('/login')"
                  >Login</vs-button
                >

                <vs-button class="float-right" @click="handleLogin"
                  >Register</vs-button
                >
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      email: '',
      password: '',
      loading: false
    }
  },
  computed: {
    ...mapGetters(['accessToken'])
  },
  methods: {
    ...mapActions(['login', 'logout']),
    async handleLogin() {
      this.loading = false
      await this.handleCallAPI(this.login, {
        email: this.email,
        password: this.password
      })
      if (this.accessToken) {
        this.$router.push('/')
      } else {
        this.$vs.notify({
          title: 'Warning',
          text: 'Incorrect login information',
          color: 'warning',
          position: 'top-right'
        })
      }

      this.loading = true
    }
  }
}
</script>

<style lang="scss" scoped>
.bg-google {
  background-color: #bf3b2d;
}
</style>
