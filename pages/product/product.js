var plugin = requirePlugin("myPlugin");
const util = require('../utils/util.js');
let app = getApp();
Page({
  data:{
    option:{
      apolloId: app.globalData.apolloId ? app.globalData.apolloId : 'd1543fc0e8274901be01a9d9fcfbf76e',       //阿波罗Id
      apolloSecret: app.globalData.apolloSecret ? app.globalData.apolloSecret :'162f0903a33a445db6af0461c63c6a3b',   //阿波罗secret
      moudleId: "product"                                 //标识阿波罗组件加载商祥页
    },
    refreshCount:0,     // 避免进来onload和onShow同时多余请求
    scrollTop: 0,        //滚动距离
    pageStyle: 'position: relative',
    wrapStyle: '',
    toTopDisplay: 'none',    // 是否展示回到顶部按钮
    screenHeight:0,         // 屏幕高度
  },
  onLoad: function(options) {
    this.pageIndex = getCurrentPages().length;

    // plugin.initStyle(this.data.option);
    this.setData({
      options: Object.assign({}, this.data.option, {
        skuId: options.wareId,
        pageParams: options
      })
    })

    util.checkVersion()

    plugin.emitter.on('fixedPageBg' + this.pageIndex, this.fixedPageBg.bind(this))
    plugin.emitter.on('goPage' + this.pageIndex, this.goPage.bind(this));
    plugin.emitter.on('scrollToPostion' + this.pageIndex, this.scrollToPostion.bind(this))
    plugin.emitter.on('updateSkuId' + this.pageIndex, this.updateSkuId.bind(this))
    plugin.emitter.on('productRefreshPage' + this.pageIndex, this.productRefreshPage.bind(this))
    this.data.refreshCount++;
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });
  },
  onUnload () {
    // 页面卸载时，注销发布事件
    plugin.emitter.off('updateSkuId' + this.pageIndex)
    plugin.emitter.off('goPage' + this.pageIndex);
    plugin.emitter.off('scrollToPostion' + this.pageIndex)
    plugin.emitter.off('fixedPageBg' + this.pageIndex)
    plugin.emitter.off('productRefreshPage' + this.pageIndex)
  },
  onShow:function(){
    let that = this;

    // 设置分享链接，增加分佣spreadUrl
    let app = getApp();
    let unionId = (app.globalData && app.globalData.unionId) || ''
    if (unionId) {
      plugin.getSpreadUrl(that.data.options.skuId, unionId).then((res)=>{
        that.data.shareUrl = `/pages/product/product?wareId=${that.data.options.skuId}&spreadUrl=${res.shortUrl}`
      }, (res)=> {
        that.data.shareUrl = `/pages/product/product?wareId=${that.data.options.skuId}`
      })
    } else {
      that.data.shareUrl = `/pages/product/product?wareId=${that.data.options.skuId}`
    }
    this.data.refreshCount != 1 ? plugin.emitter.emit('refreshPage' + this.pageIndex, Object.assign({},{isOnShow: true}, {data:this.data.options},)) : this.data.refreshCount++;
  },
  // 刷新商祥页
  productRefreshPage () {
    plugin.emitter.emit('refreshPage' + this.pageIndex, Object.assign({}, {data:this.data.options},))
  },
  /**
   * [goPage description]
   * @param  {[type]} pageInfo [description]
   * @param  {[type]} jumpMode [跳转方式：navigateTo，navigateBack， redirectTo]
   * @param  {[type]} url [条状路径]
   * @return {[type]}          [description]
   */
  goPage (pageInfo) {
    if (!pageInfo || !pageInfo.jumpMode || !pageInfo.url ) {
      return;
    }
    wx[pageInfo.jumpMode]({
      url: pageInfo.url,
      success () {
        wx.hideToast()
      }
    })
  },
  // 切换商祥skuId
  updateSkuId (skuId) {
    this.data.options.skuId = skuId
  },
  // 触底函数
  onReachBottom:function(e){
    plugin.emitter.emit('reachBottom' + this.pageIndex, e)
    //图文详情触底加载
    // this.product.methods.showProductDetail();
  },
  // 动态控制滚动条
  scrollToPostion () {
    wx.pageScrollTo({
      scrollTop: this.data.scrollTop + 50,
      duration: 200
    })
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
  // 当有弹框时，需固定页面背景
  // flag: 是否固定背景，true为固定，false为恢复原位
  fixedPageBg (flag) {
    let pageStyle = 'position: relative; height: auto';
    let wrapStyle = '';
    if (flag) {
      this.fixScrollTop = this.data.scrollTop
      pageStyle = 'position: fixed;'
                + 'overflow: hidden;'
                + 'height:' + wx.getSystemInfoSync().windowHeight + 'px;'
                + 'width: ' + wx.getSystemInfoSync().screenWidth + 'px;'
      wrapStyle = 'top: -' + this.data.scrollTop + 'px;'
      this.setData({
        pageStyle: pageStyle,
        wrapStyle: wrapStyle
      })
    } else {
      this.setData({
        pageStyle: pageStyle,
        wrapStyle: ''
      })
      wx.pageScrollTo({
        scrollTop: this.fixScrollTop ? this.fixScrollTop : 0,
        duration: 0
      })
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

  /**
   * [onShareAppMessage 商祥页分享]
   */
  onShareAppMessage: function (ev) {
    plugin.emitter.emit('buryingPoint' + this.pageIndex, 'click', {
      "eid": "WProductDetail_ShareSuccess",
      "elevel": "",
      "eparam": "",
      "pparam": '',
      "target": "", //选填，点击事件目标链接，凡是能取到链接的都要上报
      "event": ev //必填，点击事件event            
    })
    return {
      title: this.data.productName,
      path: this.data.shareUrl ? this.data.shareUrl : `/pages/product/product?wareId=${that.data.wareId}`,
    }
  },
})



