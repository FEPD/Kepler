var plugin = requirePlugin("myPlugin");
const app=getApp();
Page({
  data: {
    isLogin:false,
    returnpage:`../../index/index`,
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
  setEZRText() {
    // 手动设置 EZR 小程序打标 orderText 字段
    console.log(app.globalData)
    const openid = 'xxxxx' // 去获取用户 openid 格式保持 openid_ksz|xx#_#businessType|3;
    plugin.setStorageSync('K_orderText', `openid_ksz|${openid}#_#businessType|3;`)
    // 自测爆品小程序打标
    // plugin.setStorageSync('usualExtParams', {"unionInfo":"{\"activityId\":123456,\"shareLevel\":1}"})

    // 交易插件支持宿主小程序数据跟单--storage存入'orderChain-event-id'，在交易插件提单时上报埋点
    //wx.setStorageSync('orderChain-event-id', 'xxxx');
  },
  onLoad: function (options) {
    // 主动调用 Ezr 打标
    this.setEZRText()
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
    let jumpWay = plugin.getJumpLoginType('../cart/cart'); //传入购物车页面路径
    if (jumpWay == 'navigate') {
      wx.navigateTo({
        url: `../product/product?wareId=` + sku
      })
    } else {
      wx.redirectTo({
        url: `../product/product?wareId=` + sku
      })
    }

  },
  //跳转结算
  gotoTrade: function (e) {
    let param = e.detail.param;
    wx.navigateTo({
      url: `../trade/trade?` + param
    })
  },
  // gotoProduct: function (e) {
  //   wx.navigateTo({
  //     url: '../product/product?wareId=' + e.detail.value.skuKey
  //   });
  // },
  goUnion: function (e) {
     wx.navigateTo({
      url: `../proxyUnion/proxyUnion?spreadUrl=` + encodeURIComponent(e.detail.value.unionParam)
    });
  },
  goCpsProduct: function () {
    wx.navigateTo({
      url: `../product/product?wareId=27116817741&spreadUrl=` + 'ddddssss'
    });
  },
  goCoupon: function (e) {
    wx.navigateTo({
      url: `../getCoupon/getCoupon?key=280af7901158469cba671d4ae5251b58&roleId=18502272&to=https://shop.m.jd.com/?shopId=1000001764`
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
    let that=this;
    const wxCurrPage = getCurrentPages();//获取当前页面的页面栈
    let jumpWay = plugin.getJumpLoginType(this.data.returnpage);
    let returnPage = plugin.getRootPath(this.data.returnpage, wxCurrPage)
    let loginUrl = plugin.getLoginUrl(returnPage, true)
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
    console.log("e.detail.path", e.detail.path)
    if(e.detail.path!='../index/index'){
      wx.reLaunch({
        url: '/' + e.detail.path,
      })
    }

  },
  goToAppointment:function(){
    wx.navigateTo({
      url: 'plugin-private://wx1edf489cb248852c/pages/appointment/appointment',
    })
  },
  gotoLocItem: function () {
    wx.navigateTo({
      url: '../product/product?wareId=28270426727&spreadUrl=https://u.jd.com/f6QeKN'
    })
  },
  gotoLocItemByGuider: function () {
    wx.navigateTo({
      url: '../product/product?wareId=28270426727&locShopName=帘到家02158号线下体验店&shopAddress=北京丰台区四环到五环之间永外大红门西马场甲14号集美家具市场82003号&locShopId=20731235&distance=7.99&un_area=1_0_0&isLocal=&category=jump&des=loc&wareId=28270426727&sid=&tapFrom=addr&storePrice=1&venderId=160839&storeGroupId=9301&selStoreId=20731235&lng=116.40717&lat=39.90469&buType=&buyCount=1&isLocGuider=1'
    })
  },
  gotoLocUnion: function () {
    wx.navigateTo({
      url: '../proxyUnion/proxyUnion?wareId=28270426727&spreadUrl=https://u.jd.com/ecg6by'
    })
  },
  gotoLocUnionByGuider: function () {
    wx.navigateTo({
      url: '../proxyUnion/proxyUnion?wareId=28270426727&spreadUrl=https://u.jd.com/ecg6by&locShopName=帘到家02158号线下体验店&shopAddress=北京丰台区四环到五环之间永外大红门西马场甲14号集美家具市场82003号&locShopId=20731235&distance=7.99&un_area=1_0_0&isLocal=&category=jump&des=loc&wareId=28270426727&sid=&tapFrom=addr&storePrice=1&venderId=160839&storeGroupId=9301&selStoreId=20731235&lng=116.40717&lat=39.90469&buType=&buyCount=1&isLocGuider=1'
    })
  },
  goOrder1: function () {
    wx.navigateTo({
      url: '../order/order?id=1'
    })
  },
  goOrder2: function () {
    wx.navigateTo({
      url: '../order/order?id=2'
    })
  },
  goOrder3: function () {
    wx.navigateTo({
      url: '../order/order?id=3'
    })
  },
  goOrder4: function () {
    wx.navigateTo({
      url: '../order/order?id=4'
    })
  },
  // goUnionVender: function () {
  //   wx.navigateTo({
  //     url: '../proxyUnion/proxyUnion?spreadUrl=https://u.jd.com/cOCvDJ&isVenderAddr=1&venderId=10289299&storeId=24010973&name=百丽丝怀柔专卖店&storeAddress=北京市怀柔区迎宾北路六号百丽丝家纺&storeMark=1&vendSource=4&venderStoreTab=2&wareHouseId=24010973'
  //   })
  // }
  goPage: function(e) {
    let url = e.detail.value.pageUrl;
    wx.navigateTo({
      url
    })
  }
})
