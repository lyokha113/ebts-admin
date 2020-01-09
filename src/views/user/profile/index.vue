<template>
  <div>
    <h1>Profile</h1>
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
        <vs-input icon="info" label="Fullname" v-model="name" name="name" />
      </vs-row>
      <vs-row class="justify-center align-center">
        <vs-input icon="email" label="Email" v-model="email" name="email" />
      </vs-row>
      <vs-row class="justify-center align-center mt-4">
        <vs-button @click="handleUpdate">Update</vs-button>
      </vs-row>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'userProfile',
  computed: {
    ...mapGetters(['activeUser']),
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
    file: ''
  }),
  methods: {
    ...mapActions(['updateUser']),
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
    handleOnUploaddProgress(progressEvent) {
      this.uploadPercent = parseInt(
        Math.round((progressEvent.loaded * 100) / progressEvent.total)
      )
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
  }
}
</script>
<style>
.parentDiv {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
</style>
