<template>
  <div class="h-screen flex w-full bg-img">
    <div
      class="vx-col flex items-center justify-center flex-col sm:w-1/2 md:w-3/5 lg:w-3/4 xl:w-1/2 mx-auto text-center"
    >
      <img
        src="../../assets/images/pages/404.png"
        alt="graphic-404"
        class="mx-auto mb-4 max-w-full"
      />
      <h1 class="sm:mx-0 mx-4 mb-12 text-5xl d-theme-heading-color">
        Page Not Found !!!
      </h1>
      <p class="sm:mx-0 mx-4 mb-4 sm:mb-16 d-theme-text-inverse">
        There are something you need to find ? Maybe you went to wrong way !!!
        Try to find in others path
      </p>
      <vs-button size="large" :to="back">Back to Home</vs-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['permission']),
    back() {
      if (this.permission) {
        return this.permission == 1 ? '/admin' : '/user'
      }
      return '/'
    }
  }
}
</script>
