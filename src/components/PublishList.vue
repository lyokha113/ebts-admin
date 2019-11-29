<template>
  <div id="data-list-list-view" class="data-list-container">
    <vs-table ref="table" pagination search :max-items="itemsPerPage" :data="publishes">
      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
        <!-- ITEMS PER PAGE -->
        <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4">
          <div
            class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium"
          >
            <span class="mr-2">
              {{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
              {{
              publishes.length - currentPage * itemsPerPage > 0
              ? currentPage * itemsPerPage
              : publishes.length
              }}
              of {{ publishes.length }}
            </span>
            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
          </div>
          <vs-dropdown-menu>
            <vs-dropdown-item @click="itemsPerPage = 10">
              <span>10</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage = 20">
              <span>20</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage = 50">
              <span>50</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage = 100">
              <span>100</span>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>

      <template slot="thead">
        <vs-th sort-key="authorName">Author Name</vs-th>
        <vs-th sort-key="duplicateRate">Duplicated Percent</vs-th>
        <vs-th sort-key="Status">Status</vs-th>
        <vs-th>Action</vs-th>
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td style="width: 800px">
              <p class="product-name font-medium">{{ tr.authorName }}</p>
            </vs-td>

            <vs-td>
              <p class="product-category">{{ tr.duplicateRate | doubleToPercent }}</p>
            </vs-td>

            <vs-td>
              <vs-chip
                :color="tr.status | publishStatus"
                class="product-order-status"
              >{{tr.status }}</vs-chip>
            </vs-td>

            <vs-td>
              <span
                v-if="tr.status == 'PENDING'"
                class="action-icon mx-1"
              >
                <vs-icon size="small" icon="create" />
              </span>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>

    <CustomPopup id="create-popup" title="PUBLISH" :active.sync="popup">
      <div>
        Enter name:
        <vs-input placeholder="Name" v-model="name" style="width: 250px" class="mt-1 mb-4" />Enter description:
        <vs-input
          placeholder="Description"
          v-model="description"
          style="width: 250px"
          class="mt-1 mb-4"
        />
        <vs-select class="mb-4" label="Categories" v-model="categories" width="250px" multiple>
          <vs-select-item
            :key="item.id"
            :value="item.id"
            :text="item.name"
            v-for="item in categoriesNoTemplate"
          />
        </vs-select>
        <vs-button
          color="primary"
          type="filled"
          class="float-right mt-2"
          @click="handleUpdate"
        >Update</vs-button>
      </div>
    </CustomPopup>
  </div>
</template>

<script>
import CustomPopup from '@/components/CustomPopup.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    CustomPopup
  },
  data() {
    return {
      id: '',
      name: '',
      authorId: '',
      content: '',
      description: '',
      categories: []
    }
  },
  filters: {
    doubleToPercent: function(data) {
      return (Math.round(data * 10000) / 10000) * 100 + ' %'
    },
    publishStatus: function(status) {
      if (status == 'DENIED') return 'danger'
      if (status == 'PUBLISHED') return 'success'
      return 'warning'
    }
  },
  data() {
    return {
      selected: null,
      itemsPerPage: 10,
      categories: [],
      isMounted: false
    }
  },
  computed: {
    ...mapGetters(['publishes', 'categoriesNoTemplate']),
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0
    }
  },
  methods: {
    ...mapActions(['getPublishes', 'getCategoriesNoTemplate']),
    async handleCreate() {
      if (!this.id || !this.name || !this.description || !this.categories) {
        this.$vs.notify({
          title: 'Empty value',
          text: 'Please enter all information',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }

      const template = {
        id: this.id,
        name: this.name,
        authorId: this.authorId,
        content: this.content,
        description: this.description,
        categoryIds: this.categories,
        status: true
      }

      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `Do you want to update this template ?`,
        accept: async () => {
          if (await this.handleCallAPI(this.updateTemplate, template)) {
            this.popup = false
          }
        }
      })
    }
  },
  async created() {
    await this.handleCallAPI(this.getPublishes)
    await this.handleCallAPI(this.getCategoriesNoTemplate)
  },
  mounted() {
    this.isMounted = true
  }
}
</script>

<style lang="scss" scoped>
/deep/ .vs-popup {
  width: 300px;
}

.action-icon:hover {
  color: mediumslateblue;
}

#create-popup {
  z-index: 51100;
}

#update-popup {
  z-index: 51100;
}
</style>
