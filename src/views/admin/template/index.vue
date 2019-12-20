<template lang="html">
  <div>
    <vs-tabs>
      <vs-tab label="Available"> <AvailableTemplate /> </vs-tab>
      <vs-tab label="Publish"> <PublishList /> </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import PublishList from '@/components/PublishList'
import AvailableTemplate from '@/components/template/AvailableTemplate'
import { mapActions } from 'vuex'
export default {
  components: {
    PublishList,
    AvailableTemplate
  },
  methods: {
    ...mapActions(['getCategoriesNoTemplate'])
  },
  async created() {
    await this.handleCallAPI(this.getCategoriesNoTemplate)
  }
}
</script>

<style lang="scss" scoped>
/deep/ li.vs-tabs--li {
  width: 150px;
}
</style>
