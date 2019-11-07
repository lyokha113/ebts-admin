import Vue from "vue";
import Router from "vue-router";
import store from "@/store/store";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: "",
      component: () => import("./layouts/main/Main.vue"),
      children: [
        // =============================================================================
        // Theme Routes
        // =============================================================================
        {
          path: "/",
          name: "home",
          component: () => import("./views/Home.vue")
        },
        {
          path: "/page2",
          name: "page2",
          component: () => import("./views/Page2.vue")
        }
      ]
    },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    {
      path: "",
      component: () => import("@/layouts/full-page/FullPage.vue"),
      children: [
        // =============================================================================
        // PAGES
        // =============================================================================
        {
          path: "/login",
          name: "pageLogin",
          component: () => import("@/views/login/Login.vue")
        },
        {
          path: "/pages/error-404",
          name: "pageError404",
          component: () => import("@/views/pages/Error404.vue")
        }
      ]
    },
    // Redirect to 404 page, if no match found
    {
      path: "*",
      redirect: "/pages/error-404"
    }
  ]
});

router.afterEach(() => {
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

router.beforeEach((to, from, next) => {
  store.state.activeUser;
  if (to.path === "/login" || store.state.accessToken != null) {
    console.log("next");
    return next();
  }

  router.push({ path: "/login", query: { to: to.path } });
});

export default router;
