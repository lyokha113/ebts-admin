const getters = {
  // APP
  sidebarWidth: state => state.sidebarWidth,
  api_local: state => state.api_local,
  api_aws: state => state.api_aws,

  // USER
  accessToken: state => state.accessToken,
  activeUser: state => state.activeUser,
  permission: state => state.activeUser && state.activeUser.roleId,
  user: state => state.user,

  // ACCOUNT
  accounts: state => state.accounts,

  // CATEGORY
  categoriesNoTemplate: state => state.categoriesNoTemplate,
  categoriesWithTemplates: state => state.categoriesWithTemplates,

  // TEMPLATES
  templates: state => state.templates,
  currentTemplate: state => state.currentTemplate,

  // FILE
  files: state => state.files,

  // TUTORIAL
  tutorials: state => state.tutorials,

  // PUBLISH
  publishes: state => state.publishes,

  // WORKSPACE
  workspaces: state => state.workspaces,

  // RAW TEMPLATE
  currentRaw: state => state.currentRaw
}

export default getters
