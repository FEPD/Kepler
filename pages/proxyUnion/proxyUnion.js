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
    let that = this;
    this.setData({
      options:options
    })
    this.proxyUnion = this.selectComponent('#proxyUnion');
    //入参初始化处理
    options = this.proxyUnion.methods.initOptions(options);
    
    wx.login({
      success: function (res) {
        // console.log(res);
        let code = res.code || '';
        that.proxyUnion.methods.getUnpl(options, code)
        if (!code) {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  
  //跳转首页，首页路径根据插件接入方的首页路径更改
  goToIndex:function(e){
    let param = e.detail.param
    wx.redirectTo({
      url: '../index/index?' + param,
    })
  },
  //跳商祥页
  goToProduct:function(e){
    let wareId = e.detail && e.detail.wareId ? e.detail.wareId : '';
    let param = e.detail.param ? ('&' + e.detail.param) : ''
    wx.redirectTo({
      url: '../product/product?wareId=' + wareId + param,
    })
  }
})