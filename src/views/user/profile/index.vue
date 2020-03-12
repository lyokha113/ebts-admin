<template>
  <div>
    <vs-row class="px-3 mb-1">
      <vs-col class="m-auto mb-5" vs-type="flex" vs-align="center" vs-w="8">
        <vs-row class="p-3" style="background: white">
          <vs-col class="p-0" vs-type="flex" vs-w="12">
            <vs-row>
              <vs-col class="mb-2 px-0" vs-type="flex" vs-w="12">
                <h1 style="margin: auto">Personal data</h1>
              </vs-col>
              <vs-col class="my-2 px-0" vs-type="flex" vs-w="12">
                <vs-row>
                  <vs-col class="px-1" vs-w="3" vs-type="flex">
                    <div class="con-input-upload  mx-auto">
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
                  <vs-col class="px-1 pl-3" vs-w="9">
                    <vs-row>
                      <vs-col class="mb-5 mx-auto" vs-w="auto">
                        <vs-input
                          v-model="email"
                          class="inline-block mr-2"
                          icon="email"
                          label="Email"
                          name="email"
                          readonly
                        />

                        <vs-input
                          v-model="name"
                          class="inline-block ml-2 mr-4"
                          icon="info"
                          label="Fullname"
                          name="name"
                          :readonly="activeUser.provider == 'google'"
                        />

                        <vs-button
                          :disabled="activeUser.provider == 'google'"
                          @click="handleUpdate"
                          >Update</vs-button
                        >
                      </vs-col>
                      <vs-col class="mb-5 mx-auto" vs-w="auto">
                        <vs-input
                          v-model="password"
                          class="inline-block  mr-2"
                          :readonly="activeUser.provider == 'google'"
                          type="password"
                          icon="icon icon-lock"
                          icon-pack="feather"
                          label="New Password"
                          name="Password"
                        />
                        <vs-input
                          v-model="confirm"
                          class="inline-block  ml-2 mr-4"
                          :readonly="activeUser.provider == 'google'"
                          type="password"
                          icon="icon icon-repeat"
                          icon-pack="feather"
                          label="Confirm Password"
                          name="confirm"
                        />

                        <vs-button
                          :disabled="activeUser.provider == 'google'"
                          @click="handleChangePassword"
                          >Change</vs-button
                        >
                      </vs-col>
                      <vs-col class="mx-auto" vs-w="8">
                        <vs-checkbox
                          v-model="allowInvite"
                          @click="handleUpdateInvite"
                          >Allow Invitation</vs-checkbox
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
      <vs-col class="m-auto" vs-type="flex" vs-align="center" vs-w="8">
        <vs-row class="p-3" style="background: white">
          <vs-col vs-type="flex" vs-w="12">
            <h1 style="margin: auto">Email list</h1>
          </vs-col>
          <vs-col class="p-4" vs-type="flex" vs-w="12" vs-justify="center">
            <span
              ><strong>Limitation: </strong>{{ userEmails.length }}/5
              emails</span
            >
          </vs-col>
          <vs-col vs-w="auto" class="mx-auto">
            <vs-input
              v-model="emailTest"
              class="mr-4 inline-block"
              icon="email"
              label="Email"
              name="emailTest"
              style="width: 400px"
            />
            <vs-button @click="handleAddEmail">
              <feather-icon
                icon="PlusCircleIcon"
                svg-classes="h-4 w-4"
              ></feather-icon>
            </vs-button>
          </vs-col>
          <vs-col vs-type="flex" vs-justify="center" vs-w="12">
            <div class="my-3" style="width: 100%">
              <vs-table
                ref="table"
                :data="userEmails"
                no-data-text="Don't have any email"
                class="shadow-md"
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
    ...mapGetters(['activeUser', 'accessToken', 'userEmails']),
    user_displayName() {
      return this.activeUser && this.activeUser.fullName
    },
    user_displayImage() {
      return this.activeUser && this.activeUser.imageUrl
    },
    user_displayEmail() {
      return this.activeUser && this.activeUser.email
    },
    user_allowInvite() {
      return this.activeUser && this.activeUser.allowInvite
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
    emailTest: '',
    allowInvite: false
  }),
  methods: {
    ...mapActions([
      'updateUser',
      'getUserEmails',
      'createUserEmail',
      'deleteUserEmail',
      'updateUserInvitation',
      'userEmailWS'
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

      if (this.userEmails.length >= 5) {
        this.$vs.notify({
          title: 'Maximum emails',
          text: 'We currently support 5 emails for each user',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }

      this.handleAddEmailConfirm()
    },
    async handleUpdateInvite() {
      await this.handleCallAPI(this.updateUserInvitation, !this.allowInvite)
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
    this.allowInvite = this.user_allowInvite
    await this.handleCallAPI(this.getUserEmails)
    connectWSUseremail(this, this.accessToken, this.userEmailWS)
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
