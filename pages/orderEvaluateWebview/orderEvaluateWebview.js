var plugin = requirePlugin("myPlugin");
var log = plugin.log.init()
var app = getApp()
Page({
    data: {
        h5Url: '',
        options: {},
        isMoreProduct: false,
    },
    onLoad: function (options) {
        // 预发地址: let locUrlStr = 'https://apollob-evaluate.jd.com/?jdreactkey=JDReactEvaluateModule&jdreactapp=JDReactEvaluateModule&page=EvaluatePublish&productId=45696411572&orderId=0&publishTips=tips&productImage=&submitStyle=2&userClient=31';
        let locUrlStr = 'https://apollo-evaluate.jd.com/?jdreactkey=JDReactEvaluateModule&jdreactapp=JDReactEvaluateModule&page=EvaluatePublish&enableCache=1&productId='+options.productId+'&orderId='+options.orderId+'&publishTips=&productImage='+ encodeURIComponent(options.productImage)+'&submitStyle=2&userClient=31';
        var _that = this,
            newLocUrl = '',
            locUrl = encodeURIComponent(locUrlStr);

        plugin.promiseGentoken().then(function (res) {
            if (res.data.err_code == 0) {
                newLocUrl = res.data.url + '?to=' + locUrl + '&tokenkey=' + res.data.tokenkey;
                _that.setData({ h5Url: newLocUrl, options: options });
            }
        })
    },
    onShow: function () {
        const wxCurrPage = getCurrentPages();
        // console.log(wxCurrPage[wxCurrPage.length - 1].route)
        if (wxCurrPage[wxCurrPage.length - 1].route.indexOf('orderEvaluate/orderEvaluate') !== -1) { // 上级页面是评价中间页，表示为一单多品
            this.setData({
                isMoreProduct: true
            })
        }
    },
    /**
     * 获取h5 postMessage传递的数据
     */
    getMessage: function (e) {
        if (!this.data.isMoreProduct) { // 如果是一单一品，直接setStorageSync；如果是一单多品，在评价中间页onshow时setStorageSync
            let detailMsgList = e.detail.data;
            for (let i = 0; i < detailMsgList.length; i++) {
                if (detailMsgList[i].hasOwnProperty('code') && detailMsgList[i].code + '' === '0') {
                    // 评价发布成功时，将该订单id记录下来，供 (订单详情 | 订单列表) 更新【评价晒单】按钮状态
                    wx.setStorageSync('evaluate_success_orderid', this.data.options.orderId);
                }
            }
        }

    }
})