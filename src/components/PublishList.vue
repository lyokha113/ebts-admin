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
              <span class="action-icon mx-1">
                
              </span>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  filters: {
    doubleToPercent: function(data) {
      return Math.round(data * 10000) / 10000 * 100 + " %"
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
      isMounted: false
    }
  },
  computed: {
    ...mapGetters(['publishes']),
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0
    }
  },
  methods: {
    ...mapActions(['getPublishes'])
  },
  async created() {
    await this.handleCallAPI(this.getPublishes)
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
