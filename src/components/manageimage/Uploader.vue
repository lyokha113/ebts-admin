<template>
  <div class="con-upload">
    <div class="con-img-upload">
      <div class="con-input-upload">
        <button
          type="button"
          title="Upload"
          class="btn-upload-all vs-upload--button-upload"
        >
          <input
            ref="uploader"
            type="file"
            @change="handleUpload"
            multiple
            accept=".gif,.jpg,.jpeg,.png"
          />
          <i translate="no" class="material-icons notranslate">
            cloud_upload
          </i>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data: () => ({
    files: [],
    uploadPercent: 0
  }),
  methods: {
    ...mapActions(['createFile']),
    handleUpload() {
      this.files = []
      const selectedFiles = [...this.$refs.uploader.files]
      selectedFiles.forEach(file => {
        if (/image.*/.test(file.type)) {
          this.files.push(file)
        } else {
          this.$vs.notify({
            title: 'File not supported',
            text: `Can't upload ${file.name}`,
            color: 'warning',
            icon: 'error'
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
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .con-input-upload {
  width: 70px;
  height: 70px;
}
/deep/ .vs-upload--button-upload {
  height: 100%;
}
</style>
