import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    // =============================================================================
    // ADMIN LAYOUT ROUTES
    // =============================================================================
    {
      path: '/admin',
      component: () => import('./layouts/main/Admin.vue'),
      children: [
        {
          path: '/admin/account',
          name: 'Account',
          component: () => import('./views/admin/account/index.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home', url: '/admin' },
              { title: 'Account', active: true }
            ],
            pageTitle: 'Account Management',
            permission: 1
          }
        },
        {
          path: '/admin/category',
          name: 'Category',
          component: () => import('./views/admin/category/index.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home', url: '/admin' },
              { title: 'Category', active: true }
            ],
            pageTitle: 'Category Management',
            permission: 1
          }
        },
        {
          path: '/admin/tutorial',
          name: 'Tutorial',
          component: () => import('./views/admin/tutorial/index.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home', url: '/admin' },
              { title: 'Tutorial', active: true }
            ],
            pageTitle: 'Tutorial Management',
            permission: 1
          }
        },
        {
          path: '/admin/image',
          name: 'Images',
          component: () => import('./views/admin/tutorial/imagemanagement.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home', url: '/admin' },
              { title: 'Tutorial', url: '/admin/tutorial' },
              { title: 'Image Management', active: true }
            ],
            pageTitle: 'Image Management',
            permission: 1
          }
        }
      ],
      meta: {
        permission: 1
      }
    },

    // =============================================================================
    // USER LAYOUT ROUTES
    // =============================================================================
    {
      path: '/user',
      component: () => import('./layouts/main/User.vue'),
      children: [],
      meta: {
        permission: 2
      }
    },

    // =============================================================================
    // GUEST LAYOUT ROUTES
    // =============================================================================
    {
      path: '',
      component: () => import('./layouts/main/Guest.vue'),
      children: []
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
          component: () => import('@/views/404/index.vue'),
          meta: {
            permitAll: true
          }
        },
        {
          path: '401',
          name: 'page401',
          component: () => import('@/views/401/index.vue'),
          meta: {
            permitAll: true
          }
        }
      ]
    }
    // {
    //   path: '*',
    //   redirect: '/404'
    // }
  ]
})

const validateToken = async () => {
  try {
    if (store.getters.accessToken) {
      await store.dispatch('getInfo')
    } else {
      await store.dispatch('logout')
    }
  } catch (error) {
    await store.dispatch('logout')
  }
}

router.afterEach(() => {
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') {
    await store.dispatch('logout')
    return next()
  }

  if (to.matched.some(record => record.meta.permitAll)) {
    return next()
  }

  if (to.matched.some(record => record.meta.permission == 1)) {
    await validateToken()
    if (store.getters.permission == 1) {
      return next()
    }
    return next('/401')
  }

  if (to.matched.some(record => record.meta.permission == 2)) {
    await validateToken()
    if (store.getters.permission == 2) {
      return next()
    }
    return next('/401')
  }

  if (to.matched.some(record => !record.meta.permission)) {
    await validateToken()
    if (store.getters.permission != 1) {
      return next()
    }
    return next('/401')
  }
})

export default router
