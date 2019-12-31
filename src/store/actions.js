/* eslint-disable no-unused-vars */
import { login, googleAuth, register } from '@/service/user'
import { rate } from '@/service/rating'

import {
  getAccounts,
  createAccount,
  updateAccount,
  updateAccountStatus
} from '@/service/account'

import {
  getCategories,
  getCategoriesWithTemplates,
  createCategory,
  updateCategory
} from '@/service/category'

import {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate
} from '@/service/template'

import { getFiles, createFile, changeStatusFile } from '@/service/file'

import {
  getTutorials,
  getTutorial,
  createTutorial,
  updateTutorial,
  updateStatusTutorial
} from '@/service/tutorial'

import {
  getPublishes,
  createPublish,
  denyPublish,
  approvePublish
} from '@/service/publish'

import {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace
} from '@/service/workspace'

import {
  getRawTemplate,
  createRawTemplate,
  updateRawTemplate,
  changeVersion,
  deleteRawTemplate
} from '@/service/rawtemplate'

import { updateVersionContent } from '@/service/version'

import router from '@/router'
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
        if (loginInfo.page == 'workspace') {
          router.push('/user/workspace')
        } else if (loginInfo.page && loginInfo.page.includes('detail')) {
          router.push(`/${loginInfo.page.replace('-', '/')}`)
        } else {
          router.push('/')
        }
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
      const token = params.get('token')
      if (error) {
        this._vm.$vs.notify({
          title: 'Warning',
          text: error,
          color: 'warning',
          position: 'top-right'
        })
      } else if (token) {
        commit('SET_ACCESS_TOKEN', token)
        setToken(token)
        router.push('/user/workspace/')
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

    const url = process.env.VUE_APP_API_DOMAIN_LOCAL + googleAuth()
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

  async updateAccountStatus({ commit }, account) {
    const { data } = await updateAccountStatus(account.id, account.active)
    if (data.success) {
      commit('UPDATE_ACCOUNT', data.data)
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Account status updated',
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

  async getCategoriesWithTemplates({ commit }) {
    const { data } = await getCategoriesWithTemplates()
    if (data.success) {
      commit('SET_CATEGORIES_WITH_TEMPLATES', data.data)
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
  // TEMPLATES
  // ////////////////////////////////////////////

  async getTemplates({ commit }) {
    const { data } = await getTemplates()
    if (data.success) {
      commit('SET_TEMPLATES', data.data)
    }
  },

  async getTemplate({ commit }, id) {
    const { data } = await getTemplate(id)
    if (data.success) {
      commit('SET_CURRENT_TEMPLATE', data.data)
      return data.data
    }
  },

  async createTemplate({ commit }, template) {
    const { data } = await createTemplate(template)
    if (data.success) {
      commit('CREATE_TEMPLATE', data.data)
      this._vm.$vs.notify({
        title: 'Information',
        text: `Template created`,
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  async updateTemplate({ commit }, template) {
    const { data } = await updateTemplate(template)
    if (data.success) {
      commit('UPDATE_TEMPLATE', data.data)
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Template updated',
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  async deleteTemplate({ commit }, id) {
    const { data } = await deleteTemplate(id)
    if (data.success) {
      commit('DELETE_TEMPLATE', id)
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Template deleted',
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  // ////////////////////////////////////////////
  // RATING
  // ////////////////////////////////////////////

  async rate({ commit }, req) {
    const { data } = await rate(req)
    if (data.success) {
      this._vm.$vs.notify({
        title: 'Successfully',
        text: `Rate successfully`,
        color: 'success',
        position: 'top-right'
      })

      return data.data
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
    return data.data
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
  },

  // ////////////////////////////////////////////
  // PUBLISH
  // ////////////////////////////////////////////
  async getPublishes({ commit }) {
    const { data } = await getPublishes()
    if (data.success) {
      commit('SET_PUBLISHES', data.data)
    }
  },

  async createPublish({ commit }, content) {
    const { data } = await createPublish(content)
    if (data.success) {
      this._vm.$vs.notify({
        title: 'Request has been sent',
        text: `Processing could be take some time. Your publish request will approve later`,
        color: 'success',
        position: 'top-right'
      })
      router.push('/user/publish/')
    }
  },

  async denyPublish({ commit }, id) {
    const { data } = await denyPublish(id)
    if (data.success) {
      commit('UPDATE_PUBLISH', data.data)
      this._vm.$vs.notify({
        title: 'Request has been sent',
        text: `Pulish denied`,
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  async approvePublish({ commit }, publish) {
    const { data } = await approvePublish(publish)
    if (data.success) {
      commit('UPDATE_PUBLISH', data.data)
      this._vm.$vs.notify({
        title: 'Request has been sent',
        text: `Proccesing could be take some time to re-calculate duplication rate. Please wait until it done to get newest infromation.`,
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  async setPublish({ commit }, publish) {
    commit('SET_PUBLISHES', publish)
  },

  // ////////////////////////////////////////////
  // WORKSPACE
  // ////////////////////////////////////////////
  async getWorkspaces({ commit }) {
    const { data } = await getWorkspaces()
    if (data.success) {
      commit('SET_WORKSPACES', data.data)
    }
  },

  async createWorkspace({ commit }, workspace) {
    const { data } = await createWorkspace(workspace)
    if (data.success) {
      commit('CREATE_WORKSPACE', data.data)
      this._vm.$vs.notify({
        title: 'Information',
        text: `Workspace created`,
        color: 'success',
        position: 'top-right'
      })
    }
    return data.data.id
  },

  async updateWorkspace({ commit }, workspace) {
    const { data } = await updateWorkspace(workspace)
    if (data.success) {
      commit('UPDATE_WORKSPACE', data.data)
      this._vm.$vs.notify({
        title: 'Information',
        text: `Workspace updated`,
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  async deleteWorkspace({ commit }, workspace) {
    const { data } = await deleteWorkspace(workspace.id)
    if (data.success) {
      commit('DELETE_WORKSPACE', workspace)
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Workspace deleted',
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  // ////////////////////////////////////////////
  // RAW TEMPLATE
  // ////////////////////////////////////////////
  async getRawTemplate({ commit }, id) {
    const { data } = await getRawTemplate(id)
    if (data.success) {
      commit('SET_CURRENT_RAW', data.data)
    }
  },

  async createRawTemplate({ commit }, raw) {
    const { data } = await createRawTemplate(raw)
    if (data.success) {
      commit('CREATE_RAW', data.data)
      this._vm.$vs.notify({
        title: 'Information',
        text: `Template created`,
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  async updateRawTemplate({ commit }, raw) {
    const { data } = await updateRawTemplate(raw)
    if (data.success) {
      commit('UPDATE_RAW', { data: data.data, currentWS: raw.currentWS })
      this._vm.$vs.notify({
        title: 'Information',
        text: `Template updated`,
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  async changeVersion({ commit }, id) {
    // const { data } = await deleteWorkspace(id)
    // if (data.success) {
    //   commit('DELETE_WORKSPACE', id)
    //   this._vm.$vs.notify({
    //     title: 'Information',
    //     text: 'Workspace deleted',
    //     color: 'success',
    //     position: 'top-right'
    //   })
    // }
    // return data.success
  },

  async deleteRawTemplate({ commit }, raw) {
    const { data } = await deleteRawTemplate(raw.id)
    if (data.success) {
      commit('DELETE_RAW', raw)
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Template deleted',
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  // ////////////////////////////////////////////
  // VERSION
  // ////////////////////////////////////////////
  async updateVersionContent({ commit }, version) {
    const { data } = await updateVersionContent(version)
    if (data.success) {
      commit('SAVE_CONTENT', version.content)
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Template saved',
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  }
}

export default actions
