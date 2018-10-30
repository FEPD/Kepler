var plugin = requirePlugin("myPlugin");
Page({
  data: {
    isLogin:false,
    returnpage:'/pages/index/index'
  },
  onLoad: function (options) {

  },
  onShow:function(){
    plugin.isLogin(this.setLoginState)
  },
  setLoginState:function(isLogin){
    this.setData({
      isLogin: isLogin
    })  
  },
  gotoProduct: function (e) {
    wx.navigateTo({
      url: '../product/product?wareId=' + e.detail.value.skuKey
    });
  },
  goUnion: function (e) {
     wx.navigateTo({
      url: '../proxyUnion/proxyUnion?spreadUrl=' + encodeURIComponent(e.detail.value.unionParam)
    });
  },
  goCpsProduct: function () {
    wx.navigateTo({
      url: '../product/product?wareId=27116817741&spreadUrl=' + 'ddddssss'
    });
  },
  goCoupon: function (e) {
    wx.navigateTo({
      url: '../getCoupon/getCoupon?key=e06e7ccf43464d8e90e388c4e6454465&roleId=14598923&to=https://shop.m.jd.com/?shopId=1000001764'
    });
  },
  goOrder: function (e) {
    wx.navigateTo({
      url: '../order/order'
    });
  },
  logout:function(){
    plugin.globallogout(() => { this.goTologin()})
  },
  goTologin:function(){
    let jumpWay = plugin.getJumpLoginType(this.data.returnpage);
    let loginUrl = plugin.getLoginUrl(this.data.returnpage, true)
    if (jumpWay == 'navigate') {
      wx.navigateTo({
        url: loginUrl,
      });
    } else if (jumpWay == 'redirect') {
      wx.redirectTo({
        url: loginUrl,
      })
    }
  }
})