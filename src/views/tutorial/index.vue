<template>
  <div id="data-list-list-view" class="data-list-container">
    <vs-table
      ref="table"
      pagination
      search
      :max-items="itemsPerPage"
      :data="tutorials"
    >
      <div
        slot="header"
        class="flex flex-wrap-reverse items-center flex-grow justify-between"
      >
        <div class="flex flex-wrap-reverse items-center">
          <div
            class="p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-between text-lg font-medium text-base text-primary border border-solid border-primary"
            @click=";(title = 'Create tutorial'), openPopup()"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Create new</span>
          </div>
        </div>

        <!-- ITEMS PER PAGE -->
        <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4">
          <div
            class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium"
          >
            <span class="mr-2">
              {{ currentPage * itemsPerPage - (itemsPerPage - 1) }} -
              {{
                tutorials.length - currentPage * itemsPerPage > 0
                  ? currentPage * itemsPerPage
                  : tutorials.length
              }}
              of {{ tutorials.length }}
            </span>
            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
          </div>
          <vs-dropdown-menu>
            <vs-dropdown-item @click="itemsPerPage = 10">
              <span>10</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage = 20">
              <span>20</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage = 50">
              <span>50</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="itemsPerPage = 100">
              <span>100</span>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>

      <template slot="thead">
        <vs-th>Thumbnail</vs-th>
        <vs-th sort-key="name">Name</vs-th>
        <vs-th>Description</vs-th>
        <vs-th sort-key="active">Status</vs-th>
        <vs-th>Action</vs-th>
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td class="img-container">
              <img :src="tr.thumbnail" class="product-img" />
            </vs-td>

            <vs-td style="width: 800px">
              <p class="product-name font-medium">{{ tr.name }}</p>
            </vs-td>

            <vs-td>
              <p class="product-category">{{ tr.description }}</p>
            </vs-td>

            <vs-td>
              <vs-chip
                :color="tr.active ? 'success' : 'danger'"
                class="product-order-status"
              >
                <vs-avatar :icon="tr.active ? 'done' : 'lock'" />
                {{ tr.active ? 'Active' : 'Locked' }}
              </vs-chip>
            </vs-td>

            <vs-td>
              <span
                class="action-icon mx-1"
                @click="
                  ;(updateName = ''),
                    (selected = JSON.parse(JSON.stringify(tr))),
                    (updatePrompt = true)
                "
              >
                <vs-icon size="small" icon="create" />
              </span>

              <span class="action-icon mx-1" @click="handleStatus(tr)">
                <vs-icon
                  size="small"
                  :icon="tr.active ? 'lock' : 'lock_open'"
                />
              </span>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>

    <CustomPopup
      id="custom-popup"
      fullscreen
      :title="title"
      :active.sync="editorPopup"
      buttonCloseHidden
    >
      <ManageImage />
      <!-- <vx-card style="min-height: 350px; margin: auto">
        <div>
          <froala
            id="edit"
            :tag="'textarea'"
            :config="config"
            v-model="content"
          ></froala>
          <vs-divider />
          <prism language="html">{{ content }}</prism>
        </div>

        <div class="flex justify-end mt-3">
          <vs-button class="flex mx-2" @click="handleAdd">
            Create
          </vs-button>
          <vs-button type="border" class="flex mx-2" @click="closePopup">
            Cancel
          </vs-button>
        </div>
      </vx-card> -->
    </CustomPopup>

    <CustomPopup
      fullscreen
      :title="title"
      :active.sync="confirmPopup"
      button-close-hidden
    >
      <vs-row appear>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <h2 class="mb-5">PREVIEW</h2>
        </vs-col>

        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <froalaView id="content" v-model="content" />
        </vs-col>
      </vs-row>

      <vs-divider border-style="dashed" class="my-3" />

      <vs-row appear>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <vs-input
            placeholder="Enter name"
            v-model="name"
            style="width: 270px"
            class="my-2"
          />
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <vs-input
            placeholder="Enter description"
            v-model="description"
            style="width: 270px"
            class="my-2"
          />
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <vs-button color="primary" class="mt-4 mr-2" @click="handleUpdate"
            >Update</vs-button
          >
          <vs-button
            color="danger"
            type="border"
            class="mt-4 ml-2"
            @click="handleCloseConfirm"
            >Cancel</vs-button
          >
        </vs-col>
      </vs-row>
    </CustomPopup>
  </div>
</template>

<script>
import domtoimage from 'dom-to-image'
import ManageImage from '@/components/manageimage/ManageImage.vue'
import Prism from 'vue-prism-component'
import CustomPopup from '@/components/tutorial/CustomPopup.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ManageImage,
    CustomPopup,
    Prism
  },
  data() {
    return {
      selected: null,
      content: '',
      name: '',
      description: '',
      thumbnail: '',
      itemsPerPage: 10,
      isMounted: false,
      editorPopup: false,
      confirmPopup: false,
      config: {
        toolbarButtons: [
          'fullscreen',
          'bold',
          'italic',
          'underline',
          'strikeThrough',
          'subscript',
          'superscript',
          '|',
          'fontFamily',
          'fontSize',
          'color',
          'inlineClass',
          'inlineStyle',
          'paragraphStyle',
          'lineHeight',
          '|',
          'paragraphFormat',
          'align',
          'formatOL',
          'formatUL',
          'outdent',
          'indent',
          'quote',
          '-',
          'insertLink',
          'insertImage',
          'insertTable',
          '|',
          'emoticons',
          'fontAwesome',
          'specialCharacters',
          'insertHR',
          'selectAll',
          'clearFormatting',
          'help',
          'html',
          '|',
          'undo',
          'redo'
        ],
        imageInsertButtons: ['imageManager'],
        imageEditButtons: [
          'imageReplace',
          'imageAlign',
          'imageRemove',
          '|',
          'imageLink',
          'linkOpen',
          'linkEdit',
          'linkRemove',
          '-',
          'imageDisplay',
          'imageStyle',
          'imageAlt',
          'imageSize'
        ],
        key: '1C%kZV[IX)_SL}UJHAEFZMUJOYGYQE[\\ZJ]RAe(+%$==',
        attribution: false,
        heightMin: 250,
        zIndex: 100000,
        placeholderText: 'Edit tutorial content here',
        charCounterCount: true,
        fontFamilySelection: true,
        fontSizeSelection: true,
        paragraphFormatSelection: true,
        events: {
          initialized: function() {
            console.log('initialized')
          }
        }
      },
      title: ''
    }
  },
  computed: {
    ...mapGetters(['tutorials', 'currentTutorial']),
    currentPage() {
      if (this.isMounted) {
        return this.$refs.table.currentx
      }
      return 0
    }
  },
  methods: {
    ...mapActions([
      'getTutorials',
      'getTutorial',
      'createTutorial',
      'updateTutorial'
    ]),
    resetTutorial() {
      this.content = ''
      this.name = ''
      this.description = ''
      this.thumbnail = ''
    },
    closePopup() {
      this.editorPopup = false
      this.resetTutorial()
    },
    openPopup() {
      this.editorPopup = true
    },
    handleCloseConfirm() {
      this.confirmPopup = false
      this.editorPopup = true
      // this.$vs.dialog({
      //   type: 'confirm',
      //   color: 'danger',
      //   title: `Confirm`,
      //   text: `Do you want to create new tutorial ?`,
      //   accept: this.handleAddConfirm,
      //   cancel: this.openPopup
      // })
    },
    handleAdd() {
      this.closePopup()
      this.confirmPopup = true
      var contentNode = document.getElementById('content')
      domtoimage
        .toPng(contentNode)
        .then(dataUrl => {
          this.thumbnail = dataUrl
        })
        .catch(error => {
          console.error('oops, something went wrong!', error)
        })
    },
    handleUpdate() {
      this.updatePrompt = false
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `Do you want to update this category ?`,
        accept: this.handleUpdatedConfirm
      })
    },
    handleStatus(category) {
      this.selected = JSON.parse(JSON.stringify(category))
      const actionMsg = category.active ? 'lock' : 'unlock'
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `This action could be affect to other parts. Do you want to ${actionMsg} this category ?`,
        accept: this.handleStatusConfirm
      })
    },
    async handleAddConfirm() {
      console.log(this.currentTutorial.content)
      // await this.handleCallAPI(this.createCategory, { name: this.name })
      // this.$vs.notify({
      //   title: 'Information',
      //   text: 'Category created',
      //   color: 'success',
      //   position: 'top-right'
      // })
    },
    async handleUpdatedConfirm() {
      this.selected.name = this.updateName
      await this.handleCallAPI(this.updateCategory, this.selected)
      this.$vs.notify({
        title: 'Information',
        text: 'Category updated',
        color: 'success',
        position: 'top-right'
      })
    },
    async handleStatusConfirm() {
      this.selected.active = !this.selected.active
      await this.handleCallAPI(this.updateCategory, this.selected)
      this.$vs.notify({
        title: 'Information',
        text: 'Category status updated',
        color: 'success',
        position: 'top-right'
      })
    }
  },
  async created() {
    await this.handleCallAPI(this.getTutorials, null)
  },
  mounted() {
    this.isMounted = true
  }
}
</script>

<style lang="scss" scoped>
/deep/ .vs-popup {
  width: 300px;
}

.action-icon:hover {
  color: mediumslateblue;
}

#custom-popup {
  z-index: 51100;
}
</style>
