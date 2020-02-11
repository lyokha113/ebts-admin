const mutations = {
  // ////////////////////////////////////////////
  // SIDEBAR & UI UX
  // ////////////////////////////////////////////

  UPDATE_SIDEBAR_WIDTH(state, width) {
    state.sidebarWidth = width
  },
  UPDATE_SIDEBAR_ITEMS_MIN(state, val) {
    state.sidebarItemsMin = val
  },
  TOGGLE_REDUCE_BUTTON(state, val) {
    state.reduceButton = val
  },
  TOGGLE_CONTENT_OVERLAY(state, val) {
    state.bodyOverlay = val
  },
  TOGGLE_IS_SIDEBAR_ACTIVE(state, value) {
    state.isSidebarActive = value
  },
  UPDATE_THEME(state, val) {
    state.theme = val
  },
  UPDATE_WINDOW_BREAKPOINT(state, val) {
    state.breakpoint = val
  },
  UPDATE_PRIMARY_COLOR(state, val) {
    state.themePrimaryColor = val
  },
  UPDATE_WINDOW_WIDTH(state, width) {
    state.windowWidth = width
  },

  // ////////////////////////////////////////////
  // USER
  // ////////////////////////////////////////////
  SET_ACCESS_TOKEN(state, token) {
    state.accessToken = token
  },
  SET_ACTIVE_USER(state, user) {
    state.activeUser = user
  },
  // ////////////////////////////////////////////
  // ACCOUNT
  // ////////////////////////////////////////////
  SET_ACCOUNTS(state, accounts) {
    state.accounts = accounts
  },
  CREATE_ACCOUNT(state, account) {
    state.accounts.unshift(account)
  },
  UPDATE_ACCOUNT(state, account) {
    const current = state.accounts.find(a => a.id === account.id)
    Object.assign(current, account)
  },

  // ////////////////////////////////////////////
  // CATEGORY
  // ////////////////////////////////////////////
  SET_CATEGORIES(state, categoriesNoTemplate) {
    state.categoriesNoTemplate = categoriesNoTemplate
  },
  SET_CATEGORIES_WITH_TEMPLATES(state, categoriesWithTemplates) {
    state.categoriesWithTemplates = categoriesWithTemplates
  },
  CREATE_CATEGORY(state, category) {
    state.categoriesNoTemplate.unshift(category)
  },
  UPDATE_CATEGORY(state, category) {
    const current = state.categoriesWithTemplates.find(
      c => c.id === category.id
    )
    Object.assign(current, category)
  },

  // ////////////////////////////////////////////
  // TEMPLATES
  // ////////////////////////////////////////////
  SET_TEMPLATES(state, templates) {
    state.templates = templates
  },
  SET_CURRENT_TEMPLATE(state, template) {
    state.currentTemplate = template
  },
  CREATE_TEMPLATE(state, template) {
    state.templates.unshift(template)
  },
  UPDATE_TEMPLATE(state, template) {
    const current = state.templates.find(c => c.id === template.id)
    Object.assign(current, template)
  },
  DELETE_TEMPLATE(state, id) {
    const idx = state.templates.findIndex(t => t.id == id)
    state.templates.splice(idx, 1)
  },

  // ////////////////////////////////////////////
  // FILES
  // ////////////////////////////////////////////
  SET_FILES(state, files) {
    state.files = files
  },
  CREATE_FILE(state, files) {
    state.files = state.files.concat(files)
  },
  CHANGE_STATUS_FILE(state, file) {
    const current = state.files.find(f => f.id === file.id)
    Object.assign(current, file)
  },

  // ////////////////////////////////////////////
  // TUTORIAL
  // ////////////////////////////////////////////
  SET_TUTORIALS(state, tutorials) {
    state.tutorials = tutorials
  },
  CREATE_TUTORIAL(state, tutorial) {
    state.tutorials.unshift(tutorial)
  },
  UPDATE_TUTORIALS(state, tutorial) {
    const current = state.tutorials.find(t => t.id === tutorial.id)
    Object.assign(current, tutorial)
  },

  // ////////////////////////////////////////////
  // PUBLISHES
  // ////////////////////////////////////////////
  SET_PUBLISHES(state, publishes) {
    state.publishes = publishes
  },
  UPDATE_PUBLISH(state, publish) {
    const current = state.publishes.find(p => p.id === publish.id)
    Object.assign(current, publish)
  },

  // ////////////////////////////////////////////
  // WORKSPACE
  // ////////////////////////////////////////////
  SET_WORKSPACES(state, workspaces) {
    state.workspaces = workspaces
  },
  CREATE_WORKSPACE(state, workspace) {
    state.workspaces.push(workspace)
  },
  UPDATE_WORKSPACE(state, workspace) {
    const current = state.workspaces.find(w => w.id === workspace.id)
    Object.assign(current, workspace)
  },
  DELETE_WORKSPACE(state, workspace) {
    const defaultWs = state.workspaces.find(w => w.name == 'Default workspace')
    const idx = state.workspaces.findIndex(w => w.id === workspace.id)
    const current = state.workspaces[idx]
    defaultWs.rawTemplates = [
      ...defaultWs.rawTemplates,
      ...current.rawTemplates
    ]
    state.workspaces.splice(idx, 1)
  },

  // ////////////////////////////////////////////
  // RAW TEMPLATE
  // ////////////////////////////////////////////
  SET_CURRENT_RAW(state, currentRaw) {
    state.currentRaw = currentRaw
  },
  CREATE_RAW(state, raw) {
    const ws = state.workspaces.find(w => w.id === raw.workspaceId)
    ws.rawTemplates.unshift(raw)
  },
  UPDATE_RAW(state, raw) {
    const curentWS = state.workspaces.find(w => w.id === raw.currentWS)
    const ws = state.workspaces.find(w => w.id === raw.data.workspaceId)

    if (ws.id == curentWS.id) {
      const current = ws.rawTemplates.find(r => r.id === raw.data.id)
      Object.assign(current, raw.data)
    } else {
      const idx = curentWS.rawTemplates.findIndex(r => r.id === raw.data.id)
      curentWS.rawTemplates.splice(idx, 1)
      ws.rawTemplates.unshift(raw.data)
    }
  },
  DELETE_RAW(state, raw) {
    const ws = state.workspaces.find(w => w.id === raw.workspaceId)
    const idx = ws.rawTemplates.findIndex(t => t.id == raw.id)
    ws.rawTemplates.splice(idx, 1)
  },

  // ////////////////////////////////////////////
  // VERSION
  // ////////////////////////////////////////////
  SAVE_CONTENT(state, content) {
    state.currentRaw.content = content
  },
  SET_EDITOR_CHANGE(state, status) {
    state.editorChange = status
  },

  // ////////////////////////////////////////////
  // USER EMAILS
  // ////////////////////////////////////////////
  SET_USER_EMAILS(state, userEmails) {
    state.userEmails = userEmails
  },
  CREATE_USER_EMAIL(state, userEmail) {
    state.userEmails.push(userEmail)
  },
  UPDATE_USER_EMAIL(state, userEmail) {
    const current = state.userEmails.find(e => e.id === userEmail.id)
    Object.assign(current, userEmail)
  },
  DELETE_USER_EMAIL(state, id) {
    const idx = state.userEmails.findIndex(e => e.id == id)
    state.userEmails.splice(idx, 1)
  }
}

export default mutations
