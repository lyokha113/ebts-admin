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
                    svgClasses="w-4 h-4"
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
                    svgClasses="w-4 h-4"
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
                    svgClasses="w-4 h-4"
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
                    svgClasses="w-4 h-4"
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
                    svgClasses="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-4">Workspace</span>
                </li>
                <li
                  v-if="activeUser"
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/user/publish').catch(err => {})"
                >
                  <feather-icon
                    icon="UploadCloudIcon"
                    svgClasses="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-4">Publishes</span>
                </li>
                <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/user/tutorial').catch(err => {})"
                >
                  <feather-icon
                    icon="HelpCircleIcon"
                    svgClasses="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-4">Tutorial</span>
                </li>
                <li
                  v-if="activeUser"
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="handleLogout"
                >
                  <feather-icon
                    icon="LogOutIcon"
                    svgClasses="w-4 h-4"
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
  name: 'the-navbar',
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
