const state = {
  loginDialog: false,
  drawer: true,
  mainColor: 'success',
  background:
    'https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg'
}

const mutations = {
  SET_LOGIN_DIALOG: (state, payload) => {
    state.loginDialog = payload
  },
  SET_DRAWER: (state, payload) => {
    state.drawer = payload
  },
  SET_MAIN_COLOR: (state, payload) => {
    state.mainColor = payload
  },
  SET_BACKGROUND: (state, payload) => {
    state.background = payload
  }
}

const actions = {
  toggleLoginDialog({ commit }, payload) {
    commit('TOGGLE_LOGIN_DIALOG', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
