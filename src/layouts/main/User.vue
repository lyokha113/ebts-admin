z<template>
  <div
    class="layout--main navbar-sticky footer-static app-page"
    :style="{
      backgroundImage: 'url(' + require('@/assets/images/home-bg.png') + ')'
    }"
  >
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
import TheNavbar from '../components/TheNavbar.vue'
import TheFooter from '../components/TheFooter.vue'
import themeConfig from '@/../themeConfig.js'
import BackToTop from 'vue-backtotop'

export default {
  components: {
    TheNavbar,
    TheFooter,
    BackToTop
  },
  data() {
    return {
      routerTransition: themeConfig.routerTransition || 'none',
      routeTitle: this.$route.meta.pageTitle,
      windowWidth: window.innerWidth,
      hideScrollToTop: themeConfig.hideScrollToTop
    }
  },
  computed: {
    bodyOverlay() {
      return this.$store.state.bodyOverlay
    }
  },
  watch: {
    $route() {
      this.routeTitle = this.$route.meta.pageTitle
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
  }
}
</script>
