var plugin = requirePlugin("myPlugin");
const util = require('../utils/util.js');

Page({
	onLoad: function (options) {

		util.checkVersion();
		this.setData({
			options: options
		})
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
	}
})