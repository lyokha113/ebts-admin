<template>
  <div>
    <vs-row class="mt-3 mb-1">
      <vs-col vs-type="flex" vs-w="12">
        <div class="flex flex-wrap-reverse items-center">
          <div
            class="p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-between text-lg font-medium text-base text-primary border border-solid border-primary"
            @click="handlePopup"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
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
      buttonCloseHidden
    >
      <vx-card style="min-height: 500px; margin: auto">
        <vs-row class="mb-5" vs-align="center">
          <vs-col vs-type="flex" vs-align="center" vs-w="4">
            <span>Name: &nbsp;</span>
            <vs-input style="width: 400px" v-model="name" />
          </vs-col>
          <vs-col vs-type="flex" vs-align="center" vs-w="4">
            <span>Description: &nbsp;</span>
            <vs-input style="width: 400px" v-model="description" />
          </vs-col>
          <vs-col vs-type="flex" vs-align="center" vs-w="4">
            <span>Categories: &nbsp;</span>
            <vs-select v-model="categories" width="400px" multiple>
              <vs-select-item
                :key="item.id"
                :value="item.id"
                :text="item.name"
                v-for="item in categoriesNoTemplate"
              />
            </vs-select>
          </vs-col>
        </vs-row>
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
        imageManagerLoadURL: 'http://localhost:5000/editor/file',
        imageManagerPageSize: 100,
        imageManagerDeleteURL: `http://localhost:5000/editor/file`,
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
    ...mapGetters([
      'activeUser',
      'accessToken',
      'templates',
      'categoriesNoTemplate'
    ])
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
        !this.categories
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
        categoryIds: this.categories
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
    await this.handleCallAPI(this.getTemplates)
    this.config.requestHeaders.AUTHORIZATION = `Bearer ${this.accessToken}`
  }
}
</script>

<style lang="scss" scoped>
#create-popup {
  z-index: 51100;
}
</style>
