<template>
  <div class="flex flex-wrap">
    <div id="top-panel" class="w-full flex justify-between">
      <div class="p-3 flex shadow-md bg-white" style="width: 63%">
        <DesignSession />
      </div>
      <div class="p-3 flex shadow-md bg-white" style="width: 35%">
        <div class="flex justify-center self-center w-2/3">
          <div class="w-4/5 px-3">
            <multiselect
              v-model="timeoutSave"
              track-by="time"
              label="name"
              selectLabel=""
              selectedLabel=""
              deselectLabel=""
              @input="handleTimeoutSave"
              :options="timeoutSaves"
              :searchable="false"
            >
            </multiselect>
          </div>
          <div class="w-1/5">
            <vs-button
              class="btn-command"
              size="large"
              icon="save"
              @click="handleSaveContent"
            ></vs-button>
          </div>
        </div>
        <div class="flex justify-center self-center w-1/3">
          <div class="w-1/2">
            <vs-button
              class="btn-command"
              size="large"
              icon="cloud_download"
              @click="handleExportPopup"
            ></vs-button>
          </div>
          <div class="w-1/2">
            <vs-button
              class="btn-command"
              size="large"
              icon="drafts"
              @click="handleSendMailPopup"
            ></vs-button>
          </div>
        </div>
      </div>
    </div>
    <div id="left-panel">
      <div class="p-4 font-medium text-xl text-white text-center">
        SETTING
      </div>
      <div id="trait-manager">
        <div class="px-4" style="font-size: 10.5px; color: #DDDDDD">
          Data:
        </div>
      </div>
      <div id="selector"></div>
      <div id="style-manager"></div>
    </div>
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
import DesignSession from '@/components/editor/DesignSession.vue'
import configEditor from '@/components/editor/configEditor.js'
import configCustomBlock from '@/components/editor/configCustomBlock.js'
import configUserBlock from '@/components/editor/configUserBlock.js'
import {
  connectWSRaw,
  sendOfflineSession,
  sendDesignContent,
  disconnectWS
} from '@/service/websocket'
import { mapGetters, mapActions } from 'vuex'

import 'grapesjs/dist/css/grapes.min.css'
import 'grapesjs-preset-newsletter/dist/grapesjs-preset-newsletter.css'
export default {
  components: {
    CustomPopup,
    ExportPopup,
    SendMailPopup,
    DesignSession
  },
  data() {
    return {
      editor: {},
      loaded: false,
      uploadPopup: false,
      uploadPercent: 0,
      dynamicAttrs: [],
      exportPopup: false,
      sendmailPopup: false,
      autosaveInterval: null,
      timeoutSaves: [
        { name: 'Autosave-15 mins', time: 90000 },
        { name: 'Autosave-30 mins', time: 180000 },
        { name: 'Autosave-60 mins', time: 360000 },
        { name: 'No autosave', time: 0 }
      ],
      timeoutSave: { name: 'No autosave', time: 0 }
    }
  },
  computed: {
    ...mapGetters([
      'accessToken',
      'activeUser',
      'editorRawId',
      'editorContent',
      'editorFiles',
      'editorChange',
      'userBlocks',
      'contributors'
    ])
  },
  async mounted() {
    if (!this.editorRawId) {
      this.$router.push('/user/workspace')
      return
    }

    let loader = this.$loading.show({
      color: '#7367f0',
      loader: 'spinner',
      width: 64,
      height: 64,
      backgroundColor: '#ffffff',
      opacity: 1,
      zIndex: 110000
    })

    await Promise.all([
      this.handleCallAPI(this.getEditorFiles, null, false),
      this.handleCallAPI(this.getUserEmails, null, false),
      this.handleCallAPI(this.getUserBlocks, null, false),
      this.handleCallAPI(this.getContributors, this.editorRawId, false)
    ])

    loader.hide()

    this.setEditorChange(false)

    this.editor = grapesjs.init({
      components: this.editorRawId && this.editorContent,
      container: '#editor',
      height: '660px',
      plugins: [
        editor => grapesjsPresetNewsletter(editor, {}),
        editor => configEditor(editor),
        editor => configCustomBlock(editor),
        editor => configUserBlock(editor, this),
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
          this.handleUploadFile(files)
        },
        handleAdd: () => {}
      },
      storageManager: { type: null },
      richTextEditor: {
        actions: ['bold', 'italic', 'underline', 'strikethrough']
      },
      selectorManager: {
        appendTo: '#selector'
      },
      styleManager: {
        appendTo: '#style-manager'
      },
      traitManager: {
        appendTo: '#trait-manager'
      }
    })

    this.editor.on('change:changesCount', async () => {
      this.setEditorChange(true)
      if (this.editorRawId) {
        const message = {
          content: this.editor.runCommand('gjs-get-inlined-html'),
          rawId: this.editorRawId
        }
        if (message.content) {
          sendDesignContent(this, message)
        }
      }
    })

    this.editor.on('load', async () => {
      window.setTimeout(() => this.setEditorChange(false), 1000)
      this.loaded = true
    })

    const message = {
      online: true,
      ownerId: this.activeUser && this.activeUser.id,
      rawId: this.editorRawId
    }
    connectWSRaw(this, this.accessToken, this.rawWS, this.editorRawId, message)
  },
  methods: {
    ...mapActions([
      'getEditorFiles',
      'getUserBlocks',
      'getUserEmails',
      'getContributors',
      'uploadFiles',
      'updateRawContent',
      'autoUpdateRawContent',
      'setEditorChange',
      'rawWS'
    ]),

    handleTimeoutSave() {
      clearInterval(this.autosaveInterval)
      if (this.timeoutSave && this.timeoutSave.name != 'No autosave') {
        this.autosaveInterval = setInterval(
          this.handleAutoSave,
          this.timeoutSave.time
        )
      }
    },

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
        text:
          'Apply these change will create new file. Do you want to make it ?',
        accept: () => {
          const assetManager = this.editor.AssetManager
          const name = this.getFileNameFromAM(
            imageModel.attributes.src,
            assetManager
          )
          const file = this.base64ImageToBlob(imageEditor.toDataURL())
          this.handleApplyEditFile(file, name, imageModel)
        }
      })
    },

    handleExportPopup() {
      this.exportPopup = true
    },

    handleSendMailPopup() {
      const wrapper = this.editor.DomComponents.getWrapper().find(
        '[datatype^=dynamic '
      )
      const attr = wrapper.map(c => c.getAttributes())
      this.dynamicAttrs = attr
      this.sendmailPopup = true
    },

    async handleSaveContent() {
      if (this.loaded) {
        const content = this.editor.runCommand('gjs-get-inlined-html')
        if (!content) {
          this.handleErrorInput(
            'Can not save template',
            'Template can not be empty'
          )
          return
        }
        await this.handleCallAPI(this.updateRawContent, {
          rawId: this.editorRawId,
          autoSave: false,
          content
        })
        window.setTimeout(() => this.setEditorChange(false), 1000)
      }
    },

    async handleAutoSave() {
      if (
        this.editorChange &&
        this.loaded &&
        this.timeoutSave &&
        this.timeoutSave.name != 'No autosave'
      ) {
        const content = this.editor.runCommand('gjs-get-inlined-html')
        if (!content) {
          return
        }
        if (
          await this.handleCallAPI(
            this.autoUpdateRawContent,
            { rawId: this.editorRawId, content },
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
            text: 'Auto saved failed',
            color: 'warning',
            position: 'top-right'
          })
        }
      }
    },

    async handleApplyEditFile(file, name, imageModel) {
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
        rawId: this.editorRawId,
        file: formData,
        onUploadProgress: this.handleOnUploaddProgress
      }
      const uploaded = await this.handleCallAPI(this.uploadFiles, uploader)
      imageModel.set('src', uploaded.link)
      this.uploadPercent = 0
      this.uploadPopup = false
      this.editor.Modal.close()
    },

    async handleUploadFile(files) {
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
        const task = {
          rawId: this.editorRawId,
          file: formData,
          onUploadProgress: this.handleOnUploaddProgress
        }
        await this.handleCallAPI(this.uploadFiles, task)
        this.uploadPercent = 0
        this.uploadPopup = false
      }
    }
  },
  beforeDestroy() {
    this.uploadPopup = false
    this.exportPopup = false
    this.sendmailPopup = false
    clearInterval(this.autosaveInterval)
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
  },
  destroyed() {
    if (this.editorRawId) {
      const message = {
        online: false,
        ownerId: this.activeUser && this.activeUser.id,
        rawId: this.editorRawId
      }
      sendOfflineSession(this, message)
    }
    disconnectWS(this)
  },
  watch: {
    editorContent: function(content) {
      this.editor.setComponents(content)
    },
    editorFiles: function(files) {
      this.editor.AssetManager && this.editor.AssetManager.add([...files])
    },
    // eslint-disable-next-line no-unused-vars
    contributors: function(contributors) {
      if (this.loaded) {
        const content = this.editor.runCommand('gjs-get-inlined-html')
        this.handleCallAPI(
          this.autoUpdateRawContent,
          { rawId: this.editorRawId, content },
          false
        )
      }
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
      top: 40%;
    }

    #gjs-am-uploadFile {
      padding: 0px;
      height: 100%;
      cursor: pointer;
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

/deep/ .gjs-pn-commands {
  display: flex;
  justify-content: center;
}

/deep/ .gjs-trt-traits {
  padding: 5px;
}

/deep/ .gjs-pn-panel.gjs-pn-views {
  .gjs-pn-buttons {
    justify-content: center;

    .gjs-pn-btn {
      &.fa-bars:before {
        content: 'LAYER';
        font-size: 17px;
        padding: 5px;
      }
      &.fa-th-large:before {
        content: 'BLOCK';
        font-size: 17px;
        padding: 5px;
      }
    }
  }
}

/deep/ .gjs-pn-btn.fa.fa-code {
  display: none;
}

#top-panel {
  width: 100%;
  height: 90px;
  margin-bottom: 15px;
}

#left-panel {
  width: 13%;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #373d49;
  z-index: 1;
  overflow: scroll;
  max-height: 660px;
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  #selector {
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    padding: 5px;
  }
}
#editor {
  width: 87% !important;
}
.btn-command {
  width: 90% !important;

  /deep/ i {
    font-size: 23px !important;
  }
}
</style>
