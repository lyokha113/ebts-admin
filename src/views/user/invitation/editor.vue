<template>
  <div class="flex flex-wrap">
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
  </div>
</template>

<script>
import grapesjs from 'grapesjs'
import grapesjsPresetNewsletter from 'grapesjs-preset-newsletter'
import tUIImageEditor from 'grapesjs-tui-image-editor'
import configEditor from '@/components/editor/configEditor.js'
import configCustomBlock from '@/components/editor/configCustomBlock.js'
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
  data() {
    return {
      editor: {},
      uploadPopup: false,
      uploadPercent: 0
    }
  },
  computed: {
    ...mapGetters([
      'accessToken',
      'activeUser',
      'editorRawId',
      'editorOwnerId',
      'editorContent',
      'editorFiles',
      'forceKick',
      'editorChange'
    ])
  },
  async mounted() {
    if (!this.editorRawId) {
      this.$router.push('/user/invitation')
      return
    }

    this.editor = grapesjs.init({
      components: this.editorRawId && this.editorContent,
      container: '#editor',
      height: '780px',
      plugins: [
        editor => grapesjsPresetNewsletter(editor, {}),
        editor => configEditor(editor),
        editor => configCustomBlock(editor),
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

    this.editor.on('load', () => {
      const panelsManager = this.editor.Panels
      panelsManager.addButton('options', {
        id: 'save',
        label: ' Save',
        className: 'fa fa-upload',
        attributes: { title: 'Save' },
        active: false,
        command: () => this.handleSaveContent()
      })
    })

    const message = {
      online: true,
      ownerId: this.editorOwnerId,
      rawId: this.editorRawId
    }
    connectWSRaw(this, this.accessToken, this.rawWS, this.editorRawId, message)
  },
  methods: {
    ...mapActions([
      'getSessionForUser',
      'setEditorChange',
      'uploadFileToOwner',
      'rawWS'
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
        text: 'Do you want to create new image with these changes ?',
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

    async handleSaveContent() {
      const content = this.editor.runCommand('gjs-get-inlined-html')
      await this.handleCallAPI(this.updateUserBlockContent, {
        id: this.currentBlock.id,
        content
      })
      this.setEditorChange(false)
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
      const uploaded = await this.handleCallAPI(
        this.uploadFileToOwner,
        uploader
      )
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
        const uploader = {
          rawId: this.editorRawId,
          file: formData,
          onUploadProgress: this.handleOnUploaddProgress
        }
        await this.handleCallAPI(this.uploadFileToOwner, uploader)
        this.uploadPercent = 0
        this.uploadPopup = false
      }
    }
  },
  beforeDestroy() {
    this.uploadPopup = false
  },
  beforeRouteLeave(to, from, next) {
    if (this.editorChange > 0 && !this.forceKick) {
      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `This template haven't saved. Do you want to leave it ?`,
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
        ownerId: this.editorOwnerId,
        rawId: this.editorRawId
      }
      sendOfflineSession(this, message)
    }

    disconnectWS(this)
  },
  watch: {
    editorContent: function(val) {
      this.editor.setComponents(val)
    },
    editorFiles: function(files) {
      const assetManager = this.editor.AssetManager
      assetManager.add([...files])
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
#left-panel {
  width: 13%;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #373d49;
  z-index: 1;
  overflow: scroll;
  max-height: 780px;
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
</style>
