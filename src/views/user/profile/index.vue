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
                          accept=".gif,.jpg,.jpeg,.png"
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
                          v-model="email"
                          icon="email"
                          label="Email"
                          name="email"
                          readonly
                        />
                      </vs-col>
                      <vs-col vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-input
                          v-model="name"
                          icon="info"
                          label="Fullname"
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
                          v-model="password"
                          :readonly="activeUser.provider == 'google'"
                          type="password"
                          icon="icon icon-lock"
                          icon-pack="feather"
                          label="New Password"
                          name="Password"
                        />
                      </vs-col>
                      <vs-col vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-input
                          v-model="confirm"
                          :readonly="activeUser.provider == 'google'"
                          type="password"
                          icon="icon icon-repeat"
                          icon-pack="feather"
                          label="Confirm Password"
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
              v-model="emailTest"
              class="mr-4"
              icon="email"
              label="Email"
              name="emailTest"
              style="width: 610px"
            />
            <vs-button class="mt-5" type="gradient" @click="handleAddEmail">
              <feather-icon
                icon="PlusCircleIcon"
                svg-classes="h-5 w-5"
              ></feather-icon>
            </vs-button>
          </vs-col>
          <vs-col class="p-4" vs-type="flex" vs-justify="center" vs-w="12">
            <div class=" mt-3">
              <vs-table
                ref="table"
                :data="userEmails"
                no-data-text="Don't have any email"
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
                      v-for="(tr, indextr) in data"
                      :key="indextr"
                      :data="tr"
                    >
                      <vs-td style="width: 70%">
                        <p class="truncate" style="max-width: 450px">
                          {{ tr.email }}
                        </p>
                      </vs-td>

                      <vs-td
                        style="width: 20%"
                        :style="[
                          tr.status == 'PENDING'
                            ? { color: 'darkorange' }
                            : { color: 'teal' }
                        ]"
                      >
                        <p>{{ tr.status }}</p>
                      </vs-td>
                      <vs-td style="width: 10%;">
                        <vs-button
                          v-if="tr.status != 'Default'"
                          icon="delete"
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
import { connectWSUseremail, disconnectWS } from '@/service/websocket'
export default {
  name: 'UserProfile',
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
      'createUserEmail',
      'deleteUserEmail',
      'setApprovedUserEmails'
    ]),
    handleChangePassword() {
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
    handleAddEmail() {
      if (!this.validateEmail(this.emailTest)) {
        this.$vs.notify({
          title: 'Email empty or format incorrect',
          text: 'Please re-check your input email',
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

      this.handleAddEmailConfirm()
    },
    async handleUpdate() {
      if (!this.name) {
        this.$vs.notify({
          title: 'Warning',
          text: 'Please enter name',
          color: 'warning',
          position: 'top-right'
        })
        return
      }
      this.handleUpdateConfirm()
    },
    async handleChangePasswordConfirm() {
      if (
        await this.handleCallAPI(this.updateUser, { password: this.password })
      ) {
        this.password = ''
        this.confirm = ''
      }
    },
    async handleAddEmailConfirm() {
      const userEmail = {
        string: this.emailTest
      }
      if (await this.handleCallAPI(this.createUserEmail, userEmail)) {
        this.emailTest = ''
      }
    },
    async handleUpdateConfirm() {
      const account = {
        fullName: this.name,
        imageUrl: this.imageUrl
      }
      if (await this.handleCallAPI(this.updateUser, account)) {
        this.imageUrl = ''
      }
    },
    async handleDeleteEmail(id) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `Do you want to delete this email ?`,
        accept: async () => await this.handleCallAPI(this.deleteUserEmail, id)
      })
    },

    uploadImage(e) {
      const image = e.target.files[0]

      if (/image.*/.test(image.type)) {
        const reader = new FileReader()
        reader.onload = e => {
          this.imageUrl = e.target.result
        }
        reader.readAsDataURL(image)
      } else {
        this.$vs.notify({
          title: 'File not supported',
          text: `Can't upload ${image.name}`,
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
      }
    }
  },
  async mounted() {
    this.email = this.user_displayEmail
    this.name = this.user_displayName
    this.imageUrl = this.user_displayImage
    await this.handleCallAPI(this.getUserEmails)
    connectWSUseremail(this, this.setApprovedUserEmails)
  },
  destroyed() {
    disconnectWS(this)
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
