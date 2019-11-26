<template>
  <div class="layout--main app-page navbar-floating footer-sticky">
    <div id="content-area" class="content-area-full">
      <div class="content-wrapper">
        <TheNavbar navbarColor="#fff" />

        <div class="router-view">
          <div class="router-content">
            <div class="content-area__content">
              <BackToTop
                bottom="5%"
                visibleoffset="500"
                v-if="!hideScrollToTop"
              >
                <vs-button
                  icon-pack="feather"
                  icon="icon-arrow-up"
                  class="shadow-lg"
                />
              </BackToTop>
              <transition :name="routerTransition" mode="out-in">
                <router-view />
              </transition>
            </div>
          </div>
        </div>
      </div>

      <TheFooter />
    </div>
  </div>
</template>

<script>
import TheNavbar from '@/layouts/components/TheNavbar.vue'
import TheFooter from '@/layouts/components/TheFooter.vue'
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
      isNavbarDark: false,
      windowWidth: window.innerWidth,
      hideScrollToTop: themeConfig.hideScrollToTop
    }
  }
}
</script>
