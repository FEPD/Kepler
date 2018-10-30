var plugin = requirePlugin("myPlugin");
let loginPlugin = requirePlugin("loginPlugin");
var log = plugin.keplerReportInit();//埋点上报方法
const util = require('../utils/util.js');

let app = getApp();
Page({
	onLoad: function (options) {

    	util.checkVersion();
		this.setData({
			options: options
		})

		this.setCouponParams();
		let getCoupon = this.selectComponent('#get-coupon');
	},
	
	// 领券时毕传参数
	setCouponParams: function () {
		plugin.fingerPrint.Jdwebm();
		app.globalData.wxCookie = plugin.fingerPrint.CookieUtils;
		plugin.setStorageSync('storage_shshshfp', app.globalData.wxCookie.getCookie('shshshfp'));
		plugin.setStorageSync('storage_shshshfpa', app.globalData.wxCookie.getCookie('shshshfpa'))
		plugin.setStorageSync('storage_shshshfpb', app.globalData.wxCookie.getCookie('shshshfpb'))
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
	goToBack: function (e) {
      wx.navigateBack({});
	}

})