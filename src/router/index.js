import Vue from 'vue'
import Router from 'vue-router'
// import Store from '@/store'
import Category from '@/views/category'

Vue.use(Router)

// const ifAuthenticated = (to, from, next) => {
//   if (Store.getters.loggedUser) {
//     next()
//     return
//   }
//   next('/')
// }

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Category
    },
    {
      path: '*',
      name: '404',
      component: Category
    },
    {
      path: '/category',
      name: 'Category Management',
      component: Category
    }
    // {
    //   path: '/profile',
    //   name: 'profile',
    //   component: UserProfile,
    //   beforeEnter: ifAuthenticated
    // },
  ]
})
