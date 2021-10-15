const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option:{
      noshowRedpacket: app.globalData.noshowRedpacket ? app.globalData.noshowRedpacket : '',
    },
    scrollTop: 0, // 页面滚动距离
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    const wxCurrPage = getCurrentPages(); // 获取当前页面的页面栈
    let pageStackLists = []
    wxCurrPage.forEach(item => {
      pageStackLists.push({
        route: item && item.route
      })
    })

    this.setData({
      options: Object.assign({}, this.data.option, options, {
        wxCurrPage: pageStackLists,
        pageIndex: wxCurrPage.length
      })
    })
    this.trade = this.selectComponent('#trade');
  },
  onUnload:function(){
    this.trade.methods.clearPresaleState();
  },
  onPageScroll:function(e){
    this.data.scrollTop = e.scrollTop;
  },
  goPage (e) {
    const { detail } = e
    if (!detail || !detail.jumpMode || !detail.url ) {
      return;
    }
    wx[detail.jumpMode]({
      url: detail.url,
      success () {
        wx.hideToast()
      }
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
  },
  toHideKeyboard() {
    wx.hideKeyboard()
  },
  setScrollTop() { // 获取页面滚动高度设置到options传递给组件，组件显示弹框时用来固定背景
    this.setData({
      'options.scrollTop': this.data.scrollTop
    })
  },
  pageScrollTo(e = {}) {
    let { scrollTop = 0, duration = 0 } = e.detail || {}
     wx.pageScrollTo({ scrollTop, duration })
  }
})