<template lang="html">
  <div>
    <vs-tabs>
      <vs-tab label="Available"> <AvailableTemplate /> </vs-tab>
      <vs-tab label="Publish"> <PublishList /> </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import PublishList from '@/components/template/PublishList'
import AvailableTemplate from '@/components/template/AvailableTemplate'
import { mapActions } from 'vuex'
export default {
  components: {
    PublishList,
    AvailableTemplate
  },
  methods: {
    ...mapActions(['getCategories', 'getTemplates', 'getPublishes'])
  },
  async created() {
    let loader = this.$loading.show({
      color: '#7367f0',
      loader: 'spinner',
      width: 64,
      height: 64,
      backgroundColor: '#ffffff',
      opacity: 0.8,
      zIndex: 110000
    })

    await Promise.all([
      this.handleCallAPI(this.getCategories, null, false),
      this.handleCallAPI(this.getTemplates, null, false),
      this.handleCallAPI(this.getPublishes, null, false)
    ])

    loader.hide()
  }
}
</script>

<style lang="scss" scoped>
/deep/ li.vs-tabs--li {
  width: 150px;
}
</style>
