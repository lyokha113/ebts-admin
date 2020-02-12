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
                class="font-light italic cursor-pointer"
                style="margin-left: auto; color: #7367f0"
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
  </div>
</template>

<script>
// import CustomPopup from '@/components/CustomPopup.vue'
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
  // components: {
  //   VStepper
  // },
  data() {
    return {
      step: 1,
      selected: [],
      dynamicForm: [],
      test: '',
      isDynamicData: false,
      emails: ['lyokha113@gmail.com', 'longnhse62770@fpt.edu.vn']
    }
  },
  computed: {
    ...mapGetters(['accessToken', 'activeUser', 'editorChange'])
  },
  methods: {
    ...mapActions(['autoUpdateVersionContent', 'setEditorChange']),
    close() {
      this.$emit('update:open', false)
      this.step = 1
      this.selected = []
      this.dynamicForm = []
    },

    handleDynamicValue() {
      const unique = new Map()
      this.dynamicAttrs.filter(a => a.name).forEach(a => unique.set(a.name, a))
      this.dynamicForm = this.selected.map(email => {
        const attrs = [...unique.values()]
        attrs.forEach(a => (a.value = ''))
        return { email, attrs }
      })

      this.step = 2
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
      console.log(this.dynamicForm)
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
</style>
