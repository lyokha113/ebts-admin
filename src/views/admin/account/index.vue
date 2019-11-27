<template>
  <div id="data-list-list-view" class="data-list-container">
    <DataSidebar
      :isSidebarActive="sideBar"
      :selected="selected"
      @closeSidebar="sideBar = false"
    />

    <vs-table
      ref="table"
      pagination
      search
      :max-items="itemsPerPage"
      :data="accounts"
    >
      <div
        slot="header"
        class="flex flex-wrap-reverse items-center flex-grow justify-between"
      >
        <div class="flex flex-wrap-reverse items-center">
          <div
            class="p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-between text-lg font-medium text-base text-primary border border-solid border-primary"
            @click="handleSideBar(null)"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Create new</span>
          </div>
        </div>

        <!-- ITEMS PER PAGE -->
        <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4">
          <div
            class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium"
          >
            <span class="mr-2">
              {{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
              {{
                accounts.length - currentPage * itemsPerPage > 0
                  ? currentPage * itemsPerPage
                  : accounts.length
              }}
              of {{ accounts.length }}
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
        <vs-th sort-key="imageUrl">Avatar</vs-th>
        <vs-th sort-key="fullName">Full Name</vs-th>
        <vs-th sort-key="email">Email</vs-th>
        <vs-th sort-key="provider">Provider</vs-th>
        <vs-th sort-key="roleName">Role</vs-th>
        <vs-th sort-key="active">Status</vs-th>
        <vs-th>Action</vs-th>
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <vs-avatar
                size="large"
                :src="tr.imageUrl"
                @click="handleSelected(tr)"
              />
            </vs-td>

            <vs-td>
              <p class="product-name font-medium">{{ tr.email }}</p>
            </vs-td>

            <vs-td>
              <p class="product-category">{{ tr.fullName }}</p>
            </vs-td>

            <vs-td>
              <p class="product-category">{{ tr.provider.toUpperCase() }}</p>
            </vs-td>

            <vs-td>
              <p class="product-category">{{ tr.roleName.toUpperCase() }}</p>
            </vs-td>

            <vs-td>
              <vs-chip
                :color="tr.active ? 'success' : 'danger'"
                class="product-order-status"
              >
                <vs-avatar :icon="tr.active ? 'done' : 'lock'" />
                {{ tr.active ? 'Active' : 'Locked' }}
              </vs-chip>
            </vs-td>

            <vs-td>
              <span
                v-if="activeUser && activeUser.id != tr.id"
                class="action-icon mx-1"
                @click="handleStatus(tr)"
              >
                <vs-icon
                  size="small"
                  :icon="tr.active ? 'lock' : 'lock_open'"
                />
              </span>
              <span
                v-if="activeUser && activeUser.id != tr.id && tr.roleId == 1"
                class="action-icon mx-1"
                @click="handleSideBar(tr)"
              >
                <vs-icon size="small" icon="create" />
              </span>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>

<script>
import DataSidebar from '@/components/account/DataSidebar.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    DataSidebar
  },
  data() {
    return {
      selected: null,
      itemsPerPage: 10,
      isMounted: false,
      sideBar: false
    }
  },
  computed: {
    ...mapGetters(['accounts', 'activeUser']),
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0
    }
  },
  methods: {
    ...mapActions(['getAccounts', 'updateAccount']),
    handleStatus(account) {
      this.selected = JSON.parse(JSON.stringify(account))
      const actionMsg = account.active ? 'lock' : 'unlock'
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `This action could be affect to other parts. Do you want to ${actionMsg} this account ?`,
        accept: this.handleStatusConfirm
      })
    },
    handleSideBar(account) {
      this.selected = account ? JSON.parse(JSON.stringify(account)) : null
      this.sideBar = true
    },
    async handleStatusConfirm() {
      this.selected.active = !this.selected.active
      await this.handleCallAPI(this.updateAccount, this.selected)
    }
  },
  async created() {
    await this.handleCallAPI(this.getAccounts)
  },
  mounted() {
    this.isMounted = true
  }
}
</script>
