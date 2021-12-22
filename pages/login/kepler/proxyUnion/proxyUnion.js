/* eslint-disable no-undef */
const config = require('./config')
Page({
  data: {
    spreadUrl: ''
  },
  onLoad(options) {
    this.setData({
      options,
      customConfig: config
    })
    this.isSubPackage()
    this.proxyUnion = this.selectComponent('#proxyUnion');
    this.proxyUnion.methods.init(options, this);
  },
  onShow() {
  },
  isSubPackage() {
    let pageLists = getCurrentPages && getCurrentPages()
    let currentPath = pageLists[pageLists.length - 1] && pageLists[pageLists.length - 1].__route__
    console.log(currentPath)
    const isSubPackage = currentPath.indexOf('login/kepler/') !== -1 ? true : false
    config.isSubPackage = isSubPackage;
    this.config.currentPath = currentPath;
    this.config.customConfig.miniProgramSharePath = currentPath;
    return isSubPackage;
  },
  setUnpl(data) {
    this.proxyUnion.methods.setUnpl(data);
  },
  setJdv(data) {
    this.proxyUnion.methods.setJdv(data);
  },
  config
})
