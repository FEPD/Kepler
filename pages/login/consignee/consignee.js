import util from '../loginPluginUtils.js'

Page({
  onLoad(options={}){
    this.setData({mobile: options.mobile})
  },
  gobackListener() {
    util.goBack()
  }
})
