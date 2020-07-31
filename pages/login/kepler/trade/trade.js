const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option:{
      noshowRedpacket: app.globalData.noshowRedpacket ? app.globalData.noshowRedpacket : '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    this.setData({
      options: Object.assign({}, this.data.option, options)
    })
    this.trade = this.selectComponent('#trade');
  },
  onUnload:function(){
    this.trade.methods.clearPresaleState();
  },
  // 跳转配送页
  paymentClick:function(e){
    console.log(e)
    wx.navigateTo({
      url: e.detail.url,
    })
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
  goToAddressGuide:function(){
    wx.redirectTo({
      url: `../guideAddress/guideAddress`
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