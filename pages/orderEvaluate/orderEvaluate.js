Page({
    data: {
        options: {},
    },
    onLoad: function (options) {
        this.setData({
            options: options
        })
    },
    onShow: function () {},
    /**
     * 去评价，直接跳转 评价发布页
     * @param {*} e 
     */
	goToEvaluate: function (e) {
        // console.log('点击跳转【评价发布页】...')
        // console.log(e.detail)

        let resultObj = e.detail
		let	navigate_url = '../orderEvaluateWebview/orderEvaluateWebview?productId=' + resultObj.firstWareId + '&orderId=' + resultObj.orderId + '&productImage=' + resultObj.firstWareImg
		wx.navigateTo({
			url: navigate_url
		});
    },
    setEvaluateSuccessOrderid: function(e) {
        let orderId = e.detail;
        wx.setStorageSync('evaluate_success_orderid', orderId);
    },
    delEvaluateSuccessOrderid: function() {
        wx.removeStorageSync('evaluate_success_orderid')
    }
})