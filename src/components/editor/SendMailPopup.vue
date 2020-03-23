<template id="modal-template">
  <div v-show="open" class="modal">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Send Test Email</h2>
        </div>
        <div class="modal-body">
          <template v-if="step === 1">
            <div class="description-row italic">
              <span>List emai is setup on user profile page</span>
            </div>
            <vs-table v-model="selected" multiple :data="emails">
              <template slot="thead">
                <vs-th class="text-base">
                  Choose emails
                </vs-th>
              </template>

              <template slot-scope="{ data }">
                <vs-tr
                  v-for="(email, index) in data"
                  :key="index"
                  :data="email"
                >
                  <vs-td> {{ email }}</vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </template>

          <template v-if="step === 2">
            <div v-if="!isDynamicData" class="description-row text-base italic">
              <span>
                Dynamic data only available for dynamic components.
              </span>
            </div>
            <div v-if="isDynamicData" class="description-row text-base italic">
              <span
                >All dynamic components must have unique name attribute</span
              >
              <br />
              <span
                >Empty attribute names was ignored and duplicate one will be got
                the last one</span
              >
            </div>

            <div class="px-6 text-lg font-bold" style="display: flex">
              <label for="">Use dynamic data</label>
              <vs-checkbox
                v-model="isDynamicData"
                :disabled="disableDynamic"
                style="margin-left: 10px"
              />
              <div
                v-if="isDynamicData"
                class="font-light italic cursor-pointer"
                style="margin-left: auto; color: #7367f0"
                @click="handleExcelPopup"
              >
                Excel file support
              </div>
            </div>

            <vs-collapse accordion type="shadow">
              <vs-collapse-item
                v-for="(row, index) in dynamicForm"
                :key="index"
                :disabled="!isDynamicData"
              >
                <div slot="header" class="text-base">
                  {{ row.email }}
                </div>
                <div v-show="isDynamicData" class="pt-1">
                  <vs-row
                    v-for="(attr, index) in row.attrs"
                    :key="index"
                    class="mb-3"
                    vs-align="center"
                    style="position: relative"
                  >
                    <vs-col vs-type="flex" vs-w="12">
                      <div class="ml-1">Component name</div>
                      <div class="ml-2 font-medium">{{ attr.name }}</div>
                    </vs-col>
                    <vs-col class="my-1" vs-type="flex" vs-w="12">
                      <input
                        :id="`${row.email}-${attr.id}`"
                        v-model="attr.value"
                        class="dynamic-input"
                        type="text"
                      />
                      <label :for="`${row.email}-${attr.id}`">{{
                        attr.datatype | label
                      }}</label>
                      <vs-button
                        v-if="attr.datatype == 'dynamic image'"
                        class="ml-2"
                        icon="image"
                        @click="handleImagePopup(attr)"
                      />
                    </vs-col>
                  </vs-row>
                </div>
              </vs-collapse-item>
            </vs-collapse>
          </template>
        </div>
        <div class="modal-footer">
          <vs-button class="mx-2" type="border" @click="close">
            Close
          </vs-button>
          <vs-button v-if="step == 2" class="mx-2" @click="step = 1">
            Back
          </vs-button>
          <vs-button
            v-if="step == 1"
            class="mx-2"
            :disabled="!selected.length"
            @click="handleDynamicValue"
          >
            Next
          </vs-button>
          <vs-button v-if="step == 2" class="mx-2" @click="handleSendMail">
            Send
          </vs-button>
        </div>
      </div>
    </div>

    <CustomPopup title="Excel support" :active.sync="excelPopup">
      <div>
        <p class="text-center text-lg font-bold mb-3">
          File format need to be followed rule exactly to set data.
        </p>
        <p class="text-base">
          * Workbook have to have a sheet with name "Dynamic Data".
          <br />
          <br />
          * First row is contain dynamic component names as headers seperated by
          each column and always have one "Reciver Email" column.
          <br />
          <br />
          * Other rows are data values which correspond to headers.
          <br />
          <br />
          * Duplicate rows name will be got firsts.
          <br />
          <br />
          * You can
          <span
            class="inline-block cursor-pointer font-semibold italic mx-1"
            style="color: #725de1"
            @click="handleExportExcel"
          >
            click here to download
          </span>
          this formatted file to use for this temlate.
        </p>

        <div style="display: flex; justify-content: center">
          <div id="file-uploader" class="mt-4 my-1">
            <input
              id="file"
              ref="uploader"
              type="file"
              accept=".xls,.xlsx"
              @click="e => (e.target.value = null)"
              @change="handleImportExcel"
            />
            <label for="file" class="btn-upload"
              ><span class="truncate mt-1">{{
                'Upload excel file'
              }}</span></label
            >
          </div>
        </div>
      </div>
    </CustomPopup>

    <CustomPopup title="Images" :active.sync="imagePopup" fullscreen>
      <vs-row v-if="editorFiles.length">
        <vs-col
          vs-type="flex"
          vs-w="2"
          vs-justify="center"
          vs-align="center"
          v-for="file in editorFiles"
          :key="file.id"
        >
          <vx-card class="grid-view-item mb-base overflow-hidden">
            <div
              class="item-img-container bg-white h-32 flex items-center justify-center mx-3 cursor-pointer"
            >
              <img
                :src="file.src"
                class="grid-view-img"
                @click="handleImageSelect(file.src)"
              />
            </div>
          </vx-card>
        </vs-col>
      </vs-row>
      <vs-row v-else>
        <vs-col vs-w="12">
          <p class="text-center text-xl font-semibold mt-10">
            You haven't upload any image. Upload to use them in editor
          </p>
        </vs-col>
      </vs-row>
    </CustomPopup>
  </div>
</template>

<script>
import XLSX from 'xlsx'
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
    },
    dynamicAttrs: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  filters: {
    label: function(type) {
      if (type == 'dynamic text') return 'Text data'
      if (type == 'dynamic link') return 'Link data'
      if (type == 'dynamic image') return 'Url data'
    }
  },
  data() {
    return {
      step: 1,
      selected: [],
      dynamicForm: [],
      excelPopup: false,
      imagePopup: false,
      isDynamicData: false,
      selectedImageAttr: null
    }
  },
  computed: {
    ...mapGetters([
      'accessToken',
      'activeUser',
      'editorChange',
      'editorRawId',
      'editorRawId',
      'userEmails',
      'editorFiles'
    ]),
    disableDynamic() {
      return (
        !this.dynamicAttrs.length ||
        this.dynamicAttrs.every(a => !a.hasOwnProperty('name') || !a.name)
      )
    },
    emails() {
      return [
        this.activeUser && this.activeUser.email,
        ...this.userEmails.filter(e => e.status == 'APPROVED').map(e => e.email)
      ]
    }
  },
  methods: {
    ...mapActions(['autoUpdateRawContent', 'setEditorChange', 'sendEmail']),
    close() {
      this.$emit('update:open', false)
      this.step = 1
      this.selected = []
      this.dynamicForm = []
    },

    formatDynamicData() {
      return this.dynamicForm.map(row => {
        row.attrs = row.attrs
          .filter(a => a.value)
          .map(a => {
            return {
              datatype: a.datatype,
              name: a.name,
              value: a.value
            }
          })
        return { email: row.email, attrs: row.attrs }
      })
    },

    handleDynamicValue() {
      if (this.disableDynamic) {
        this.isDynamicData = false
      }

      const map = new Map()
      this.dynamicAttrs.filter(a => a.name).forEach(a => map.set(a.name, a))
      this.dynamicForm = this.selected.map(email => {
        const attrs = JSON.parse(JSON.stringify([...map.values()]))
        attrs.forEach(a => (a.value = ''))
        return { email, attrs }
      })

      this.step = 2
    },

    handleExcelPopup() {
      this.excelPopup = true
    },

    handleExportExcelData() {
      const data = []
      const map = new Map()
      this.dynamicAttrs.filter(a => a.name).forEach(a => map.set(a.name, a))

      const attrs = [...map.values()]
      this.selected.forEach(email => {
        const row = {}
        row['Reciver Email'] = email
        attrs.forEach(f => {
          row[f.name] = f.text ? f.text : ''
        })
        data.push(row)
      })
      return data
    },

    handleExportExcel() {
      let data = this.handleExportExcelData()
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Dynamic Data')
      const out = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' })
      FileSaver.saveAs(
        new Blob([this.strToArrayBuffer(out)], {
          type: 'application/octet-stream'
        }),
        `ETBS-${this.editorRawId}.xlsx`
      )
    },

    handleImportExcelData(data) {
      data = data.map(d => {
        let { 'Reciver Email': email, ...components } = d
        let attrs = []
        for (const key in components) {
          attrs.push({ name: key, value: components[key] })
        }
        return { email, attrs }
      })

      this.dynamicForm.forEach(row => {
        const matched = data.find(
          d => d.email && row.email.trim() === d.email.trim()
        )
        if (matched) {
          row.attrs.forEach(r => {
            const attr = matched.attrs.find(m => m.name === r.name)
            if (attr) {
              r.value = attr.value
            }
          })
        } else {
          row.attrs.forEach(r => (r.value = ''))
        }
      })

      this.excelPopup = false
      this.$vs.notify({
        title: 'Dynamic data',
        text: `Data were imported`,
        color: 'success',
        icon: 'success',
        position: 'top-right'
      })
    },

    handleImportExcel() {
      const excelFile = this.$refs.uploader.files[0]
      var reader = new FileReader()
      reader.onload = e => {
        const types = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel'
        ]
        if (!types.includes(excelFile.type)) {
          this.$vs.notify({
            title: 'File not supported',
            text: `Can't import ${excelFile.name}`,
            color: 'warning',
            icon: 'error',
            position: 'top-right'
          })
          return
        }
        let workbook = XLSX.read(new Uint8Array(e.target.result), {
          type: 'array'
        })
        let data = XLSX.utils.sheet_to_json(workbook.Sheets['Dynamic Data'])
        if (!data.length) {
          this.$vs.notify({
            title: 'Wrong formation',
            text: `File don't have any sheet with name "Dynamic Data"`,
            color: 'warning',
            icon: 'error',
            position: 'top-right'
          })
          return
        }
        this.handleImportExcelData(data)
      }
      reader.readAsArrayBuffer(excelFile)
    },

    handleImagePopup(attr) {
      this.selectedImageAttr = attr
      this.imagePopup = true
    },

    handleImageSelect(link) {
      this.selectedImageAttr.value = link
      this.imagePopup = false
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

    async handleSendMail() {
      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `Send test email ?`,
        accept: async () => {
          const data = this.formatDynamicData()
          const request = {
            rawId: this.editorRawId,
            data
          }

          await this.handleCallAPI(this.fetchInlineContent)
          if (await this.handleCallAPI(this.sendEmail, request)) {
            this.close()
          }
        }
      })
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
    width: 650px;
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
  }
}

.dynamic-input {
  width: 100%;
  padding: 10px 0 10px 5px;
  border: solid lightgray 1px;
  border-radius: 10px;
  outline: 0;
  text-indent: 100px;
  text-overflow: ellipsis;

  + label {
    position: absolute;
    padding: 8px 10px;
    color: white;
    background: #7367f0;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  &:focus {
    border: solid #7367f0 1px;
  }
}

/deep/ .vs-popup {
  width: 600px;
}

/deep/ .con-content--item {
  padding-top: 0px !important;
}

#file-uploader {
  [type='file'] {
    height: 0;
    width: 0;
    overflow: hidden;
    margin-left: auto;
    margin-top: auto;
  }

  [type='file'] + label {
    background: #725de1;
    border: none;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    font-family: 'Poppins', sans-serif;
    font-size: inherit;
    font-weight: 600;
    margin-bottom: 1rem;
    outline: none;
    padding: 0.5rem 20px;
    position: relative;
    transition: all 0.3s;
    vertical-align: middle;

    &:hover {
      background-color: darken(#6d41b9, 10%);
    }

    &.btn-upload {
      background-color: #725de1;
      border-radius: 25px;
      overflow: hidden;
      margin-bottom: auto;

      span {
        display: inline-block;
        height: 100%;
        transition: all 0.3s;
        width: 100%;
      }

      &::before {
        color: #fff;
        content: '\e2c3';
        font-family: 'Material Icons';
        font-size: 130%;
        height: 100%;
        left: 45%;
        line-height: 2.6;
        position: absolute;
        top: -180%;
        transition: all 0.3s;
        width: 100%;
      }

      &:hover {
        background-color: darken(#725de1, 30%);

        span {
          transform: translateY(300%);
        }

        &::before {
          top: 0;
        }
      }
    }
  }
}

.grid-view-item {
  .grid-view-img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    transition: 0.35s;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);

    .grid-view-img {
      opacity: 0.9;
    }
  }
}
</style>
