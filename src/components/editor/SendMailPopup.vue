<template id="modal-template">
  <div class="modal" v-show="open">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Send Test Email</h2>
        </div>
        <div class="modal-body">
          <template v-if="step === 1">
            <div class="description-row">
              <span>List emai is setup on user profile page</span>
            </div>
            <vs-table multiple v-model="selected" :data="emails">
              <template slot="thead">
                <vs-th>
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
            <div class="description-row">
              <span
                >All dynamic components must have unique name attribute</span
              >
              <br />
              <span
                >Empty attribute names was ignored and duplicate one will be got
                the last one</span
              >
            </div>
            <vs-table :data="dynamicForm">
              <template slot="thead">
                <vs-th />
                <vs-th>
                  Setup dynamic value
                </vs-th>
              </template>

              <template slot-scope="{ data }">
                <vs-tr :key="index" v-for="(row, index) in data">
                  <vs-td>{{ row.email }}</vs-td>

                  <template slot="expand">
                    <div>
                      <vs-row
                        class="mb-3"
                        vs-align="center"
                        :key="index"
                        v-for="(attr, index) in row.attrs"
                      >
                        <vs-col
                          class="my-1"
                          v-if="attr.datatype == 'dynamic text'"
                          vs-type="flex"
                          vs-w="12"
                        >
                          <vs-input
                            :label="`Text Component name: ${attr.name}`"
                            style="width: 500px"
                            v-model="attr.value"
                          />
                        </vs-col>

                        <vs-col
                          class="my-1"
                          v-if="attr.datatype == 'dynamic link'"
                          vs-type="flex"
                          vs-w="6"
                        >
                          <vs-input
                            :label="`Link Component name: ${attr.name}`"
                            style="width: 235px"
                            v-model="attr.value"
                          />
                        </vs-col>

                        <vs-col
                          class="my-1"
                          v-if="attr.datatype == 'dynamic link'"
                          vs-type="flex"
                          vs-w="6"
                        >
                          <vs-input
                            :label="`Link Component name: ${attr.name}`"
                            style="width: 235px"
                            v-model="attr.value"
                          />
                        </vs-col>
                      </vs-row>
                    </div>
                  </template>
                </vs-tr>
              </template>
            </vs-table>
          </template>
        </div>
        <div class="modal-footer">
          <vs-button class="mx-2" type="border" @click="close">
            Close
          </vs-button>
          <vs-button class="mx-2" v-if="step == 2" @click="step = 1">
            Back
          </vs-button>
          <vs-button class="mx-2" v-if="step == 1" @click="handleDynamicValue">
            Next
          </vs-button>
          <vs-button class="mx-2" v-if="step == 2" @click="close">
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
      console.log(this.dynamicForm)

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
  width: 00px;
}
</style>
