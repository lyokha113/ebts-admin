<template>
  <div class="relative">
    <div class="vx-navbar-wrapper">
      <vs-navbar
        class="vx-navbar navbar-custom"
        color="white"
        :class="navWidth"
      >
        <img
          class="cursor-pointer"
          src="@/assets/images/logo/logo-rec.png"
          height="40px"
          @click="$router.push('/').catch(err => {})"
        />

        <vs-spacer />

        <div
          class="font-semibold text-xl antialiased cursor-pointer mx-8"
          :style="[
            $route.name == 'Home' ? { color: '#32caab' } : { color: 'silver' }
          ]"
          @click="$router.push('/').catch(err => {})"
        >
          HOME
        </div>

        <div
          class="font-semibold text-xl antialiased cursor-pointer mx-8"
          :style="[
            $route.name == 'Tutorial'
              ? { color: '#32caab' }
              : { color: 'silver' }
          ]"
          @click="$router.push('/tutorial').catch(err => {})"
        >
          TUTORIAL
        </div>

        <vs-spacer />

        <!-- USER META -->
        <div class="the-navbar__user-meta flex items-center">
          <div
            v-if="activeUser"
            class="text-right leading-tight hidden sm:block"
          >
            <p class="font-semibold">{{ user_displayName }}</p>
            <small>Available</small>
          </div>
          <vs-dropdown
            vs-custom-content
            vs-trigger-click
            class="cursor-pointer"
          >
            <div class="con-img ml-3">
              <img
                v-if="activeUser"
                key="localImg"
                :src="activeUserImg"
                alt="user-img"
                width="40"
                height="40"
                class="rounded-full shadow-md cursor-pointer block"
              />
              <img
                v-else
                key="localImg"
                src="@/assets/images/logo/logo.png"
                alt="user-img"
                width="40"
                height="40"
                class="rounded-full shadow-md cursor-pointer block"
              />
            </div>
            <vs-dropdown-menu class="vx-navbar-dropdown" style="width: 180px">
              <ul style="min-width: 10rem">
                <li
                  v-if="!activeUser"
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/login').catch(err => {})"
                >
                  <feather-icon
                    icon="LogInIcon"
                    svg-classes="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-4">Login</span>
                </li>
                <li
                  v-if="!activeUser"
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/register').catch(err => {})"
                >
                  <feather-icon
                    icon="SmileIcon"
                    svg-classes="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-4">Register</span>
                </li>
                <li
                  v-if="activeUser"
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/user/profile')"
                >
                  <feather-icon
                    icon="UserIcon"
                    svg-classes="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-4">Profiles</span>
                </li>
                <li
                  v-if="activeUser"
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/user/image')"
                >
                  <feather-icon
                    icon="ImageIcon"
                    svg-classes="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-4">Images</span>
                </li>
                <li
                  v-if="activeUser"
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/user/workspace').catch(err => {})"
                >
                  <feather-icon
                    icon="FileMinusIcon"
                    svg-classes="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-4">Workspace</span>
                </li>
                <li
                  v-if="activeUser"
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/user/block').catch(err => {})"
                >
                  <feather-icon
                    icon="TrelloIcon"
                    svg-classes="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-4">User Block</span>
                </li>
                <li
                  v-if="activeUser"
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/user/publish').catch(err => {})"
                >
                  <feather-icon
                    icon="UploadCloudIcon"
                    svg-classes="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-4">Publishes</span>
                </li>
                <li
                  v-if="activeUser"
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="handleLogout"
                >
                  <feather-icon
                    icon="LogOutIcon"
                    svg-classes="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-4">Logout</span>
                </li>
              </ul>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>
      </vs-navbar>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TheNavbar',
  computed: {
    ...mapGetters(['sidebarWidth', 'activeUser']),
    navWidth() {
      if (this.sidebarWidth == 'default') return 'navbar-default'
      else if (this.sidebarWidth == 'reduced') return 'navbar-reduced'
      else if (this.sidebarWidth) return 'navbar-full'
      return 'navbar-full'
    },
    user_displayName() {
      return this.activeUser && this.activeUser.fullName
    },
    activeUserImg() {
      return this.activeUser && this.activeUser.imageUrl
    }
  },
  methods: {
    ...mapActions(['logout']),
    async handleLogout() {
      await this.logout()
      this.$router.push('/login')
    }
  }
}
</script>
