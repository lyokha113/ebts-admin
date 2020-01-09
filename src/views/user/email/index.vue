<template>
  <div>
    <span>
      <h1>Email</h1>
      <vs-button class="flex mx-2" type="gradient" @click="handleOpenPopup"
        >+ Add new email</vs-button
      >
    </span>
    <div id="data-list-list-view" class="data-list-container mt-3">
      <vs-table ref="table" :data="userEmails">
        <template slot="thead">
          <vs-th>Email</vs-th>
          <vs-th>Name</vs-th>
          <!-- <vs-th>Provider</vs-th> -->
          <vs-th>Status</vs-th>
          <vs-th>Action</vs-th>
        </template>

        <template slot-scope="{ data }">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td style="width: 30%">
                <p>{{ tr.email }}</p>
              </vs-td>
              <vs-td style="width: 30%">
                <p>{{ tr.name }}</p>
              </vs-td>
              <!-- <vs-td style="width: 10%">
                <p>{{ tr.provider }}</p>
              </vs-td> -->
              <vs-td style="width: 20%">
                <p>{{ tr.status }}</p>
              </vs-td>
              <vs-td style="width: 20%;">
                <vs-button
                  icon="edit"
                  v-if="tr.status != 'Default'"
                  color="green"
                  radius
                  @click="handleOpenPopupSelected(tr)"
                />
                <vs-button
                  icon="delete"
                  v-if="tr.status != 'Default'"
                  color="danger"
                  radius
                  @click="handleDeleteEmail(tr.id)"
                />
              </vs-td>
            </vs-tr>
          </tbody>
        </template>
      </vs-table>
    </div>
    <CustomPopup title="Email details" :active.sync="popup">
      <div>
        <div v-if="type == 0">
          Enter email:
          <vs-input
            placeholder="emailuser@email.com"
            v-model="email"
            style="width: 250px"
            class="mt-1 mb-4"
          />
        </div>
        <div>
          Enter name:
          <vs-input
            placeholder="ex: Tran Duc Thai"
            v-model="name"
            style="width: 250px"
            class="mt-1 mb-4"
          />
        </div>
        <vs-button
          class="justify-center align-center text-medium"
          type="gradient"
          @click="handleAddEmail"
          v-if="type == 0"
          >Add</vs-button
        >
        <vs-button
          class="justify-center align-center text-medium"
          type="gradient"
          @click="handleUpdateEmail"
          v-if="type == 1"
          >Update</vs-button
        >
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
      popup: false,
      id: 0,
      name: '',
      email: '',
      type: 0,
      duplicate: false
    }
  },
  filters: {},
  computed: {
    ...mapGetters(['userEmails'])
  },
  methods: {
    ...mapActions([
      'getUserEmails',
      'addUserEmail',
      'updateUserEmail',
      'deleteUserEmail'
    ]),
    async handleOpenPopup() {
      if (this.userEmails.length < 5) {
        this.popup = true
        this.type = 0
      } else {
        this.$vs.notify({
          title: 'Your test email list should be less than 5',
          text: 'Please delete some email to add another',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }
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
      this.handleCheckDuplicate()
      if (!this.duplicate) {
        this.handleAddEmailConfirm()
      }
    },
    async handleAddEmailConfirm() {
      const userEmail = {
        name: this.name,
        email: this.email,
        provider: 'Gmail'
      }
      await this.handleCallAPI(this.addUserEmail, userEmail)
      this.popup = false
    },
    async handleOpenPopupSelected(selected) {
      this.popup = true
      this.type = 1
      this.email = selected.email
      this.name = selected.name
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
        email: this.email
      }
      await this.handleCallAPI(this.updateUserEmail, userEmail)
      this.popup = false
    },
    async handleCheckDuplicate() {
      this.duplicate = false
      this.userEmails.forEach(list => {
        if (list.email == this.email) {
          this.duplicate = true
          this.$vs.notify({
            title: 'Email is existed',
            text: 'Please re-check email textfield',
            color: 'warning',
            icon: 'error',
            position: 'top-right'
          })
        }
      })
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
  },
  destroyed() {
    this.popup = false
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
