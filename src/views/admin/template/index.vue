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
    await Promise.all([
      this.handleCallAPI(this.getTemplates, null),
      this.handleCallAPI(this.getCategories, null, false),
      this.handleCallAPI(this.getPublishes, null, false)
    ])
  }
}
</script>

<style lang="scss" scoped>
/deep/ li.vs-tabs--li {
  width: 150px;
}
</style>
