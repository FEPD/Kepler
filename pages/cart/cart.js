var plugin = requirePlugin("myPlugin");
const util = require('../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.checkVersion();
    this.setData({
      options: options
    })   
  },
  //跳转商祥
  gotoProduct:function(e){
    let sku = e.detail.sku;
    let jumpWay = plugin.getJumpLoginType('/pages/cart/cart');//传入购物车页面路径
    if (jumpWay == 'navigate'){
      wx.navigateTo({
        url: '/pages/product/product?wareId=' + sku
      })
    }else{
      wx.redirectTo({
        url: '/pages/product/product?wareId=' + sku
      })
    }
    
  },
  //跳转结算
  gotoTrade:function(e){
    let param = e.detail.param;
    wx.navigateTo({
      url: '/pages/trade/trade?' + param
    })
  },
  //跳转登录
  goToLogin: function (e) {
    let resultObj = e.detail;
    wx.navigateTo({
      url: resultObj.loginUrl,
    });
  }
})