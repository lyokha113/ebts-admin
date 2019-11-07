import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store'
import { async } from 'q'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: '',
      component: () => import('./layouts/main/Main.vue'),
      children: [
        // =============================================================================
        // Theme Routes
        // =============================================================================
        {
          path: '/',
          name: 'home',
          component: () => import('./views/Home.vue')
        },
        {
          path: '/page2',
          name: 'page2',
          component: () => import('./views/Page2.vue')
        }
      ]
    },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    {
      path: '',
      component: () => import('@/layouts/full-page/FullPage.vue'),
      children: [
        // =============================================================================
        // PAGES
        // =============================================================================
        {
          path: '/login',
          name: 'pageLogin',
          component: () => import('@/views/login/index.vue')
        },
        {
          path: '/404',
          name: 'page404',
          component: () => import('@/views/404/index.vue')
        }
      ]
    },
    // Redirect to 404 page, if no match found
    {
      path: '*',
      redirect: '/404'
    }
  ]
})

router.afterEach(() => {
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

router.beforeEach(async (to, from, next) => {
  if (to.path === '/login' || store.getters.activeUser != null) {
    return next()
  } else {
    try {
      console.log(store.getters.accessToken)
      if (store.getters.accessToken) {
        await store.dispatch('getInfo')
        return next({ ...to, replace: true })
      } else {
        await store.dispatch('logout')
        return next(`/login`)
      }
    } catch (error) {
      await store.dispatch('logout')
      return next(`/login`)
    }
  }
})

export default router
