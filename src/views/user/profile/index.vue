<template>
  <div>
    <div class="parentDiv">
      <vs-row class="justify-center align-center text-medium"
        >Personal data</vs-row
      >
      <vs-row class="justify-center align-center">
        <div class="con-input-upload">
          <img :src="imageUrl" name="imageUrl" width="100%" />
          <button
            type="button"
            title="Upload"
            class="btn-upload-all vs-upload--button-upload"
          >
            <i translate="no" class="material-icons notranslate"
              >cloud_upload</i
            >
            <input ref="uploader" type="file" @change="uploadImage" />
          </button>
        </div>
      </vs-row>
      <vs-row class="justify-center align-center">
        <vs-input
          icon="info"
          label="Fullname"
          v-model="name"
          name="name"
          class="mr-2"
        />
        <vs-input
          icon="email"
          label="Email"
          v-model="email"
          name="email"
          class="ml-2"
        />
      </vs-row>
      <vs-row class="justify-center align-center mt-4">
        <vs-button @click="handleUpdate">Update</vs-button>
      </vs-row>
    </div>
    <div class="parentDiv" v-if="this.activeUser.provider == 'local'">
      <vs-row class="justify-center align-center text-medium">Password</vs-row>
      <vs-row class="justify-center align-center">
        <vs-input
          type="password"
          icon="icon icon-lock"
          icon-pack="feather"
          label="New Password"
          v-model="password"
          name="Password"
          class="mr-2"
        />
        <vs-input
          type="password"
          icon="icon icon-repeat"
          icon-pack="feather"
          label="Confirm Password"
          v-model="confirm"
          name="confirm"
          class="ml-2"
        />
      </vs-row>
      <vs-row class="justify-center align-center mt-4">
        <vs-button @click="handleChangePassword">Change Password</vs-button>
      </vs-row>
    </div>
    <div class="parentDiv">
      <vs-row class="justify-center align-center text-medium">Checklist</vs-row>
      <vs-row class="justify-center align-center mt-4">
        <vs-input
          class="mr-4"
          icon="email"
          label="Email"
          v-model="emailTest"
          name="emailTest"
        />
        <vs-button class="mt-6" type="gradient" @click="handleAddEmail"
          >+ Add new email</vs-button
        >
      </vs-row>
      <div id="data-list-list-view" class="data-list-container mt-3">
        <vs-table ref="table" :data="userEmails">
          <template slot="thead">
            <vs-th>Email</vs-th>
            <vs-th>Status</vs-th>
            <vs-th>Action</vs-th>
          </template>

          <template slot-scope="{ data }">
            <tbody>
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td style="width: 30%">
                  <p>{{ tr.email }}</p>
                </vs-td>
                <vs-td style="width: 20%">
                  <p>{{ tr.status }}</p>
                </vs-td>
                <vs-td style="width: 20%;">
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
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'userProfile',
  computed: {
    ...mapGetters(['activeUser', 'userEmails']),
    user_displayName() {
      return this.activeUser && this.activeUser.fullName
    },
    user_displayImage() {
      return this.activeUser && this.activeUser.imageUrl
    },
    user_displayEmail() {
      return this.activeUser && this.activeUser.email
    }
  },
  data: () => ({
    email: '',
    name: '',
    imageUrl: '',
    file: '',
    password: '',
    confirm: '',
    status: '',
    emailTest: ''
  }),
  methods: {
    ...mapActions(['updateUser', 'get  ', 'addUserEmail', 'deleteUserEmail']),
    async handleChangePassword() {
      if (!this.password || !this.confirm) {
        this.$vs.notify({
          title: 'Warning',
          text: 'Please enter password and confirm',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }
      if (this.password != this.confirm) {
        this.$vs.notify({
          title: 'Confirm password not matched',
          text: 'Please re-check confirm password',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }
      this.handleChangePasswordConfirm()
    },
    async handleChangePasswordConfirm() {
      const account = {
        password: this.password
      }
      await this.handleCallAPI(this.updateUser, account)
      this.password = ''
      this.confirm = ''
    },
    async handleAddEmail() {
      if (!this.emailTest) {
        this.$vs.notify({
          title: 'Email should not be empty',
          text: 'Please re-check email textfield',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }
      if (this.userEmails.length > 5) {
        this.$vs.notify({
          title: 'Your test email list should be less than 5',
          text: 'Please delete some email to add another',
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
        email: this.emailTest
      }
      await this.handleCallAPI(this.addUserEmail, userEmail)
    },
    async handleCheckDuplicate() {
      this.duplicate = false
      this.userEmails.forEach(list => {
        if (list.email == this.emailTest) {
          this.duplicate = true
          this.$vs.notify({
            title: 'Email is existed in your list',
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
    },
    async handleUpdate() {
      if (!this.email || !this.name) {
        this.$vs.notify({
          title: 'Warning',
          text: 'Please enter email and name',
          color: 'warning',
          position: 'top-right'
        })
        return
      }
      this.handleUpdateConfirm()
    },
    async handleUpdateConfirm() {
      const account = {
        email: this.email,
        fullName: this.name,
        imageUrl: this.imageUrl
      }
      await this.handleCallAPI(this.updateUser, account)
    },
    uploadImage(e) {
      const image = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onload = e => {
        this.imageUrl = e.target.result
      }
    }
  },
  async mounted() {
    this.email = this.user_displayEmail
    this.name = this.user_displayName
    this.imageUrl = this.user_displayImage
    this.handleCallAPI(this.getUserEmails)
  }
}
</script>
<style>
.parentDiv {
  display: block;
  margin-left: auto;
  background-color: white;
  margin-right: auto;
  width: 80%;
  padding-top: 5%;
  padding: 1%;
  border-color: #e4e8ec;
  border-style: solid;
  border-width: 1px;
}
</style>
