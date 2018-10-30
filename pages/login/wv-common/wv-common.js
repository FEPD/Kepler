import util from '../loginPluginUtils.js';
let plugin = requirePlugin("loginPlugin");

Page({
  onLoad: function (options = {}) {
    let { h5_url = '' } = options;
    this.setData({ h5_url });
    plugin.wxapp_gentoken({
      h5_url,
      callback: (res) => {
        let { isSuccess,  url } = res
        if (isSuccess) {
          this.setData({
            url
          });
        } else {
          util.redirectToH5({page:url});
        }
      }
    })
  },
  onShareAppMessage: function () {
    let { h5_url } = this.data;
    return {
      title: '京东',
      path: `/pages/login/wv-common/wv-common?h5_url=${h5_url}`
    }
  }
})
