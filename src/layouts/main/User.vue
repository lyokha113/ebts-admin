<template>
  <div class="layout--main navbar-sticky footer-static app-page">
    <div
      id="content-area"
      class="content-area-no-sidebar"
      :class="{ 'show-overlay': bodyOverlay }"
    >
      <div id="content-overlay"></div>

      <div class="content-wrapper">
        <the-navbar />

        <div class="router-view">
          <div class="router-content">
            <div class="content-area__content">
              <back-to-top
                bottom="5%"
                visibleoffset="500"
                v-if="!hideScrollToTop"
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
import TheNavbar from '../components/TheNavbar.vue'
import TheFooter from '../components/TheFooter.vue'
import themeConfig from '@/../themeConfig.js'
import BackToTop from 'vue-backtotop'

export default {
  data() {
    return {
      routerTransition: themeConfig.routerTransition || 'none',
      routeTitle: this.$route.meta.pageTitle,
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
    bodyOverlay() {
      return this.$store.state.bodyOverlay
    }
  },
  methods: {
    changeRouteTitle(title) {
      this.routeTitle = title
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth
    },
    toggleHideScrollToTop(val) {
      this.hideScrollToTop = val
    }
  },
  components: {
    TheNavbar,
    TheFooter,
    BackToTop
  }
}
</script>
