var plugin = requirePlugin("myPlugin");
const util = require('../utils/util.js');
const app = getApp();
const globalData = app.globalData

Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'options.clearCart': options.clearCart ? options.clearCart : 0,
      tabbarConfig: app.tabBar,
      "tabbarConfig.selectIndex": 1,
      'logSet.urlParam':options
    })

  },
  onShow:function(){
    const wxCurrPage = getCurrentPages();//获取当前页面的页面栈
    this.setData({
      wxCurrPage: wxCurrPage
    })
  },
  //跳转商祥
  gotoProduct: function (e) {
    let sku = e.detail.sku;
    let jumpWay = plugin.getJumpLoginType('../cart/cart'); //传入购物车页面路径
    if (jumpWay == 'navigate') {
      wx.navigateTo({
        url: '../product/product?wareId=' + sku
      })
    } else {
      wx.redirectTo({
        url: '../product/product?wareId=' + sku
      })
    }

  },
  //跳转结算
  gotoTrade: function (e) {
    let param = e.detail.param;
    wx.navigateTo({
      url: '../trade/trade?' + param
    })
  },
  // 跳凑单页
  goPiecelist: function (e) {
    let { jumpType, url, success } = e.detail || {}
    if(!jumpType || !url) return
    wx[jumpType]({
      url: `plugin-private://wx1edf489cb248852c/pages/piecelist/piecelist?${url.split('?')[1]}&rootPath=${encodeURIComponent(this.getRootPath())}`,
      success
    })
  },
  getRootPath:function(){
    const wxCurrPage = getCurrentPages();//获取当前页面的页面栈
    if (wxCurrPage[wxCurrPage.length - 1].route){
      let route=wxCurrPage[wxCurrPage.length - 1].route;
      let routeArr = route.split('/');
      routeArr.splice(-2,2);
      var rootPath = routeArr.join("/")+"/"
    }
    return rootPath;
  },
  //跳转登录
  goToLogin: function (e) {
    let resultObj = e.detail;
    if (resultObj.jumpWay == 'navigate') {
      wx.navigateTo({
        url: resultObj.loginUrl,
      });
    } else if (resultObj.jumpWay == 'redirect') {
      wx.redirectTo({
        url: resultObj.loginUrl,
      })
    }
  },

  tabBarClick: function (e) {
    this.setData({
      "tabbarConfig.selectIndex": e.detail.index
    })
    if (e.detail.path != '../cart/cart'){
      wx.reLaunch({
        url: '/' + e.detail.path,
      })
    }
  },

  gotoPage: function(e = {}) {
    let { jumpType, url, success=()=>{} } = e.detail || {}
    if(!jumpType || !url) return
    wx[jumpType]({ url, success })
  },
  gotoIndex: function() {
    console.log('去首页')
  },
})
