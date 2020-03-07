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
  getTemplatesByAuthor,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate
} from '@/service/template'

import {
  getFiles,
  createFile,
  changeStatusFile,
  changeAccessibleFile
} from '@/service/file'

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
  updateRawContent,
  deleteRawTemplate
} from '@/service/rawtemplate'

import {
  makeDraftGMail,
  makeDraftYahoo,
  makeDraftOutlook,
  sendEmail,
  sendEmailConfirm
} from '@/service/email'

import { updateUser } from '@/service/user'

import {
  getUserEmails,
  createUserEmail,
  deleteUserEmail
} from '@/service/useremail'

import {
  getUserBlocks,
  getUserBlock,
  createUserBlock,
  updateUserBlock,
  updateUserBlockContent,
  deleteUserBlock,
  synchronizeContent
} from '@/service/userblock'

import {
  createSession,
  getContributors,
  kickContributor,
  kickContributors,
  getSessionsForUser,
  getSessionForUser,
  leaveSession
} from '@/service/designsession'

import router from '@/router'
import { removeToken, setToken, decodeToken } from '@/plugins/auth'

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
  },

  async googleAuth({ commit, dispatch }, loginInfo) {
    const { data } = await googleAuth(loginInfo)
    if (data.success) {
      const token = data.data.accessToken.substring(7)
      commit('SET_ACCESS_TOKEN', token)
      setToken(token)
      if (loginInfo.page == 'workspace') {
        router.push('/user/workspace')
      } else if (loginInfo.page && loginInfo.page.includes('detail')) {
        router.push(`/${loginInfo.page.replace('-', '/')}`)
      } else {
        router.push('/')
      }
    } else {
      dispatch('logout')
    }
  },

  async register({ dispatch }, registerInfo) {
    const { data } = await register(registerInfo)
    if (data.success) {
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Account was created. Please check your email to confirm it.',
        color: 'success',
        position: 'top-right'
      })
      router.push('/login')
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
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Account was created',
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
        text: 'Account was updated',
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
        text: 'Account status was updated',
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
        text: 'Category was created',
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
        text: 'Category was updated',
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

  async getTemplatesByAuthor({ commit }, uuid) {
    const { data } = await getTemplatesByAuthor(uuid)
    if (data.success) {
      commit('SET_TEMPLATES_BY_AUTHOR', data.data)
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
        text: `Template was created`,
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
        text: 'Template was updated',
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
        text: 'Template was deleted',
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
        text: file.active ? 'File was restored' : 'File was deleted',
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  async changeAccessibleFile({ commit }, file) {
    const { data } = await changeAccessibleFile(file.id, file.open)
    if (data.success) {
      commit('CHANGE_STATUS_FILE', file)
      this._vm.$vs.notify({
        title: 'Successfully',
        text: file.open
          ? 'File was changed to public'
          : 'File was changed to private',
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
        text: `Tutorial was created`,
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
        text: `Tutorial was updated`,
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
        text: 'Tutorial status was updated',
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
        text: `Workspace was created`,
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
        text: `Workspace was updated`,
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
        text: 'Workspace was deleted',
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
        text: `Template was created`,
        color: 'success',
        position: 'top-right'
      })
      return data.data.id
    }
    return null
  },

  async updateRawTemplate({ commit }, raw) {
    const { data } = await updateRawTemplate(raw)
    if (data.success) {
      commit('UPDATE_RAW', { data: data.data, currentWS: raw.currentWS })
      this._vm.$vs.notify({
        title: 'Information',
        text: `Template was updated`,
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  async deleteRawTemplate({ commit }, raw) {
    const { data } = await deleteRawTemplate(raw.id)
    if (data.success) {
      commit('DELETE_RAW', raw)
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Template was deleted',
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  async updateRawContent({ commit }, raw) {
    const { data } = await updateRawContent(raw)
    if (data.success) {
      commit('SAVE_CONTENT', raw.content)
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Template was saved',
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  async autoUpdateRawContent({ commit }, raw) {
    const { data } = await updateRawContent(raw)
    if (data.success) {
      commit('SAVE_CONTENT', raw.content)
    }
    return data.success
  },

  async setEditorChange({ commit }, status) {
    commit('SET_EDITOR_CHANGE', status)
  },

  // ////////////////////////////////////////////
  // USER
  // ////////////////////////////////////////////

  async updateUser({ commit }, user) {
    const { data } = await updateUser(user)
    if (data.success) {
      commit('SET_ACTIVE_USER', data.data)
      this._vm.$vs.notify({
        title: 'Information',
        text: `Account was updated`,
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  // ////////////////////////////////////////////
  // EMAIL
  // ////////////////////////////////////////////

  async makeDraftGMail({ commit }, rawId) {
    const { data } = await makeDraftGMail(rawId)

    if (data.success) {
      let popup = null
      const openPopup = url => {
        if (popup === null || popup.closed) {
          popup = window.open(
            url,
            'Google Authorization',
            'toolbar=no, menubar=no, width=600, height=700, top=100, left=100'
          )
        }
        popup.focus()
      }

      const receiveMessage = event => {
        if (!event.data) {
          this._vm.$vs.notify({
            title: 'Information',
            text: 'Google Mail draft was created',
            color: 'success',
            position: 'top-right'
          })
        }
      }

      window.onmessage = () => {}
      window.onmessage = receiveMessage
      openPopup(data.data)
    }
  },

  async makeDraftYahoo({ commit }, request) {
    const { data } = await makeDraftYahoo(request)
    if (data.success) {
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Yahoo draft was created',
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  async makeDraftOutlook({ commit }, request) {
    const { data } = await makeDraftOutlook(request)
    if (data.success) {
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Outlook draft was created',
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  async sendEmail({ commit }, request) {
    const { data } = await sendEmail(request)
    if (data.success) {
      this._vm.$vs.notify({
        title: 'Information',
        text:
          'Mail was sent. Check all your mailbox and spam. Try again if you do not see them',
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  async sendEmailConfirm({ commit }, email) {
    const { data } = await sendEmailConfirm(email)
    if (data.success) {
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Mail was sent. Check all your mailbox and spam',
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  // ////////////////////////////////////////////
  // USER EMAIL
  // ////////////////////////////////////////////
  async userEmailWS({ commit }, message) {
    message = JSON.parse(message)
    commit('UPDATE_USER_EMAIL', message)
  },

  async getUserEmails({ commit }) {
    const { data } = await getUserEmails()
    if (data.success) {
      commit('SET_USER_EMAILS', data.data)
    }
  },

  async createUserEmail({ commit }, userEmail) {
    const { data } = await createUserEmail(userEmail)
    if (data.success) {
      commit('CREATE_USER_EMAIL', data.data)
      this._vm.$vs.notify({
        title: 'Information',
        text: `A email was sent to this email for confirmation. Please approve it. Re-add it if you don't get the email.`,
        color: 'success',
        position: 'top-right'
      })
    }

    return data.success
  },

  async deleteUserEmail({ commit }, id) {
    const { data } = await deleteUserEmail(id)
    if (data.success) {
      commit('DELETE_USER_EMAIL', id)
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Email was deleted',
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },

  // ////////////////////////////////////////////
  // USER BLOCK
  // ////////////////////////////////////////////

  async getUserBlocks({ commit }) {
    const { data } = await getUserBlocks()
    if (data.success) {
      commit('SET_USER_BLOCKS', data.data)
    }
  },

  async getUserBlock({ commit }, id) {
    const { data } = await getUserBlock(id)
    if (data.success) {
      commit('SET_CURRENT_USER_BLOCK', data.data)
      return data.data
    }
  },

  async createUserBlock({ commit }, userBlock) {
    const { data } = await createUserBlock(userBlock)
    if (data.success) {
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Block was created',
        color: 'success',
        position: 'top-right'
      })
      commit('CREATE_USER_BLOCK', data.data)
    }

    return data.success
  },
  async updateUserBlock({ commit }, userBlock) {
    const { data } = await updateUserBlock(userBlock)
    if (data.success) {
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Block was updated',
        color: 'success',
        position: 'top-right'
      })
      commit('UPDATE_USER_BLOCK', data.data)
    }

    return data.success
  },
  async deleteUserBlock({ commit }, id) {
    const { data } = await deleteUserBlock(id)
    if (data.success) {
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Block was deleted',
        color: 'success',
        position: 'top-right'
      })
      commit('DELETE_USER_BLOCK', id)
    }

    return data.success
  },
  async updateUserBlockContent({ commit }, block) {
    const { data } = await updateUserBlockContent(block)
    if (data.success) {
      commit('SAVE_USER_BLOCK_CONTENT', block.content)
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Block was saved',
        color: 'success',
        position: 'top-right'
      })
    }
    return data.success
  },
  async synchronizeContent({ commit }, request) {
    const { data } = await synchronizeContent(request)
    if (data.success) {
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Block content was synchronized to designs',
        color: 'success',
        position: 'top-right'
      })
    }

    return data.success
  },

  // ////////////////////////////////////////////
  // DESIGN SESSION
  // ////////////////////////////////////////////
  async invitationWS({ commit }, message) {
    message = JSON.parse(message)
    if (message.command == 'add') {
      commit('INVITE_SESSION', message.data)
    } else if (message.command == 'remove') {
      commit('LEAVE_SESSION', message.data)
    }
  },

  async rawWS({ commit, getters }, message) {
    message = JSON.parse(message)
    if (message.command == 'contributor') {
      commit('ON_OFF_SESSION', message.data)
    } else if (message.command == 'leave') {
      commit('KICK_CONTRIBUTOR', message.data)
    } else if (message.command == 'edit') {
      if (getters.activeUser.id == message.data.owner) {
        commit('SAVE_CONTENT', message.data.content)
      } else {
        commit('SAVE_CURRENT_SESSION_CONTENT', message.data.content)
      }
    }
  },

  async getContributors({ commit }, id) {
    const { data } = await getContributors(id)
    if (data.success) {
      commit('SET_SESSIONS_CONTRIBUTOR', data.data)
    }
  },

  async createSession({ commit }, session) {
    const { data } = await createSession(session)
    if (data.success) {
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Invitation was sent',
        color: 'success',
        position: 'top-right'
      })
      commit('CREATE_SESSIONS', data.data)
    }

    return data.success
  },

  async kickContributors({ commit }, rawId) {
    const { data } = await kickContributors(rawId)
    if (data.success) {
      this._vm.$vs.notify({
        title: 'Information',
        text: 'All contributors were kicked',
        color: 'success',
        position: 'top-right'
      })
      commit('SET_SESSIONS_CONTRIBUTOR', [])
    }

    return data.success
  },

  async kickContributor({ commit }, request) {
    const { data } = await kickContributor(request.rawId, request.contributorId)
    if (data.success) {
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Contributor was kicked',
        color: 'success',
        position: 'top-right'
      })
      commit('KICK_CONTRIBUTOR', request.contributorId)
    }

    return data.success
  },

  async getSessionsForUser({ commit }) {
    const { data } = await getSessionsForUser()
    if (data.success) {
      commit('SET_SESSIONS', data.data)
    }
  },

  async getSessionForUser({ commit }, rawId) {
    const { data } = await getSessionForUser(rawId)
    if (data.success) {
      commit('SET_CURRENT_SESSION', data.data)
    }
  },

  async leaveSession({ commit }, id) {
    const { data } = await leaveSession(id)
    if (data.success) {
      this._vm.$vs.notify({
        title: 'Information',
        text: 'Design invitation was removed',
        color: 'success',
        position: 'top-right'
      })
      commit('LEAVE_SESSION', id)
    }
  }
}
export default actions
