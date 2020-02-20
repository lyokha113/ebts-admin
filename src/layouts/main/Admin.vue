z<template>
  <div class="layout--main navbar-floating footer-static app-page">
    <vx-sidebar
      :sidebar-items="sidebarItems"
      :logo="require('@/assets/images/logo/logo.png')"
      title="ETBS"
      parent=".layout--main"
    />

    <div
      id="content-area"
      :class="[contentAreaClass, { 'show-overlay': bodyOverlay }]"
    >
      <div id="content-overlay"></div>

      <div class="content-wrapper">
        <the-navbar-admin />

        <div class="router-view">
          <div class="router-content">
            <transition :name="routerTransition">
              <div
                v-if="$route.meta.breadcrumb || $route.meta.pageTitle"
                class="router-header flex flex-wrap items-center mb-6"
              >
                <div
                  class="content-area__heading"
                  :class="{
                    'pr-4 border-0 md:border-r border-t-0 border-b-0 border-l-0 border-solid border-grey-light':
                      $route.meta.breadcrumb
                  }"
                >
                  <h2 class="mb-1">{{ routeTitle }}</h2>
                </div>

                <!-- BREADCRUMB -->
                <vx-breadcrumb
                  v-if="$route.meta.breadcrumb"
                  class="ml-4 md:block hidden"
                />
              </div>
            </transition>
            <div class="content-area__content">
              <back-to-top
                v-if="!hideScrollToTop"
                bottom="5%"
                visibleoffset="500"
              >
                <vs-button
                  icon-pack="feather"
                  icon="icon-arrow-up"
                  class="shadow-lg"
                />
              </back-to-top>
              <transition :name="routerTransition" mode="out-in">
                <router-view @changeRouteTitle="changeRouteTitle"></router-view>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <the-footer></the-footer>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VxSidebar from '@/layouts/components/vx-sidebar/VxSidebar.vue'
import TheNavbarAdmin from '../components/TheNavbarAdmin.vue'
import TheFooter from '../components/TheFooter.vue'
import themeConfig from '@/../themeConfig.js'
import sidebarItems from '@/layouts/components/vx-sidebar/sidebarItems.js'
import BackToTop from 'vue-backtotop'

export default {
  data() {
    return {
      routerTransition: themeConfig.routerTransition || 'none',
      routeTitle: this.$route.meta.pageTitle,
      sidebarItems: sidebarItems,
      windowWidth: window.innerWidth,
      hideScrollToTop: themeConfig.hideScrollToTop
    }
  },
  watch: {
    $route() {
      this.routeTitle = this.$route.meta.pageTitle
    }
  },
  computed: {
    ...mapGetters(['sidebarWidth']),
    bodyOverlay() {
      return this.$store.state.bodyOverlay
    },
    contentAreaClass() {
      if (this.sidebarWidth == 'default') return 'content-area-default'
      else if (this.sidebarWidth == 'reduced') return 'content-area-reduced'
      else if (this.sidebarWidth) return 'content-area-full'
      return 'content-area-default'
    }
  },
  created() {
    this.setSidebarWidth()
  },
  methods: {
    changeRouteTitle(title) {
      this.routeTitle = title
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth
      this.setSidebarWidth()
    },
    setSidebarWidth() {
      if (this.windowWidth < 1200) {
        this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', false)
        this.$store.dispatch('updateSidebarWidth', 'no-sidebar')
      } else if (this.windowWidth < 1200) {
        this.$store.dispatch('updateSidebarWidth', 'reduced')
      } else {
        this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true)
      }
    },
    toggleHideScrollToTop(val) {
      this.hideScrollToTop = val
    }
  },
  components: {
    VxSidebar,
    TheNavbarAdmin,
    TheFooter,
    BackToTop
  }
}
</script>
