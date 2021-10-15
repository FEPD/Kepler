Page({
  data: {
    options: {},
  },
  onLoad: function (options) {
    this.setData({
      options
    });
    let { addressType } = options
    if (addressType && addressType == 'add') {
      wx.setNavigationBarTitle({ title: '新建收货地址' });
    } else {
      wx.setNavigationBarTitle({ title: '编辑收货地址' });
    }
  },
  //保存成功回调
  submitSuccess: function (e) {
    wx.navigateBack();
  },
  //删除地址回调
  deleteSuccess: function (e) {
    let fromModel = e.detail.fromModel
    wx.redirectTo({
      url: '../addressul/addressul?fromModel='+fromModel
    })
  }
})  