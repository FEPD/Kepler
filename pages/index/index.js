var plugin = requirePlugin("myPlugin");
const app = getApp();
Page({
  data: {
    isLogin:false,
    returnpage:'/pages/index/index',
    options:{
      apolloId: '595cd1c1f91a4856a2de48310afe5fdf',
      apolloSecret: 'c0e631a45aa24e6399f72075ecf77f65',
      // clientVersion: '6.0.0',
      moudleId: "personal",
      // colorAppId:"apollowx",
      // skuId:"1241849"
    },
    logSet:{
      urlParam:'',
      title: '首页', //网页标题
      siteId: 'WXAPP-JA2016-1', //开普勒小程序固定用：WXAPP-JA2016-1
      pageId: 'Wpersonal_index',
      pparam: '1'
  }
  },
  onLoad: function (options) {
    // plugin.initStyle({
      // apolloId: '595cd1c1f91a4856a2de48310afe5fdf',
      // apolloSecret: 'c0e631a45aa24e6399f72075ecf77f65',
      // clientVersion: '6.0.0',
      // colorAppId:"apollowx"
    // });
    this.setData({
      tabbarConfig:app.tabBar,
      'logSet.urlParam':options
    })
  },
  onShow:function(){
    var styleStorageData = wx.getStorageSync('style');
    plugin.isLogin(this.setLoginState)
  },
  setLoginState:function(isLogin){
    this.setData({
      isLogin: isLogin
    })
  },
  //跳转商祥
  gotoProduct: function (e) {
    // let sku = e.detail.sku;
    let sku = e.detail.value.skuKey;
    let jumpWay = plugin.getJumpLoginType('/pages/cart/cart'); //传入购物车页面路径
    if (jumpWay == 'navigate') {
      wx.navigateTo({
        url: '/pages/product/product?wareId=' + sku
      })
    } else {
      wx.redirectTo({
        url: '/pages/product/product?wareId=' + sku
      })
    }

  },
  //跳转结算
  gotoTrade: function (e) {
    let param = e.detail.param;
    wx.navigateTo({
      url: '/pages/trade/trade?' + param
    })
  },
  // gotoProduct: function (e) {
  //   wx.navigateTo({
  //     url: '../product/product?wareId=' + e.detail.value.skuKey
  //   });
  // },
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
      url: '../getCoupon/getCoupon?key=280af7901158469cba671d4ae5251b58&roleId=18502272&to=https://shop.m.jd.com/?shopId=1000001764'
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
  },
  tabBarClick:function(e){
    this.setData({
      "tabbarConfig.selectIndex":e.detail.index
    })
    if(e.detail.path!='pages/index/index'){
      wx.reLaunch({
        url: '/'+e.detail.path,
      })
    }

  },
  goToAppointment:function(){
    wx.navigateTo({
      url: 'plugin-private://wx1edf489cb248852c/pages/appointment/appointment',
    })
  }
})
