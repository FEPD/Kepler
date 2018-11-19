var plugin = requirePlugin("myPlugin");
var log = plugin.keplerReportInit();//埋点上报方法
const util = require('../utils/util.js');

Page({
  data:{
  },
  onLoad: function(options) {
    util.checkVersion();
    //处理商品sku参数
    this.setData({
      wareId:options.wareId,
      options: options
    })
    this.product = this.selectComponent('#product');
  },
  onShow:function(){
    let that = this;
    //防止用户多次点击（一定要加！！！）
    this.setData({
      buyDisabled: false,
    })
    //地址选择数据同步
    this.product.methods.getAddressStorage();
    //同步缓存中购物车角标数
    this.product.methods.updateCartNum();
    this.product.methods.firstCheckIsLogin();

    // 设置分享链接，增加分佣spreadUrl
    let app = getApp();
    let unionId = (app.globalData && app.globalData.unionId) || ''
    if (unionId) {
      plugin.getSpreadUrl(that.data.wareId, unionId).then((res)=>{
        that.data.shareUrl = `/pages/product/product?wareId=${that.data.wareId}&spreadUrl=${res.shortUrl}`
      })
    } else {
      that.data.shareUrl = `/pages/product/product?wareId=${that.data.wareId}`
    }
  },
  onReachBottom:function(){
    //图文详情触底加载
    this.product.methods.showProductDetail();
  },
  onPageScroll:function(e){
    //监听页面滑动
    this.product.methods.pageScroll(e);
  },
  //跳转登录
  goToLogin: function (e){
    let resultObj = e.detail;
    if (resultObj.jumpWay =='navigate'){
      wx.navigateTo({
        url: resultObj.loginUrl,
      });
    } else if (resultObj.jumpWay == 'redirect'){
      wx.redirectTo({
        url: resultObj.loginUrl,
      })
    }
  },
  //去结算
  goToPay:function(e){
    wx.navigateTo({
      url: e.detail.url,
    })
  },
  //返顶处理
  toTopTap:function(){
    wx.pageScrollTo({
      scrollTop: Math.random() * 0.001,
      duration: 300
    })
  },
  //跳转购物车
  goToCart: function () {
    wx.redirectTo({
      url: '/pages/cart/cart',
    })
  },
  goToChooseAddress:function(e){
    let wareId = e.detail && e.detail.wareId ? e.detail.wareId : '';
    wx.navigateTo({
      url: `plugin-private://wx1edf489cb248852c/pages/chooseaddress/chooseaddress?wareId=${wareId}`,
    })
  },
  getProductName:function(e){
    let productName = e.detail && e.detail.productName ? e.detail.productName : '';
    this.data.productName = productName;
  },
  /**
   * [onShareAppMessage 商祥页分享]
   */
  onShareAppMessage: function (ev) {
    return {
      title: this.data.productName,
      path: this.data.shareUrl ? this.data.shareUrl : `/pages/product/product?wareId=${that.data.wareId}`,
      success: function (res) {
        log.click({
          "eid": "WProductDetail_ShareSuccess",
          "elevel": "",
          "eparam": "",
          "pname": "",
          "pparam": "",
          "target": "", //选填，点击事件目标链接，凡是能取到链接的都要上报
          "event": "" //必填，点击事件event
        });        
      }
    }
  }
})