<template lang="html">
  <div>
    <vs-tabs>
      <vs-tab label="Active">
        <vs-row>
          <vs-col
            v-for="template in templates"
              :key="template.id"
              vs-type="flex"
              vs-justify="center"
              vs-align="center"
              vs-w="3">
            <AdminTemplateList :template="template" />
          </vs-col>
      </vs-row>
      </vs-tab>
      <vs-tab label="Pending">
          login
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import AdminTemplateList from '@/components/template/AdminTemplateList'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    AdminTemplateList
  },
  computed: {
    ...mapGetters(['templates'])
  },
  methods: {
    ...mapActions(['getTemplates'])
  },
  async mounted() {
    await this.handleCallAPI(this.getTemplates)
  }
}
</script>

<style lang="scss" scoped>
/deep/ li.vs-tabs--li {
  width: 150px;
}
</style>