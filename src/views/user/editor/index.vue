<template>
  <div>
    <div id="editor"></div>
    <CustomPopup :active.sync="customPopup" />
  </div>
</template>

<script>
import grapesjs from 'grapesjs'
import grapesjsPresetNewsletter from 'grapesjs-preset-newsletter'
import CustomPopup from '@/components/CustomPopup.vue'
import configEditor from '@/components/editor/configEditor.js'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      editor: null,
      customPopup: false
    }
  },
  components: {
    CustomPopup
  },
  computed: {
    ...mapGetters(['accessToken', 'currentRaw'])
  },
  created() {
    if (!this.currentRaw) {
      this.$router.push('/user/workspace')
    }
  },
  mounted() {
    this.editor = grapesjs.init({
      container: '#editor',
      height: '890px',
      plugins: [grapesjsPresetNewsletter],
      pluginsOpts: {
        [grapesjsPresetNewsletter]: {
          modalTitleImport: 'Import template haha'
        }
      },
      components: this.currentRaw && this.currentRaw.content,
      storageManager: {
        id: '',
        type: 'remote',
        autosave: false,
        autoload: false,
        storeComponents: 1,
        storeStyles: 1,
        storeHtml: 1,
        storeCss: 1,
        urlStore: '',
        urlLoad: '',
        params: { param: '123' },
        headers: { Authorization: `Bearer ${this.accessToken}` },
        contentTypeJson: true
      }
    })

    configEditor(this.editor)
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import '~grapesjs/dist/css/grapes.min.css';
@import '~grapesjs-preset-newsletter/dist/grapesjs-preset-newsletter.css';

/deep/ .gjs-one-bg {
  background-color: #373d49;
}

/deep/ .gjs-pn-buttons.gjs-pn-views {
  justify-content: space-evenly;
}
</style>
