var modal = require('./model.js')// 
var utils = require('../../shop_utils/util');
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

    suitList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        console.log('suit suit suit suit suit suit suit list')
        console.log(newVal)
        console.log(oldVal)
      }
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    list: modal.getData_SuitList()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //事件处理函数
    bindViewTap: function () {
      wx.navigateTo({
        url: '../logs/logs'
      })
    },
    suitListClick: function (e) {
      console.log('999999999')
      var suitList = this.data.suitList;
      var index = e.currentTarget.dataset.index;
      var item = e.currentTarget.dataset.item;
      item.open = !item.open;
      suitList.splice(index, 1, item);
      this.setData({ suitList: suitList })
    },
    tipsClick: function () {

      let data = this.data.list;
      data.otherMap.promRuleOpen = !data.otherMap.promRuleOpen;
      this.setData({ list: data })

    },
    onMyEvent: function () {
      console.log('page1 test')
    },

    skuClick: function(e){

      let wareId = e.currentTarget.dataset.item.wareId;
      wx.navigateTo({
        url: "../product/product?wareId=" + wareId,
      })

    },
    addCard: function(e) {
      console.log('加入购物车')
      const that = this;
      var item = e.currentTarget.dataset.item;
      var rfId = item.rfId;
      console.log(item)
      let sid = wx.getStorageSync('sid');
      let useFlagCheck = wx.getStorageSync('USER_FLAG_CHECK');
     
        utils.request({
          url: app.globalRequestUrl + '/kwxp' + '/cart/add.json?rfId=' + rfId,
          success: function (data) {},
          fail: function (e) {}
        });
    }
  }
})
