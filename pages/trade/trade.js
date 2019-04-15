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
    this.trade = this.selectComponent('#trade');
  },
  onUnload:function(){
    this.trade.methods.clearPresaleState();
  },
  //跳转新建地址页
  createAddress:function(e){
    let param = e.detail && e.detail.param ? e.detail.param : '';
    wx.navigateTo({
      url: '../address/address?' + param,
    })
  },
  //跳转选择地址列表
  chooseAddress:function(e){
    let param = e.detail && e.detail.param ? e.detail.param : '';
    wx.navigateTo({
      url: '../addressul/addressul?' + param,
    })
  },
  //跳转收银台页面
  goToPayment:function(e){
    wx.redirectTo({
      url: `../payment/payment`,
    })
  },
  paymentSuccess: function (e) {
    wx.redirectTo({
      url: `../paySuccess/paySuccess`
    });
  },
  goBack:function(){
    wx.navigateBack();
  },
  ShowRedPacketRules:function(){
     wx.navigateTo({
      url:'../redPacketTxt/redPacketTxt'
    })
  },
  goToOrderList:function(){
     wx.redirectTo({
        url: '../order/order'
     });
  },
  goAddressPage(e){
    let resultObj = e.detail;
    console.log("options++++++++==",resultObj )
     wx.navigateTo({
        url: `../address/address?addressType=addEdit&provinceId=${resultObj.provinceId}&cityId=${resultObj.cityId}&areaId=${resultObj.areaId}&townId=${resultObj.townId}&isGlobalPayment=${resultObj.isGlobalPayment}`
      });
  }
})