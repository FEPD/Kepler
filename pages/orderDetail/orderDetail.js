var plugin = requirePlugin("myPlugin");
var log = plugin.keplerReportInit();//埋点上报方法

Page({
	onLoad: function (options) {
		this.setData({
			options: options
		})
		this.orderDetail = this.selectComponent('#order-detail');
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