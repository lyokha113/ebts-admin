<template>
  <ul class="list">
    <li v-for="(item, index) in list" :key="index" class="list__item">
      <feather-icon :icon="icon" class="w-5 h-5 mr-1"></feather-icon
      ><span v-html="item"></span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'VxList',
  props: {
    list: {
      type: Array,
      required: true
    },
    icon: {
      type: String,
      default: 'ChevronsRightIcon'
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/vuesax/components/vxList.scss';
</style>
