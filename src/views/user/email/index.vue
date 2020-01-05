<template>
  <div>
    <span>
      <h1>Email</h1>
      <vs-button class="flex mx-2" type="gradient" @click="handleOpenPopup">+ Add new email</vs-button>
    </span>
    <div id="data-list-list-view" class="data-list-container mt-3">
      <vs-table ref="table" pagination :max-items="itemsPerPage" :data="userEmails">
        <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
          <!-- ITEMS PER PAGE -->
          <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4">
            <div
              class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium"
            >
              <span class="mr-2">
                {{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
                {{
                userEmails.length - currentPage * itemsPerPage > 0
                ? currentPage * itemsPerPage
                : userEmails.length
                }}
                of {{ userEmails.length }}
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
          <vs-th>Email</vs-th>
          <vs-th>Name</vs-th>
          <vs-th>Provider</vs-th>
          <vs-th>Status</vs-th>
          <vs-th>Action</vs-th>
        </template>

        <template slot-scope="{ data }">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td style="width: 350px">
                <p>{{ tr.email }}</p>
              </vs-td>
              <vs-td style="width: 350px">
                <p>{{ tr.name }}</p>
              </vs-td>
              <vs-td style="width: 100px">
                <p>{{ tr.provider }}</p>
              </vs-td>
              <vs-td style="width: 150px">
                <p>{{ tr.status }}</p>
              </vs-td>
              <vs-td style="width: 150px;">
                <vs-button icon="edit" color="green" radius @click="handleOpenPopupSelected(tr)" />
                <vs-button icon="delete" color="danger" radius @click="handleDeleteEmail(tr.id)" />
              </vs-td>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>
    </div>
    <CustomPopup title="Email details" :active.sync="popup">
      <div>
        Enter email:
        <vs-input
          placeholder="emailuser@email.com"
          v-model="email"
          style="width: 250px"
          class="mt-1 mb-4"
        />Enter name:
        <vs-input
          placeholder="ex: Tran Duc Thai"
          v-model="name"
          style="width: 250px"
          class="mt-1 mb-4"
        />Choose provider
        <vs-select class="mb-4" label v-model="provider" width="250px">
          <vs-select-item
            :key="provider.text"
            :text="provider.text"
            v-for="provider in providers"
            v-bind:value="provider.text"
          />
        </vs-select>
        <vs-button
          class="justify-center align-center text-medium"
          type="gradient"
          @click="handleAddEmail"
          v-if="type == 0"
        >Add</vs-button>
        <vs-button
          class="justify-center align-center text-medium"
          type="gradient"
          @click="handleUpdateEmail"
          v-if="type == 1"
        >Update</vs-button>
      </div>
    </CustomPopup>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import CustomPopup from '@/components/CustomPopup.vue'
export default {
  components: {
    CustomPopup
  },
  data() {
    return {
      itemsPerPage: 10,
      isMounted: false,
      popup: false,
      id: 0,
      name: '',
      email: '',
      type: 0,
      provider: 'Gmail',
      providers: [
        { text: 'Gmail', value: 'Gmail' },
        { text: 'Outlook', value: 'Outlook' },
        { text: 'Yahoo', value: 'Yahoo' }
      ]
    }
  },
  filters: {},
  computed: {
    ...mapGetters(['userEmails']),
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0
    }
  },
  methods: {
    ...mapActions([
      'getUserEmails',
      'addUserEmail',
      'updateUserEmail',
      'deleteUserEmail'
    ]),
    async handleOpenPopup() {
      this.popup = true
      this.type = 0
    },
    async handleAddEmail() {
      if (!this.email) {
        this.$vs.notify({
          title: 'Email should not be empty',
          text: 'Please re-check email textfield',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }
      this.handleAddEmailConfirm()
    },
    async handleAddEmailConfirm() {
      const userEmail = {
        name: this.name,
        email: this.email,
        provider: this.provider
      }
      await this.handleCallAPI(this.addUserEmail, userEmail)
      this.popup = false
    },
    async handleOpenPopupSelected(selected) {
      this.popup = true
      this.type = 1
      this.email = selected.email
      this.name = selected.name
      this.provider = selected.provider
      this.id = selected.id
    },
    async handleUpdateEmail() {
      if (!this.email) {
        this.$vs.notify({
          title: 'Email should not be empty',
          text: 'Please re-check email textfield',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }
      this.handleUpdateEmailConfirm()
    },
    async handleUpdateEmailConfirm() {
      const userEmail = {
        id: this.id,
        name: this.name,
        email: this.email,
        provider: this.provider
      }
      await this.handleCallAPI(this.updateUserEmail, userEmail)
      this.popup = false
    },
    async handleDeleteEmail(id) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `This action can't be undo. Do you want to delete this email ?`,
        accept: async () => await this.handleCallAPI(this.deleteUserEmail, id)
      })
    }
  },
  mounted() {
    this.handleCallAPI(this.getUserEmails)
    this.isMounted = true
  }
}
</script>
<style lang="scss" scoped>
span {
  display: inline-block;
}
span h1 {
  float: left;
}
span button {
  float: left;
}
/deep/ .vs-popup {
  width: 280px;
}
</style>