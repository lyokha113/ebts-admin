<template>
  <div class="relative">
    <div class="vx-navbar-wrapper">
      <vs-navbar
        class="vx-navbar navbar-custom"
        color="white"
        :class="navWidth"
      >
        <vs-spacer />

        <!-- SEARCHBAR -->
        <div
          class="search-full-container w-full h-full absolute left-0 rounded-lg"
          :class="{ flex: showFullSearch }"
          v-show="showFullSearch"
        >
          <vx-auto-suggest
            :autoFocus="showFullSearch"
            :data="navbarSearchAndPinList"
            @selected="selected"
            ref="navbarSearch"
            @closeSearchbar="showFullSearch = false"
            placeholder="Search..."
            class="w-full"
            inputClassses="w-full vs-input-no-border vs-input-no-shdow-focus no-icon-border"
            icon="SearchIcon"
            background-overlay
          ></vx-auto-suggest>
          <div class="absolute right-0 h-full z-50">
            <feather-icon
              icon="XIcon"
              class="px-4 cursor-pointer h-full close-search-icon"
              @click="showFullSearch = false"
            ></feather-icon>
          </div>
        </div>
        <feather-icon
          icon="SearchIcon"
          @click="showFullSearch = true"
          class="cursor-pointer navbar-fuzzy-search mx-4"
        ></feather-icon>

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
            <vs-dropdown-menu class="vx-navbar-dropdown">
              <ul style="min-width: 9rem">
                <li
                  v-if="!activeUser"
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/login')"
                >
                  <feather-icon
                    icon="LogInIcon"
                    svgClasses="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-2">Login</span>
                </li>
                <li
                  v-if="!activeUser"
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/register')"
                >
                  <feather-icon
                    icon="SmileIcon"
                    svgClasses="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-2">Register</span>
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
                  <span class="ml-2">Images</span>
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
                  <span class="ml-2">Logout</span>
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
import navbarSearchAndPinList from '@/layouts/components/navbarSearchAndPinList'
import VxAutoSuggest from '@/components/vx-auto-suggest/VxAutoSuggest.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'the-navbar',
  data() {
    return {
      navbarSearchAndPinList: navbarSearchAndPinList,
      searchQuery: '',
      showFullSearch: false
    }
  },
  computed: {
    ...mapGetters(['sidebarWidth', 'activeUser']),
    navWidth() {
      if (this.sidebarWidth == 'default') return 'navbar-default'
      else if (this.sidebarWidth == 'reduced') return 'navbar-reduced'
      else if (this.sidebarWidth) return 'navbar-full'
      return 'navbar-full'
    },
    user_displayName() {
      return this.activeUser.fullName
    },
    activeUserImg() {
      return this.activeUser.imageUrl
    }
  },
  methods: {
    selected(item) {
      this.$router.push(item.url)
      this.showFullSearch = false
    },
    ...mapActions(['logout']),
    async handleLogout() {
      await this.logout()
      this.$router.push('/login')
    }
  },
  components: {
    VxAutoSuggest
  }
}
</script>
