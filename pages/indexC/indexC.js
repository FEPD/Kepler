

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

    // plugin.initStyle({
    //   ...this.data.options,
    // });
    // util.checkVersion();
    wx.navigateTo({
      url: '/pages/login/kepler/indexB/indexB',
    })

  }

})