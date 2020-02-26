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
            <feather-icon icon="PlusIcon" svg-classes="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Create new</span>
          </div>
          <div
            class="p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-between text-lg font-medium text-base text-primary border border-solid border-primary"
            @click="$router.push('/admin/image').catch(err => {})"
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
            <feather-icon icon="ChevronDownIcon" svg-classes="h-4 w-4" />
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
          <vs-tr v-for="(tr, indextr) in data" :key="indextr" :data="tr">
            <vs-td class="img-container">
              <img :src="tr.thumbnail" class="product-img" />
            </vs-td>

            <vs-td style="width: 300px">
              <p class="font-medium">{{ tr.name }}</p>
            </vs-td>

            <vs-td style="width: 400px; padding: 10px">
              <p>{{ tr.description }}</p>
            </vs-td>

            <vs-td>
              <vs-chip :color="tr.active ? 'success' : 'danger'">
                <vs-avatar :icon="tr.active ? 'done' : 'lock'" />
                {{ tr.active ? 'Active' : 'Locked' }}
              </vs-chip>
            </vs-td>

            <vs-td style="padding: 10px">
              <span class="action-icon mr-2" @click.stop="handleStatus(tr)">
                <vs-icon
                  size="small"
                  :icon="tr.active ? 'lock' : 'lock_open'"
                />
              </span>
              <span class="action-icon ml-2" @click="handleContent(tr.id)">
                <vs-icon size="small" icon="create" />
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
      :active.sync="popup"
      button-close-hidden
    >
      <vx-card style="min-height: 500px; margin: auto">
        <vs-row class="mb-5" vs-align="center">
          <vs-col vs-type="flex" vs-align="center" vs-w="3  ">
            <span class="mr-3">Tutorial name:</span>
            <vs-input v-model="name" placeholder="Name" />
          </vs-col>
          <vs-col vs-type="flex" vs-align="center" vs-w="3">
            <span class="mr-3">Tutorial description:</span>
            <vs-input v-model="description" placeholder="Description" />
          </vs-col>
          <vs-col
            id="file-uploader"
            style="margin-left: auto"
            vs-type="flex"
            vs-align="center"
            vs-w="6"
          >
            <input
              id="file"
              ref="uploader"
              type="file"
              accept=".gif,.jpg,.jpeg,.png"
              @click="e => (e.target.value = null)"
              @change="handleUpload"
            />
            <label for="file" class="btn-upload"
              ><span class="truncate mt-1">{{
                thumbnail ? thumbnail.name : 'Thumbnail'
              }}</span></label
            >
          </vs-col>
        </vs-row>

        <div>
          <froala
            id="edit"
            v-model="content"
            :tag="'textarea'"
            :config="config"
          ></froala>
          <vs-divider />
          <prism language="html">{{ content }}</prism>
        </div>
        <div class="flex justify-end mt-3">
          <vs-button class="flex mx-2" type="gradient" @click="handleSubmit">
            {{ isCreating ? 'Create' : 'Update' }}
          </vs-button>
          <vs-button class="flex mx-2" type="gradient" @click="handlePreview"
            >Preview</vs-button
          >
          <vs-button type="border" class="flex mx-2" @click="handleCloseContent"
            >Cancel</vs-button
          >
        </div>
      </vx-card>
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
      popup: false,
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
        imageManagerLoadURL: process.env.VUE_APP_API_DOMAIN + '/editor/file',
        imageManagerPageSize: 100,
        imageManagerDeleteURL: process.env.VUE_APP_API_DOMAIN + '/editor/file',
        imageManagerDeleteMethod: 'DELETE',
        imageUploadURL: process.env.VUE_APP_API_DOMAIN + '/editor/file',
        imageUploadParam: 'files',
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
    handleCloseContent() {
      this.popup = false
      this.id = ''
      this.content = ''
      this.name = ''
      this.description = ''
      this.thumbnail = ''
      this.isCreating = true
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
      this.popup = true
    },
    async handleSubmit() {
      if (!this.content || !this.name || !this.description) {
        this.$vs.notify({
          title: 'Empty value',
          text: 'Please input all tutorial information',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }

      let tutorial = new FormData()
      tutorial.append('name', this.name)
      tutorial.append('content', this.content)
      tutorial.append('description', this.description)
      if (this.thumbnail) {
        tutorial.append('thumbnail', this.thumbnail)
      }

      if (this.isCreating) {
        this.$vs.dialog({
          type: 'confirm',
          title: `Confirm`,
          text: `${
            !this.thumbnail
              ? "Thumbnail will be set to default if you don't select.\n"
              : ''
          } Please check all informations before create new tutorial.`,
          accept: async () => {
            if (await this.handleCallAPI(this.createTutorial, tutorial)) {
              this.handleCloseContent()
            }
          }
        })
      } else {
        const req = {
          id: this.id,
          tutorial: tutorial
        }
        this.$vs.dialog({
          type: 'confirm',
          title: `Confirm`,
          text: `Please check all informations before update tutorial.`,
          accept: async () => {
            if (await this.handleCallAPI(this.updateTutorial, req)) {
              this.handleCloseContent()
            }
          }
        })
      }
    },
    handleStatus(tutorial) {
      const actionMsg = tutorial.active ? 'lock' : 'unlock'
      this.$vs.dialog({
        type: 'confirm',
        title: `Confirm`,
        text: `Do you want to ${actionMsg} this tutorial ?`,
        accept: async () => {
          tutorial.active = !tutorial.active
          await this.handleCallAPI(this.updateStatusTutorial, tutorial)
        }
      })
    },
    handleUpload() {
      const selectedFiles = this.$refs.uploader.files[0]
      if (/image.*/.test(selectedFiles.type)) {
        this.thumbnail = selectedFiles
      } else {
        this.$vs.notify({
          title: 'File not supported',
          text: `Can't upload ${selectedFiles.name}`,
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
      }
    },
    handlePreview() {
      if (!this.content) {
        this.$vs.notify({
          title: 'Empty tutorial',
          text: 'Please enter tutorial before previewing',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }
      const preview = window.open('', '_blank')
      preview.document.write(this.content)
    }
  },
  async created() {
    await this.handleCallAPI(this.getTutorials)
  },
  mounted() {
    this.isMounted = true
    this.config.requestHeaders.AUTHORIZATION = `Bearer ${this.accessToken}`
  },
  destroyed() {
    this.popup = false
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

<style lang="scss" scoped>
/deep/ td.img-container {
  span {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
}
</style>
