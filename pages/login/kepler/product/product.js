var plugin = requirePlugin("myPlugin");
const util = require('../utils/util.js');
let app = getApp();
Page({
  data:{
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
    this.pageIndex = getCurrentPages().length;
    const wxCurrPage = getCurrentPages();//获取当前页面的页面栈

    let pageStackLists = []
    wxCurrPage.forEach(item => {
      pageStackLists.push({
        route: item.route
      })
    })
    if (options.isLocGuider == '1') {
       plugin.setStorageSync('isLocGuider', true);
    }
    options = plugin.initItemOptions(options)
    // plugin.initStyle(this.data.option);
    this.setData({
      options: Object.assign({}, this.data.option, {
        skuId: options.wareId,
        pageParams: options,
        wxCurrPage: pageStackLists
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
    that.getRootPath();//获取全局根目录
    // 设置分享链接，增加分佣spreadUrl
    let app = getApp();
    let unionId = (app.globalData && app.globalData.unionId) || ''
    // 存储当前用户所在位置经纬度
    this.getUserAuthSetting();
    if (unionId) {
      plugin.getSpreadUrl(that.data.options.skuId, unionId).then((res)=>{
        that.data.shareUrl = `/${this.data.rootPath}?wareId=${that.data.options.skuId}&spreadUrl=${res.shortUrl}`
      }, (res)=> {
        that.data.shareUrl = `/${this.data.rootPath}?wareId=${that.data.options.skuId}`
      })
    } else {
      that.data.shareUrl = `/${this.data.rootPath}?wareId=${that.data.options.skuId}`
    }
    this.data.refreshCount != 1 ? plugin.emitter.emit('refreshPage' + this.pageIndex, Object.assign({},{isOnShow: true}, {data:this.data.options},)) : this.data.refreshCount++;
  },
  // 刷新商祥页，切换地址后，重新渲染商详
  productRefreshPage (sitesAddress) {
    let regionIdStr = sitesAddress && sitesAddress.regionIdStr
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
      wrapStyle = 'top: -' + this.data.scrollTop + 'px; position: relative;'
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

    // 如果是导购员，分享链接拼接经纬度信息
    
    let _shareUrl = this.data.shareUrl ? this.data.shareUrl : `/${this.data.rootPath}?wareId=${this.data.wareId}`;
    let locParams = plugin.getLocParams(this.data.options.pageParams);
    console.log('locParams====', locParams)
    if (locParams == -1) {
      let _lng = plugin.getStorageSync('user_lng')
      let _lat = plugin.getStorageSync('user_lat')
      console.log('_lng======', _lng, _lat)
      if (_lng && _lat) {
        _shareUrl = _shareUrl + '&lng=' + _lng + '&lat=' + _lat;
      }
    } else {
      _shareUrl = _shareUrl + locParams
    }
    console.log('_shareUrl=======', _shareUrl)
    return {
      title: this.data.productName,
      path: _shareUrl,
    }
  },
})



