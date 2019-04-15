import util from '../util.js'
let plugin = requirePlugin("loginPlugin");
let config = util.getLoginConfig();

Page({
  data: {
    config
  },
  smsloginResListener(res = {}) {
    util.handleJump(res.detail)
  },
  getPhoneNumber(event = {}) {
    let {
      stopClick
    } = this.data;
    let { detail } = event;
    let { iv, encryptedData } = detail;
    plugin.clickLog({
      event,
      eid: 'WLogin_Diversion_Wechat',
    })
    if (!iv || !encryptedData) return
    if (stopClick) {
      wx.showToast({
        icon: 'none',
        title: '请不要重复点击'
      })
      return
    }
    this.setData({
      detail,
      stopClick: true
    })
    this.mobileLogin()
    plugin.clickLog({
      event,
      eid: 'WLogin_DiversionWechat_Allow',
    })
  },
  mobileLogin() {
    let {
      code,
      detail
    } = this.data;
    let {
      iv,
      encryptedData
    } = detail;
    if (!code || !iv || !encryptedData) return
    plugin.WXMobileLogin({
      iv,
      encryptedData,
      code,
    }).then(res => util.handleJump(res));
  },
  onLoad(options) {
    util.setLoginParamsStorage(options);
    plugin.setLog({ url: 'pages/login/index/index', pageId: 'WLogin_Diversion'})
    util.setCustomNavigation();
    wx.login({
      success: (res = {}) => {
        this.setData({
          code: res.code
        })
      }
    })
  },
  onShow(){
    plugin.pvLog()
  }
})