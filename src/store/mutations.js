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
    state.categoriesWithTemplates.unshift(category)
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
  SET_TEMPLATES_BY_AUTHOR(state, templatesByAuthor) {
    state.templatesByAuthor = templatesByAuthor
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
    const idx = state.templates.findIndex(t => t.id === id)
    if (idx != -1) {
      state.templates.splice(idx, 1)
    }
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
    if (idx != -1) {
      const current = state.workspaces[idx]
      defaultWs.rawTemplates = [
        ...defaultWs.rawTemplates,
        ...current.rawTemplates
      ]
      state.workspaces.splice(idx, 1)
    }
  },

  // ////////////////////////////////////////////
  // RAW TEMPLATE
  // ////////////////////////////////////////////
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
      if (idx != -1) {
        curentWS.rawTemplates.splice(idx, 1)
        ws.rawTemplates.unshift(raw.data)
      }
    }
  },
  DELETE_RAW(state, raw) {
    const ws = state.workspaces.find(w => w.id === raw.workspaceId)
    const idx = ws.rawTemplates.findIndex(t => t.id === raw.id)
    if (idx != -1) {
      ws.rawTemplates.splice(idx, 1)
    }
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
    const idx = state.userEmails.findIndex(e => e.id === id)
    if (idx != -1) {
      state.userEmails.splice(idx, 1)
    }
  },

  // ////////////////////////////////////////////
  // USER BLOCK
  // ////////////////////////////////////////////
  SET_USER_BLOCKS(state, userBlocks) {
    state.userBlocks = userBlocks
  },
  SET_CURRENT_USER_BLOCK(state, userBlock) {
    state.currentBlock = userBlock
  },
  CREATE_USER_BLOCK(state, userBlock) {
    state.userBlocks.push(userBlock)
  },
  UPDATE_USER_BLOCK(state, userBlock) {
    const current = state.userBlocks.find(ub => ub.id === userBlock.id)
    Object.assign(current, userBlock)
  },
  DELETE_USER_BLOCK(state, id) {
    const idx = state.userBlocks.findIndex(ub => ub.id === id)
    if (idx != -1) {
      state.userBlocks.splice(idx, 1)
    }
  },

  // ////////////////////////////////////////////
  // DESIGN SESSION
  // ////////////////////////////////////////////
  INVITE_SESSION(state, session) {
    state.sessions.unshift(session)
  },
  SET_SESSIONS(state, sessions) {
    state.sessions = sessions
  },
  LEAVE_SESSION(state, id) {
    const idx = state.sessions.findIndex(s => s.rawId === id)
    if (idx != -1) {
      state.sessions.splice(idx, 1)
    }
  },
  CREATE_CONTRIBUTOR(state, contributor) {
    state.contributors.push(contributor)
  },
  SET_CONTRIBUTOR(state, contributors) {
    state.contributors = contributors
  },
  KICK_CONTRIBUTOR(state, id) {
    const idx = state.contributors.findIndex(sc => sc.contributorId === id)
    if (idx != -1) {
      state.contributors.splice(idx, 1)
    }
  },
  SET_ONLINE(state, session) {
    if (session instanceof Array) {
      session.forEach(s => {
        const idx = state.contributors.findIndex(sc => sc.contributorId === s)
        if (idx != -1) {
          let current = state.contributors.splice(idx, 1)
          current[0].online = true
          state.contributors.unshift(current[0])
        }
      })
    } else {
      const idx = state.contributors.findIndex(
        sc => sc.contributorId === session.contributorId
      )
      if (idx != -1) {
        let current = state.contributors.splice(idx, 1)
        current[0].online = session.online
        state.contributors.unshift(current[0])
      }
    }
  },

  // ////////////////////////////////////////////
  // EDITOR
  // ////////////////////////////////////////////
  SET_EDITOR(state, raw) {
    state.editorRawId = raw.id
    state.editorContent = raw.content
  },
  SET_EDITOR_FILE(state, files) {
    state.editorFiles = files
  },
  SET_EDITOR_CONTRIBUTOR(state, session) {
    state.editorRawId = session.rawId
    state.editorOwnerId = session.ownerId
    state.editorContent = session.rawContent
    state.editorFiles = session.files
  },
  SAVE_EDITOR_CONTENT(state, content) {
    if (state.editorContent != content) {
      state.editorContent = content
    }
  },
  SAVE_USER_BLOCK_CONTENT(state, content) {
    state.currentBlock.content = content
  },
  SET_EDITOR_CHANGE(state, status) {
    state.editorChange = status
  },
  SET_FORCE_KICK(state, status) {
    state.forceKick = status
  },

  // ////////////////////////////////////////////
  // NOTIFICATION
  // ////////////////////////////////////////////
  SET_NOTIFICATIONS(state, notifications) {
    state.notifications = notifications
    state.newNoti = notifications.length
  },
  SET_ALL_NOTIFICATIONS(state, notifications) {
    state.notifications = notifications
  },
  ADD_NOTIFICATIONS(state, notification) {
    state.notifications.unshift(notification)
    state.newNoti++
  },
  LOAD_NOTIFICATIONS(state, id) {
    const current = state.notifications.find(n => n.id === id)
    Object.assign(current, { loaded: true })
    state.newNoti--
  }
}

export default mutations
