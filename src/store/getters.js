const getters = {
  // USER
  accessToken: state => state.accessToken,
  activeUser: state => state.activeUser,

  // ACCOUNT
  accounts: state => state.accounts,

  // CATEGORY
  categories: state => state.categories
}

export default getters
