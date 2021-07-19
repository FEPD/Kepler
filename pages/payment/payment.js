// pages/payment/payment.js
Page({
  data: {
  },
  onLoad: function (options) {
    this.setData({
      options: options
    })
  },
  paymentSuccess:function(e){
    let _url = e.detail.url;
    if (_url.indexOf('/pages/web-h5/web-h5')== 0) {
      const wxCurrPage = getCurrentPages();//获取当前页面的页面栈
      if (wxCurrPage[wxCurrPage.length - 1].route) {
        let rootPath = wxCurrPage[wxCurrPage.length - 1].route;
        let _arr = rootPath && rootPath.split('/')
        let _sharePath = (rootPath.split('/').slice(0, _arr.length-2).concat(['web-h5', 'web-h5'])).join('/')
        _url = _url.replace('pages/web-h5/web-h5', _sharePath)
      }
    }
    
    wx.redirectTo({
      url: _url
    });
  },
  paymentFail:function(e){
    console.log('pay fail=====>',e);
    wx.redirectTo({
      url: '../order/order'
    });
  }
})