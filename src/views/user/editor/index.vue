<template>
  <div id="editor"></div>
</template>

<script>
import grapesjs from 'grapesjs'
import grapesjsPresetNewsletter from 'grapesjs-preset-newsletter'
import grapesjsPluginExport from 'grapesjs-plugin-export'
export default {
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.editor = grapesjs.init({
      container: '#editor',
      height: '1000px',
      plugins: [grapesjsPresetNewsletter, grapesjsPluginExport],
      pluginsOpts: {
        grapesjsPresetNewsletter: {
          modalTitleImport: 'Import template'
        }
      }
    })

    this.editor.runCommand('gjs-export-zip')
  }
}
</script>

<style lang="scss" scoped>
@import '~grapesjs/dist/css/grapes.min.css';
@import '~grapesjs-preset-newsletter/dist/grapesjs-preset-newsletter.css';

/deep/ .gjs-one-bg {
  background-color: #373d49;
}

/deep/ .gjs-pn-buttons {
  justify-content: space-evenly;
}
</style>
