// shopRcmd.js
var utils = require('../shop_utils/util')
var shop_util = require('../shop_utils/shop_util.js')
var log = require('../shop_utils/keplerReport.js').init();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    shopID: '',
    winWidth: 0,
    winHeight: 0,
    winScale: 0,
    platform: '',
    pixelRatio: 0,
    uid:'',
    moduletype:'',
    shopid:'',
    key:'',
    template:'',
    state: 0,
    hasNext: true, // 是否加载完毕
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var obj = shop_util.getShopConfigure();
    var shopID = obj.configure.shopID;
    var optionsShopID = options.shopId;
    var title = options.name;
    var moduletype = options.moduletype;
    if (!title || title === 'undefined'){
        title = '商品列表'
        if (moduletype === 'PD_PRODUCT') {
          title = '超值单品'
        }
    }
    wx.setNavigationBarTitle({ title: title });
    if (optionsShopID) {
      shopID = optionsShopID;
    }
    if (!shopID) {
      shopID = wx.getStorageSync('shopID');
    }
    /** 获取系统信息 begin*/
    wx.getSystemInfo({
      success: function (res) {
        // success
        var winScale = (res.windowWidth / 320.0)
        var platform = res.platform
        var pixelRatio = res.pixelRatio;

        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          winScale: winScale,
          platform: res.platform,
          pixelRatio: pixelRatio,
          shopID: shopID,
          uid: options.uid ? options.uid : '',
          moduletype: options.moduletype,
          key: options.key,
          template: options.template,
        });
      }
    });

    that._searchWare();
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // },
  /** 点击商品 上报埋点 */
  wareClick: function (e) {
    /**pv 埋点 */
    log.click({
      "eid": e.currentTarget.dataset.eid,
      "elevel": "",
      "eparam": e.currentTarget.dataset.eparam + '_' + this.data.shopID,
      "pname": "/pages/product/product",
      "pparam": "wareId=" + e.currentTarget.dataset.eparam,
      "target": "",
      "event": e,
    });

    let wareId = e.currentTarget.dataset.eparam;

    let pages = getCurrentPages();
    if (pages.length === 1) {
      wx.navigateTo({
        url: "../../product/product?wareId=" + wareId,
      })
    } else {
      wx.redirectTo({
        url: "../../product/product?wareId=" + wareId,
      })
    }
  },
  // 数据请求
  _searchWare: function () {

    this.showToast();

    var urlD = 'getPromotionDetail'; // 参数key
    var id = this.data.key;
    if (this.data.moduletype === 'PD_PRODUCT'){
      urlD = 'getRecProduct'; // 参数 shopid_uid
      id = this.data.shopID + '_' + this.data.uid;
    }
    var body = {
      shopId: this.data.shopID,
      id: id,
      template: this.data.template,
    }

    var strBody = JSON.stringify(body);
    var obj = new Object();
    obj.body = strBody;
    obj.screen = (this.data.winWidth * this.data.pixelRatio) + '*' + (this.data.winHeight * this.data.pixelRatio)
    var url = app.globalRequestUrl + '/shopwechat/shophomesoa/' + urlD;
    var that = this;
    that.setData({ state: 1 })
    wx.request({
      url: url,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      data: obj,
      success: function (res) {
        /** 数据处理 begin */
        var code = res.data.code;
        if (parseInt(code) == 0) {
          var result = res.data.wareList;
          var list = that.data.list;
             list = result;
              that.setData({
                list: that.formatJDPrice(list),
                hasNext: false,
                netError: false,
                state: 0,
              })
        } else {

          that.setData({
            loadingfailed: true,
            noData: false,
            netError: false,
            nextPage: true,
            hasNext: true,
            state: 0,
          })

        }
        /** 数据处理 end */
      },
      fail: function (res) {
        that.setData({ state: 3 })
        that.networkFail();
      },
      complete: function (res) {
        that.networkComplete();
      }
    });
    /** 网落请求－全部商品 end */
  },
  /** 网落请求 完成 */
  networkFail: function () {
    this.setData({
      list: [],
      netError: true,
      noData: false,
      nextPage: 1,
    })
  },

  /** 网落请求 完成 */
  networkComplete: function () {

    //  setTimeout(function(){
    wx.hideToast()
    //  },1000);

    this.setData({
      loading: false,
    });
  },
  // 当前分类无数据
  noData: function () {
    this.setData({
      list: [],
      nextPage: 1,
      noData: true,
      netError: false,
    })
  },

  resetData: function () {
    this.setData({
      netError: false,
      noData: false,
      loading: true,
      loadingfailed: false,
      flex: false,
    })
  },

  showToast: function () {
      wx.showToast({
        title: '数据加载中',
        icon: 'loading',
        duration: 12000,
        mask: true,
      });
  },

  /**
   价格格式化
  */
  formatJDPrice: function (list) {

    if(!list){
      return false;
    }
    if (!list.length) {
      return false;
    }
    let newList = [];
    list.map(function (item, index) {
      newList.push(
        newItem(item, index)
      )
    })
    function newItem(item, index) {
      if (checkPrice(item.jdPrice)) {
        item.preJDPrice = item && item.jdPrice && item.jdPrice.toString().split(".")[0];
        item.sufJDPrice = item && item.jdPrice && item.jdPrice.toString().split(".")[1];
        item.isJDPrice = item && item.jdPrice && true;
      } else {
        item.isJDPrice = item && item.jdPrice && false;
      }
      return item;
    }
    function checkPrice(me) {
      if ((/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(me))) {
        return true;
      }
      return false;
    }
    return newList
  },
  // 网络异常点击重新加载
  onReload: function () {
    this._searchWare()
  },

})
