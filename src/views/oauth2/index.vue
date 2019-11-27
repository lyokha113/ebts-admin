<template>
  <div class="loading">
    <div class="effect-1 effects"></div>
    <div class="effect-2 effects"></div>
    <div class="effect-3 effects"></div>
  </div>
</template>
<script>
export default {
  created() {
    const params = window.location.search
    if (window.opener) {
      window.opener.postMessage(params)
      window.close()
    }
  }
}
</script>

<style></style>
