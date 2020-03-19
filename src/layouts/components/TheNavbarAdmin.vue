/* eslint-disable no-unused-vars */
<template>
  <div class="relative">
    <div class="vx-navbar-wrapper">
      <vs-navbar
        class="vx-navbar navbar-custom"
        color="white"
        :class="navWidth"
      >
        <!-- SM - OPEN SIDEBAR BUTTON -->
        <feather-icon
          class="sm:inline-flex xl:hidden cursor-pointer mr-1"
          icon="MenuIcon"
          @click.stop="showSidebar"
        ></feather-icon>

        <vs-spacer></vs-spacer>

        <!-- SEARCHBAR -->
        <div
          v-show="showFullSearch"
          class="search-full-container w-full h-full absolute left-0 rounded-lg"
          :class="{ flex: showFullSearch }"
        >
          <vx-auto-suggest
            ref="navbarSearch"
            :auto-focus="showFullSearch"
            :data="navbarSearchAndPinList"
            placeholder="Search..."
            class="w-full"
            input-classses="w-full vs-input-no-border vs-input-no-shdow-focus no-icon-border"
            icon="SearchIcon"
            background-overlay
            @selected="selected"
            @closeSearchbar="showFullSearch = false"
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
          class="cursor-pointer navbar-fuzzy-search mx-4"
          @click="showFullSearch = true"
        ></feather-icon>

        <!-- NOTIFICATIONS -->
        <vs-dropdown
          vs-custom-content
          vs-trigger-click
          class="cursor-pointer ml-4"
        >
          <feather-icon
            icon="BellIcon"
            class="cursor-pointer mt-1 sm:mr-6 mr-2"
            :badge="newNoti"
          ></feather-icon>
          <vs-dropdown-menu
            class="notification-dropdown dropdown-custom vx-navbar-dropdown"
          >
            <div class="notification-top text-center p-5 bg-primary text-white">
              <h3 class="text-white">{{ newNoti }} New</h3>
              <p class="opacity-75">Notifications</p>
            </div>

            <VuePerfectScrollbar
              ref="mainSidebarPs"
              class="scroll-area--nofications-dropdown p-0 mb-10"
              :settings="settings"
            >
              <ul class="bordered-items">
                <li
                  v-for="ntf in notifications"
                  :key="ntf.id"
                  class="flex justify-between px-4 py-4 notification cursor-pointer"
                  @click="handleNoti(ntf)"
                >
                  <div class="flex items-start">
                    <feather-icon
                      :icon="ntf.code | notiIcon"
                      :svgClasses="[
                        `text-${ntf.status.toLowerCase()}`,
                        'stroke-current mr-1 h-6 w-6'
                      ]"
                    ></feather-icon>
                    <div class="mx-2">
                      <span
                        class="font-medium block notification-title"
                        :class="[`text-${ntf.status.toLowerCase()}`]"
                        >{{ ntf.title }}</span
                      >
                      <small>{{ ntf.content }}</small>
                    </div>
                  </div>
                  <div>
                    <small class="mt-1 whitespace-no-wrap">
                      {{ ntf.createdDate | duration('humanize') }}
                    </small>
                    <br />
                    <feather-icon
                      v-if="!ntf.loaded"
                      icon="MailIcon"
                      svgClasses="h-5 w-5"
                    ></feather-icon>
                  </div>
                </li>
              </ul>
            </VuePerfectScrollbar>
            <div
              v-if="!isAllNoti"
              class="checkout-footer fixed bottom-0 rounded-b-lg text-primary w-full p-2 font-semibold text-center border border-b-0 border-l-0 border-r-0 border-solid d-theme-border-grey-light cursor-pointer"
            >
              <span @click.stop="handleAllNoti">View All Notifications</span>
            </div>
          </vs-dropdown-menu>
        </vs-dropdown>

        <!-- USER META -->
        <div class="the-navbar__user-meta flex items-center">
          <div class="text-right leading-tight hidden sm:block">
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
                key="localImg"
                :src="activeUserImg"
                alt="user-img"
                width="40"
                height="40"
                class="rounded-full shadow-md cursor-pointer block"
              />
            </div>
            <vs-dropdown-menu class="vx-navbar-dropdown">
              <ul style="min-width: 9rem">
                <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="handleLogout"
                >
                  <feather-icon
                    icon="LogOutIcon"
                    svg-classes="w-4 h-4"
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
import { connectWSNotification, disconnectWS } from '@/service/websocket'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TheNavbarAdmin',
  filters: {
    notiIcon: function(code) {
      if (code == 'REQUEST_PUBLISH') return 'UploadCloudIcon'
    }
  },
  data() {
    return {
      navbarSearchAndPinList: navbarSearchAndPinList,
      searchQuery: '',
      showFullSearch: false,
      isAllNoti: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebarWidth',
      'activeUser',
      'notifications',
      'newNoti',
      'accessToken'
    ]),

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
    showSidebar() {
      this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true)
    },
    selected(item) {
      this.$router.push(item.url)
      this.showFullSearch = false
    },

    ...mapActions([
      'logout',
      'getNewNotifications',
      'getAllNotifications',
      'loadNotification',
      'notificationWs'
    ]),
    handleAllNoti() {
      this.isAllNoti = true
      this.getAllNotifications()
    },
    handleNoti(ntf) {
      if (!ntf.loaded) this.loadNotification(ntf.id)
      if (ntf.code == 'REQUEST_PUBLISH' && this.$route.name != 'AdminPublish')
        this.$router.push('/admin/publish')
    },
    async handleLogout() {
      await this.logout()
      this.$router.push('/login')
    }
  },
  mounted() {
    this.getNewNotifications()
    connectWSNotification(this, this.accessToken, this.notificationWs)
  },
  destroyed() {
    disconnectWS(this)
  },
  directives: {
    'click-outside': {
      bind: function(el, binding) {
        const bubble = binding.modifiers.bubble
        const handler = e => {
          if (bubble || (!el.contains(e.target) && el !== e.target)) {
            binding.value(e)
          }
        }
        el.__vueClickOutside__ = handler
        document.addEventListener('click', handler)
      },

      unbind: function(el) {
        document.removeEventListener('click', el.__vueClickOutside__)
        el.__vueClickOutside__ = null
      }
    }
  },
  components: {
    VxAutoSuggest
  }
}
</script>
