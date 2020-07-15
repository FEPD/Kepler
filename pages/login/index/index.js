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
    wx.showLoading({
      title: '加载中',
    })
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

    const startClick = () => {
      wx.hideLoading();
      this.setData({
        stopClick: false
      })
    }
    plugin.WXMobileLogin({
      iv,
      encryptedData,
      code,
    }).then(res => {
      if(res.err_code==32) return plugin.loginRequest({})
      if(res.err_code==124) return this.getWxcode(); // 风控提示用户去浏览器解除 重新获取code
      return res;
    }).then(res=>{
      let { pt_key,rsa_modulus, guid } = res;
      if (!pt_key&&rsa_modulus&&guid){ // login 返回
        res.pluginUrl = plugin.formatPluginPage('main')
      }
      // startClick()
      util.handleJump(res)
    }).catch(res => {
      startClick()
      console.jdLoginLog(res)
    }); 

  },
  getWxcode(){
    wx.login({
      success: (res = {}) => {
        console.log('页面的wxcode',res.code)
        this.setData({
          code: res.code
        })
      }
    })
  },
  onLoad(options) {
    let { riskFail } = options
    this.setData({
      config: util.getLoginConfig(options)
    })
    console.log(util.getLoginConfig(options))
    //风控失败不重置缓存
    if (!riskFail) {
      util.setLoginParamsStorage(options);
    }
    plugin.setLog({ url: 'pages/login/index/index', pageId: 'WLogin_Diversion'})
    util.setCustomNavigation();
    this.getWxcode();
  },
  onShow(){
    plugin.pvLog()
  }
})