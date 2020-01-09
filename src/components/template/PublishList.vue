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
        <vs-th sort-key="requestDate">Request Date</vs-th>
        <vs-th sort-key="authorName">Author Name</vs-th>
        <vs-th sort-key="duplicateName">Most Duplication Template</vs-th>
        <vs-th sort-key="duplicateRate">Most Duplication Rate</vs-th>
        <vs-th sort-key="status">Status</vs-th>
        <vs-th>Action</vs-th>
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
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
                @click="handlePopup(tr.id)"
              >
                <vs-icon size="small" icon="publish" />
              </span>
              <span
                v-if="tr.status == 'PENDING'"
                class="action-icon ml-2"
                @click="handleCancel(tr.id)"
              >
                <vs-icon size="small" icon="cancel" />
              </span>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>

    <CustomPopup id="create-popup" title="Publish info" :active.sync="popup">
      <div>
        Enter name:
        <vs-input
          placeholder="Name"
          v-model="name"
          style="width: 250px"
          class="mt-1 mb-4"
        />Enter description:
        <vs-input
          placeholder="Description"
          v-model="description"
          style="width: 250px"
          class="mt-1 mb-4"
        />
        <vs-select
          class="mb-4"
          label="Categories"
          v-model="categories"
          width="250px"
          multiple
        >
          <div>
            <vs-select-group title="Active">
              <vs-select-item
                :key="item.id"
                :value="item.id"
                :text="item.name"
                v-for="item in categoriesNoTemplate.filter(c => c.active)"
              />
            </vs-select-group>
          </div>
          <div>
            <vs-select-group title="Locked">
              <vs-select-item
                :key="item.id"
                :value="item.id"
                :text="item.name"
                v-for="item in categoriesNoTemplate.filter(c => !c.active)"
              />
            </vs-select-group>
          </div>
        </vs-select>
        <vs-button
          color="primary"
          type="filled"
          class="float-right mt-2"
          @click="handlePublish"
          >Publish</vs-button
        >
      </div>
    </CustomPopup>
  </div>
</template>

<script>
import ProgressBar from 'vue-simple-progress'
import CustomPopup from '@/components/CustomPopup.vue'
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    ProgressBar,
    CustomPopup
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
      selected: null,
      itemsPerPage: 10,
      wsConnected: false,
      isMounted: false
    }
  },
  filters: {
    duplicationRate(rate) {
      if (rate <= 60) return '#28c76f'
      if (rate <= 89) return '#fe9f43'
      return '#fe485a'
    },
    publishStatus(status) {
      if (status == 'DENIED') return 'danger'
      if (status == 'PUBLISHED') return 'success'
      return 'warning'
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
    ...mapActions([
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
        categoryIds: this.categories
      }

      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `Do you want to approve this publish request ?`,
        accept: async () => {
          if (await this.handleCallAPI(this.approvePublish, request)) {
            this.popup = false
          }
        }
      })
    },
    async handleCancel(id) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `Do you want to deny this publish request ?`,
        accept: async () => await this.handleCallAPI(this.denyPublish, id)
      })
    },
    handlePreview(content) {
      const preview = window.open('', '_blank')
      preview.document.write(content)
    },
    connectWs() {
      this.socket = new SockJS(
        process.env.VUE_APP_API_DOMAIN_LOCAL + '/ws-publish'
      )
      this.stompClient = Stomp.over(this.socket, { debug: false })
      this.stompClient.connect(
        {},
        // eslint-disable-next-line no-unused-vars
        frame => {
          this.wsConnected = true
          this.stompClient.subscribe('/topic/get-publish', data => {
            this.setPublish(JSON.parse(data.body))
          })
        },
        error => {
          console.log(error)
          this.wsConnected = false
        }
      )
    },
    disconnectWs() {
      if (this.stompClient) {
        this.stompClient.disconnect()
      }
      this.wsConnected = false
    }
  },
  async created() {
    await this.handleCallAPI(this.getPublishes)
    this.connectWs()
  },
  mounted() {
    this.isMounted = true
  },
  destroyed() {
    this.disconnectWs()
    this.popup = false
  }
}
</script>

<style lang="scss" scoped>
/deep/ .vs-popup {
  width: 285px;
}

.duplicate-name {
  color: mediumslateblue;
  text-decoration: underline;
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
