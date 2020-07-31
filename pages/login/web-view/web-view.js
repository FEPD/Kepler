import util from '../util.js'
let plugin = requirePlugin("loginPlugin");

Page({
  onLoad(options={}){
    let { token } = options;
    this.handleBackFromH5(token);
    util.setCustomNavigation();
  },
  handleBackFromH5(token) {
    plugin.tokenLogin({
      token,
    }).then((res ={}) => {
      let { goback, err_msg } = res;
      if(goback){
        util.goBack();
        return
      }
      err_msg && wx.showModal({
        title: '提示',
        content: err_msg,
        success: res => {
          if (res.confirm) {
            this.handleBackFromH5(token)
          }
        }
      })
    })
  }
})