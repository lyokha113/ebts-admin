import Vue from 'vue'
import App from './App.vue'

// Vuesax Component Framework
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css' // Vuesax
Vue.use(Vuesax)

// Theme Configurations
import '../themeConfig.js'

// Globally Registered Components
import './globalComponents.js'

// Styles: SCSS
import './assets/scss/main.scss'

// Tailwind
import '@/assets/css/main.css'

// Vue Router
import router from './router'

// Vuex Store
import store from './store/store'

// Vuesax Admin Filters
import './filters/filters'

// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer)

// PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

import 'froala-editor/css/froala_editor.pkgd.min.css'

// Import and use Vue Froala lib.
import VueFroala from 'vue-froala-wysiwyg'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/js/plugins.pkgd.min'
Vue.use(VueFroala)

// Feather font icon
require('./assets/css/iconfont.css')

// Mixins
import mixins from '@/mixin.js'

// Filters
import filters from '@/filters.js'

// Moment
Vue.use(require('vue-moment'))

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
Vue.use(Loading)

Vue.config.productionTip = false

new Vue({
  filters,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.mixin(mixins)
