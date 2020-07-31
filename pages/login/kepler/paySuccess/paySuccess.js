var plugin = requirePlugin("myPlugin");
var log = plugin.keplerReportInit();//埋点上报方法
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
    this.setData({
      options: options
    })
  },

  //跳转到订单列表页
  goToOrder:function(){
    wx.redirectTo({
      url: `../order/order`,
    })
  }
})