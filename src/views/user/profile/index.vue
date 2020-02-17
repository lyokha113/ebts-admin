<template>
  <div>
    <vs-row class="px-3 mb-1">
      <vs-col
        class="mb-5"
        vs-type="flex"
        vs-align="center"
        vs-w="6"
        vs-offset="3"
      >
        <vs-row class="p-3" style="background: white">
          <vs-col vs-type="flex" vs-w="12">
            <vs-row>
              <vs-col class="mb-2" vs-type="flex" vs-w="12">
                <h1 style="margin: auto">Personal data</h1>
              </vs-col>
              <vs-col class="my-2" vs-type="flex" vs-w="12">
                <vs-row>
                  <vs-col vs-w="4">
                    <div class="con-input-upload">
                      <img :src="imageUrl" name="imageUrl" width="100%" />
                      <button
                        type="button"
                        title="Upload"
                        class="btn-upload-all vs-upload--button-upload"
                        :disabled="activeUser.provider == 'google'"
                      >
                        <i translate="no" class="material-icons notranslate"
                          >cloud_upload</i
                        >
                        <input
                          ref="uploader"
                          type="file"
                          @click="e => (e.target.value = null)"
                          @change="uploadImage"
                        />
                      </button>
                    </div>
                  </vs-col>
                  <vs-col vs-type="flex" vs-w="4">
                    <vs-row>
                      <vs-col vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-input
                          icon="email"
                          label="Email"
                          name="email"
                          v-model="email"
                          readonly
                        />
                      </vs-col>
                      <vs-col vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-input
                          icon="info"
                          label="Fullname"
                          v-model="name"
                          name="name"
                          :readonly="activeUser.provider == 'google'"
                        />
                      </vs-col>

                      <vs-col vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-button
                          :disabled="activeUser.provider == 'google'"
                          @click="handleUpdate"
                          >Update</vs-button
                        >
                      </vs-col>
                    </vs-row>
                  </vs-col>
                  <vs-col vs-type="flex" vs-w="4">
                    <vs-row>
                      <vs-col vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-input
                          :readonly="activeUser.provider == 'google'"
                          type="password"
                          icon="icon icon-lock"
                          icon-pack="feather"
                          label="New Password"
                          v-model="password"
                          name="Password"
                        />
                      </vs-col>
                      <vs-col vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-input
                          :readonly="activeUser.provider == 'google'"
                          type="password"
                          icon="icon icon-repeat"
                          icon-pack="feather"
                          label="Confirm Password"
                          v-model="confirm"
                          name="confirm"
                        />
                      </vs-col>

                      <vs-col vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-button
                          :disabled="activeUser.provider == 'google'"
                          @click="handleChangePassword"
                          >Change Password</vs-button
                        >
                      </vs-col>
                    </vs-row>
                  </vs-col>
                </vs-row>
              </vs-col>
            </vs-row>
          </vs-col>
        </vs-row>
      </vs-col>
      <vs-col vs-type="flex" vs-align="center" vs-w="6" vs-offset="3">
        <vs-row class="p-3" style="background: white">
          <vs-col vs-type="flex" vs-w="12">
            <h1 style="margin: auto">Email list</h1>
          </vs-col>
          <vs-col vs-type="flex" vs-justify="center" vs-w="12">
            <vs-input
              class="mr-4"
              icon="email"
              label="Email"
              v-model="emailTest"
              name="emailTest"
            />
            <vs-button class="mt-5" type="gradient" @click="handleAddEmail">
              <feather-icon
                icon="PlusCircleIcon"
                svgClasses="h-5 w-5"
              ></feather-icon>
            </vs-button>
          </vs-col>
          <vs-col class="p-4" vs-type="flex" vs-justify="center" vs-w="12">
            <div class=" mt-3">
              <vs-table
                ref="table"
                :data="userEmails"
                class="shadow-md"
                style="width: 700px"
              >
                <template slot="thead">
                  <vs-th>Email</vs-th>
                  <vs-th>Status</vs-th>
                  <vs-th>Action</vs-th>
                </template>

                <template slot-scope="{ data }">
                  <tbody>
                    <vs-tr
                      :data="tr"
                      :key="indextr"
                      v-for="(tr, indextr) in data"
                    >
                      <vs-td style="width: 70%">
                        <p>{{ tr.email }}</p>
                      </vs-td>
                      <vs-td style="width: 20%">
                        <p>{{ tr.status }}</p>
                      </vs-td>
                      <vs-td style="width: 10%;">
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
          </vs-col>
        </vs-row>
      </vs-col>
    </vs-row>
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
    ...mapActions([
      'updateUser',
      'getUserEmails',
      'addUserEmail',
      'deleteUserEmail'
    ]),
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
      if (!this.validateEmail(this.emailTest)) {
        this.$vs.notify({
          title: 'Email empty or format incorrect',
          text: 'Please re-check your email',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }

      if (this.userEmails.length > 5) {
        this.$vs.notify({
          title: 'Maximum emails',
          text: 'We currenly support 5 emails for each user',
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
    await this.handleCallAPI(this.getUserEmails)
  }
}
</script>
<style>
.parentDiv {
  display: block;
  background-color: white;
  border-color: #e4e8ec;
  border-style: solid;
  border-width: 1px;
}
</style>
