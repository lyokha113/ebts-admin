<template>
  <div class="con-upload">
    <div class="con-img-upload">
      <div class="con-input-upload">
        <button
          type="button"
          :disabled="uploading"
          title="Upload"
          class="btn-upload-all vs-upload--button-upload"
        >
          <input
            ref="uploader"
            type="file"
            multiple
            accept=".gif,.jpg,.jpeg,.png"
            @click="e => (e.target.value = null)"
            @change="handleUpload"
          />
          <i translate="no" class="material-icons notranslate">
            cloud_upload
          </i>
        </button>
      </div>
    </div>
    <CustomPopup
      button-close-hidden
      title="File upload"
      :active.sync="uploading"
    >
      <span v-if="uploadPercent == 100"
        >Uploaded. Waiting for server processing !</span
      >
      <span v-else>Uploading to server </span>
      <vs-progress
        :percent="uploadPercent"
        :height="8"
        color="success"
      ></vs-progress>
    </CustomPopup>
  </div>
</template>
<script>
import CustomPopup from '@/components/CustomPopup.vue'
import { mapActions } from 'vuex'
export default {
  components: {
    CustomPopup
  },
  data: () => ({
    files: [],
    uploading: false,
    uploadPercent: 0
  }),
  methods: {
    ...mapActions(['createFile']),
    handleUpload() {
      this.files = []
      const selectedFiles = [...this.$refs.uploader.files]

      if (selectedFiles.length > 10) {
        this.$vs.notify({
          title: 'Maximum file limit',
          text: `Please select maximum 10 files`,
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }

      selectedFiles.forEach(file => {
        if (/image.*/.test(file.type)) {
          this.files.push(file)
        } else {
          this.$vs.notify({
            title: 'File not supported',
            text: `Can't upload ${file.name}`,
            color: 'warning',
            icon: 'error',
            position: 'top-right'
          })
        }
      })
      this.uploadFile()
    },
    handleOnUploaddProgress(progressEvent) {
      this.uploadPercent = parseInt(
        Math.round((progressEvent.loaded * 100) / progressEvent.total)
      )
    },
    async uploadFile() {
      this.uploading = true
      this.uploadPercent = 0
      let formData = new FormData()
      this.files.forEach(f => {
        formData.append('files', f)
      })

      const uploader = {
        file: formData,
        onUploadProgress: this.handleOnUploaddProgress
      }
      await this.handleCallAPI(this.createFile, uploader)
      this.files = []
      this.uploadPercent = 0
      this.uploading = false
      this.$emit('uploaded')
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .con-input-upload {
  width: 70px;
  height: 50px;
}
/deep/ .vs-upload--button-upload {
  height: 100%;
}
</style>
