import util from '../util.js'
let plugin = requirePlugin("loginPlugin");
let fm = require("../fm.min.js")
let config = util.getLoginConfig();

Page({
  data: {
    config,
    stopClick: false,
    checkboxChecked: !config.author
  },
  smsloginResListener(res = {}) {
    if(this.data.checkboxChecked){
      util.handleJump(res.detail)
    }else{
      this.showLoad();
    }
  },
  showLoad(){
    wx.showToast({
      title: '请阅读并勾选页面底部协议',
      icon: "none",
      duration: 3000
    })
  },
  changeCheckbox(e){
    this.setData({checkboxChecked: e.detail})
  },
  needAuthor(){
    if(!this.data.checkboxChecked){
      this.showLoad();
    };
  },
  getPhoneNumber(event = {}) {
    let {
      stopClick
    } = this.data;
    if (stopClick) {
      wx.showToast({
        icon: 'none',
        title: '请不要重复点击'
      })
      return
    }
    this.setData({
      stopClick: true
    })
    let { detail } = event;
    let { iv, encryptedData } = detail;
    plugin.clickLog({
      event,
      eid: 'WLogin_Diversion_Wechat',
    })
    if (!iv || !encryptedData) {
      this.setData({stopClick:false});
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      detail
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
      if ([32,33].indexOf(res.err_code)>=0) return plugin.loginRequest({})
      if (res.err_code == 124) return this.getWxcode(); // 风控提示用户去浏览器解除 重新获取code
      return res;
    }).then(res => {
      let { pt_key, rsa_modulus, guid } = res;
      if (!pt_key && rsa_modulus && guid) { // login 返回
        res.pluginUrl = plugin.formatPluginPage('main')
      }
      // startClick()
      util.handleJump(res)
    }).catch(res => {
      startClick()
      console.jdLoginLog(res)
    });

  },
  getWxcode() {
    wx.login({
      success: (res = {}) => {
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
    //风控失败不重置缓存
    if (!riskFail) {
      util.setLoginParamsStorage(options);
    }
    plugin.setLog({ url: 'pages/login/index/index', pageId: 'WLogin_Diversion' })
    util.setCustomNavigation();
    this.getWxcode();
    this.setFingerData()
  },
  setFingerData() {
    fm.config(this, { bizKey: plugin.bizKey });
    fm.init();
    fm.getEid((res = {}) => {
      plugin.setJdStorageSync('finger_tk', res.tk)
    })
  },
  // 拒绝协议
  reject(){
    let {rejectReturnPage, rejectPageType} = this.data.config;
    if(rejectReturnPage){
      wx[`${rejectPageType}` || 'rejectTo']({url:rejectReturnPage})
    }else{
      wx.navigateBack()
    }
  },
  onShow() {
    plugin.pvLog()
  }
})