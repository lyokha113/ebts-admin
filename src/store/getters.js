const getters = {
  // app
  loginDialog: state => state.app.loginDialog,
  drawer: state => state.app.drawer,
  mainColor: state => state.app.mainColor,
  background: state => state.app.background,

  //category
  categories: state => state.category.categories
}
export default getters
