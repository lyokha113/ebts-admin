/* eslint-disable no-unused-vars */
import { login, loginGoogle } from '@/service/user'
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
  updateTutorial,
  updateStatusTutorial
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

  // ////////////////////////////////////////////
  // USER
  // ////////////////////////////////////////////

  async login({ commit, dispatch }, loginInfo) {
    const { data } = await login(loginInfo)
    if (data.success) {
      const token = data.data.accessToken.substring(7)
      const user = decodeToken(token)
      commit('SET_ACCESS_TOKEN', token)
      setToken(token)
      return user.roleId
    }

    dispatch('logout')
  },

  async loginGoogle({ commit, getters }) {
    let windowObjectReference = null
    let previousUrl = null
    const receiveMessage = event => {
      console.log(event)
    }
    const openSignInWindow = (url, name) => {
      window.removeEventListener('message', receiveMessage)

      const strWindowFeatures =
        'toolbar=no, menubar=no, width=600, height=700, top=100, left=100'

      if (windowObjectReference === null || windowObjectReference.closed) {
        windowObjectReference = window.open(url, name, strWindowFeatures)
      } else if (previousUrl !== url) {
        windowObjectReference = window.open(url, name, strWindowFeatures)
        windowObjectReference.focus()
      } else {
        windowObjectReference.focus()
      }

      window.addEventListener('message', event => receiveMessage(event), false)
      previousUrl = url

      const params = window.location.search
      if (window.opener) {
        console.log(params)
        window.opener.postMessage(params)
        window.close()
      }
      console.log(params)
    }

    const url = getters.api_local + loginGoogle()
    openSignInWindow(url, 'Google')
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
    return data.success
  },
  async updateAccount({ commit }, account) {
    const { data } = await updateAccount(account)
    if (data.success) {
      commit('UPDATE_ACCOUNT', data.data)
    }
    return data.success
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
    return data.success
  },
  async updateCategory({ commit }, category) {
    const { data } = await updateCategory(category)
    if (data.success) {
      commit('UPDATE_CATEGORY', data.data)
    }
    return data.success
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
    return data.success
  },
  async changeStatusFile({ commit }, file) {
    const { data } = await changeStatusFile(file.id, file.active)
    if (data.success) {
      commit('CHANGE_STATUS_FILE', file)
    }
    return data.success
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
      commit('CREATE_TUTORIAL', data.data)
    }
    return data.success
  },
  async updateTutorial({ commit }, req) {
    const { data } = await updateTutorial(req.id, req.tutorial)
    if (data.success) {
      commit('UPDATE_TUTORIALS', data.data)
    }
    return data.success
  },
  async updateStatusTutorial({ commit }, tutorial) {
    const { data } = await updateStatusTutorial(tutorial.id, tutorial.active)
    if (data.success) {
      commit('UPDATE_TUTORIALS', data.data)
    }
    return data.success
  }
}

export default actions
