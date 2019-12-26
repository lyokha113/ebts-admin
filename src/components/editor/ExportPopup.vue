<template>
  <CustomPopup title="Export Template" :active.sync="active">
    <span>123</span>
  </CustomPopup>
</template>

<script>
import CustomPopup from '@/components/CustomPopup.vue'
export default {
  components: {
    CustomPopup
  },
  data() {
    return {
      active: false
    }
  }
}
</script>

<style></style>
