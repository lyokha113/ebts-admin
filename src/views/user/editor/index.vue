<template>
  <div>
    <div id="left-panel"></div>
    <div id="editor"></div>

    <ExportPopup :open.sync="exportPopup" :editor="editor" />
    <SendMailPopup
      :open.sync="sendmailPopup"
      :editor="editor"
      :dynamic-attrs="dynamicAttrs"
    />

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
import SendMailPopup from '@/components/editor/SendMailPopup.vue'
import configEditor from '@/components/editor/configEditor.js'
import { mapGetters, mapActions } from 'vuex'

import 'grapesjs/dist/css/grapes.min.css'
import 'grapesjs-preset-newsletter/dist/grapesjs-preset-newsletter.css'
export default {
  components: {
    CustomPopup,
    ExportPopup,
    SendMailPopup
  },
  data() {
    return {
      editor: {},
      uploadPopup: false,
      uploadPercent: 0,
      dynamicAttrs: [],
      exportPopup: false,
      sendmailPopup: false
    }
  },
  computed: {
    ...mapGetters([
      'accessToken',
      'currentRaw',
      'editorFiles',
      'editorChange',
      'userBlocks'
    ])
  },
  async mounted() {
    if (!this.currentRaw) {
      this.$router.push('/user/workspace')
      return
    }

    let loader = this.$loading.show({
      color: '#7367f0',
      loader: 'spinner',
      width: 64,
      height: 64,
      backgroundColor: '#ffffff',
      opacity: 0.8,
      zIndex: 110000
    })

    await Promise.all([
      this.handleCallAPI(this.getFiles, null, false),
      this.handleCallAPI(this.getUserEmails, null, false),
      this.handleCallAPI(this.getUserBlocks, null, false)
    ])

    loader.hide()

    this.setEditorChange(false)

    this.editor = grapesjs.init({
      components: this.currentRaw && this.currentRaw.content,
      container: '#editor',
      height: '750px',
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
      },
      selectorManager: {
        appendTo: '#left-panel'
      },
      styleManager: {
        appendTo: '#left-panel'
      },
      traitManager: {
        appendTo: '#left-panel'
      }
    })

    this.editor.on('change:changesCount', async () => {
      this.setEditorChange(true)
    })

    this.editor.on('load', async () => {
      window.setTimeout(() => this.setEditorChange(false), 1000)
      // window.setInterval(this.handleAutoSave, 1000 * 60 * 3)
    })
  },
  methods: {
    ...mapActions([
      'getFiles',
      'getUserBlocks',
      'getUserEmails',
      'createFile',
      'updateRawContent',
      'autoUpdateRawContent',
      'setEditorChange'
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

    handleSendMailPopup(attr) {
      this.dynamicAttrs = attr
      this.sendmailPopup = true
    },

    async handleSaveContent() {
      const content = this.editor.runCommand('gjs-get-inlined-html')
      await this.handleCallAPI(this.updateRawContent, {
        rawId: this.currentRaw.id,
        content
      })
      this.setEditorChange(false)
    },

    async handleAutoSave() {
      if (this.editorChange) {
        const content = this.editor.runCommand('gjs-get-inlined-html')
        if (
          await this.handleCallAPI(
            this.autoUpdateRawContent,
            { rawId: this.currentRaw.id, content },
            false
          )
        ) {
          this.setEditorChange(false)
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
    this.sendmailPopup = false
    // window.clearInterval(this.handleAutoSave)
  },
  beforeRouteLeave(to, from, next) {
    if (this.editorChange > 0) {
      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `Your template haven't saved. Do you want to leave it ?`,
        'accept-text': 'Leave',
        cancel: async () => next(false),
        accept: async () => next()
      })
    } else {
      next()
    }
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

/deep/ .gjs-cv-canvas {
  width: 70%;
  left: 15%;
}

/deep/ .gjs-pn-commands {
  width: 70%;
  left: 15%;
  display: flex;
  justify-content: center;
}

/deep/ .gjs-pn-devices-c {
  left: 15%;
}

/deep/ .gjs-trt-traits {
  padding: 10px 15px 10px 10px;
}

#left-panel {
  font-family: Arial, Helvetica, sans-serif;
  width: 15%;
  height: 300px;
  position: absolute;
  z-index: 1;
}
</style>
