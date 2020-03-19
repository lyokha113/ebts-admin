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
                  @click="$router.push('/user/profile').catch(err => {})"
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
                  @click="$router.push('/user/image').catch(err => {})"
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
                  <span class="ml-4">Userblock</span>
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
                  @click="$router.push('/user/invitation').catch(err => {})"
                >
                  <feather-icon
                    icon="Share2Icon"
                    svg-classes="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-4">Invitation</span>
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
import { connectWSNotification, disconnectWS } from '@/service/websocket'

export default {
  name: 'TheNavbar',
  filters: {
    notiIcon: function(code) {
      if (code.includes('APPROVE_PUBLISH') || code == 'DENY_PUBLISH')
        return 'UploadCloudIcon'
      if (code == 'USER_EMAIL') return 'ListIcon'
      if (code == 'INVITE_SESSION') return 'UserPlusIcon'
      if (code == 'KICK_SESSION' || code == 'LEAVE_SESSION') {
        return 'UserMinusIcon'
      }
    }
  },
  data() {
    return {
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
      if (ntf.code.includes('APPROVE_PUBLISH')) {
        const templateId = ntf.code.split(' ')[1]
        if (this.$route.path != `/detail/${templateId}`) {
          this.$router.push(`/detail/${templateId}`)
        }
      }
      if (ntf.code.includes('DENY_PUBLISH') && this.$route.name != 'Publish') {
        this.$router.push(`/user/publish`)
      }
      if (ntf.code == 'USER_EMAIL' && this.$route.name != 'User Profile') {
        this.$router.push(`/user/profile`)
      }
      if (
        (ntf.code == 'INVITE_SESSION' || ntf.code == 'KICK_SESSION') &&
        this.$route.name != 'Invitation'
      ) {
        this.$router.push(`/user/invitation`)
      }
    },
    async handleLogout() {
      await this.logout()
      this.$router.push('/login')
    }
  },
  mounted() {
    if (this.accessToken) {
      this.getNewNotifications()
      connectWSNotification(this, this.accessToken, this.notificationWs)
    }
  },
  destroyed() {
    disconnectWS(this)
  }
}
</script>
