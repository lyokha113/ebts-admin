<template id="modal-template">
  <div class="modal" v-show="open">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Export Template</h2>
        </div>
        <div class="modal-body">
          <div class="description-row">
            <span>Choose a export type</span>
          </div>
          <div class="icon-row">
            <div
              class="shadow-md cursor-pointer export"
              @click="handleDownload"
              :style="{
                backgroundImage:
                  'url(' + require('@/assets/images/export-file.png') + ')'
              }"
            />
            <div
              class="shadow-md cursor-pointer export"
              @click="handleGMailDraft"
              :style="{
                backgroundImage:
                  'url(' + require('@/assets/images/export-gmail.png') + ')'
              }"
            />

            <div
              class="shadow-md cursor-pointer export"
              @click="handleYahooPopup"
              :style="{
                backgroundImage:
                  'url(' + require('@/assets/images/export-yahoo.png') + ')'
              }"
            />
            <div
              class="shadow-md cursor-pointer export"
              @click="handleOutlookPopup"
              :style="{
                backgroundImage:
                  'url(' + require('@/assets/images/export-outlook.png') + ')'
              }"
            />
          </div>
          <div class="text-row">
            <div>
              Download
            </div>
            <div>
              Draft Gmail
            </div>
            <div>
              Draft Yahoo
            </div>
            <div>
              Draft Outlook
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <vs-button type="border" @click="close">
            Close
          </vs-button>
        </div>
      </div>
    </div>

    <CustomPopup title="Outlook" :active.sync="outlookPopup">
      <div style="text-align: center">
        <div
          class="mb-3"
          style="height: 150px; background-size: contain;"
          :style="{
            backgroundImage:
              'url(' + require('@/assets/images/outlook-bg.jpg') + ')'
          }"
        />
        <span
          >We won't store any information about this request. Please use
          testing/temporary outlook account to make draft email for keeping your
          privacy data.
        </span>
        <div
          style="display: flex; text-align: left; justify-content: center; flex-wrap: wrap"
        >
          <vs-input
            placeholder="Email"
            class="m-3"
            style="width: 100%;"
            v-model="outlookEmail"
          />
          <vs-input
            type="password"
            placeholder="Pasword"
            class="m-3"
            style="width: 100%"
            v-model="outlookPassword"
          />
        </div>
        <div style="display: flex; justify-content: flex-end">
          <vs-button class="m-3" @click="handleOutlookDraft">
            Submit
          </vs-button>
        </div>
      </div>
    </CustomPopup>

    <CustomPopup title="Yahoo" :active.sync="yahooPopup">
      <div style="text-align: center">
        <div
          class="mb-3"
          style="height: 150px; background-size: contain;"
          :style="{
            backgroundImage:
              'url(' + require('@/assets/images/yahoo-bg.jpg') + ')'
          }"
        />
        <span
          >We won't store any information about this request. Please use
          testing/temporary outlook account to make draft email for keeping your
          privacy data.
        </span>
        <div
          style="display: flex; text-align: left; justify-content: center; flex-wrap: wrap"
        >
          <vs-input
            placeholder="Email"
            class="m-3"
            style="width: 100%;"
            v-model="yahooEmail"
          />
          <vs-input
            type="password"
            placeholder="Pasword"
            class="m-3"
            style="width: 100%"
            v-model="yahooPassword"
          />
        </div>
        <div style="display: flex; justify-content: flex-end">
          <vs-button class="m-3" @click="handleYahooDraft">
            Submit
          </vs-button>
        </div>
      </div>
    </CustomPopup>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import CustomPopup from '@/components/CustomPopup.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true
    },
    editor: {
      type: Object,
      default: undefined,
      required: true
    }
  },
  components: {
    CustomPopup
  },
  data() {
    return {
      outlookPopup: false,
      outlookEmail: '',
      outlookPassword: '',
      yahooPopup: false,
      yahooEmail: '',
      yahooPassword: ''
    }
  },
  computed: {
    ...mapGetters(['accessToken', 'currentRaw', 'editorChange'])
  },
  methods: {
    ...mapActions([
      'autoUpdateVersionContent',
      'setEditorChange',
      'makeDraftOutlook',
      'makeDraftYahoo',
      'makeDraftGMail'
    ]),
    close() {
      this.$emit('update:open', false)
    },

    handleOutlookPopup() {
      this.outlookEmail = ''
      this.outlookPassword = ''
      this.outlookPopup = true
    },

    handleYahooPopup() {
      this.yahooEmail = ''
      this.yahooPassword = ''
      this.yahooPopup = true
    },

    async fetchInlineContent() {
      if (this.editorChange > 0) {
        const content = this.editor.runCommand('gjs-get-inlined-html')
        await this.handleCallAPI(this.autoUpdateVersionContent, {
          rawId: this.currentRaw.id,
          content
        })
        this.setEditorChange(false)
      }
    },

    async handleDownload() {
      await this.fetchInlineContent()
      const file = new File(
        [this.currentRaw.content],
        `etbs-${this.currentRaw.name}.html`,
        {
          type: 'text/html;charset=utf-8'
        }
      )
      FileSaver.saveAs(file)
      this.$vs.notify({
        title: 'Information',
        text: 'HTML file exported',
        color: 'success',
        position: 'top-right'
      })
    },

    async handleGMailDraft() {
      await this.fetchInlineContent()
      await this.handleCallAPI(this.makeDraftGMail, this.currentRaw.id)
    },

    async handleOutlookDraft() {
      if (!this.validateEmail(this.outlookEmail)) {
        this.$vs.notify({
          title: 'Email format incorrect',
          text: 'Please re-check email format',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }

      await this.fetchInlineContent()
      const request = {
        rawTemplateId: this.currentRaw.id,
        email: this.outlookEmail,
        password: this.outlookPassword
      }
      if (await this.handleCallAPI(this.makeDraftOutlook, request)) {
        this.outlookPopup = false
      }
    },

    async handleYahooDraft() {
      if (!this.validateEmail(this.yahooEmail)) {
        this.$vs.notify({
          title: 'Email format incorrect',
          text: 'Please re-check email format',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }

      await this.fetchInlineContent()
      const request = {
        rawTemplateId: this.currentRaw.id,
        email: this.yahooEmail,
        password: this.yahooPassword
      }
      if (await this.handleCallAPI(this.makeDraftYahoo, request)) {
        this.yahooPopup = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: table;
  transition: opacity 0.3s ease;
  z-index: 10000;

  &-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  &-container {
    background: #fff;
    width: 550px;
    border-radius: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    margin: 0 auto;
    padding: 20px 30px;
  }

  &-header {
    text-align: center;
    margin-bottom: 5px;
  }

  &-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

  &-body {
    .description-row {
      text-align: center;
      margin-bottom: 15px;
    }

    .text-row {
      display: flex;
      justify-content: space-between;
      text-align: center;

      div {
        width: 100px;
        margin-top: 10px;
      }
    }

    .icon-row {
      display: flex;
      justify-content: space-between;

      .export {
        width: 100px;
        height: 100px;
        padding: 10px;
        border-radius: 25px;
        background-repeat: no-repeat;
        background-size: contain;
        background-origin: content-box;
      }
    }
  }
}

/deep/ .vs-popup {
  width: 500px;
}
</style>
