<template>
  <div
    v-if="template"
    style="background-color: white; width: 1400px; margin:auto"
  >
    <div v-html="template.content" style="max-width: 300px" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      template: null
    }
  },
  methods: {
    ...mapActions(['getTemplate'])
  },
  async mounted() {
    this.template = await this.getTemplate(this.$route.params.id)
  }
}
</script>

<style></style>
