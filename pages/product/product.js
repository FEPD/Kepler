var plugin = requirePlugin("myPlugin");
const util = require('../utils/util.js');
util.checkVersion()
let app = getApp();
Page({
  data:{
    // 全局配置项
    feGlobalConfig: {
      coverMethodsAllDefine: [], // 需要覆写的方法，需在此申明注册
      isHideJDLogo: false, // 是否屏蔽京东元素标识
      hasRecommendFloor: true, // 是否展示推荐楼层
      isCanCouponBuy: true, // boolean类型，默认：true。是否支持领券购买
      share: {
        qrCodeImgurl: '', // 小程序码
      },
      prodFavorableInfo: null,
      singlePage: {
        isShowPromotionFloor: true, // 是否展示优惠券
        discountCoupon: null,
      },
      bpChoice: null
    },
    option:{
      apolloId: app.globalData.apolloId ? app.globalData.apolloId : 'd1543fc0e8274901be01a9d9fcfbf76e',       //阿波罗Id
      apolloSecret: app.globalData.apolloSecret ? app.globalData.apolloSecret :'162f0903a33a445db6af0461c63c6a3b',   //阿波罗secret
      moudleId: "product"                               //标识阿波罗组件加载商祥页
    },
    refreshCount:0,     // 避免进来onload和onShow同时多余请求
    scrollTop: 0,        //滚动距离
    pageStyle: 'position: relative',
    wrapStyle: '',
    toTopDisplay: 'none',    // 是否展示回到顶部按钮
    screenHeight:0,         // 屏幕高度
    rootPath:'' //全局根目录
  },
  onLoad: function(options) {
    console.log('============00', options)
    const that = this;
    this.initOptionsVal = options;
    if (plugin && options.isLocGuider == '1') {
      plugin.setStorageSync('isLocGuider', true);
    }
    options = plugin ? plugin.initItemOptions(options) : options;
    const curPages = getCurrentPages();
    this.pageIndex = curPages.length;
    const pageStackLists = that.setBasicInfo()
    const pageParamsOption = Object.assign(options, {
      wxCurrPage: pageStackLists
    })
    this.setData({
      isIphoneX: !!((app && app.globalData && app.globalData.isIphoneX) || (plugin.getStorageSync('isIphoneX'))),
      options: Object.assign({}, options, {
        initOptionsVal: this.initOptionsVal,
        wareId: options.wareId,
        skuId: options.wareId,
        pageParams: pageParamsOption,
        pageIndex: curPages.length,
        wxCurrPage: pageStackLists
      })
    })
    this.updateShareurl(options.wareId)
    
    plugin.emitter.on('goPage' + this.pageIndex, this.goPage.bind(this));
    plugin.emitter.on('scrollToPostion' + this.pageIndex, this.scrollToPostion.bind(this))
    plugin.emitter.on('getScrollTop' + this.pageIndex, this.getScrollTop.bind(this))
    plugin.emitter.on('updateSkuId' + this.pageIndex, this.updateSkuId.bind(this))
    // plugin.emitter.on('productRefreshPage' + this.pageIndex, this.productRefreshPage.bind(this))
    this.data.refreshCount++;
  },
  onUnload () {
    // 页面卸载时，注销发布事件
    plugin.emitter.off('goPage' + this.pageIndex);
    plugin.emitter.off('scrollToPostion' + this.pageIndex)
    plugin.emitter.off("getScrollTop" + this.pageIndex);
    plugin.emitter.off('updateSkuId' + this.pageIndex)
    // plugin.emitter.off('productRefreshPage' + this.pageIndex)
  },
  onShow:function(){
    const that = this;
    that.getRootPath();//获取全局根目录
    // 存储当前用户所在位置经纬度
    this.getUserAuthSetting();
    // this.data.refreshCount != 1 ? plugin.emitter.emit('refreshPage' + this.pageIndex, Object.assign({},{isOnShow: true}, {data:this.data.options},)) : this.data.refreshCount++;
  },
  /**
   * 商详主接口获取成功后，回调。
   */
  doAfterGetdataSuccessInject(triggerDetail) {
    const { wareInfo: wareData } = triggerDetail.detail;
    this.data.wareData = wareData
  },
  coverMethodsAll: function(triggerDetail) {
    const {doMethodName, fnparam} = triggerDetail.detail;
    this[doMethodName](fnparam);
  },
  // 刷新商祥页，切换地址后，重新渲染商详
  // productRefreshPage (sitesAddress) {
  //   let regionIdStr = sitesAddress && sitesAddress.regionIdStr
  //   plugin.emitter.emit('refreshPage' + this.pageIndex, Object.assign({}, {data:this.data.options},))
  // },
  getScrollTop() {
    return this.data.scrollTop
  },
  // 切换商祥skuId
  updateSkuId (skuId) {
    this.updateShareurl(skuId)
    this.setData({
      options: Object.assign({}, this.data.options, {
        wareId: skuId,
        skuId: skuId,
      })
    })
    return `skuId=${skuId}`
  },
  // 更新shareurl
  updateShareurl (skuId) {
    const that = this;
    skuId = skuId || that.data.options.skuId
    // 设置分享链接，增加分佣spreadUrl
    const app = getApp();
    const unionId = (app && app.globalData && app.globalData.unionId) || ''
    that.data.shareUrl = ''
    if (unionId) {
      plugin.getSpreadUrl(skuId, unionId).then((res)=>{
        that.data.shareUrl = `spreadUrl=${res.shortUrl}`
      }, (res)=> {})
    }
  },
  // 触底函数
  onReachBottom:function(e){
    plugin.emitter.emit('reachBottom' + this.pageIndex, e)
    plugin.emitter.emit("getRecommend" + this.pageIndex, e);
  },
  // 动态控制滚动条
  scrollToPostion ({ type, top, duration }) {
    const pageScroll = {
      scrollTop: this.data.scrollTop + 50,
      duration: 200
    }
    if (type === 1) {
      pageScroll.scrollTop = top
      pageScroll.duration = duration || 0
    }
    wx.pageScrollTo(pageScroll)
  },
  // 监听页面滚动
  onPageScroll:function(e){
    this.data.scrollTop = e.scrollTop;
    if (e.scrollTop > this.data.screenHeight) {
      if (this.data.toTopDisplay == 'none') {
        this.setData({
          toTopDisplay: "block"
        })
      }
    } else {
      if (this.data.toTopDisplay == 'block') {
        this.setData({
          toTopDisplay: "none"
        })
      }
    }
  },
  //返顶处理
  toTopTap:function(e){
    wx.pageScrollTo({
      scrollTop: Math.random() * 0.001,
      duration: 300
    })
    plugin.emitter.emit('buryingPoint' + this.pageIndex, 'click', {
      "eid": "WProductDetail_BackTop",
      "elevel": "",
      "eparam": "",
      "pparam": this.data.options.skuId+ '_1',
      "target": "", //选填，点击事件目标链接，凡是能取到链接的都要上报
      "event": e //必填，点击事件event            
    })
  },
  getRootPath: function () {
    const wxCurrPage = getCurrentPages();//获取当前页面的页面栈
    if (wxCurrPage[wxCurrPage.length - 1].route) {
      this.data.rootPath = wxCurrPage[wxCurrPage.length - 1].route;
    }
    
  },
  // 存储当前用户所在位置的经纬度
  getUserAuthSetting: function () {
    let that = this;
    wx.getSetting({
      success (res) {
        if (res && res.authSetting && res.authSetting && res.authSetting['scope.userLocation']) {
          plugin.saveLngLat()
        } else {

            // 如果用户未授权，清楚缓存中的经纬度
            let _lng = that.data.options && that.data.options.pageParams && that.data.options.pageParams.lng;
            let _lat = that.data.options && that.data.options.pageParams && that.data.options.pageParams.lat;
            if (_lng && _lat) {
              plugin.setStorageSync('user_lng', _lng)
              plugin.setStorageSync('user_lat', _lat)
            } else {
              plugin.removeStorageSync('user_lng')
              plugin.removeStorageSync('user_lat')
            }
        }
      }
    })
  },
  setBasicInfo() {
    const that = this;
    // 获取可视区域
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      },
    });
    let pageStackLists = []
    const wxCurrPage = getCurrentPages();//获取当前页面的页面栈
    wxCurrPage.forEach(item => {
      pageStackLists.push({
        route: item && item.route
      })
    })
    return pageStackLists
  },
  /**
   * [onShareAppMessage 商祥页分享]
   */
  onShareAppMessage: function (ev) {
    plugin.emitter.emit('buryingPoint' + this.pageIndex, 'click', {
      eid: 'WProductDetail_ShareSuccess',
      event: ev //必填，点击事件event            
    })
    // 如果是导购员，分享链接拼接经纬度信息
    let _sharePath = `/${this.data.rootPath}?wareId=${this.data.options.skuId}`
    _sharePath = this.data.shareUrl ? `${_sharePath}&${this.data.shareUrl}` : _sharePath
    const res = plugin.emitter.emit("onShareAppMessageFn" + this.pageIndex, ev, _sharePath);
    return res;
  },
  /**
     * [onShareTimeline 商详分享至朋友圈]
     */
  onShareTimeline: function (ev) {
    const { wareData } = this.data;
    const wareInfo = wareData.wareInfo;
    let query = `wareId=${this.data.options.skuId}`;
    query = this.data.shareUrl ? `${query}&${this.data.shareUrl}` : query;
    return {
      title: wareInfo.name,
      query,
      imageUrl: wareData.wareImage[0].big,
    }
  },
  /**
     * [goPage description]
     * @param  {[type]} pageInfo [description]
     * @param  {[type]} jumpMode [跳转方式：navigateTo，navigateBack， redirectTo]
     * @param  {[type]} url [条状路径]
     * @return {[type]}          [description]
     */
  goPage(pageInfo) {
    console.log(pageInfo);
    // const pageInfo = triggerObj.detail.pageInfo
    if (!pageInfo || !pageInfo.jumpMode || !pageInfo.url) {
      return;
    }
    wx[pageInfo.jumpMode]({
      url: pageInfo.url,
      success() {},
      fail(err) {
        console.log(err);
      },
    });
  },
})



