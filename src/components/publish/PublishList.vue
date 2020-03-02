<template>
  <div id="data-list-list-view" class="data-list-container mt-3">
    <vs-table
      ref="table"
      pagination
      :max-items="itemsPerPage"
      :data="publishes"
    >
      <div
        slot="header"
        class="flex flex-wrap-reverse items-center flex-grow justify-between"
      >
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
            <feather-icon icon="ChevronDownIcon" svg-classes="h-4 w-4" />
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
        <vs-th sort-key="requestDate">Request Date</vs-th>
        <vs-th sort-key="authorName">Author Name</vs-th>
        <vs-th sort-key="duplicateName">Most Duplication Template</vs-th>
        <vs-th sort-key="duplicateRate">Most Duplication Rate</vs-th>
        <vs-th sort-key="status">Status</vs-th>
        <vs-th>Action</vs-th>
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr v-for="(tr, indextr) in data" :key="indextr" :data="tr">
            <vs-td style="width: 200px">
              <p>{{ tr.requestDate | moment('DD-MM-YYYY, HH:mm:ss') }}</p>
            </vs-td>

            <vs-td style="width: 300px">
              <p>{{ tr.authorName }}</p>
            </vs-td>

            <vs-td style="width: 300px">
              <p
                class="font-medium duplicate-name"
                @click="handlePreview(tr.duplicateContent)"
              >
                {{ tr.duplicateName }}
              </p>
            </vs-td>

            <vs-td>
              <ProgressBar
                text-position="top"
                size="small"
                :val="tr.duplicateRate"
                :bar-color="tr.duplicateRate | duplicationRate"
                :text="`${tr.duplicateRate} %`"
              />
            </vs-td>

            <vs-td>
              <vs-chip :color="tr.status | publishStatus">
                {{ tr.status }}
              </vs-chip>
            </vs-td>

            <vs-td style="padding: 10px">
              <span class="action-icon mr-2" @click="handlePreview(tr.content)">
                <vs-icon size="small" icon="search" />
              </span>
              <span
                v-if="tr.status == 'PENDING'"
                class="action-icon mx-2"
                @click="handlePublish(tr.id)"
              >
                <vs-icon size="small" icon="publish" />
              </span>
              <span
                v-if="tr.status == 'PENDING'"
                class="action-icon ml-2"
                @click="handleDeny(tr.id)"
              >
                <vs-icon size="small" icon="cancel" />
              </span>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>

<script>
import ProgressBar from 'vue-simple-progress'
export default {
  props: ['publishes'],
  components: {
    ProgressBar
  },
  filters: {
    duplicationRate(rate) {
      if (rate <= 60) return '#28c76f'
      if (rate < 90) return '#fe9f43'
      return '#fe485a'
    },
    publishStatus(status) {
      if (status == 'DENIED') return 'danger'
      if (status == 'PUBLISHED') return 'success'
      return 'warning'
    }
  },
  data() {
    return {
      itemsPerPage: 10,
      isMounted: false
    }
  },
  computed: {
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0
    }
  },
  methods: {
    handlePreview(content) {
      const preview = window.open('', '_blank')
      preview.document.write(content)
    },
    handlePublish(id) {
      this.$emit('publish', id)
    },
    handleDeny(id) {
      this.$emit('deny', id)
    }
  },
  mounted() {
    this.isMounted = true
  }
}
</script>

<style lang="scss" scoped>
/deep/ .vs-popup {
  width: 320px;
}

.duplicate-name {
  color: mediumslateblue;
  text-decoration: underline;
}

.action-icon:hover {
  color: mediumslateblue;
}
</style>
