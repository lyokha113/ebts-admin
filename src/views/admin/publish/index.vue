<template>
  <div>
    <vs-tabs>
      <vs-tab label="All"> <PublishList :publishes="publishes" /> </vs-tab>
      <vs-tab label="Pending">
        <PublishList
          :publishes="tabPending"
          @publish="handlePopup"
          @deny="handleDeny"
        />
      </vs-tab>
      <vs-tab label="Published">
        <PublishList :publishes="tabPublished" />
      </vs-tab>
      <vs-tab label="Denied">
        <PublishList :publishes="tabDenied" />
      </vs-tab>
    </vs-tabs>

    <CustomPopup id="create-popup" title="Publish info" :active.sync="popup">
      <div>
        Enter name:
        <vs-input
          v-model="name"
          placeholder="Name"
          style="width: 100%"
          class="mt-1 mb-4"
        />Enter description:
        <vs-input
          v-model="description"
          placeholder="Description"
          style="width: 100%"
          class="mt-1 mb-5"
        />
        Enter workspaces:
        <multiselect
          v-model="categories"
          track-by="id"
          label="name"
          selectLabel=""
          selectedLabel=""
          deselectLabel=""
          group-values="categories"
          group-label="group"
          :options="categoriesNoTemplateSelect"
          :multiple="true"
          :close-on-select="false"
          :searchable="false"
        >
        </multiselect>
        <vs-button
          color="primary"
          type="filled"
          class="float-right mt-5"
          :disabled="!name || !description || !categories.length"
          @click="handlePublish"
          >Publish</vs-button
        >
      </div>
    </CustomPopup>
  </div>
</template>

<script>
import CustomPopup from '@/components/CustomPopup.vue'
import PublishList from '@/components/publish/PublishList.vue'
import { connectWSPublishAdmin, disconnectWS } from '@/service/websocket'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    CustomPopup,
    PublishList
  },
  data() {
    return {
      id: '',
      name: '',
      authorId: '',
      content: '',
      description: '',
      popup: false,
      categories: [],
      selected: null
    }
  },
  computed: {
    ...mapGetters(['publishes', 'categoriesNoTemplate', 'accessToken']),
    categoriesNoTemplateSelect() {
      const active = this.categoriesNoTemplate.filter(c => c.active)
      const locked = this.categoriesNoTemplate.filter(c => !c.active)
      return [
        { group: 'Active', categories: active },
        { group: 'Locked', categories: locked }
      ]
    },
    tabPending() {
      return this.publishes.filter(
        p => p.status == 'PENDING' || p.status == 'PROCESSING'
      )
    },
    tabPublished() {
      return this.publishes.filter(
        p => p.status == 'PUBLISHED' || p.status == 'PROCESSING'
      )
    },
    tabDenied() {
      return this.publishes.filter(p => p.status == 'DENIED')
    }
  },
  methods: {
    ...mapActions([
      'getCategories',
      'getPublishes',
      'denyPublish',
      'approvePublish',
      'setPublish'
    ]),
    handlePopup(id) {
      this.id = id
      this.name = ''
      this.description = ''
      this.categories = []
      this.popup = true
    },
    async handlePublish() {
      if (
        !this.id ||
        !this.name ||
        !this.description ||
        !this.categories.length
      ) {
        this.$vs.notify({
          title: 'Empty value',
          text: 'Please enter all information',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }

      const request = {
        id: this.id,
        name: this.name,
        content: this.content,
        description: this.description,
        categoryIds: this.categories.map(c => c.id)
      }

      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `Do you want to approve this publish request ?`,
        accept: async () => {
          if (await this.handleCallAPI(this.approvePublish, request)) {
            this.popup = false
          }
        }
      })
    },
    async handleDeny(id) {
      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `Do you want to deny this publish request ?`,
        accept: async () => await this.handleCallAPI(this.denyPublish, id)
      })
    },
    handlePreview(content) {
      const preview = window.open('', '_blank')
      preview.document.write(content)
    }
  },
  async created() {
    await Promise.all([
      this.handleCallAPI(this.getPublishes, null),
      this.handleCallAPI(this.getCategories, null, false)
    ])
    connectWSPublishAdmin(this, this.accessToken, this.setPublish)
  },
  destroyed() {
    disconnectWS(this)
    this.popup = false
  }
}
</script>

<style lang="scss" scoped>
/deep/ .vs-popup {
  width: 320px;
}

#create-popup,
#update-popup {
  z-index: 51100;
}

/deep/ li.vs-tabs--li {
  width: 150px;
}
</style>
