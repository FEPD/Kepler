var utils = require('../shop_utils/util');
var log = require('../shop_utils/keplerReport.js').init();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proInfo: {
      data:[]
    },
    shopId: '',
    hasNext: true, // 是否有下一页
    pageNum: 1,
    pageSize: 20,
    requestUrl:'',
    skuType:'',
    pvFlag:true,
    isfirstload: true, // 是否是第一次加载此页面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var type = options.type||'';
    var title="";
    var requestUrl="";
    if (type === 'MS'){
      title = '限时秒杀';
      requestUrl='/shopwechat/shophomesoa/getShopSecKillPage'

    }else if(type === 'SG'){
      title = '限时闪购'
      requestUrl='/shopwechat/shophomesoa/getShopGwredPage'
    }
    wx.setNavigationBarTitle({ title: title });
    let shopID = wx.getStorageSync('shopID');
    that.setData({
      shopId: shopID,
      requestUrl:requestUrl,
      skuType:type
    });
    that.getData();
    this.data.isfirstload=false
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight
        });
      }
    });
    //加密key和openid都是异步获取 ，所以setLogPv封装成一个promise 来同步数据
    utils.setLogPv({
      urlParam:options, //onLoad事件传入的url参数对象
      title:title, //网页标题
      pparam: that.data.shopId,
      pageId:type == 'MS'?'Wshop_SecondKillList':'Wshop_FlashList',
      pageTitleErro:'pages/shopSecKill/shopSecKill/'+title
    }).then(function(data){
      log.set(data);
      if(that.data.pvFlag){
          that.data.pvFlag = false
          log.pv()
      }
    })
  },
  onShow:function(){
    if(this.data.isfirstload){
      this.data.pageNum=1
      this.getData()
    }
    this.data.isfirstload=true
     //this.data.pvFlag为true 上报pv
     if(!this.data.pvFlag){
      log.pv()
    } 
  },
  // 数据请求
  getData: function (param) {
    //this.showToast();
    var that = this;
    var obj={};
    if(!param){
      obj = {
        shopId: that.data.shopId,
        page: that.data.pageNum,
        size: that.data.pageSize
      }
    }else{
      obj=param;
    }
    var body = JSON.stringify(obj)
    var url=app.globalRequestUrl + this.data.requestUrl;
    url = url + "?body=" + body;
    var that = this;
    utils.request({
        url: url,
        method: 'post',
        success: function (res) {
          var code = res.data.code;
          if (parseInt(code) == 0) {
            let result=res.data.result;
            result.currentTime=res.dateTime;
            that.toViewPage(result);
          }
        },
        complete: () => {
          that.setData({ loadmore: false })
        },
        fail: (e) => {
          utils.reportErr("#requestFail#"+(that.data.skuType=='SG'?"#requestFail#flash":"#requestFail#Spike"+"request fail：") + e.errMsg);
        }
    });
  },
  onReachBottom: function () {
    var that = this;
    if(!that.data.hasNext){
      return
    }
    that.setData({ loadmore: true })
    var obj = {
      shopId: that.data.shopId,
      page:that.data.pageNum,
      size:that.data.pageSize
    }; 
    that.getData(obj)
  },
  toTopTap: function (e) {
    var that = this;
    this.setData({
      toTopDisplay: "none",
      scrollTop: Math.random() * 0.001
    })
  },
  toViewPage: function (response) {
    var that = this;
    if (null != response && response.data) {
      if (response.data.length> 0) {
        var arrlist = this.data.proInfo.data.concat(response.data);
        response.data=arrlist;
        that.setData({
          hasNext: response.nextPage,
          pageNum: that.data.pageNum + 1,
          proInfo: response
        });
      }
    }
  },
  scroll: function (e) {
    if (e.detail.scrollTop > this.data.screenHeight) {
      this.setData({
        toTopDisplay: "block"
      })
    } else {
      this.setData({
        toTopDisplay: "none"
      })
    }
  },
  //组件内的埋点方法
  clickFunc: function (e) {
      this.pingClick(e.detail.eid, "", e.detail.eparam, e.detail.target||'', e.detail.ev,e.detail.pname,e.detail.event_name,e.detail.click_type)
  },
  //埋点方法调用
  pingClick: function (eid, elevel, eparam, target, event,pname,event_name,click_type) {
      var that = this;
      log.click({
      "eid": eid,
      "elevel": elevel,
      "eparam": eparam,
      "pname": pname,
      "pparam": "",
      "target": target, //选填，点击事件目标链接，凡是能取到链接的都要上报
      "event": event, //必填，点击事件event
      "event_name":event_name,
      "click_type":click_type
      });
  },
})
