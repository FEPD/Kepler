import util from '../loginPluginUtils.js'
Page({
  toLoginListener(event = {}){
    util.redirectPage(event.detail.url)
  },
  smsloginResListener(event = {}) {
    util.handleComponentRedirect(event.detail)
  },
  onLoad(options={}){
    let {
      token = null,
      nickname = '',
      url = ''
    } = options;
    this.setData({
      token,
      nickname,
      imgurl: decodeURIComponent(url),
    })
  }
})
