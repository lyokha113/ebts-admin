<template>
  <div>
    <vs-row class="mt-3 mb-1">
      <vs-col vs-type="flex" vs-w="12">
        <div class="flex flex-wrap-reverse items-center">
          <div
            class="p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-between text-lg font-medium text-base text-primary border border-solid border-primary"
            @click="handlePopup"
          >
            <feather-icon icon="PlusIcon" svg-classes="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Create new</span>
          </div>
        </div>
      </vs-col>
    </vs-row>
    <vs-row>
      <vs-col
        v-for="template in templates"
        :key="template.id"
        vs-type="flex"
        vs-justify="center"
        vs-align="center"
        vs-w="3"
      >
        <AdminTemplateList :template="template" />
      </vs-col>
    </vs-row>

    <CustomPopup
      id="create-popup"
      fullscreen
      title="Template"
      :active.sync="popup"
      button-close-hidden
    >
      <vx-card style="min-height: 500px; margin: auto">
        <vs-row class="mb-5" vs-align="center">
          <vs-col vs-type="flex" vs-align="center" vs-w="4">
            <span class="mr-3">Name:</span>
            <vs-input v-model="name" style="width: 400px" />
          </vs-col>
          <vs-col vs-type="flex" vs-align="center" vs-w="4">
            <span class="mr-3">Description:</span>
            <vs-input v-model="description" style="width: 400px" />
          </vs-col>
          <vs-col vs-type="flex" vs-align="center" vs-w="4">
            <span class="mr-3">Categories:</span>
            <multiselect
              v-model="categories"
              track-by="id"
              label="name"
              selectLabel=""
              selectedLabel=""
              deselectLabel=""
              group-values="categories"
              group-label="group"
              :options="categoriesNoTemplateSelect"
              :multiple="true"
              :close-on-select="false"
              :searchable="false"
            >
            </multiselect>
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
            Create
          </vs-button>
          <vs-button class="flex mx-2" type="gradient" @click="handlePreview"
            >Preview</vs-button
          >
          <vs-button type="border" class="flex mx-2" @click="popup = false"
            >Cancel</vs-button
          >
        </div>
      </vx-card>
    </CustomPopup>
  </div>
</template>

<script>
import AdminTemplateList from '@/components/template/AdminTemplateList'
import Prism from 'vue-prism-component'
import CustomPopup from '@/components/CustomPopup.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    CustomPopup,
    Prism,
    AdminTemplateList
  },
  data() {
    return {
      popup: false,
      content: '',
      name: '',
      description: '',
      categories: [],
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
    ...mapGetters([
      'activeUser',
      'accessToken',
      'templates',
      'categoriesNoTemplate'
    ]),
    categoriesNoTemplateSelect() {
      const active = this.categoriesNoTemplate.filter(c => c.active)
      const locked = this.categoriesNoTemplate.filter(c => !c.active)
      return [
        { group: 'Active', categories: active },
        { group: 'Locked', categories: locked }
      ]
    }
  },
  methods: {
    ...mapActions(['getTemplates', 'createTemplate']),
    handlePopup() {
      this.content = ''
      this.categories = []
      this.name = ''
      this.description = ''
      this.popup = true
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
    },
    async handleSubmit() {
      if (
        !this.name ||
        !this.description ||
        !this.content ||
        !this.categories.length
      ) {
        this.$vs.notify({
          title: 'Empty value',
          text: 'Please enter all information',
          color: 'warning',
          icon: 'error',
          position: 'top-right'
        })
        return
      }

      const template = {
        name: this.name,
        authorId: this.activeUser.id,
        content: this.content,
        description: this.description,
        categoryIds: this.categories.map(c => c.id)
      }

      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirm`,
        text: `Do you want to create this template ?`,
        accept: async () => {
          if (await this.handleCallAPI(this.createTemplate, template)) {
            this.popup = false
          }
        }
      })
    }
  },
  async mounted() {
    this.config.requestHeaders.AUTHORIZATION = `Bearer ${this.accessToken}`
  },
  destroyed() {
    this.popup = false
  }
}
</script>

<style lang="scss" scoped>
#create-popup {
  z-index: 51100;
}
/deep/ .multiselect {
  z-index: 100001;
}
</style>
