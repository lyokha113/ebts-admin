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
                        <p class="truncate" style="max-width: 500px">
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
      let isError = false
      if (this.password.length < 6 || this.password.length > 30) {
        this.handleErrorInput(
          'Error input value',
          'Password must be 6 - 30 characters'
        )
        isError = true
      }

      if (this.password != this.confirm) {
        this.handleErrorInput(
          'Confirm password not matched',
          'Please re-check confirm password'
        )
        isError = true
      }

      if (isError) {
        return
      }
      this.handleChangePasswordConfirm()
    },
    handleAddEmail() {
      let isError = false
      if (!this.validateEmail(this.emailTest)) {
        this.handleErrorInput(
          'Email format incorrect',
          'Please re-check your email'
        )
        isError = true
      }

      if (this.userEmails.length >= 5) {
        this.handleErrorInput(
          'Maximum emails',
          'We currently support 5 emails for each user'
        )

        isError = true
      }

      if (isError) {
        return
      }

      this.handleAddEmailConfirm()
    },
    handleUpdateInvite() {
      this.handleCallAPI(this.updateUserInvitation, !this.allowInvite)
    },
    handleUpdate() {
      if (!this.name.length < 5 || this.name.length > 30) {
        this.handleErrorInput(
          'Error input value',
          'Name must be 5 - 30 characters'
        )
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
        this.handleErrorInput(
          'File not supported',
          `Can't upload ${image.name}`
        )
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
