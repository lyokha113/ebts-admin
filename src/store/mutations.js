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
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  SET_CATEGORIES_NO_TEMPLATE(state, categoriesNoTemplate) {
    state.categoriesNoTemplate = categoriesNoTemplate
  },
  CREATE_CATEGORY(state, category) {
    state.categories.unshift(category)
  },
  UPDATE_CATEGORY(state, category) {
    const current = state.categories.find(c => c.id === category.id)
    Object.assign(current, category)
  },

  // ////////////////////////////////////////////
  // TEMPLATES
  // ////////////////////////////////////////////
  SET_TEMPLATES(state, templates) {
    state.templates = templates
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
    state.currentRaw = raw
  },
  DELETE_RAW(state, raw) {
    const ws = state.workspaces.find(w => w.id === raw.workspaceId)
    const idx = ws.rawTemplates.findIndex(t => t.id == raw.id)
    ws.rawTemplates.splice(idx, 1)
  }
}

export default mutations
