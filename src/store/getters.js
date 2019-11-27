const getters = {
  // APP
  sidebarWidth: state => state.sidebarWidth,
  api_local: state => state.api_local,
  api_aws: state => state.api_aws,

  // USER
  accessToken: state => state.accessToken,
  activeUser: state => state.activeUser,
  permission: state => state.activeUser && state.activeUser.roleId,

  // ACCOUNT
  accounts: state => state.accounts,

  // CATEGORY
  categories: state => state.categories,
  homeCategories: state => state.homeCategories,

  // FILE
  files: state => state.files,

  // TUTORIAL
  tutorials: state => state.tutorials
}

export default getters
