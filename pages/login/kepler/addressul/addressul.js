Page({
  data: {
    
  },
  onLoad: function (options) {
    this.setData({
      options: options
    })
    this.addressul = this.selectComponent('#addressul');
  },
  onShow:function(){
    //地址列表数据初始化
    this.addressul.methods.init();
  },
  //跳转编辑地址
  goToEditAddress:function(){
    let url = this.addressul.methods.getEditAddressUrl();
    wx.redirectTo({
      url: url,
    })
  },
  //选择地址成功回调
  chooseAddressSuccess:function(){
    wx.navigateBack();
  },
  //新建地址跳转
  newAddress:function(e){
    let param = e.detail.param;
    wx.redirectTo({
      url: '../address/address?' + param
    })
  }
})