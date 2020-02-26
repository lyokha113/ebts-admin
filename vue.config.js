module.exports = {
  publicPath: '/',
  chainWebpack: config => {
    config.plugin('define').tap(definitions => {
      definitions[0] = Object.assign(definitions[0], {
        API_DOMAIN: JSON.stringify(process.env.VUE_APP_API_DOMAIN)
      })
      return definitions
    })
  }
}
