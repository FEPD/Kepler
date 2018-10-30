import util from '../loginPluginUtils.js';
let plugin = requirePlugin("loginPlugin");

Page({
  onLoad(options={}){
    let { token } = options;
    this.handleBackFromH5(token);
    this.setData({ token })
  },
  handleBackFromH5(token) {
    plugin.tokenLogin({
      token,
      callback: () => {
        util.handleComponentRedirect()
      }
    }).bind(this);
  }
})
