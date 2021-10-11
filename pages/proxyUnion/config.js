/* eslint-disable no-console */
const app = getApp();
// 二合一、三合一 页面path
const PagePath = {
  'CommonCoupon': 'common-coupon',
  'GiftCoupon': 'gift-coupon'
}

// 获取 跳转 二合一、三合一 页面路径
const getJumpUrl = function ({ type, spreadUrl, currentShare, url }) {
  const pagePath = PagePath[type]
  const query = `spreadUrl=${encodeURIComponent(spreadUrl)}&currentShare=${currentShare}&landingpage=${encodeURIComponent(url)}`
  const jumpUrl = `plugin-private://wx1edf489cb248852c/miniprogram_npm/@jdunion/unionPluginWx/pages/${pagePath}/${pagePath}?${query}`
  return jumpUrl;
}

// 记录联盟页面链接
let unionInfo = null;

const config = {
  isSubPackage: false,
  /**
   * 中间页onLoad的回调
   * @param {*} options 页面onLoad的形参
   * @param {*} plugin  联盟跟单插件实例
   */
  // eslint-disable-next-line no-unused-vars
  onLoad(options, plugin) {
    let logPluginName = wx.getStorageSync('logPluginName')
    if (!!logPluginName) {
      // 如果用埋点插件，需要执行该方法
      plugin.setLogPluginName(logPluginName)
    }
  },
  navigate: {
    /**
     * 跳转商详
     * @param {*} sku
     */
    toProduct(sku, plugin = wx) {
      console.log('=>>>>>toProduct')
      let toUrl = '/pages/product/product'
      if (!!config.isSubPackage) { // 分包路径
        toUrl = '/pages/login/kepler/product/product'
      }
      plugin.redirectTo({
        url: `${toUrl}?wareId=${sku}`
      })
    },
    /**
     * 跳转拼购商详
     * @param {*} sku
     */
    toPinGou(sku, url, plugin = wx) {
      console.log('=>>>>>toPinGou')
      console.log(url)
      let toUrl = '/pages/product/product'
      if (!!config.isSubPackage) { // 分包路径
        toUrl = '/pages/login/kepler/product/product'
      }
      plugin.redirectTo({ url: `${toUrl}?wareId=${sku}` })
    },
    /**
     * 跳转券品二合一页面
     * @param {*} param
     */
    toCommonCoupon({ spreadUrl, currentShare, url }) {
      const jumpUrl = getJumpUrl({type: 'CommonCoupon', spreadUrl, currentShare, url})
      unionInfo = {
        loginReturnPage: jumpUrl
      }
      wx.redirectTo({
        url: jumpUrl
      })
    },
    /**
     * 跳转券品礼金三合一页面
     * @param {*} param
     */
    toGiftCoupon({ spreadUrl, currentShare, url }) {
      let jumpUrl = getJumpUrl({type: 'GiftCoupon', spreadUrl, currentShare, url})
      jumpUrl = `${jumpUrl}&linkType=3`
      unionInfo = {
        loginReturnPage: jumpUrl
      }
      wx.redirectTo({
        url: jumpUrl
      })
    },
    /**
     * 跳转登录的实现
     * @param {*} returnPage 登录后的返回页面
     */
    toLogin(returnPage, plugin = wx) {
      console.log('Turbo Console Log: toLogin -> returnPage', returnPage)
      let loginReturnPage = unionInfo && unionInfo.loginReturnPage;
      loginReturnPage = `${loginReturnPage}&isMainBack=1`
      plugin.navigateTo({
        url: '/pages/login/index/index?returnPage=' + encodeURIComponent(loginReturnPage)
      })
    },
    /**
     * 未知类型的页面跳转
     * 默认逻辑判断是H5的页面就直接跳转登录插件提供的webview页
     * @param {*} url
     */
    toUnknownPage(url, tk) {
      config.handleError({});
      return;
      if(url && url.startsWith('/pages')) {
        // 原生页面直接跳转
        wx.redirectTo({
          url: `${url}&pagePath=${encodeURIComponent(url)}`
        })
      } else {
        const h5_url = config.customMethods.isJump() === 1 ? 'https://union-click.jd.com/jump?tk=' + tk : url
        // H5页面通过webview打开
        wx.redirectTo({
          url: '/pages/login/wv-common/wv-common?h5_url=' + encodeURIComponent(h5_url)
        })
        return
      }
    }
  },
  /**
   * 自定义传递给插件的方法，如获取登录Token等
   */
  customMethods: {
    env() {
      return undefined
    },
    isJump() {
      return 1
    },
    // 获取Token
    getAuthToken() {
      console.log('JDU: customMethods -> getAuthToken')
      return 'token'
    }
  },
  handleError({ code, message }) {
    // 联盟逻辑错误要跳转的兜底页
    const errorPage = app && app.globalData && app.globalData.errorPage
    if (!!errorPage) {
      wx.navigateTo({
        url: errorPage
      })
    }
    
  }
}

module.exports = config
