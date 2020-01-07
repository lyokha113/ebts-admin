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
            pageTitle: 'Account Management'
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
            pageTitle: 'Category Management'
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
            pageTitle: 'Tutorial Management'
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
            pageTitle: 'Image Management'
          }
        },
        {
          path: '/admin/template',
          name: 'Template',
          component: () => import('./views/admin/template/index.vue'),
          meta: {
            breadcrumb: [
              { title: 'Home', url: '/admin' },
              { title: 'Template', active: true }
            ],
            pageTitle: 'Template Management'
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
      path: '',
      component: () => import('./layouts/main/User.vue'),
      children: [
        {
          path: '/user/profile',
          name: 'User Profile',
          component: () => import('@/views/user/profile/index.vue'),
          meta: {
            permission: 2
          }
        },
        {
          path: '/user/image',
          name: 'User Image',
          component: () => import('@/views/user/userimage/index.vue'),
          meta: {
            permission: 2
          }
        },
        {
          path: '/user/workspace',
          name: 'Workspace',
          component: () => import('@/views/user/workspace/index.vue'),
          meta: {
            permission: 2
          }
        },
        {
          path: '/user/publish',
          name: 'Publish',
          component: () => import('@/views/user/publish/index.vue'),
          meta: {
            permission: 2
          }
        },
        {
          path: '/user/editor',
          name: 'Editor',
          component: () => import('@/views/user/editor/index.vue'),
          meta: {
            permission: 2
          }
        },
        {
          path: '/user/email',
          name: 'Email',
          component: () => import('@/views/user/email/index.vue'),
          meta: {
            permission: 2
          }
        },
        {
          path: '/user/password',
          name: 'Password',
          component: () => import('@/views/user/password/index.vue'),
          meta: {
            permission: 2
          }
        },
        {
          path: '/',
          name: 'Home',
          component: () => import('@/views/home/index.vue'),
          meta: {
            guest: true
          }
        },
        {
          path: '/detail/:id',
          name: 'Detail',
          component: () => import('@/views/detail/index.vue'),
          props: true,
          beforeEnter(to, from, next) {
            const isValidId = Number.isInteger(Number(to.params.id))
            if (isValidId) next()
            else next('/')
          },
          meta: {
            guest: true
          }
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
        {
          path: '/login',
          name: 'Login',
          component: () => import('@/views/login/index.vue')
        },
        {
          path: '/register',
          name: 'Register',
          component: () => import('@/views/register/index.vue')
        },
        {
          path: '/404',
          name: '404',
          component: () => import('@/views/404/index.vue')
        },
        {
          path: '/401',
          name: '401',
          component: () => import('@/views/401/index.vue')
        },
        {
          path: '/oauth2',
          name: 'oauth2',
          component: () => import('@/views/oauth2/index.vue')
        },
        {
          path: '/confirm/useremail',
          name: 'Confirm Useremail',
          component: () => import('@/views/confirm/useremail/index.vue')
        },
        {
          path: '/confirm/account',
          name: 'Confirm Account',
          component: () => import('@/views/confirm/account/index.vue')
        }
      ],
      meta: {
        permitAll: true
      }
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})

const validateToken = async () => {
  try {
    if (store.getters.accessToken && !store.getters.activeUser) {
      await store.dispatch('getInfo')
    } else if (!store.getters.accessToken) {
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

    if (store.getters.permission == 1) {
      return next('/admin')
    }

    if (store.getters.permission == 2) {
      return next()
    }
    return next('/401')
  }

  if (to.matched.some(record => record.meta.guest)) {
    await validateToken()
    if (store.getters.permission == 1) {
      return next('/admin')
    }
    return next()
  }
})

export default router
