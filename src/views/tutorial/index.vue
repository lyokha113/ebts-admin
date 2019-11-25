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
            @click="handleContent(null)"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Create new</span>
          </div>
          <div
            class="p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-between text-lg font-medium text-base text-primary border border-solid border-primary"
            @click="$router.push('/image/')"
          >
            <span class="ml-2 text-base text-primary">Image Manage</span>
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
              <span class="action-icon mx-1" @click="handleContent(tr.id)">
                <vs-icon size="small" icon="create" />
              </span>

              <span class="action-icon mx-1" @click.stop="handleStatus(tr)">
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
      title="Tutorial content"
      :active.sync="contentPopup"
      buttonCloseHidden
    >
      <vx-card style="min-height: 350px; margin: auto">
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
          <vs-button class="flex mx-2" @click="handleDetail">Next</vs-button>
          <vs-button type="border" class="flex mx-2" @click="handleCloseContent"
            >Cancel</vs-button
          >
        </div>
      </vx-card>
    </CustomPopup>

    <CustomPopup
      fullscreen
      title="Tutorial detail"
      :active.sync="detailPopup"
      button-close-hidden
    >
      <vs-row>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
          <h2 class="mb-5">PREVIEW</h2>
        </vs-col>

        <vs-col
          id="content-container"
          vs-type="flex"
          vs-justify="center"
          vs-align="center"
          vs-w="12"
        >
          <froalaView id="content" class="py-2 px-" v-model="content" />
        </vs-col>
      </vs-row>

      <vs-divider border-style="dashed" class="my-3" />

      <vs-row>
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
          <vs-button color="primary" class="mt-4 mr-2" @click="handleSubmit">
            {{ isCreating ? 'Create' : 'Update' }}
          </vs-button>
          <vs-button
            color="danger"
            type="border"
            class="mt-4 ml-2"
            @click="handleBackToContent"
            >Back</vs-button
          >
        </vs-col>
      </vs-row>
    </CustomPopup>
  </div>
</template>

<script>
import Prism from 'vue-prism-component'
import CustomPopup from '@/components/CustomPopup.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    CustomPopup,
    Prism
  },
  data() {
    return {
      id: '',
      selected: null,
      content: '',
      name: '',
      description: '',
      thumbnail: '',
      itemsPerPage: 10,
      isMounted: false,
      isCreating: true,
      contentPopup: false,
      detailPopup: false,
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
        imageInsertButtons: ['imageBack', '|', 'imageUpload', 'imageManager'],
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
        quickInsertTags: [''],
        imageManagerLoadURL: 'http://localhost:5000/editor/file',
        imageManagerPageSize: 100,
        imageManagerDeleteURL: 'http://localhost:5000/editor/file',
        imageManagerDeleteMethod: 'DELETE',
        imageUploadURL: 'http://localhost:5000/editor/file',
        requestHeaders: {
          AUTHORIZATION: ''
        },
        key: '1C%kZV[IX)_SL}UJHAEFZMUJOYGYQE[\\ZJ]RAe(+%$==',
        attribution: false,
        heightMin: 250,
        zIndex: 100000,
        placeholderText: 'Edit tutorial content here',
        charCounterCount: true,
        fontFamilySelection: true,
        fontSizeSelection: true,
        paragraphFormatSelection: true
      }
    }
  },
  computed: {
    ...mapGetters(['accessToken', 'tutorials']),
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
      'updateTutorial',
      'updateStatusTutorial'
    ]),
    resetTutorial() {
      this.id = ''
      this.content = ''
      this.name = ''
      this.description = ''
      this.thumbnail = ''
      this.isCreating = true
    },
    handleCloseContent() {
      this.contentPopup = false
      this.resetTutorial()
    },
    handleBackToContent() {
      this.contentPopup = true
      this.detailPopup = false
    },
    handleDetail() {
      if (!this.content) {
        this.$vs.notify({
          title: 'Empty value',
          text: 'Please input tutorial content',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }

      this.contentPopup = false
      this.detailPopup = true
    },
    handleStatus(tutorial) {
      const actionMsg = tutorial.active ? 'lock' : 'unlock'
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `Do you want to ${actionMsg} this tutorial ?`,
        accept: () => this.handleStatusConfirm(tutorial)
      })
    },
    async handleStatusConfirm(tutorial) {
      tutorial.active = !tutorial.active
      await this.handleCallAPI(this.updateStatusTutorial, tutorial)
      this.$vs.notify({
        title: 'Information',
        text: 'Tutorial status updated',
        color: 'success',
        position: 'top-right'
      })
    },
    async handleContent(id) {
      if (id != null) {
        this.isCreating = false
        const tutorial = await this.getTutorial(id)
        this.id = id
        this.content = tutorial.content
        this.name = tutorial.name
        this.description = tutorial.description
      }
      this.contentPopup = true
    },
    async handleSubmit() {
      if (!this.name || !this.description) {
        this.$vs.notify({
          title: 'Empty value',
          text: 'Please input tutorial name and description',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }

      const contentNode = document.getElementById('content')
      this.thumbnail = await this.html2Image(contentNode)

      let tutorial = new FormData()
      tutorial.append('name', this.name)
      tutorial.append('content', this.content)
      tutorial.append('description', this.description)
      tutorial.append('thumbnail', this.base64ImageToBlob(this.thumbnail))
      tutorial.append('active', true)

      if (this.isCreating) {
        await this.handleCallAPI(this.createTutorial, tutorial)
      } else {
        const req = {
          id: this.id,
          tutorial: tutorial
        }
        await this.handleCallAPI(this.updateTutorial, req)
      }

      this.$vs.notify({
        title: 'Information',
        text: `Tutorial ${this.isCreating ? 'created' : 'upadted'} sucessfully`,
        color: 'success',
        position: 'top-right'
      })
      this.contentPopup = false
      this.detailPopup = false
    }
  },
  async created() {
    await this.handleCallAPI(this.getTutorials)
  },
  mounted() {
    this.isMounted = true
    this.config.requestHeaders.AUTHORIZATION = `Bearer ${this.accessToken}`
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
