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
      // apolloId:  '89f5bc2d5c9b4c68b3c03aaad4d0af4f', //预发
      // apolloSecret: '94cac8db22814664a4e5ae8cabfe7566', //预发
      apolloId: globalData.apolloId ? globalData.apolloId : 'd1543fc0e8274901be01a9d9fcfbf76e',
      apolloSecret: globalData.apolloSecret ? globalData.apolloSecret : '162f0903a33a445db6af0461c63c6a3b',
      clientVersion: '7.0.0',
      // moudleId: "cart",
      // colorAppId:"apollomp",
      //colorAppId:"apollowx",//开发者工具
      // clearCart: 0
    },
    logSet:{
      urlParam:'',
      title: '购物车', //网页标题
      siteId: 'WXAPP-JA2016-1', //开普勒小程序固定用：WXAPP-JA2016-1
      pageId: 'Wpersonal_OrderList',
      pparam: '1'
  }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app);

    // plugin.initStyle({
    //   ...this.data.options,
    // });
    // util.checkVersion();
    this.setData({
      'options.clearCart': options.clearCart ? options.clearCart : 0,
      // options: {
      //   // ...this.data.options,
      //   clearCart: options.clearCart ? options.clearCart : 0
      // },
      tabbarConfig: app.tabBar,
      "tabbarConfig.selectIndex": 1,
      'logSet.urlParam':options
    })

  },
  // onShow: function (options) {
  //   // plugin.initStyle({
  //   //   ...this.data.options,
  //   // });
  //   // util.checkVersion();
  //   this.setData({
  //     // options: options,
  //     clearCart: 1,
  //     tabbarConfig: app.tabBar,
  //     "tabbarConfig.selectIndex": 1
  //   })

  // },
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
  goPiecelist: function (e) {
    let param = e.detail;
    // console.log(param);
   var rootPath=this.getRootPath();
    wx.navigateTo({
      url: `plugin-private://wx1edf489cb248852c/pages/piecelist/piecelist?skuId=${param.skuId}&activityId=${param.activityId}&promotionTitle=${param.promotionTitle}&body=${param.body}&params=${param.params}&requestUrl=${param.requestUrl}&giftType=${param.giftType}&rootPath=${rootPath}`
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
  getLogSetData:function(){
    return {
      urlParam: this.properties.options, //onLoad事件传入的url参数对象
      title: '购物车', //网页标题
      siteId: 'WXAPP-JA2016-1', //开普勒小程序固定用：WXAPP-JA2016-1
      pageId: 'Wpersonal_OrderList',
      pparam: '1'
  };
  }
})
