<template>
  <div id="data-list-list-view" class="data-list-container bg-white p-3">
    <vs-table
      ref="table"
      pagination
      search
      :max-items="itemsPerPage"
      :data="sessions"
      @selected="handleEdit"
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
                sessions.length - currentPage * itemsPerPage > 0
                  ? currentPage * itemsPerPage
                  : sessions.length
              }}
              of {{ sessions.length }}
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
        <vs-th>Thumbnail</vs-th>
        <vs-th sort-key="rawName">Design</vs-th>
        <vs-th sort-key="ownerEmail">Author</vs-th>
        <vs-th sort-key="invitedDate">Invite Date</vs-th>
        <vs-th sort-key="modifiedDate">Edited Date</vs-th>
        <vs-th>Action</vs-th>
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr v-for="(tr, indextr) in data" :key="indextr" :data="tr">
            <vs-td class="img-container">
              <img :src="tr.rawThumbnail" />
            </vs-td>

            <vs-td style="width: 30%;">
              <div class="font-semibold truncate">{{ tr.rawName }}</div>
              <p class="break-words truncate-six">{{ tr.rawDescription }}</p>
            </vs-td>

            <vs-td style="width: 15%;">
              <span class="font-semibold truncate">{{ tr.ownerEmail }}</span>
              <p class="truncate">{{ tr.ownerName }}</p>
            </vs-td>

            <vs-td style="width: 15%">
              <p class="font-medium">
                {{ tr.invitedDate | moment('DD-MM-YYYY, HH:mm:ss') }}
              </p>
            </vs-td>

            <vs-td style="width: 15%">
              <p class="font-medium">
                {{ tr.modifiedDate | moment('DD-MM-YYYY, HH:mm:ss') }}
              </p>
            </vs-td>

            <vs-td style="width: 5%">
              <span class="action-icon" @click.stop="handleLeave(tr.rawId)">
                <vs-icon size="small" icon="delete" />
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
import { connectWSInvitation, disconnectWS } from '@/service/websocket'
export default {
  data() {
    return {
      itemsPerPage: 10,
      isMounted: false
    }
  },
  computed: {
    ...mapGetters(['accessToken', 'sessions']),
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0
    }
  },
  methods: {
    ...mapActions([
      'getSessionsForUser',
      'getSessionForUser',
      'leaveSession',
      'invitationWS'
    ]),
    handleLeave(id) {
      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `Do you want to remove this invitation ?`,
        accept: () => this.handleLeaveConfirm(id)
      })
    },
    handleEdit(row) {
      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `Do you want to start design this template ?`,
        accept: () => this.handleEditConfirm(row.rawId)
      })
    },
    async handleLeaveConfirm(rawId) {
      await this.handleCallAPI(this.leaveSession, rawId)
    },
    async handleEditConfirm(rawId) {
      await this.handleCallAPI(this.getSessionForUser, rawId)
      this.$router.push('/user/invitation/editor')
    }
  },
  async created() {
    await this.handleCallAPI(this.getSessionsForUser)
  },
  async mounted() {
    this.isMounted = true
    connectWSInvitation(this, this.accessToken, this.invitationWS)
  },
  destroyed() {
    disconnectWS(this)
  }
}
</script>

<style lang="scss" scoped>
.action-icon:hover {
  color: mediumslateblue;
}
</style>

<style lang="scss" scoped>
/deep/ td.img-container {
  img {
    height: 150px;
  }

  span {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
}
</style>
