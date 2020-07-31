var plugin = requirePlugin("myPlugin");
var log = plugin.log.init()
var app = getApp()

Page({
	data: {
		shareObj: '',
		webUrl: '',
		canIUse: wx.canIUse('web-view.src'),
		pvFlag: true,	
	},
	onLoad: function (options) {
    let that = this
    app.urlAddSeries = log.urlAddSeries('');
    plugin.getwebH5Param(options, app, (webObj)=>{
			if(!webObj.url) {
        return;
      }
			if (webObj.title) {
				wx.setNavigationBarTitle({
						title: webObj.title
				})
			}
			if (webObj.shareObj) {
				that.data.shareObj = webObj.shareObj
				wx.showShareMenu()
			} else {
				wx.hideShareMenu()
			}
      plugin.promiseGentoken().then(function(res){
				if(res.data.err_code==0){
					let _webUrl = res.data.url+'?to='+webObj.url+'&tokenkey='+res.data.tokenkey;
					that.setData({webUrl:_webUrl});
				}
			})
			if (webObj.logObj) {
				plugin.setLogPv(webObj.logObj).then((data)=>{
					log.set(data);
					if (that.data.pvFlag) {
						that.data.pvFlag = false;
						log.pv();
					}
				})
			}
    })
	},
	onShow: function () {
		if (!this.data.pvFlag) {
      log.pv();
    }
	},
	// 分享
  onShareAppMessage: function () {
		return this.data.shareObj
  }
})