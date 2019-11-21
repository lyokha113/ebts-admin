<template>
  <footer class="the-footer flex-wrap justify-between" :class="classes">
    <span>COPYRIGHT @ {{ new Date().getFullYear() }}</span>
    <span class="md:flex hidden items-center">
      <span>ETBS Capstone Project Team</span>
    </span>
  </footer>
</template>

<script>
export default {
  name: 'the-footer',
  props: {
    classes: {
      type: String
    }
  }
}
</script>
