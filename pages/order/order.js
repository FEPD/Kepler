var plugin = requirePlugin("myPlugin");
const util = require('../utils/util.js');
const app = getApp();
Page({
	data:{
		logSet:{
      urlParam:'',
			title: '订单详情', //网页标题
      pageId:'Wpersonal_OrderDetails',
      siteId: 'WXAPP-JA2016-1', //开普勒小程序固定用：WXAPP-JA2016-1
      pparam: '1'
  }
	},
	onLoad: function (options) {
    const wxCurrPage = getCurrentPages();//获取当前页面的页面栈
		util.checkVersion();
		this.setData({
			options: options,
      wxCurrPage: wxCurrPage,
			tabbarConfig: app.tabBar
		})
		// util.checkVersion();
   
		// this.order = this.selectComponent('#order');
	},
	
	goOrderDetail: function (e) {
		let data = e.detail;
		wx.navigateTo({
			url: '../orderDetail/orderDetail?' + data.strDetailUrlParams
			// url: '../getCoupon/getCoupon?key=dd63b86235b84ee5b43f05aef3f8c29a&roleId=11832085&to=https://pro.m.jd.com/mall/active/3d34Pm49obpjLEdhhagSZuM5QrwC/index.html'
		});
	},
	goToLogin: function (e){
		let resultObj = e.detail;
		console.log(resultObj);
		
	  if (resultObj.jumpWay =='navigate'){
	    wx.navigateTo({
	      url: resultObj.loginUrl,
	    });
	  } else if (resultObj.jumpWay == 'redirect'){
	    wx.redirectTo({
	      url: resultObj.loginUrl,
	    })
	  }
	},
	goOrderTrack: function (e) {
		//清除storage
		let trackUrl = e.detail.trackUrl;
		plugin.removeStorageSync('order_track_jump_url')
		plugin.setStorage({
		  key: 'order_track_jump_url',
		  data: {
		    'trackUrl': trackUrl
		  },
		  fail: function () {
		    console.log('set order_track_jump_url error in order module');
		  },
		  success: function () {
		    wx.navigateTo({
		      url: 'plugin-private://wx1edf489cb248852c/pages/orderTrack/orderTrack'
		    });
		  }
		});
	},
	goToPayment:function(){
	  wx.navigateTo({
	    url: '../payment/payment',
	  })
	},
	tabBarClick: function (e) {
    this.setData({
      "tabbarConfig.selectIndex":e.detail.index
    })
    if (e.detail.path != '../order/order'){
      wx.reLaunch({
        url: '/'+e.detail.path,
      })
    } 
  }
})