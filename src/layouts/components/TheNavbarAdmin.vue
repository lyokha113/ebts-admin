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
        <!-- <vs-dropdown
          vs-custom-content
          vs-trigger-click
          class="cursor-pointer ml-4"
        >
          <feather-icon
            icon="BellIcon"
            class="cursor-pointer mt-1 sm:mr-6 mr-2"
            :badge="unreadNotifications.length"
          ></feather-icon>
          <vs-dropdown-menu
            class="notification-dropdown dropdown-custom vx-navbar-dropdown"
          >
            <div class="notification-top text-center p-5 bg-primary text-white">
              <h3 class="text-white">{{ unreadNotifications.length }} New</h3>
              <p class="opacity-75">App Notifications</p>
            </div>

            <VuePerfectScrollbar
              ref="mainSidebarPs"
              class="scroll-area--nofications-dropdown p-0 mb-10"
              :settings="settings"
            >
              <ul class="bordered-items">
                <li
                  v-for="ntf in unreadNotifications"
                  :key="ntf.index"
                  class="flex justify-between px-4 py-4 notification cursor-pointer"
                >
                  <div class="flex items-start">
                    <feather-icon
                      :icon="ntf.icon"
                      :svgClasses="[
                        `text-${ntf.category}`,
                        'stroke-current mr-1 h-6 w-6'
                      ]"
                    ></feather-icon>
                    <div class="mx-2">
                      <span
                        class="font-medium block notification-title"
                        :class="[`text-${ntf.category}`]"
                        >{{ ntf.title }}</span
                      >
                      <small>{{ ntf.msg }}</small>
                    </div>
                  </div>
                  <small class="mt-1 whitespace-no-wrap">{{
                    elapsedTime(ntf.time)
                  }}</small>
                </li>
              </ul>
            </VuePerfectScrollbar>
            <div
              class="checkout-footer fixed bottom-0 rounded-b-lg text-primary w-full p-2 font-semibold text-center border border-b-0 border-l-0 border-r-0 border-solid d-theme-border-grey-light cursor-pointer"
            >
              <span>View All Notifications</span>
            </div>
          </vs-dropdown-menu>
        </vs-dropdown> -->

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
                <!-- <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/profile').catch(err => {})"
                >
                  <feather-icon
                    icon="UserIcon"
                    svgClasses="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-2">Profile</span>
                </li> -->
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
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TheNavbarAdmin',
  data() {
    return {
      navbarSearchAndPinList: navbarSearchAndPinList,
      searchQuery: '',
      showFullSearch: false,
      unreadNotifications: [
        {
          index: 0,
          title: 'New Message',
          msg: 'Are your going to meet me tonight?',
          icon: 'MessageSquareIcon',
          time: 'Wed Jan 30 2019 07:45:23 GMT+0000 (GMT)',
          category: 'primary'
        },
        {
          index: 1,
          title: 'New Order Recieved',
          msg: 'You got new order of goods.',
          icon: 'PackageIcon',
          time: 'Wed Jan 30 2019 07:45:23 GMT+0000 (GMT)',
          category: 'success'
        },
        {
          index: 2,
          title: 'Server Limit Reached!',
          msg: 'Server have 99% CPU usage.',
          icon: 'AlertOctagonIcon',
          time: 'Thu Jan 31 2019 07:45:23 GMT+0000 (GMT)',
          category: 'danger'
        },
        {
          index: 3,
          title: 'New Mail From Peter',
          msg: 'Cake sesame snaps cupcake',
          icon: 'MailIcon',
          time: 'Fri Feb 01 2019 07:45:23 GMT+0000 (GMT)',
          category: 'primary'
        },
        {
          index: 4,
          title: "Bruce's Party",
          msg: 'Chocolate cake oat cake tiramisu',
          icon: 'CalendarIcon',
          time: 'Fri Feb 02 2019 07:45:23 GMT+0000 (GMT)',
          category: 'warning'
        }
      ],
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
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
    elapsedTime(startTime) {
      let x = new Date(startTime)
      let now = new Date()
      var timeDiff = now - x
      timeDiff /= 1000

      var seconds = Math.round(timeDiff)
      timeDiff = Math.floor(timeDiff / 60)

      var minutes = Math.round(timeDiff % 60)
      timeDiff = Math.floor(timeDiff / 60)

      var hours = Math.round(timeDiff % 24)
      timeDiff = Math.floor(timeDiff / 24)

      var days = Math.round(timeDiff % 365)
      timeDiff = Math.floor(timeDiff / 365)

      var years = timeDiff

      if (years > 0) {
        return years + (years > 1 ? ' Years ' : ' Year ') + 'ago'
      } else if (days > 0) {
        return days + (days > 1 ? ' Days ' : ' Day ') + 'ago'
      } else if (hours > 0) {
        return hours + (hours > 1 ? ' Hrs ' : ' Hour ') + 'ago'
      } else if (minutes > 0) {
        return minutes + (minutes > 1 ? ' Mins ' : ' Min ') + 'ago'
      } else if (seconds > 0) {
        return seconds + (seconds > 1 ? `${seconds} sec ago` : 'just now')
      }

      return 'Just Now'
    },

    ...mapActions(['logout']),
    async handleLogout() {
      await this.logout()
      this.$router.push('/login')
    }
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
