var myPluginInterface = requirePlugin('myPlugin');
const app=getApp();
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
    // console.log(app);
    let that=this;
    wx.navigateTo({
      url: '/pages/login/kepler/index/index',
    })
    that.data.option = options
  },
  onShow:function(){
    let that = this;
    myPluginInterface.initStyle({})
    myPluginInterface.appShow(that.data.option, app);
  }

})