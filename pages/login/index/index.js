import util from '../loginPluginUtils.js';
let plugin = requirePlugin("loginPlugin");
const CURRENT_URL = '/pages/login/index/index';
import {
  config
} from '../loginConfig.js'
Page({
  data: {
    config
  },
  smsloginResListener(event = {}) {
    util.handleComponentRedirect(event.detail)
  },
  getPhoneNumber(event = {}) {
    let {
      stopClick
    } = this.data;
    let { detail } = event;
    let { iv, encryptedData } = detail;
    if (!iv || !encryptedData) return
    if (stopClick) {
      wx.showToast({
        icon: 'none',
        title: '请不要重复点击'
      })
      return
    }
    this.setData({
      detail: event.detail,
      stopClick: true
    })
    this.mobileLogin()
    plugin.clickLog({
      event,
      eid: 'WLogin_Index_QuickLog',
      target: CURRENT_URL
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
      detail,
      code,
      callback: (res = {}) => {
        this.setData({
          stopClick: false
        })
        let {
          err_msg,
          url
        } = res;
        if (err_msg) {
          this.handleError({
            detail,
            err_msg
          });
        } else {
          util.handleComponentRedirect({
            url
          })
        }
      }
    });
  },
  onLoad(options) {
    util.setLoginParamsStorage(options);
    wx.login({
      success: (res = {}) => {
        this.setData({
          code: res.code
        })
      }
    })
  },
  onUnload(event) {
    plugin.clickLog({
      event,
      eid: 'WLogin_Mian_Close',
      target: CURRENT_URL
    })
  },
  handleError(params = {}) {
    let {
      err_msg,
      detail
    } = params
    wx.showModal({
      title: '提示',
      content: err_msg || '系统错误，请退出重试',
      success: (res) => {
        util.handleComponentRedirect(detail)
      }
    });
  }
})
