<template id="modal-template">
  <div class="modal" v-show="open">
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
            <vs-table multiple v-model="selected" :data="emails">
              <template slot="thead">
                <vs-th class="text-base">
                  Choose emails
                </vs-th>
              </template>

              <template slot-scope="{ data }">
                <vs-tr
                  :data="email"
                  :key="index"
                  v-for="(email, index) in data"
                >
                  <vs-td> {{ email }}</vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </template>

          <template v-if="step === 2">
            <div class="description-row text-base italic" v-if="!isDynamicData">
              <span>Setup email data to send</span>
            </div>
            <div class="description-row text-base italic" v-if="isDynamicData">
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
              <vs-checkbox v-model="isDynamicData" style="margin-left: 10px" />
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
                :key="index"
                v-for="(row, index) in dynamicForm"
                :disabled="!isDynamicData"
              >
                <div slot="header" class="text-base">
                  {{ row.email }}
                </div>
                <div v-show="isDynamicData" class="pt-1">
                  <vs-row
                    class="mb-3"
                    vs-align="center"
                    :key="index"
                    v-for="(attr, index) in row.attrs"
                    style="position: relative"
                  >
                    <vs-col vs-type="flex" vs-w="12">
                      <div class="ml-1">Component name</div>
                      <div class="ml-2 font-medium">{{ attr.name }}</div>
                    </vs-col>
                    <vs-col class="my-1" vs-type="flex" vs-w="12">
                      <input
                        :id="`${row.email}-${attr.id}`"
                        class="dynamic-input"
                        type="text"
                        v-model="attr.value"
                      />
                      <label :for="`${row.email}-${attr.id}`">{{
                        attr.datatype == 'dynamic text'
                          ? 'Text Data'
                          : 'Link Data'
                      }}</label>
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
          <vs-button class="mx-2" v-if="step == 2" @click="step = 1">
            Back
          </vs-button>
          <vs-button
            class="mx-2"
            v-if="step == 1"
            @click="handleDynamicValue"
            :disabled="!selected.length"
          >
            Next
          </vs-button>
          <vs-button class="mx-2" v-if="step == 2" @click="handleSendMail">
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
          * Work on first sheet.
          <br />
          <br />
          * First row is contain dynamic component names as headers seperated by
          each column and the first column is always 'Reciver Email'.
          <br />
          <br />
          * Other rows are data values which correspond to headers.
          <br />
          <br />
          * You can
          <download-excel
            class="inline-block cursor-pointer font-semibold italic mx-1"
            style="color: #725de1"
            worksheet="Dynamic data"
            :name="`ETBS-${currentRaw.name}.xls`"
            :meta="excelMetadata"
            :data="excelData"
            :fields="excelFields"
          >
            click here to download
          </download-excel>
          this formatted file to use for this temlate.
        </p>

        <div style="display: flex; justify-content: center">
          <div id="file-uploader" class="mt-4 my-1">
            <input
              type="file"
              ref="uploader"
              id="file"
              accept=".xls,.xlsx"
              @click="handleImportExcel"
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
  </div>
</template>

<script>
import readXlsxFile from 'read-excel-file'
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
    },
    dynamicAttrs: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  components: {
    CustomPopup
  },
  data() {
    return {
      step: 1,
      selected: [],
      dynamicForm: [],
      excelPopup: false,
      isDynamicData: false,
      excelData: [],
      excelFields: {},
      excelMetadata: [
        [
          {
            key: 'charset',
            value: 'utf-8'
          }
        ]
      ],
      emails: ['lyokha113@gmail.com', 'longnhse62770@fpt.edu.vn']
    }
  },
  computed: {
    ...mapGetters(['accessToken', 'activeUser', 'editorChange', 'currentRaw'])
  },
  methods: {
    ...mapActions(['autoUpdateVersionContent', 'setEditorChange']),
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
              id: a.id,
              name: a.name,
              value: a.value
            }
          })
        return { email: row.email, data: row.attrs }
      })
    },

    handleDynamicValue() {
      const map = new Map()
      this.dynamicAttrs.filter(a => a.name).forEach(a => map.set(a.name, a))
      this.dynamicForm = this.selected.map(email => {
        const attrs = [...map.values()]
        attrs.forEach(a => (a.value = ''))
        return { email, attrs }
      })

      this.step = 2
    },

    handleExcelPopup() {
      const fields = { 'Reciver email': 'email' }
      const data = []

      const map = new Map()
      this.dynamicAttrs.filter(a => a.name).forEach(a => map.set(a.name, a))

      const attrs = [...map.values()]
      this.selected.forEach(email => {
        const row = {}
        attrs.forEach(f => {
          fields[f.name] = f.name
          row[f.name] = f.text ? f.text : 'Default value'
        })

        row['email'] = email
        data.push(row)
      })

      this.excelFields = Object.assign({}, fields)
      this.excelData = data

      this.excelPopup = true
    },

    async handleImportExcel() {
      const excelFile = this.$refs.uploader.files[0]
      readXlsxFile(excelFile).then(rows => {
        console.log(rows)
      })
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

    async handleSendMail() {
      // const data = this.formatDynamicData()
      // const request = {
      //   rawId: this.currentRaw.id,
      //   data
      // }
      console.log(this.formatDynamicData())
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
</style>
