/* eslint-disable no-unused-vars */
import { login, googleAuth, register } from '@/service/user'
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
import router from '@/router'
import { removeToken, setToken, decodeToken } from '@/plugin/auth'
import { messaging } from 'firebase'

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
  // USER
  // ////////////////////////////////////////////

  async login({ commit, dispatch }, loginInfo) {
    const { data } = await login(loginInfo)
    if (data.success) {
      const token = data.data.accessToken.substring(7)
      const user = decodeToken(token)
      commit('SET_ACCESS_TOKEN', token)
      setToken(token)
      if (user.roleId == 1) {
        router.push('/admin')
      } else {
        router.push('/')
      }

      return user.roleId
    }

    dispatch('logout')
    this._vm.$vs.notify({
      title: 'Warning',
      text: 'Incorrect login information',
      color: 'warning',
      position: 'top-right'
    })
  },

  async googleAuth({ commit, getters }) {
    let popup = null

    const reciveMessage = event => {
      const { data } = event
      const params = new URLSearchParams(data)
      const error = params.get('error')
      if (error) {
        this._vm.$vs.notify({
          title: 'Warning',
          text: error,
          color: 'warning',
          position: 'top-right'
        })
      } else {
        const token = params.get('token').substring(7)
        commit('SET_ACCESS_TOKEN', token)
        setToken(token)
        router.push('/user')
      }
    }

    window.onmessage = () => {}
    const openSignInWindow = (url, name) => {
      const strWindowFeatures =
        'toolbar=no, menubar=no, width=600, height=700, top=100, left=100'
      if (popup === null || popup.closed) {
        popup = window.open(url, name, strWindowFeatures)
      } else {
        popup.focus()
      }
      window.onmessage = reciveMessage
    }

    const url = getters.api_local + googleAuth()
    openSignInWindow(url, 'Google')
  },

  async register({ dispatch }, registerInfo) {
    const { data } = await register(registerInfo)
    if (data.success) {
      const loginInfo = {
        email: registerInfo.email,
        password: registerInfo.password
      }
      dispatch('login', loginInfo)
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
      this.$vs.notify({
        title: 'Information',
        text: 'Account created',
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  async updateAccount({ commit }, account) {
    const { data } = await updateAccount(account)
    if (data.success) {
      commit('UPDATE_ACCOUNT', data.data)
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Account updated',
        color: 'success',
        position: 'top-right'
      })
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

  async getHomeCategories({ commit }) {
    const { data } = await getCategories()
    if (data.success) {
      commit('SET_HOME_CATEGORIES', data.data)
    }
  },

  async createCategory({ commit }, category) {
    const { data } = await createCategory(category)
    if (data.success) {
      commit('CREATE_CATEGORY', data.data)
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Category created',
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  async updateCategory({ commit }, category) {
    const { data } = await updateCategory(category)
    if (data.success) {
      commit('UPDATE_CATEGORY', data.data)
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Category updated',
        color: 'success',
        position: 'top-right'
      })
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
      this._vm.$vs.notify({
        title: 'Successfully',
        text: file.active ? 'File restored' : 'File deleted',
        color: 'success',
        position: 'top-right'
      })
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
      this._vm.$vs.notify({
        title: 'Information',
        text: `Tutorial created`,
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  async updateTutorial({ commit }, req) {
    const { data } = await updateTutorial(req.id, req.tutorial)
    if (data.success) {
      commit('UPDATE_TUTORIALS', data.data)
      this._vm.$vs.notify({
        title: 'Information',
        text: `Tutorial updated`,
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  async updateStatusTutorial({ commit }, tutorial) {
    const { data } = await updateStatusTutorial(tutorial.id, tutorial.active)
    if (data.success) {
      commit('UPDATE_TUTORIALS', data.data)
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Tutorial status updated',
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  }
}

export default actions
