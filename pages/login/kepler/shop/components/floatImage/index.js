// pages/shop/components/floatImage/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

    shopId: {
      type: String,
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    top: app.globalData.systemInfo.windowHeight-140,
    left: app.globalData.systemInfo.windowWidth - 60,
  },

  /**
   * 组件的方法列表
   */
  methods: {

    move: function (e) {

      var top = e.touches[0].clientY - 30
      var left = e.touches[0].clientX - 30
      var windowWidth = app.globalData.systemInfo.windowWidth
      var windowHeight = app.globalData.systemInfo.windowHeight
      this.setData({
        top: top < 0 ? 0 : top > windowHeight - 60 ? windowHeight - 60 : top,
        left: left < 0 ? 0 : left > windowWidth - 60 ? windowWidth - 60 : left,
      })
    },
    click: function() {
      wx.navigateTo({
        url: '../activityH5/activityH5',
      })
    }

  }
})
