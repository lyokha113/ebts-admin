<template>
  <div class="flex flex-wrap">
    <div id="top-panel" class="w-full shadow-md flex">
      <div class="p-2 flex self-center" style="width: 13%">
        <multiselect
          class="w-10/12"
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
        <div class="w-2/12 flex justify-center ml-4">
          <vs-button
            class="btn-command"
            icon="save"
            @click="handleSaveContent"
          />
        </div>
      </div>
      <div class="p-3 flex justify-center self-center" style="width: 74%"></div>
      <div class="p-3 flex self-center" style="width: 13%">
        <div class="w-1/2 flex justify-center">
          <vs-button
            class="btn-command"
            size="large"
            icon="cloud_download"
            @click="handleExportPopup"
          ></vs-button>
        </div>
        <div class="w-1/2 flex justify-center">
          <vs-button
            class="btn-command"
            size="large"
            icon="drafts"
            @click="handleSendMailPopup"
          ></vs-button>
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
      opacity: 1,
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
      height: '700px',
      plugins: [
        editor => grapesjsPresetNewsletter(editor, {}),
        editor => configEditor(editor),
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
    })

    this.editor.on('load', async () => {
      const blockManager = this.editor.BlockManager
      const domComponents = this.editor.DomComponents

      domComponents.addType('dynamic-text', {
        isComponent: el => {
          return (
            el instanceof HTMLElement &&
            el.getAttribute('datatype') == 'dynamic text'
          )
        },
        model: {
          defaults: {
            traits: [
              { name: 'name', placeholder: 'Field name' },
              { name: 'text', placeholder: 'Default text' }
            ],
            attributes: { datatype: 'dynamic text' }
          },
          init() {
            this.on('change:attributes:text', this.handleTextChange)
          },

          handleTextChange() {
            const text = this.getAttributes().text
            this.editor.getSelected().set('content', text)
          }
        }
      })

      domComponents.addType('dynamic-link', {
        isComponent: el => {
          return (
            el instanceof HTMLElement &&
            el.getAttribute('datatype') == 'dynamic link'
          )
        },
        model: {
          defaults: {
            tagName: 'a',
            traits: [
              { name: 'name', placeholder: 'Field name' },
              { name: 'text', placeholder: 'Default text' },
              { name: 'href', placeholder: 'Default link' },
              {
                type: 'select',
                name: 'target',
                options: [
                  { name: 'New windows', value: '_blank' },
                  { name: 'This window', value: '_top' }
                ]
              }
            ],
            attributes: {
              datatype: 'dynamic link',
              href: 'about:blank',
              target: '_blank'
            }
          },
          init() {
            this.on('change:attributes:text', this.handleTextChange)
          },

          handleTextChange() {
            const text = this.getAttributes().text
            this.editor.getSelected().set('content', text)
          }
        }
      })

      blockManager.add('button', {
        label: 'Button',
        category: 'Basic',
        content: {
          type: 'link',
          content: 'Button',
          style: {
            cursor: 'pointer',
            margin: 'auto',
            padding: '10px 20px 10px 20px',
            color: 'white',
            display: 'inline-block',
            'font-weight': 'bold',
            'box-sizing': 'border-box',
            'background-color': '#44d1b3',
            'letter-spacing': '2px',
            'text-decoration': 'none',
            'border-radius': '5px'
          },
          droppable: false
        },
        attributes: { class: 'gjs-fonts gjs-f-button' }
      })

      blockManager.add('dynamic text', {
        label: 'Dynamic Text',
        category: 'Dynamic Content',
        attributes: { class: 'gjs-fonts gjs-f-text' },
        content: {
          type: 'dynamic text',
          content: 'Dynamic Text',
          style: { color: 'lightgrey', padding: '10px 5px 10px 5px' },
          droppable: false
        }
      })

      blockManager.add('dynamic link', {
        label: 'Dynamic Link',
        category: 'Dynamic Content',
        attributes: { class: 'fa fa-external-link' },
        content: {
          type: 'dynamic link',
          content: 'Dynamic Link',
          style: { color: '#3b97e3', padding: '10px 5px 10px 5px' },
          droppable: false
        }
      })

      this.userBlocks.forEach(block => {
        domComponents.addType(`user-block-${block.name}`, {
          isComponent: el => {
            return (
              el instanceof HTMLElement &&
              el.getAttribute('datatype') == 'user block'
            )
          },
          model: {
            defaults: {
              attributes: { datatype: 'user block', name: block.name }
            }
          }
        })

        blockManager.add(`${block.id}-${block.name}`, {
          label: block.name,
          category: 'User Blocks',
          attributes: { class: `fa fa-${block.icon}` },
          content: {
            type: `user-block-${block.name}`,
            content: block.content,
            droppable: false
          }
        })
      })

      window.setTimeout(() => this.setEditorChange(false), 1000)
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

    handleTimeoutSave() {
      clearInterval(this.autosaveInterval)
      if (this.timeoutSave.name != 'None') {
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

    handleSendMailPopup() {
      const wrapper = this.editor.DomComponents.getWrapper().find(
        '[datatype^=dynamic '
      )
      const attr = wrapper.map(c => c.getAttributes())
      this.dynamicAttrs = attr
      this.sendmailPopup = true
    },

    async handleSaveContent() {
      const content = this.editor.runCommand('gjs-get-inlined-html')
      await this.handleCallAPI(this.updateRawContent, {
        rawId: this.currentRaw.id,
        autoSave: false,
        content
      })
      this.setEditorChange(false)
    },

    async handleAutoSave() {
      // if (this.editorChange) {
      //   const content = this.editor.runCommand('gjs-get-inlined-html')
      //   if (
      //     await this.handleCallAPI(
      //       this.autoUpdateRawContent,
      //       { rawId: this.currentRaw.id, autoSave: true, content },
      //       false
      //     )
      //   ) {
      //     this.setEditorChange(false)
      //     this.$vs.notify({
      //       title: 'Information',
      //       text: 'Auto saved',
      //       color: 'success',
      //       position: 'top-right'
      //     })
      //   } else {
      //     this.$vs.notify({
      //       title: 'Information',
      //       text: 'Auto failed',
      //       color: 'warning',
      //       position: 'top-right'
      //     })
      //   }
      // }
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
        content: 'STRUCTURE';
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
#top-panel {
  width: 100%;
  height: 80px;
  background-color: white;
  margin-bottom: 15px;
}

#left-panel {
  width: 13%;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #373d49;
  z-index: 1;
  overflow: scroll;
  max-height: 700px;
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
