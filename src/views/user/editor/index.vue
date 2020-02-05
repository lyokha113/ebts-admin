<template>
  <div>
    <div id="editor"></div>

    <ExportPopup :open.sync="exportPopup" :editor="editor" />

    <CustomPopup
      button-close-hidden
      title="File upload"
      :active.sync="uploadPopup"
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
import grapesjs from 'grapesjs'
import grapesjsPresetNewsletter from 'grapesjs-preset-newsletter'
import tUIImageEditor from 'grapesjs-tui-image-editor'
import CustomPopup from '@/components/CustomPopup.vue'
import ExportPopup from '@/components/editor/ExportPopup.vue'
import configEditor from '@/components/editor/configEditor.js'
import { mapGetters, mapActions } from 'vuex'

import 'grapesjs/dist/css/grapes.min.css'
import 'grapesjs-preset-newsletter/dist/grapesjs-preset-newsletter.css'
export default {
  data() {
    return {
      editor: {},
      saved: false,
      uploadPopup: false,
      uploadPercent: 0,
      exportPopup: false
    }
  },
  components: {
    CustomPopup,
    ExportPopup
  },
  computed: {
    ...mapGetters(['accessToken', 'currentRaw', 'editorFiles', 'editorChange'])
  },
  created() {
    if (!this.currentRaw) {
      this.$router.push('/user/workspace')
    }
  },
  async mounted() {
    await this.handleCallAPI(this.getFiles)
    this.resetEditorChange()

    this.editor = grapesjs.init({
      components: this.currentRaw && this.currentRaw.content,
      container: '#editor',
      height: '780px',
      plugins: [
        editor => grapesjsPresetNewsletter(editor, {}),
        editor => configEditor(editor, { vueInstance: this }),
        editor =>
          tUIImageEditor(editor, {
            includeUI: {
              useDefaultUI: true,
              initMenu: 'filter'
            },
            icons: {
              'menu.normalIcon.path': require('@/assets/images/editor/icon-d.svg'),
              'menu.activeIcon.path': require('@/assets/images/editor/icon-b.svg'),
              'menu.disabledIcon.path': require('@/assets/images/editor/icon-a.svg'),
              'menu.hoverIcon.path': require('@/assets/images/editor/icon-c.svg'),
              'submenu.normalIcon.path': require('@/assets/images/editor/icon-d.svg'),
              'submenu.activeIcon.path': require('@/assets/images/editor/icon-c.svg')
            },
            onApply: this.handleApplyEditconfirm
          })
      ],
      assetManager: {
        assets: [...this.editorFiles],
        noAssets: `<div class="no-image">You haven't upload any image.</div>`,
        dropzone: false,
        openAssetsOnDrop: false,
        uploadFile: event => {
          var files = event.dataTransfer
            ? event.dataTransfer.files
            : event.target.files
          this.handleUploadFile(files, this.editor.AssetManager)
        },
        handleAdd: () => {}
      },
      storageManager: { type: null },
      richTextEditor: {
        actions: ['bold', 'italic', 'underline', 'strikethrough']
      }
    })

    this.editor.on('change:changesCount', async () => {
      this.countEditorChange()
      this.save = false
      if (this.editorChange == 10) {
        const content = this.editor.runCommand('gjs-get-inlined-html')
        if (
          await this.handleCallAPI(
            this.autoUpdateVersionContent,
            {
              rawId: this.currentRaw.id,
              content
            },
            false
          )
        ) {
          this.save = true
          this.resetEditorChange()
          this.$vs.notify({
            title: 'Information',
            text: 'Auto saved',
            color: 'success',
            position: 'top-right'
          })
        } else {
          this.$vs.notify({
            title: 'Information',
            text: 'Auto failed',
            color: 'warning',
            position: 'top-right'
          })
        }
      }
    })

    this.editor.on('load', async () => {
      window.setTimeout(() => this.resetEditorChange(), 100)
    })
  },
  methods: {
    ...mapActions([
      'getFiles',
      'createFile',
      'updateVersionContent',
      'autoUpdateVersionContent',
      'countEditorChange',
      'resetEditorChange'
    ]),

    getFileNameFromAM(src, assetManager) {
      let files = assetManager.getAll()
      files = [...files.models]
      const file = files.find(f => f.attributes.src == src)
      return file && file.attributes.name
    },

    handleOnUploaddProgress(progressEvent) {
      this.uploadPercent = parseInt(
        Math.round((progressEvent.loaded * 100) / progressEvent.total)
      )
    },

    handleApplyEditconfirm(imageEditor, imageModel) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: 'Do you want to apply these changes ?',
        accept: () => {
          const assetManager = this.editor.AssetManager
          const name = this.getFileNameFromAM(
            imageModel.attributes.src,
            assetManager
          )
          const file = this.base64ImageToBlob(imageEditor.toDataURL())
          this.handleApplyEditFile(
            file,
            name,
            imageModel,
            this.editor.AssetManager
          )
        }
      })
    },

    handleExportPopup() {
      this.exportPopup = true
    },

    async handleSaveContent() {
      const content = this.editor.runCommand('gjs-get-inlined-html')
      await this.handleCallAPI(this.updateVersionContent, {
        rawId: this.currentRaw.id,
        content
      })
    },

    async handleApplyEditFile(file, name, imageModel, assetManager) {
      this.uploadPopup = true
      this.uploadPercent = 0

      if (name) {
        const dot = name.lastIndexOf('.')
        name =
          dot != -1
            ? name.substring(0, dot) + '-edited' + name.substring(dot)
            : name + '-edited'
      } else {
        name = 'edited'
      }

      let formData = new FormData()
      formData.append('files', file, name)
      const uploader = {
        file: formData,
        onUploadProgress: this.handleOnUploaddProgress
      }
      const uploaded = await this.handleCallAPI(this.createFile, uploader)
      assetManager.add([...this.editorFiles])
      imageModel.set('src', uploaded[0].link)
      this.uploadPercent = 0
      this.uploadPopup = false
      this.editor.Modal.close()
    },

    async handleUploadFile(files, assetManager) {
      this.uploadPopup = true
      this.uploadPercent = 0
      files = [...files]

      let formData = new FormData()
      files.forEach(file => {
        if (/image.*/.test(file.type)) {
          formData.append('files', file)
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

      if (formData.getAll('files').length) {
        const uploader = {
          file: formData,
          onUploadProgress: this.handleOnUploaddProgress
        }
        await this.handleCallAPI(this.createFile, uploader)
        assetManager.add([...this.editorFiles])
        this.uploadPercent = 0
        this.uploadPopup = false
      }
    }
  },
  destroyed() {
    this.uploadPopup = false
    this.exportPopup = false
  }
}
</script>

<style lang="scss" scoped>
/deep/ .gjs-one-bg {
  background-color: #373d49;
}

/deep/ .gjs-pn-buttons.gjs-pn-views {
  justify-content: space-evenly;
}

/deep/ .gjs-am-file-uploader {
  float: unset;
  width: 100%;
  height: 100px;

  form {
    height: 100px;

    #gjs-am-title {
      padding: 0px;
      position: relative;
      top: 40%;
    }
  }
}

/deep/ .gjs-am-assets-cont {
  float: unset;
  width: 100%;
  padding-top: 25px;
}

/deep/ .gjs-am-assets-header {
  display: none;
}

/deep/ .gjs-am-assets {
  .gjs-am-asset {
    width: 20%;
    height: 130px;
    border: none;
    margin-bottom: 15px;

    &:hover {
      .gjs-am-close {
        display: none;
      }
    }
    .gjs-am-preview-cont {
      height: 100px;
      width: 100%;
    }

    .gjs-am-meta {
      width: 100%;

      .gjs-am-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .no-image {
    position: relative;
    width: 100%;
    text-align: center;
    top: 40%;
  }
}

/deep/ .gjs-blocks-c {
  .gjs-block[title='Text'] {
    order: 1;
  }
  .gjs-block[title='Link'] {
    order: 2;
  }

  .gjs-block[title='Image'] {
    order: 3;
  }

  .gjs-block[title='Button'] {
    order: 4;
  }

  .gjs-block[title='Divider'] {
    order: 5;
  }
}

/deep/ .gjs-dropzone-active {
  .gjs-dropzone {
    display: none !important;
  }
}
</style>
