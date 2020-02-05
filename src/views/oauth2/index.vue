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
    const params = new URLSearchParams(window.location.search)
    const error = params.get('error')

    if (window.opener) {
      window.opener.postMessage(error)
      window.close()
    }
  }
}
</script>

<style></style>
