<template>
  <div
    class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center"
  >
    <div class="vx-col">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter justify-center items-center m-4">
            <div class="mt-6 mb-3" style="width: 100%">
              <img
                v-if="error"
                src="@/assets/images/error.png"
                alt="approve"
                width="300px"
                style="margin: auto"
              />
              <img
                v-else
                src="@/assets/images/approve.png"
                alt="approve"
                width="300px"
                style="margin: auto"
              />
            </div>
            <span class="font-bold mb-5" style="font-size: 20px">
              {{ nofitication }}
            </span>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      error: this.$route.query.error,
      confirm: this.$route.query.confirm
    }
  },
  computed: {
    nofitication() {
      if (this.confirm == 'email')
        return 'Email was approved successfully. This page can be closed now.'
      else if (this.confirm == 'account')
        return 'Account was approved successfully. This page can be closed now.'
      else if (this.confirm == 'recovery')
        return 'Your account new password was reset and sent to your email. This page can be closed now.'
      else return 'There are some errors happend. Please try again.'
    }
  }
}
</script>
