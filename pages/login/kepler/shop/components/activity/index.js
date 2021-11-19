// pages/shop/components/activity/index.js
var log = require('../../shop_utils/keplerReport').init();
var modal = require('./model.js')
var shopBehavior = require('../../shop_utils/shopBehavior.js');
Component({
  behaviors: [shopBehavior],
    pageLifetimes: {
        show() {
            // 页面被展示
            this.setPin(log);
        },
    },
  attached(){
      this.setLogPv(log);
  },
  /**
   * 组件的属性列表
   */
  properties: {

    activityList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        console.log(newVal)
        console.log(oldVal)
      }
    },

  },

  /**
   * 组件的初始数据
   */
  data: {

    list: modal.getShopActivityPage()

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickSku: function(e){
      console.log(e)
      let wareId = e.currentTarget.dataset.wareid;
      let activityType = e.currentTarget.dataset.activitytype;
      // log.set({
      //   pageId: 'KeplerMiniAppShopHome',
      // });
      var param = {
        "eid": 'KMiniAppShop_ShopDynamic',
        "eparam":"" + activityType,
        "target": "../product/product?wareId=" + wareId,
        "ev": e
      }
      this.triggerEvent('clickFunc', param)
      wx.navigateTo({
        url: "../product/product?wareId=" + wareId,
      })
    },
  subjectUrl: function (e) {
      let murl = e.currentTarget.dataset.murl;
      if (murl && murl.indexOf('sale.jd.com') > 0){
        murl = murl.split('?')[0];
        murl = murl.substring(murl.lastIndexOf("\/") + 1, murl.length - 5);
        // log.set({
        //   pageId: 'KeplerMiniAppShopHome',
        // });
        var param = {
          "eid": 'KMiniAppShop_ShopDynamic',
          "eparam": "3",
          "target": '../jshopHtml/jshopHtml?appId=' + murl,
          "ev": e
        }
        this.triggerEvent('clickFunc', param)
        wx.navigateTo({
          url: '../jshopHtml/jshopHtml?appId=' + murl,
        })
      }
    },

    bigPicPreview: function(e){
      console.log(e);
      // log.set({
      //   pageId: 'KeplerMiniAppShopHome',
      // });
      var param = {
        "eid": 'KMiniAppShop_ShopDynamic',
        "eparam": "16",
        "ev": e
      }
      this.triggerEvent('clickFunc', param)
      var current = e.currentTarget.dataset.currenturl;
      var urls = [];
      var lists = e.currentTarget.dataset.list;
      (lists || []).map(function (item, index) {
        urls.push(item.imgUrl)
      })
      wx.previewImage({
        current: current,
        urls: urls
      })
    }
  }
})
