/*
 * @Author: wuazhu
 * @Date: 2021-06-02 16:43:47
 * @LastEditTime: 2021-08-10 18:30:47
 */
var app = getApp();
Page({
  onLoad: function (options) {
    this.setData({
      options: options
    })
  },
  // onShow:function(){
  //   //地址列表数据初始化
  //   this.addressul.methods.init();
  // },
  //跳转编辑地址
  goToEditAddress:function(e){
    let url = e.detail.url;
    wx.redirectTo({ url })
  },
  //选择地址成功回调
  chooseAddressSuccess: function () {
    wx.navigateBack();
  },
  //新建地址跳转
  newAddress: function (e) {
    let param = e.detail.param;
    wx.redirectTo({
      url: `../address/address?${param}`
    })
  }
})
