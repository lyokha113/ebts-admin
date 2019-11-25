import { login } from '@/service/user'
import { getAccounts, createAccount, updateAccount } from '@/service/account'
import {
  getCategories,
  createCategory,
  updateCategory
} from '@/service/category'
import { getFiles, createFile, changeStatusFile } from '@/service/file'
import {
  getTutorials,
  getTutorial,
  createTutorial,
  updateTutorial
} from '@/service/tutorial'
import { removeToken, setToken, decodeToken } from '@/plugin/auth'

const actions = {
  // ////////////////////////////////////////////
  // SIDEBAR & UI UX
  // ////////////////////////////////////////////

  updateSidebarWidth({ commit }, width) {
    commit('UPDATE_SIDEBAR_WIDTH', width)
  },
  updateI18nLocale({ commit }, locale) {
    commit('UPDATE_I18N_LOCALE', locale)
  },
  toggleContentOverlay({ commit }) {
    commit('TOGGLE_CONTENT_OVERLAY')
  },
  updateTheme({ commit }, val) {
    commit('UPDATE_THEME', val)
  },
  updateUserRole({ commit }, val) {
    commit('UPDATE_USER_ROLE', val)
  },
  updateWindowWidth({ commit }, width) {
    commit('UPDATE_WINDOW_WIDTH', width)
  },

  // ////////////////////////////////////////////
  // COMPONENT
  // ////////////////////////////////////////////

  // VxAutoSuggest
  updateStarredPage({ commit }, payload) {
    commit('UPDATE_STARRED_PAGE', payload)
  },

  //  The Navbar
  arrangeStarredPagesLimited({ commit }, list) {
    commit('ARRANGE_STARRED_PAGES_LIMITED', list)
  },
  arrangeStarredPagesMore({ commit }, list) {
    commit('ARRANGE_STARRED_PAGES_MORE', list)
  },

  // ////////////////////////////////////////////
  // USER
  // ////////////////////////////////////////////

  async login({ commit, dispatch }, loginInfo) {
    const { data } = await login(loginInfo)
    if (data.success) {
      const token = data.data.accessToken.substring(7)
      const user = decodeToken(token)
      if (user.roleId == 1) {
        commit('SET_ACCESS_TOKEN', token)
        setToken(token)
      }
    } else {
      dispatch('logout')
    }
  },

  async getInfo({ commit, state }) {
    const user = decodeToken(state.accessToken)
    commit('SET_ACTIVE_USER', user)
  },

  async logout({ commit }) {
    commit('SET_ACCESS_TOKEN', null)
    commit('SET_ACTIVE_USER', null)
    removeToken()
  },

  // ////////////////////////////////////////////
  // ACCOUNT
  // ////////////////////////////////////////////
  async getAccounts({ commit }) {
    const { data } = await getAccounts()
    if (data.success) {
      commit('SET_ACCOUNTS', data.data)
    }
  },
  async createAccount({ commit }, account) {
    const { data } = await createAccount(account)
    if (data.success) {
      commit('CREATE_ACCOUNT', data.data)
    }
  },
  async updateAccount({ commit }, account) {
    const { data } = await updateAccount(account)
    if (data.success) {
      commit('UPDATE_ACCOUNT', data.data)
    }
  },

  // ////////////////////////////////////////////
  // CATEGORY
  // ////////////////////////////////////////////
  async getCategories({ commit }) {
    const { data } = await getCategories()
    if (data.success) {
      commit('SET_CATEGORIES', data.data)
    }
  },
  async createCategory({ commit }, category) {
    const { data } = await createCategory(category)
    if (data.success) {
      commit('CREATE_CATEGORY', data.data)
    }
  },
  async updateCategory({ commit }, category) {
    const { data } = await updateCategory(category)
    if (data.success) {
      commit('UPDATE_CATEGORY', data.data)
    }
  },

  // ////////////////////////////////////////////
  // FILES
  // ////////////////////////////////////////////
  async getFiles({ commit }) {
    const { data } = await getFiles()
    if (data.success) {
      commit('SET_FILES', data.data)
    }
  },
  async createFile({ commit }, uploader) {
    const { data } = await createFile(uploader.file, uploader.onUploadProgress)
    if (data.success) {
      commit('CREATE_FILE', data.data)
    }
  },
  async changeStatusFile({ commit }, file) {
    const { data } = await changeStatusFile(file.id, file.active)
    if (data.success) {
      commit('CHANGE_STATUS_FILE', file)
    }
  },

  // ////////////////////////////////////////////
  // TUTORIAL
  // ////////////////////////////////////////////
  async getTutorials({ commit }) {
    const { data } = await getTutorials()
    if (data.success) {
      commit('SET_TUTORIALS', data.data)
    }
  },
  async getTutorial({ commit }, id) {
    const { data } = await getTutorial(id)
    if (data.success) {
      return data.data
    }
  },
  async createTutorial({ commit }, tutorial) {
    const { data } = await createTutorial(tutorial)
    if (data.success) {
      commit('CREATE_CATEGORY', data.data)
    }
  },
  async updateTutorial({ commit }, tutorial) {
    const { data } = await updateTutorial(tutorial)
    if (data.success) {
      commit('UPDATE_TUTORIALS', data.data)
    }
  }
}

export default actions
