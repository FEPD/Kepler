var shop_util = require('../shop_utils/shop_util');
var mark = require('../shop_utils/individualMark.js');
//获取应用实例
var app = getApp()
var log = require('../shop_utils/keplerReport').init();
let Ad = require('../shop_utils/Ad.js');
var utils = require('../shop_utils/util');
let {checkH5UrlParams} = require('../shop_utils/checkH5UrlParams.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        option: '',
        h5Url: '',
        isLogin: false,
        jdaFlag: 0, //jda获取标识 1已获取并上报给直投 0 未获取
        pvFlag: true,
        venderId: ''
    },
    onLoad: function (options) {
        let that = this
        that.data.option = options;
        that.data.venderId = options && options.venderId;
        console.log('shopDetail页面参数', options);
        wx.hideShareMenu()
        //广告进入储存storage 供埋点使用
        if (options.platform) {
            (options.platform == 1 || options.platform == 2) && wx.setStorageSync('ad', 'zhitou');
            (options.platform == 99) && wx.setStorageSync('ad', 'jingteng');
        }
        //埋点上报设置
        //加密key和openid都是异步获取 ，所以setLogPv封装成一个promise 来同步数据
        utils.setLogPv({
            urlParam: options, //onLoad事件传入的url参数对象
            title: '店铺详情', //网页标题
            pageId: 'KeplerMiniAppShopDetail', //页面标识，默认为空，必填
            pageTitleErro: 'pages/jshopH5/jshopH5/店铺详情',
            account:(utils.getPtKey() || !wx.getStorageSync('jdlogin_pt_key') ) ? '-' : (utils.getPtKey() || wx.getStorageSync('jdlogin_pt_key')) //传入用户登陆京东的账号
        }).then(function (data) {
            log.set(data);
            if (that.data.pvFlag) {
                that.data.pvFlag = false
                log.pv()
            }
        })
        this.data.isLogin = !!(utils.getPtKey() || wx.getStorageSync('jdlogin_pt_key'))
        this.reLoadPage();
    },
    onShow: function () {
        let that = this
        let options = that.data.option
        //广告进入上报直投接口
        if (options.platform) {
            Ad.reportAdsData(options);
        }
        //this.data.pvFlag为true 上报pv
        if (!this.data.pvFlag) {
            log.pv()
        }
        if (this.data.isLogin != !!(utils.getPtKey() || wx.getStorageSync('jdlogin_pt_key'))) {
            this.data.isLogin = !!(utils.getPtKey() || wx.getStorageSync('jdlogin_pt_key'))
            this.reLoadPage();
        }
    },
    // 重新加载页面数据
    reLoadPage: function () {
        const _that = this;
        let venderId = _that.data.venderId || wx.getStorageSync("venderId") || '';
        let activityUrl = 'https://shop.m.jd.com/detail/detailInfo?wxAppName=Kepler&venderId='+venderId
        //防止微信直接抓链接去掉参数的异常处理
        let checkUrlParam = checkH5UrlParams(activityUrl,['venderId']);
        if(!checkUrlParam){
            wx.redirectTo({ url: '/pages/webViewError/webViewError' });
            return;
        }
        console.log(checkUrlParam,'checkH5RrlParams')
        _that.setData({ h5Url: activityUrl });
    },
    onShareAppMessage: function (e) {
    },
    onHide: function () {
        let that = this;
        //that.repeatSetReportAdsData();
    },
    onUnload: function () {
        let that = this;
        //that.repeatSetReportAdsData();
    },
    onH5LoadSuccess: function (res) {
        let H5src = res.detail.src;
        let indexOfCount = H5src.indexOf('wqs.jd.com/error.shtml')
        if (indexOfCount !== -1) {
            wx.redirectTo({ url: '/pages/webViewError/webViewError' })
        }
    },
    handleH5LoadError: function (err) {
        wx.redirectTo({ url: '/pages/webViewError/webViewError' })
    }

})
