<template>
  <footer
    class="the-footer flex-wrap justify-between block"
    style="background: white; box-shadow: 0 -5px 25px 5px rgba(0,0,0,.05)"
  >
    <div class="font-semibold text-center">
      COPYRIGHT @ {{ new Date().getFullYear() }} - ETBS Capstone Project Team
    </div>
  </footer>
</template>

<script>
export default {
  name: 'the-footer'
}
</script>
