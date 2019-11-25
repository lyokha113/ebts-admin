const getters = {
  // USER
  accessToken: state => state.accessToken,
  activeUser: state => state.activeUser,

  // ACCOUNT
  accounts: state => state.accounts,

  // CATEGORY
  categories: state => state.categories,

  // FILE
  files: state => state.files,

  // TUTORIAL
  tutorials: state => state.tutorials
}

export default getters
