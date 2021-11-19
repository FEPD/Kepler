// pages/shop/components/shopTab/index.js
var log = require('../../shop_utils/keplerReport').init();
var shopBehavior = require('../../shop_utils/shopBehavior.js');
var app = getApp();
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
      statusHeight:{
          type: Number ,
          value: 40,
    
      },
      winScale:{
          type: Number ,
          value: 1,
      },
    userInfoBac: {
      type: String
    },
    isScroll: {
      type: Boolean
    },
    scrollTop: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) {

        // if (newVal >= app.globalData.systemInfo.windowHeight && this.data.showTab) {
        //   this.setData({
        //     showTab: false,
        //   })
        // } else if (newVal < app.globalData.systemInfo.windowHeight && !this.data.showTab) {
        //   this.setData({
        //     showTab: true,
        //   })
        // }
      }
    },

    shopTabs: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        // if (newVal && newVal.length) {
        //   var tab = newVal[0];
        //   this.setData({
        //     key: tab.key
        //   })
        //   var param = {
        //     "key": tab.key,
        //     "searchSort": this.data.searchSort
        //   }
        //   // this.triggerEvent('tabevent', param)
        // }
      }
    },
    //活动tab上方展示的促销文案
    tabFlag: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
      }
    },
    promList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        if (newVal && newVal.length) {
          this.setData({
            promoId: newVal[0].promoId,
            promoInfo: newVal[0],
          })
        }
      }
    },

    tabKey: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        console.log('exchangeTab')
        if (newVal != '1001') {
          this.setData({
            key: newVal
          })
          var param = {
            "key": this.data.key,
            "searchSort": this.data.searchSort,
            promoInfo: this.data.promoInfo
          }
          // this.triggerEvent('tabevent', param)
        }
      }
    },

    exType: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        if (newVal) {
          this.setData({
            key: newVal
          })
          var param = {
            "key": this.data.key,
            "searchSort": this.data.searchSort,
            promoInfo: this.data.promoInfo
          }
          this.triggerEvent('tabevent', param)
        }
      }
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    showTab: true,
    promoId: '',
    promoInfo: {},
    key: "1001",
    subKey: "2001",
    searchSort: 0,
    priceIcon: 'http://njst.360buyimg.com/jdreact/program/shop_price_arrow_normal.png',
    tab: [{
        "name": "精选",
        "key": "1001"
      },
      {
        "name": "商品",
        "key": "1002"
      },
      // {
      //   "name": "热销",
      //   "key": "1003"
      // },
      {
        "name": "促销",
        "key": "1004"
      },
      {
        "name": "上新",
        "key": "1005"
      },
      {
        "name": "动态",
        "key": "1006"
      },
    ],
    showActFlag:true//活动tab上的红色标签点击后消失
  },

  /**
   * 组件的方法列表
   */
  methods: {
      clickSearch(e){
          var param = {
            "eid": 'KMiniAppShop_SearchBtn',
            "eparam": wx.getStorageSync('shopId'),
            "target":"/pages/shop/shopSearch/shopSearch?focus=true",
            "ev": e,
            "event_name": "搜索按钮",
            "click_type": 1,
          }
          this.triggerEvent('clickFunc', param)
          wx.navigateTo({
              url: "../shop/shopSearch/shopSearch?focus=true"
          });
      },
    navFormId: function (e) {},
    formSale: function (e) {},
    navChildFormId: function (e) {},
    click: function (e) {
      let key = e.currentTarget.dataset.key;
      let name = e.currentTarget.dataset.name;
      if (key === this.data.key) {
        return;
      }
      // log.set({
      //   pageId: 'KeplerMiniAppShopHome',
      //   shopid: '9999',
      //   account: !wx.getStorageSync('jdlogin_pt_key') ? '-' : wx.getStorageSync('jdlogin_pt_key') //传入用户登陆京东的账号
      // });
      var param = {
        "eid": 'KMiniAppShop_TopTab',
        "eparam": name,
        "ev": e
      }
      this.triggerEvent('clickFunc', param)
      if(key=='1008'){
        this.setData({
          showActFlag:false
        })
      }
      this.setData({
        key: key
      })
      var param = {
        "key": this.data.key,
        "searchSort": this.data.searchSort,
        promoInfo: this.data.promoInfo
      }
      this.triggerEvent('tabevent', param)
      if (key !== '1002') {

      }
    },
    promClick: function (e) {
      let item = e.currentTarget.dataset.item;
      if (item.promoId === this.data.promoId) {
        return;
      }
      // log.set({
      //   pageId: 'KeplerMiniAppShopHome',
      //   shopid: '9999'
      // });
      var param = {
        "eid": 'KMiniAppShop_PromotionTab',
        "eparam": item.name,
        "ev": e
      }
      this.triggerEvent('clickFunc', param)
      this.setData({
        promoId: item.promoId,
        promoInfo: item,
      })
      var param = {
        "key": this.data.key,
        promo: item
      }
      this.triggerEvent('tabevent', param)

    },
    subClick: function (e) {
      let key = e.currentTarget.dataset.key;
      let name = e.currentTarget.dataset.name;
      // log.set({
      //   pageId: 'KeplerMiniAppShopHome',
      //   shopid: '9999'
      // });
      var param = {
        "eid": 'KMiniAppShop_AllGoodsTab',
        "eparam": name,
        "ev": e
      }
      this.triggerEvent('clickFunc', param)
      var searchSort = '';
      if (key === '2004') {
        if (this.data.priceIcon.indexOf("shop_price_arrow_normal") > -1) {
          this.setData({
            subKey: key,
            priceIcon: 'http://njst.360buyimg.com/jdreact/program/shop_price_arrow_up.png'
          })
          searchSort = '3'; // 价格小到小
        } else if (this.data.priceIcon.indexOf("shop_price_arrow_up") > -1) {
          this.setData({
            subKey: key,
            priceIcon: 'http://njst.360buyimg.com/jdreact/program/shop_price_arrow_down.png'
          })
          searchSort = '2'; // 价格大到小
        } else if (this.data.priceIcon.indexOf("shop_price_arrow_down") > -1) {
          this.setData({
            subKey: key,
            priceIcon: 'http://njst.360buyimg.com/jdreact/program/shop_price_arrow_up.png'
          })
          searchSort = '3'; // 价格小到大
        }
        var param = {
          "key": this.data.key,
          "searchSort": searchSort
        }
        this.setData({
          searchSort: searchSort
        })
        this.triggerEvent('tabevent', param)
        return;
      } else if (key === '2003') {
        searchSort = '5'; // 上新
      } else if (key === '2002') {
        searchSort = '1'; // 销量
      } else if (key === '2001') {
        searchSort = '0'; // 推荐
      }
      if (key === this.data.subKey) {
        return;
      }
      this.setData({
        searchSort: searchSort,
        subKey: key,
        priceIcon: 'http://njst.360buyimg.com/jdreact/program/shop_price_arrow_normal.png',
      })

      var param = {
        "key": this.data.key,
        "searchSort": searchSort
      }
      this.triggerEvent('tabevent', param)
    }
  }
})
