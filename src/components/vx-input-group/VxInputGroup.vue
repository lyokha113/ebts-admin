<template>
  <div class="vx-input-group flex">
    <!-- SLOT: PREPEND -->
    <div
      v-if="this.$slots.prepend"
      class="vx-input-group-prepend flex"
      :class="prependClasses"
    >
      <slot name="prepend"></slot>
    </div>

    <!-- SLOT: DEFAULT -->
    <div class="vx-input-group-default flex-grow">
      <slot></slot>
    </div>

    <!-- SLOT: APPEND -->
    <div
      v-if="this.$slots.append"
      class="vx-input-group-append flex"
      :class="appendClasses"
    >
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VxInputGroup',
  props: {
    prependClasses: {
      type: String
    },
    appendClasses: {
      type: String
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/vuesax/components/vxInputGroup.scss';
</style>
