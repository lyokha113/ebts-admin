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

// Font Awesome 4
import 'font-awesome/css/font-awesome.min.css'

// Vue Router
import router from './router'

// Vuex Store
import store from './store/store'

import './filters/filters'

// Feather font icon
require('./assets/css/iconfont.css')

// Mixins
import mixins from '@/mixin.js'

// Plugins
import '@/plugins'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.mixin(mixins)
