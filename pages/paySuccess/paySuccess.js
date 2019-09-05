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
    log.set({
      url: 'pages/paySuccess/paySuccess',
      urlParam: options, //onLoad事件传入的url参数对象
      title: '支付成功', //网页标题
      shopid: '',
      pparam: '1',
      siteId: 'WXAPP-JA2016-1', //开普勒小程序固定用：WXAPP-JA2016-1
      pageId: 'Worder_SucceedPayment',
      account: !plugin.getStorageSync('jdlogin_pt_key') ? '-' : plugin.getStorageSync('jdlogin_pt_key')  //传入用户登陆京东的账号
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    log.pv();
  },
  //跳转到订单列表页
  goToOrder:function(){
    wx.redirectTo({
      url: `../order/order`,
    })
  }
})