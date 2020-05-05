<template id="modal-template">
  <div v-show="open" class="modal">
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
              :style="{
                backgroundImage:
                  'url(' + require('@/assets/images/export-file.png') + ')'
              }"
              @click="handleDownload"
            />
            <div
              class="shadow-md cursor-pointer export"
              :style="{
                backgroundImage:
                  'url(' + require('@/assets/images/export-gmail.png') + ')'
              }"
              @click="handleGMailDraft"
            />

            <div
              class="shadow-md cursor-pointer export"
              :style="{
                backgroundImage:
                  'url(' + require('@/assets/images/export-yahoo.png') + ')'
              }"
              @click="handleYahooPopup"
            />
            <!-- <div
              class="shadow-md cursor-pointer export"
              :style="{
                backgroundImage:
                  'url(' + require('@/assets/images/export-outlook.png') + ')'
              }"
              @click="handleOutlookPopup"
            /> -->
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
            <!-- <div>
              Draft Outlook
            </div> -->
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
            v-model="outlookEmail"
            placeholder="Email"
            class="m-3"
            style="width: 100%;"
          />
          <vs-input
            v-model="outlookPassword"
            type="password"
            placeholder="Pasword"
            class="m-3"
            style="width: 100%"
          />
        </div>
        <div style="display: flex; justify-content: flex-end">
          <vs-button
            class="m-3"
            :disabled="!outlookEmail || !outlookPassword"
            @click="handleOutlookDraft"
          >
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
            v-model="yahooEmail"
            placeholder="Email"
            class="m-3"
            style="width: 100%;"
          />
          <vs-input
            v-model="yahooPassword"
            type="password"
            placeholder="Pasword"
            class="m-3"
            style="width: 100%"
          />
        </div>
        <div style="display: flex; justify-content: flex-end">
          <vs-button
            class="m-3"
            :disabled="!yahooEmail || !yahooPassword"
            @click="handleYahooDraft"
          >
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
  components: {
    CustomPopup
  },
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
    ...mapGetters([
      'accessToken',
      'editorRawId',
      'editorContent',
      'editorChange'
    ])
  },
  methods: {
    ...mapActions([
      'autoUpdateRawContent',
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
        await this.handleCallAPI(this.autoUpdateRawContent, {
          rawId: this.editorRawId,
          content
        })
        this.setEditorChange(false)
      }
    },

    async handleDownload() {
      await this.fetchInlineContent()
      const file = new File(
        [this.editorContent],
        `etbs-${this.editorRawId}.html`,
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
      await this.handleCallAPI(this.makeDraftGMail, this.editorRawId)
    },

    async handleOutlookDraft() {
      if (!this.validateEmail(this.outlookEmail.trim())) {
        this.handleErrorInput(
          'Email format incorrect',
          `Please re-check email format`
        )
        return
      }

      await this.fetchInlineContent()
      const request = {
        rawTemplateId: this.editorRawId,
        email: this.outlookEmail.trim(),
        password: this.outlookPassword
      }
      if (await this.handleCallAPI(this.makeDraftOutlook, request)) {
        this.outlookPopup = false
      }
    },

    async handleYahooDraft() {
      if (!this.validateEmail(this.yahooEmail.trim())) {
        this.handleErrorInput(
          'Email format incorrect',
          `Please re-check email format`
        )
        return
      }

      await this.fetchInlineContent()
      const request = {
        rawTemplateId: this.editorRawId,
        email: this.yahooEmail.trim(),
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
