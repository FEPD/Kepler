Page({
  data: {

  },
  onLoad: function (options) {
    this.setData({
      addressType: options.addressType ? options.addressType : '',
      defaultFlag: options.defaultFlag ? options.defaultFlag : 0,
    });
    this.addressedit = this.selectComponent('#addressedit');
    if (options.addressType && options.addressType == 'add') {
      wx.setNavigationBarTitle({ title: '新建收货地址' });
      //新建收货地址时请求接口数据
      this.addressedit.methods.addInit(options);
    } else {
      wx.setNavigationBarTitle({ title: '编辑收货地址' });
      //编辑收货地址请求接口数据
      this.addressedit.methods.editInit(options);
    }
  },
  //保存成功回调
  submitSuccess: function () {
    wx.navigateBack();
  },
  //删除地址回调
  deleteSuccess: function () {
    wx.redirectTo({
      url: '../addressul/addressul'
    })
  }
})