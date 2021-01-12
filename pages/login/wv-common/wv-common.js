import util from '../util.js'
let plugin = requirePlugin("loginPlugin");

Page({
  onLoad: function (options = {}) {
    let { h5_url = '' } = options;
    util.h5Init(options);
    this.setData({ h5_url });
    util.setCustomNavigation();
    this._genToken();
  },
  _genToken() {
    let { h5_url } = this.data
    plugin.genToken({
      h5_url,
    }).then(res => {
      let {
        isSuccess,
        err_code,
        url,
        tokenkey,
        err_msg
      } = res;
      if (isSuccess && !err_code) {
        this.setData({ url: `${url}?to=${h5_url}&tokenkey=${tokenkey}` });
      } else {
        wx.showModal({
          title: '提示',
          content: err_msg || '页面跳转失败，请重试',
          success: (res) => {
            if (res.confirm) {
              this._genToken()
            }
          }
        })
      }
    }).catch(res => console.jdLoginLog(res))
  },
  onShareAppMessage: function () {
    let { h5_url } = this.data;
    return {
      title: '京东',
      path: `/pages/login/wv-common/wv-common?h5_url=${h5_url}`
    }
  }
})