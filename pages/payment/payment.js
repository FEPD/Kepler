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
    wx.redirectTo({
      url: e.detail.url
    });
  },
  paymentFail:function(e){
    console.log('pay fail=====>',e);
    wx.redirectTo({
      url: '../order/order'
    });
  }
})