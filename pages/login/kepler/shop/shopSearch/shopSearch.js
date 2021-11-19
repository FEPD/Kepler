// shopSearch.js
// var network_util = require('../../utils/network_util.js');
var utils = require('../shop_utils/util')
var shop_util = require('../shop_utils/shop_util.js')
var log = require('../shop_utils/keplerReport').init();
var request = require('../shop_utils/shop.request.js')
var app = getApp();
Page({
    data: {
        imgUrl: 'http://njst.360buyimg.com/jdreact/program/',
        returnpage: '',
        shopID: '',
        winWidth: 0,
        winHeight: 0,
        flex: false, // 浮动
        winScale: 0,
        scrollTop: "",          // 自动滚动的距离
        pageIndex: "",          // 当前分页,发送请求的参数
        nextPage: 0,           // 下一个分页
        tabIndex: 0,            // 选项卡的Index,发送请求的参数
        sortIndex: 0,
        tabItems: [],           // 选项卡
        list: [],               // 商品数据
        shopInfo: '',       // 顶部banner 店铺基本信息
        height_banner: 0,     // 顶部banner的高度
        isShowBackTop: false,
        hasNext: true, // 是否加载完毕
        loadingfailed: false, // 数据异常
        //head
        status: { "allProduct": true, "goodShop": true },
        select: { "recommend": true, "sale": false, "new": false, "price": false },
        priceImage: "shop_price_arrow_normal.png",
        priceUp: true,
        isBanner: false,
        boolBack: false,
        netError: false,// 网络错误
        noData: false,// 该分类没有数据
        loading: false,
        promotion: '促销',
        promotionID: 0,
        promotionType: 0,
        selectIndex: 0,
        platform: '',// 平台
        selectShopName: [],
        selectShop: [],
        client: 'apple',
        clientVersion: '5.7.0',
        isShopPage: true,
        shareDes: '',
        pixelRatio: '',
        networkType: '',
        bDisplayMask: false,
        searchText: '',
        bInputText: false,
        bGoodShop: false,
        focus: false,
        isShowTab: true,
        scrollHeight: 0,
        forceHidden: false,
        animationData: {},
        cateId: '',
        state: 1,// 1 请求中 2 首次异常 3 加载更多数据异常
        requestParam: { "searchType": 4, "sort": 0, "pageIdx": 1, "pageSize": 20 },// 请求参数
        logoType: 1, // 1 正方形 2 长方形
        pvFlag:true,
        hotwords:[],
        hasSearch:false ,
        isShowHotwords:true,
        isXproject:false
    },

    /** systemsystem cycle*/
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        wx.showLoading({
            title:'加载中...'
        })
        var that = this;
        var obj = shop_util.getShopConfigure();
        var shopID = obj.configure.shopID;
        var optionsShopID = options.shopId;
        if (optionsShopID) {
            shopID = optionsShopID;
        }
        if (!shopID) {
            shopID = wx.getStorageSync('shopID');
        }
        var shopInfo = [];
        let shopList = [];
        var shop = shopInfo.map(function (item, index) {
            shopList.push(item.name)
        })

        that.setData({
            shopID: shopID,
            selectShop: shopInfo,
            searchText: options.keyWord ? options.keyWord : '',
            cateId: options.cateId ? options.cateId : '',
            isShowHotwords: options.focus ? options.focus : false,
            isXproject: app.globalData.mvpType == 'x_project'
        });
        console.log(this.data.searchText);

        /** 获取系统信息 begin*/
        wx.getSystemInfo({
            success: function (res) {
                // success
                var winScale = (res.windowWidth / 320.0)//招牌图高度
                var height_banner = 100 * winScale//招牌图高度
                var platform = res.platform
                var pixelRatio = res.pixelRatio;

                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight,
                    height_banner: height_banner,
                    winScale: winScale,
                    platform: res.platform,
                    pixelRatio: pixelRatio,
                });
            }
        });

        wx.getNetworkType({
            success: function (res) {
                var networkType = res.networkType // 返回网络类型2g，3g，4g，wifi
                that.setData({
                    networkType: networkType,
                });
            }
        })
        /** 获取系统信息 end*/

        /** 网络请求 begin*/
        //获取店铺信息
        this._getShopHomeData();
        //获取全部商品
        if(options.cateId){
            this.requestSearchWare();
        }
        // this.getHotWord();


        /** 网络请求 end*/

        // //埋点上报设置
        // log.set({
        //   urlParam: options, //onLoad事件传入的url参数对象
        //   //skuid:'testskuid', //单品页上报，传入商品id
        //   title: '搜索', //网页标题
        //   siteId: 'WXAPP-JA2016-1', //开普勒小程序固定用：WXAPP-JA2016-1
        //   //account:'testuser'  //传入用户登陆京东的账号
        //   //loadtime: 2.3 //页面加载耗时，单位秒，选填
        // });

        //埋点上报设置
        // log.set({
        //     urlParam: options, //onLoad事件传入的url参数对象
        //     //skuid:'testskuid', //单品页上报，传入商品id
        //     title: '店铺搜索', //网页标题
        //     shopid: this.data.shopID, //店铺id，店铺页pop商品页传店铺id，其他页面留空即可
        //     pname: '',
        //     pparam: this.data.shopID + "",
        //     pageId: 'KeplerMiniAppShopSearch',
        //     siteId: 'WXAPP-JA2016-1', //开普勒小程序固定用：WXAPP-JA2016-1
        //     //account:'testuser'  //传入用户登陆京东的账号
        //     //loadtime: 2.3 //页面加载耗时，单位秒，选填
        //     account: !wx.getStorageSync('jdlogin_pt_key') ? '-' : wx.getStorageSync('jdlogin_pt_key')  //传入用户登陆京东的账号
        //
        // });
            //setLogPv 返回值是一个json对象 json.pvFlag记录ptKey获取状态 json.setPvData是上报pv所需参数

            //埋点上报设置
        //埋点上报设置
    //加密key和openid都是异步获取 ，所以setLogPv封装成一个promise 来同步数据
    this.setSpv(options)


    },
    setSpv(options){
        let that = this
        that.data.pvFlag = true
        utils.setLogPv({
            urlParam: options||'', //onLoad事件传入的url参数对象
            //skuid:'testskuid', //单品页上报，传入商品id
            title: '店铺搜索', //网页标题
            shopid: this.data.shopID, //店铺id，店铺页pop商品页传店铺id，其他页面留空即可
            pname: '',
            pparam: this.data.shopID + "_" + this.data.searchText,
            pageId: 'Kepler_Shop_Search',
            siteId: 'WXAPP-JA2016-1', //开普勒小程序固定用：WXAPP-JA2016-1
            //account:'testuser'  //传入用户登陆京东的账号
            //loadtime: 2.3 //页面加载耗时，单位秒，选填
            // account: !wx.getStorageSync('jdlogin_pt_key') ? '-' : wx.getStorageSync('jdlogin_pt_key')  //传入用户登陆京东的账号
            pageTitleErro:'pages/shop/shopSearch/shopSearch/店铺搜索',
            account:(utils.getPtKey() || !wx.getStorageSync('jdlogin_pt_key') ) ? '-' : (utils.getPtKey() || wx.getStorageSync('jdlogin_pt_key')) //传入用户登陆京东的账号

        }).then(function(data){
            log.set(data);
            if(that.data.pvFlag){
                that.data.pvFlag = false
                log.pv()
            }
        })
    },
    onReady: function () {
        // 页面渲染完成

    },
    onShow: function () {
        //this.data.pvFlag为true 上报pv
        if(!this.data.pvFlag) {
            log.pv()
        }
        this.getHotWord()

    },
    onHide: function () {
        // 页面隐藏
        //上报留存时长，需要在页面的onUnload、onHide事件中调用log.pageUnload()方法可实现页面留存时长统计
        log.pageUnload()
    },
    onUnload: function () {
        // 页面关闭
        //上报留存时长，需要在页面的onUnload、onHide事件中调用log.pageUnload()方法可实现页面留存时长统计
        log.pageUnload()
    },

    // 滚动到底部加载更多数据
    onReachBottom: function () {
        if (!this.data.hasNext) {
            return;
        }
        this.requestSearchWare()
    },

    loadLogo: function (e) {
        console.log('图片加载完成')
        console.log(e);
        var w = e.detail.width;
        var h = e.detail.height;
        this.setData({ logoType: (w === h) ? 1 : 2 })
    },
     //店铺详情
     goShopDetail:function(){
        let venderId = wx.getStorageSync('venderId')||''
        wx.navigateTo({
            url:'/pages/shop/shopDetail/shopDetail?venderId='+venderId
        })
    },

    // page滚动偏移监听
    onPageScroll: function (e) {
        var scrollTop = e.scrollTop;
        if (scrollTop >= this.data.winHeight && !this.data.isShowBackTop) {
            this.setData({ isShowBackTop: true, })
        } else if (scrollTop < this.data.winHeight && this.data.isShowBackTop) {
            this.setData({ isShowBackTop: false })
        }
    },

    /**
     *
     * Action Event
     *
     */

    /** 点击选项卡－全部商品－推荐 */
    recommend_tap: function () {
        log.click({
            "eid": "KMiniAppShop_AllGoodsTab",
            "elevel": "",
            "eparam": "推荐",
            "pname": "/pages/shop/shop",
            "pparam": "",
            "target": "",
            "event": "subClick",
        });
        this.setData({
            priceImage: "shop_price_arrow_normal.png",
            list: [],
            select: { "recommend": true, "sale": false, "new": false, "price": false },
            priceUp: true,
            hasNext: true,
        });
        this.data.requestParam.sort = 0;
        this.data.requestParam.pageIdx = 1;
        this.setData({
            requestParam: this.data.requestParam
        });
        this.requestSearchWare();
    },
    /** 点击选项卡－全部商品－销量 */
    sale_tap: function () {
        log.click({
            "eid": "KMiniAppShop_AllGoodsTab",
            "elevel": "",
            "eparam": "销量",
            "pname": "/pages/shop/shop",
            "pparam": "",
            "target": "",
            "event": "subClick",
        });
        this.setData({
            priceImage: "shop_price_arrow_normal.png",
            list: [],
            select: { "recommend": false, "sale": true, "new": false, "price": false },
            priceUp: true,
            hasNext: true,
        });
        this.data.requestParam.sort = 1;
        this.data.requestParam.pageIdx = 1;
        this.setData({
            requestParam: this.data.requestParam
        });
        this.requestSearchWare();
    },
    /** 点击选项卡－全部商品－新品 */
    new_tap: function () {
        log.click({
            "eid": "KMiniAppShop_AllGoodsTab",
            "elevel": "",
            "eparam": "新品",
            "pname": "/pages/shop/shop",
            "pparam": "",
            "target": "",
            "event": "subClick",
        });
        this.setData({
            select: { "recommend": false, "sale": false, "new": true, "price": false },
            hasNext: true,
            priceImage: "shop_price_arrow_normal.png",
            priceUp: true,
            list: [],
        });
        this.data.requestParam.sort = 5;
        this.data.requestParam.pageIdx = 1;
        this.setData({
            requestParam: this.data.requestParam
        });
        this.requestSearchWare();
    },
    /** 点击选项卡－全部商品－价格 */
    price_tap: function () {
        log.click({
            "eid": "KMiniAppShop_AllGoodsTab",
            "elevel": "",
            "eparam": "价格",
            "pname": "/pages/shop/shop",
            "pparam": "",
            "target": "",
            "event": "subClick",
        });
        if (this.data.priceUp) {
            this.setData({
                select: { "recommend": false, "sale": false, "new": false, "price": true },
                hasNext: true,
                priceImage: "shop_price_arrow_up.png",
                priceUp: false,
                list: [],
            });
            this.data.requestParam.sort = 3;
            this.data.requestParam.pageIdx = 1;
            this.setData({
                requestParam: this.data.requestParam
            });
            this.requestSearchWare();
        } else {
            this.setData({
                select: { "recommend": false, "sale": false, "new": false, "price": true },
                hasNext: true,
                priceImage: "shop_price_arrow_down.png",
                priceUp: true,
                list: [],
            });
            this.data.requestParam.sort = 2;
            this.data.requestParam.pageIdx = 1;
            this.setData({
                requestParam: this.data.requestParam
            });
            this.requestSearchWare();
        }
    },
    /** 点击滚动到顶部 */
    backtoTop: function () {
        if (wx.pageScrollTo) {
            wx.pageScrollTo({
                scrollTop: 0
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    },


    bindfocus: function (event) {
        log.click({
            "eid": "KMiniAppShop_Search",
            "elevel": "",
            "eparam": "",
            "pname": "/pages/shop/shop",
            "pparam": "",
            "target": "",
            "event": event,
        });
        this.setData({ bDisplayMask: true, focus: true,isShowHotwords:true });
    },
    bindblur: function (event) {
        this.setData({
            // bDisplayMask: false,
            focus: false
        });
    },
    bindinput: function (event) {
        this.setData({ searchText: event.detail.value });
    },
    deleteClick: function (event) {
        this.setData({
            searchText: '',
            bDisplayMask: true,
            isShowHotwords: true,
        });
    },
    clickSearch: function (event) {
        this.data.cateId = ''
        if (this.data.searchText && this.data.searchText.length) {
            // 搜索
            this.setData({
                state:1,
                hasNext: true,
                list: [],
                isShowHotwords:false
            });
            this.data.requestParam.pageIdx = 1;

            this.requestSearchWare();
        }else{
            console.log("取消了")
            this.setData({
                bDisplayMask: false,
                focus: false,
                nextPage: 1,
                isShowHotwords:this.data.list.length>0?false:true
            });
        }

        if (this.data.searchText) {
            console.log("搜索结果页搜索执行了")
            // this._searchWare('4', 1, this.data.sortIndex);
            log.click({
                "eid": "WShop_Search",
                "elevel": "",
                "eparam":this.data.searchText,
                "pname": "/pages/shop/shopSearch/shopSearch",
                "pparam": "",
                "target": "",
                "event": event,
            });
        } else {
            log.click({
                "eid": "WShop_CancelSearch",
                "elevel": "",
                "eparam": "",
                "pname": "/pages/shop/shopSearch/shopSearch",
                "pparam": "",
                "target": "",
                "event": event,
            });
        };

    },
    clickMask: function (event) {
        this.setData({ bDisplayMask: false, focus: false, searchText: '', });
    },
    hideHotwords(){
        this.setData({
            isShowHotwords: this.data.list.length>0?false:true,
        });
    },

    // 网络异常点击重新加载
    onReload: function () {
        this.requestSearchWare()
    },

    /**
     *
     *  NetRequest
     *
     */
    _getShopHomeData: function () {
        var body = {
            shopId: this.data.shopID,
        }
        var strBody = JSON.stringify(body);
        var obj = new Object();
        obj.body = strBody;
        obj.screen = (this.data.winWidth * this.data.pixelRatio) + '*' + (this.data.winHeight * this.data.pixelRatio)
        var url = app.globalRequestUrl + '/shopwechat/shophomesoa/getShopHomeData';
        var that = this;
        wx.request({
            url: url,
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            data: obj,
            success: function (res) {
                var code = res.data.code;
                if (parseInt(code) == 0) {
                    that.setData({ shopInfo: res.data.result.shopInfo })
                }
            },
            fail: function (res) {
            },
            complete: function (res) {
            }
        });
    },

    // 获取全部商品
    requestSearchWare: function () {
        this.setSpv()
        var that = this;
        var param = this.data.requestParam;
        if (this.data.cateId.length) {
            param.searchType = '5';
        } else {
            param.searchType = '4';
        }
        param.keyWord = this.data.searchText;
        param.cateId = this.data.cateId;
        that.setData({ state: 1 ,hasSearch:true})
        const getOpenid = require('../shop_utils/getOpenid');
        getOpenid.kGetCleanOpenid().then((openid) => {
            param.openId= openid;
            that.getSearchWare(param)
        }).catch(function (res) {
            let stringRes = JSON.stringify(res)
            util.reportErr("#requestFail#getOpenid.kGetCleanOpenid fail", stringRes);
        })
    },
    getSearchWare: function(param){
        let that=this;
        request.searchWare(param, (data, hasNext) => {
            if (data) {
                var list = this.data.list.concat(data)
                console.log(list)
                that.setData({
                    list: list,
                    hasNext: hasNext,
                    state: 0,
                })
                this.data.requestParam.pageIdx += 1;
            } else { that.setData({ state: 0, hasNext: false }) }
        }, (error) => {
            var state = 2;
            if (this.data.list && this.data.list.length) {
                state = 3;
            }
            that.setData({ state: state })
        })
    },
    getHotWord(){
        var that = this;
        request.getHotWord((data, hasNext) => {
            if (data && data.data) {
                that.setData({
                    hotwords: data.data,
                })
            }
            wx.hideLoading()
        }, (error) => {
            wx.hideLoading()
        })
    },
    toCategory(e){
        log.click({
            "eid": "Kepler_Shop_Search_Tip",
            "elevel": "",
            "eparam": this.data.shopID,
            "pname": "/pages/shop/shopSearch/shopSearch",
            "pageId": 'Kepler_Shop_Search',
            "pparam": "",
            "target": "",
            "event": e,
            "event_name": "查看店内分类按钮",
            "click_type": 1,
        });
       wx.switchTab({
           url:'/pages/shop/shopCategories/index'
       })
    },
    searchHotWord(e){
        let word = e.currentTarget.dataset.item
        this.setData({
            searchText: word,
            isShowHotwords:false,
            hasNext:true,
            state:1,
            cateId:'' ,
            list: [],
            requestParam: { "searchType": 4, "sort": 0, "pageIdx": 1, "pageSize": 20 },// 请求参数
        });
        //获取全部商品
        this.requestSearchWare();
    }

})
