let plugin = requirePlugin("loginPlugin");
let lgConfig;
try {
  lgConfig = require("./config.js");
} catch (err) {
  lgConfig = {};
}
let { config = {} } = lgConfig;

const utils = {
  redirectPage(url) {
    wx.redirectTo({
      url
    });
  },
  redirectToH5({ page, wvroute }) {
    let url = plugin.formH5Url({ page: decodeURIComponent(page), wvroute })
    utils.redirectPage(url)
  },
  navigateToH5({ page, wvroute }){
    let url = plugin.formH5Url({ page: decodeURIComponent(page), wvroute })
    wx.navigateTo({url})
  },
  setLoginParamsStorage(obj = {}) {
    /*
  首页存缓存逻辑（兼容不适用loginConfig直接存缓存）：
  同名参数优先级：url 中参数 > loginConfig > 缓存中
  */
    let storageConfig = plugin.getLoginParams();
    let loginParams = { ...storageConfig, ...config };
    if (plugin.isObject(obj)) {
      loginParams = { ...loginParams, ...obj }
    } else {
      console.jdLoginLog('登录参数必须为对象')
    }
    plugin.setLoginStorageSync(loginParams);
  },
  getLoginConfig() {
    return config
  },
  handleJump(p = {}) {
    let { goback, pluginUrl, riskUrl } = p;
    if (goback) {
      goback && utils.goBack();
      return
    }
    if (pluginUrl) {
      utils.redirectPage(pluginUrl);
      return
    }
    riskUrl && utils.redirectToH5({ page: riskUrl })
  },
  goBack() {
    let params = plugin.getLoginParams(),
      { returnPage, pageType } = params;
    if (!returnPage) {
      wx.showToast({
        title: '没有returnPage，无法跳转',
        icon: 'none'
      })
      return
    }
    if (pageType !== 'h5') {
      returnPage = decodeURIComponent(returnPage);
    }
    switch (pageType) {
      case 'switchTab':
        wx.switchTab({
          url: returnPage
        })
        break
      case 'h5':
        utils.redirectToH5({ page: returnPage })
        break
      case 'reLaunch':
        wx.reLaunch({ url: returnPage })
        break
      default:
        utils.redirectPage(returnPage)
    }
    plugin.gobackLog();
  },
  h5Init(options) {
    let p = plugin.getLoginParams();
    if (plugin.isEmptyObj(p)) utils.setLoginParamsStorage(options)
  },
  setCustomNavigation() {
    let { navigationBarColor, navigationBarTitle } = plugin.getLoginParams();
    plugin.isObject(navigationBarColor) && wx.setNavigationBarColor(navigationBarColor);
    plugin.isObject(navigationBarTitle) && wx.setNavigationBarTitle(navigationBarTitle);
  }
}

export default utils
