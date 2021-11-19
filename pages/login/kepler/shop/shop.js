// var network_util = require('../../utils/network_util.js');
var utils = require("./shop_utils/util.js");
var shop_util = require("./shop_utils/shop_util.js");
var log = require("./shop_utils/keplerReport.js").init();
var request = require("./shop_utils/shop.request.js");
var jump = require("./shop_utils/jump.js");
// var modal = require("./model.js");
let appId = wx.getStorageSync("appid")
console.log(appId)
// obtain pluginInfo from ext.json.
let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
console.log(extConfig)
let pluginObj = {}
// for (let i in extConfig.plugins) {
//     pluginObj[i] = requirePlugin(i)
// }
// console.log(pluginObj)

// 小程序SEO上报skuId集合, 防止重复上报数据
let seoShopids = [];

let Ad = require('../shop/shop_utils/Ad.js');
var app = getApp();
//分享数据上报js
var shareFission = require('../shop/shop_utils/shareFission.js');
var coupoExpor = true;
var loginStatus = false; // 监听登陆状态，每次回到首页只要状态有改变即刷新首页接口
var searchReport = false; // 监听输入法
var screen_flag = false; //监听弹屏的状态
Page({
    data: {
        isApiError: false, // 接口报错展示兜底的标识
        wSceneTip:false,
        isIphoneX: app.globalData.isIphoneX,
        option: '',
        imgUrl: "http://njst.360buyimg.com/jdreact/program/",
        returnpage: "/pages/shop/shop",
        fromPageType: "switchTab",
        fromPageLevel: 1,
        shopID: "",
        winWidth: 0,
        winHeight: 0,
        scrollTop: 1, // 自动滚动的距离
        pageIndex: "", // 当前分页,发送请求的参数
        nextPage: 0, // 下一个分页
        tabIndex: 1, // 选项卡的Index,发送请求的参数
        sortIndex: 0,
        tabItems: [], // 选项卡
        list: [], // 商品数据
        shopInfo: "", // 顶部banner 店铺基本信息
        isShowBackTop: false,
        loadingfailed: false, // 数据异常
        //head
        status: {
            allProduct: false,
            goodShop: true
        },
        select: {
            recommend: true,
            sale: false,
            new: false,
            price: false
        },
        priceImage: "shop_price_arrow_normal.png",
        priceUp: true,
        isBanner: false,
        netError: false, // 网络错误
        noData: false, // 该分类没有数据
        loading: false,
        promotion: "促销",
        promotionID: 0,
        promotionType: 0,
        selectIndex: 0,
        platform: "", // 平台
        client: "apple",
        clientVersion: "5.7.0",
        showMy: false,
        shareDes: "",
        pixelRatio: "",
        networkType: "",
        bDisplayMask: false, // new
        searchText: "", // new
        bInputText: false, // new
        bGoodShop: true,
        floorData: [],
        floors: [],
        coupons: [],
        couponsCount: 0,
        showToast: {
            processStatus: "",
            desc: ""
        },
        isShowToast: false,
        isLogin: false,
        isRequestCoupons: false,
        focus: false,
        isShowTab: true,
        scrollHeight: 0,
        forceHidden: false,
        animationData: {},
        shopCategories: [],
        isShowActivity: false,
        allGoodList: [], // 全部商品
        hasNext: true,
        placeHeight: 188,
        state: 0, // 1 请求中 2 首次异常 3 加载更多数据异常
        tabKey: "",
        switchKey: "",
        promList: [],
        tabs: [],
        promo: {},
        userInfoBac: '',
        isScroll: false, //是否滚动了
        concernPlaceHeight: 40,
        requestParam: {}, // 请求参数
        logoType: 1, // 1 正方形 2 长方形
        needShieldShopCategory: false,
        conternData: 0, //关注的数据
        isShowHeart: false,
        follow: false, //用户是否关注  true:已关注   false：未关注
        conternMsg: "", //关注弹窗的内容
        giftMsg: [], //关注有礼大礼包
        followType: 1, //设置关注的类型 1关注  2关注有礼
        activityId: "",
        conternLoginStatus: false, //true:从登录页面回来  false：从其他页面回来
        isShowGift: false, //是否显示关注有礼的弹窗
        couponTimer: true, //防抖
        pendant_open: true, // 挂件icon
        newreward_open: true, // 挂件icon
        PendantParam: {}, //挂件对象
        ScreenParam: [], //弹窗对象
        currentScreenIndex: 0, //弹屏数组队列的当前索引
        redPacketToLogin: false, //判断是否是点击领取红包跳转的登录
        centerToLogin: false, //判断是否是点击中心化弹屏跳转的登录
        redPacketMsg: '红包到账，快去消费吧', //红包提示的文案
        redPackeTipsOpc: 0, //红包提示框的透明度动画
        isFirstScreen: true, //首屏控制onshow不请求挂件弹屏接口
        getCoupontempTimes: 1, //领取红包的尝试次数
        getCouponCenterTimes: 1, //领取中心化弹屏券的尝试次数
        getRedBagParams: {},
        getCenterParams: {},
        isVieoShow: false,
        screen_open: true,
        center_screen: '',
        center_screen_open: true,
        plugLoginStatus: false, //弹屏或者挂件是否从登录页面回来
        jdaFlag: 0,//jda获取标识 1已获取并上报给直投 0 未获取
        pvData: {},
        pvFlag: true, //记录pv是否在onload里上报
        contactInfo: {},
        fightPage: 0,
        scrollTime: 0,
        isShowLoadData: false,        //为了使onShow的时候加载数据，增加一个限制条件
        statusBarHeight: 0,
        isCustomTabbar: true,
        promoId: '',
        menuFixed: false, //活动促销的tab栏状态
        menuTop: 0,
        isActivitySupport: 1,//默认支持
        promotionFlag:'',//活动tab上方展示的文案
        currPromIdx:0, //当前促销title的index，
        floorIndex:0,
        floorTop:0,
        showAddToast:false, //是否展示添加到我的小程序弹框
        isShowContact:true  //是否展示关键词
    },

    /** systemsystem cycle*/
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
        })
        // //自定义tab bar用
        // let isCustomTabbar = utils.setTabBar(this)
        // this.setData({
        //     isCustomTabbar: isCustomTabbar
        // })

        //获取分享群ID
        wx.showShareMenu({
            withShareTicket: true
        })

        this.data.option = options;
        //广告进入储存storage 供埋点使用
        console.log('shop页面参数', options);
        if (options.platform) {
            (options.platform == 1 || options.platform == 2) && wx.setStorageSync('ad', 'zhitou');
            (options.platform == 99) && wx.setStorageSync('ad', 'jingteng');
        }
        let adStorage = wx.getStorageSync('ad') ? wx.getStorageSync('ad') : '';
        if (options.scene) {
            var scene = decodeURIComponent(options.scene);
            var sceneArr = scene.split("&");
            if (sceneArr[0]) {
                wx.setStorageSync("customerinfo", sceneArr[0]);
            } else {
                //wx.removeStorageSync("customerinfo");//史辰出了最新的清除方案，在全局onshow统一清除
            }
            if (sceneArr[1]) {
                var globalWxappStorageName = wx.getStorageSync("wxappStorageName");
                var tmpData = wx.getStorageSync(globalWxappStorageName);
                tmpData.unionid = sceneArr[1];
                wx.setStorageSync(globalWxappStorageName, tmpData);
            }
        }
        // 获取登录状态
        let jdlogin_pt_key = utils.getPtKey() || wx.getStorageSync("jdlogin_pt_key");
        loginStatus = jdlogin_pt_key ? true : false;

        var that = this;
        var obj = shop_util.getShopConfigure();
 
        var shopID = obj.configure.shopID;
        var optionsShopID = options.shopId;
        if (optionsShopID) {
            shopID = optionsShopID;
            this.setData({
                fromPageType: "",
                fromPageLevel: 0
            });
        }
        if (!shopID) {
            shopID = wx.getStorageSync("shopID");
        }
        // 从商祥页跳入店铺页，当店铺页为tabBar页面时，触发此条件
        if (app && app.globalData && app.globalData.shopInfo && app.globalData.shopInfo.shopId && app.globalData.shopInfo.shopName) {
            shopID = app.globalData.shopInfo.shopId;
            options.shopName = app.globalData.shopInfo.shopName;
            app.globalData.shopInfo = null;
        }
        wx.setStorageSync("shopID", shopID);
        wx.setStorageSync("shopId", shopID);

        wx.setNavigationBarTitle({
            title: options.shopName ? options.shopName : (obj.configure.shopName ? obj.configure.shopName : '')
        });
        that.setData({
            shopID: shopID,
            needShieldShopCategory: app.globalConfig && app.globalConfig.needShieldShopCategory ?
                app.globalConfig.needShieldShopCategory : false
        });

        /** 获取系统信息 begin*/
        wx.getSystemInfo({
            success: function (res) {
                // success
                var platform = res.platform;
                var pixelRatio = res.pixelRatio;
                var winScale = (res.windowWidth / 375.0)//招牌图高度
                var statusBarHeight = res.statusBarHeight

                var data = wx.getMenuButtonBoundingClientRect()
                console.log('菜单按键宽度：', data.width)
                console.log('菜单按键高度：', data.height)
                console.log('菜单按键上边界坐标：', data.top)
                console.log('菜单按键右边界坐标：', data.right)

                that.setData({
                    menuWidth: data.width,
                    menuRight: res.windowWidth - data.right,
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight,
                    platform: res.platform,
                    pixelRatio: pixelRatio,
                    winScale: winScale,
                    statusBarHeight: statusBarHeight,
                    concernPlaceHeight: statusBarHeight,
                });
            }
        });

        wx.getNetworkType({
            success: function (res) {
                var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
                that.setData({
                    networkType: networkType
                });
            }
        });

        setTimeout(() => {
            this.data.coupons.length > 0 ? utils.toGenerateFingerPrint() : '';
        }, 1000)
        // 获取首页数据
        // !loginStatus && this.getShopHomeData();
        if (!loginStatus || !!options.refreshShopFlag) {
          this.getShopHomeData();
        }
        // 年货节
        this.isShowActivityIcon();

        let isRisk = wx.getStorageSync("isRisk");
        // 中心化弹屏有值就不显示
        // let center_screen = wx.getStorageSync("center_screen");
        // if(center_screen){
        //     this.setData({
        //         center_screen:center_screen,
        //     })
        // }

       // this.getPopup();
        //获取客服消息
        this.getContactInfo();

        if (isRisk == "false") {
            this.setData({
                screen_open: false,
                pendant_open: false
            })
        }
        if (loginStatus == true && this.data.plugLoginStatus == true) {
            this.plugFn(this.data.shopID);
        } else if (loginStatus == true) {
            this.getToken(this.data.shopID);
        }

        //从朋友圈小程序链接打开
        let wScene = wx.getStorageSync('scene')
        if(wScene == 1154){
            this.setData({
                wSceneTip:true
            })
        }
        //埋点上报设置
        //加密key和openid都是异步获取 ，所以setLogPv封装成一个promise 来同步数据
        utils.setLogPv({
            urlParam: that.data.option, //onLoad事件传入的url参数对象
            title: "京东店铺", //网页标题
            shopid: this.data.shopID + "", //店铺id，店铺页pop商品页传店铺id，其他页面留空即可
            pname: "",
            pageTitleErro: 'pages/shop/shop/京东店铺',
            pageId: "KeplerMiniAppShopHome",
            siteId: "WXAPP-JA2016-1", //开普勒小程序固定用：WXAPP-JA2016-1
            account: (utils.getPtKey() || !wx.getStorageSync('jdlogin_pt_key')) ? '-' : (utils.getPtKey() || wx.getStorageSync('jdlogin_pt_key')) //传入用户登陆京东的账号
        }).then(function (data) {
            log.set(data);
            if (that.data.pvFlag) {
                that.data.pvFlag = false
                log.pv()
            }

        })
    },
    onReady: function () {
        // 页面渲染完成
        this.jdTemplate = this.selectComponent("#jdTemplate");
        //展示添加到我的小程序弹框
        setTimeout(()=>{
            this.setData({
                showAddToast: true
              })
        },1000)
    },
    onShow: function () {
        // @jianglun 会员2.0 首页移除登录/注册会员标记
        utils.storage.remove('vipToRegFlag')
        utils.storage.remove('vipToLoginFlag')
        //自定义tab bar用
        // let isCustomTabbar = utils.setTabBar(this)
        // this.setData({
        //     isCustomTabbar: isCustomTabbar
        // })
        console.log(options)
        var that = this;
         //检验是否在黑名单之列，在的话就跳转一个维护页面
        utils.checkInBlackList().then(data=>{
            if(data==='true'){
                wx.reLaunch({
                    url:'/pages/maintenance/maintenance'
                })
            }
        });
        // 商祥页跳入设为tabBar的店铺页时，路径不能带参数，顾修改缓存中shopId,首页再次点开时，需加载ExtJson中的shopId的数据
        if (this.data.isShowLoadData) {
            let obj = shop_util.getShopConfigure();
            let shopID = obj.configure.shopID;
            if (app && app.globalData && app.globalData.shopInfo && app.globalData.shopInfo.shopId && app.globalData.shopInfo.shopName && app.globalData.shopInfo.shopId != shopID) {
                shopID = app.globalData.shopInfo.shopId;
                let shopName = app.globalData.shopInfo.shopName;
                app.globalData.shopInfo = null;
                this.setData({
                    shopID: shopID,
                })
                wx.setNavigationBarTitle({
                    title: shopName
                });
                wx.setStorageSync("shopID", shopID);
                wx.setStorageSync("shopId", shopID);
                // 获取首页数据
                this.getShopHomeData();
            } else {
                if (shopID && wx.getStorageSync('shopID') && wx.getStorageSync('shopID') != shopID) {
                    this.setData({
                        shopID: shopID,
                    })
                    wx.setNavigationBarTitle({
                        title: obj.configure.shopName ? obj.configure.shopName : ''
                    });
                    wx.setStorageSync("shopID", shopID);
                    wx.setStorageSync("shopId", shopID);
                    // 获取首页数据
                    this.getShopHomeData();
                }
            }

        }
        this.data.isShowLoadData = true;


        var options = that.data.option
        if (options.platform) {
            Ad.reportAdsData(options);
        }
        //that.data.pvFlag为true 上报pv
        //获得加密的ptkey值并上报
        utils.getSecretPtKey(function (secretPtKey) {
            //埋点上报数据初始化
            log.set({
                cipherPin: secretPtKey
            });
            //this.data.pvFlag为true 上报pv
            if (!that.data.pvFlag) {
                log.pv()
            }
        })

        var obj = shop_util.getShopConfigure();
        // 首页数据没变化，不应重新设置标题，暂时先注释掉
        // wx.setNavigationBarTitle({
        //     title: options.shopName ? options.shopName : (obj.configure.shopName ? obj.configure.shopName : '')
        // });
        // 页面显示

        this.setData({
            showMy: true,
            isRequestCoupons: false
        });

        // 获取登录状态
        let jdlogin_pt_key = utils.getPtKey() || wx.getStorageSync("jdlogin_pt_key");
        let pt_key = jdlogin_pt_key ? true : false;
        if (loginStatus || pt_key) {
            console.log("刷新数据了")
            this.getShopHomeData();
        }
        loginStatus = pt_key;
        console.log("现在的登录状态是======》" + loginStatus)
        console.log("现在的红包登录状态是======》" + this.data.redPacketToLogin)
        //如果未登录
        if (loginStatus == false) {
            this.setData({
                conternLoginStatus: false,
                isLogin: false,
                plugLoginStatus: false
            })
        } else {
            this.setData({
                isLogin: true
            })
        }
        if (app.globalConfig && app.globalConfig.isOperatorTemplate && jdlogin_pt_key) {
            var bindUrFn = require('../../utils/bindUserRel.js');
            console.log('用户是登录状态，准备绑定分佣关系');
            bindUrFn.bindUserRel(this.globalRequestUrl);
        }
        // 新人红包
        if (this.data.redPacketToLogin && loginStatus) {
            this.getNewArrivalCoupon()
            if (this.data.ScreenParam[this.data.currentScreenIndex] && this.data.ScreenParam[this.data.currentScreenIndex].screenType == 'initBag') {
                this.closeScreen('newreward')
            }
            this.setData({
                redPacketToLogin: false
            })
        } else if (this.data.redPacketToLogin && !loginStatus) {
            if (this.data.ScreenParam[this.data.currentScreenIndex] && this.data.ScreenParam[this.data.currentScreenIndex].screenType == 'initBag') {
                this.closeScreen('newreward')
            }
            this.setData({
                redPacketToLogin: false
            })
        } else if (this.data.centerToLogin && loginStatus) {
            // 中心化弹屏
            this.getCenterScreenCoupon()
            if (this.data.ScreenParam[this.data.currentScreenIndex] && this.data.ScreenParam[this.data.currentScreenIndex].screenType == 'centringScreen') {
                this.closeScreen('centerreward')
            }
            this.setData({
                centerToLogin: false
            })
        } else if (this.data.centerToLogin && !loginStatus) {
            if (this.data.ScreenParam[this.data.currentScreenIndex] && this.data.ScreenParam[this.data.currentScreenIndex].screenType == 'centringScreen') {
                this.closeScreen('centerreward')
            }
            this.setData({
                centerToLogin: false
            })
        }
        //挂件
        if (this.data.isFirstScreen) {
            this.setData({
                isFirstScreen: false
            })
        } else if (loginStatus == false || isRisk == "true") {
            //挂件
            this.getPendantFn();
        }
        if (isRisk == "false") {
            this.setData({
                screen_open: false,
                pendant_open: false
            })
        }
        var isRisk = wx.getStorageSync("isRisk");
        console.log("现在风控的状态是" + isRisk);

        if (loginStatus == true && this.data.plugLoginStatus == true) {
            this.plugFn(this.data.shopID, this.data.pluginUrl);
            // //在跳转插件时，1s后选择加载下一个页面
            // if (this.data.ScreenParam[this.data.currentScreenIndex] && this.data.ScreenParam[this.data.currentScreenIndex].screenType == 'generalScreen') {
            //     setTimeout(function () {
            //         that.closeScreen('generalScreen')
            //     },2000)
            // }
        } else if (loginStatus == true) {
            this.getToken(this.data.shopID)
        }
        //如果是在活动tab下的话会调接口刷新数据
        if (this.data.tabKey == "1008") {
            this.getActivityInfo();
        }
        //为了展示活动tab上方的促销文案需要先调用一下活动getCampaignPageTab这个接口，但是并不渲染具体的活动组件，比如说秒杀，促销等内容
        this.getPromotionFlag();
    },
    refreshShop: function () {
      const {option} = this.data
      option.refreshShopFlag = true
      this.setData({
        isApiError: false
      })
      this.onLoad(option)
    },
    //添加到我的小程序浮框的曝光埋点
    toastShowExFunc:function(){
        this.reportExposure("WShop_GuideToMyApplet_Expo", "/引导添加到我的小程序浮窗曝光/")
    },
    //添加到我的小程序弹框的关闭点击埋点
    closeAddToast:function(e){
        log.click({
            eid: "Wshop_Main_GuideDialogClose",
            elevel: "",
            eparam: "",
            pname: "/pages/shop/shop",
            pparam: "",
            event: e
        });
    },
    // 秒杀和闪购模块attach触发该方法刷新数据。
    refreshSecKill: function () {
        this.getActivityInfo();
    },
    //获取活动信息接口，包括秒杀、闪购、优惠券等
    getActivityInfo: function () {
        const that = this;
        that.setData({menuFixed:false})//避免上次吸顶的促销分类title依然是处于吸顶状态
        let param = {
            shopId: this.data.shopID
        };
        request.getCampaignPageTab(param,
            data => {
                if(data.code*1===0){
                    let result=null;
                    if(data.data.result){
                        result = data.data.result;
                        if(result.secKillPage){
                            //currentTime为当前的服务器时间，用作倒计时计算
                            result.secKillPage.currentTime=data.dateTime||'';
                        }
                        if(result.gwredPage){
                            result.gwredPage.currentTime=data.dateTime||'';
                        }
                        that.setData({
                            secKillInfo: result.secKillPage || {},
                            flahPurchaseInfo: result.gwredPage || {},
                            couponInfo: result.couponInfos || [],
                            promotionInfo: result.promotionFloorInfo || {}
                        })
                        if (that.data.promotionInfo && that.data.promotionInfo.type == 1) {
                            that.initSalesFunc();
                        }
                        //促销没有信息下发的时候则显示热销
                        if (that.data.promotionInfo && (that.data.promotionInfo.type != 1 || that.data.promotionInfo.type == 1 && that.data.promotionInfo.firstTabFirstPageSkuList && that.data.promotionInfo.firstTabFirstPageSkuList.totalSize && that.data.promotionInfo.firstTabFirstPageSkuList.totalSize == 0)) {
                            that.hotSaleInit();
                        }
                    }
                }else{
                    //如果数据获取失败则显示热销商品进行兜底
                    that.hotSaleInit();
                    // code返回不为0
                    utils.reportErr("#requestNoData#shop.js getActivityInfo item getCampaignPageTab code no equal 0，值为"+JSON.stringify(data));
                }
            }, error => {
                utils.reportErr("#requestFail#shop.js getActivityInfo item getCampaignPageTab.json fail: " + JSON.stringify(error));
                //如果数据获取失败则显示热销商品进行兜底
                that.hotSaleInit();
            })
    },
    //活动tab上方展示文案方法
    getPromotionFlag(){
        let that=this;
        let param = {
            shopId: this.data.shopID
        };
        request.getCampaignPageTab(param,
            data => {
                if(data.code*1===0){
                    let result=null;
                    if(data.data.result){
                        result = data.data.result;
                        if(result.secKillPage&&result.secKillPage.data){
                            if(result.secKillPage.data.length===1){
                                let discontAmount=result.secKillPage.data[0].jdPrice-result.secKillPage.data[0].miaoShaPrice
                                discontAmount=parseInt(discontAmount)
                                that.setData({
                                    promotionFlag:'立减'+discontAmount+'元'
                                })
                            }else if(result.secKillPage.data.length>1){
                                that.setData({
                                    promotionFlag:'限时秒杀'
                                })
                            }
                            return;
                        }else if(result.gwredPage&&result.gwredPage.data){
                            if(result.gwredPage.data.length===1){
                                let discontAmount=result.gwredPage.data[0].jdPrice-result.gwredPage.data[0].miaoShaPrice
                                discontAmount=parseInt(discontAmount)
                                that.setData({
                                    promotionFlag:'立减'+discontAmount+'元'
                                })
                            }else if(result.gwredPage.data.length>1){
                                that.setData({
                                    promotionFlag:'限时闪购'
                                })
                            }
                            return;
                        }else if(result.promotionFloorInfo&&result.promotionFloorInfo.promotionTitles&&result.promotionFloorInfo.promotionTitles.length>0){
                            that.setData({
                                promotionFlag:result.promotionFloorInfo.promotionTitles[0]&&result.promotionFloorInfo.promotionTitles[0].promotionTitle
                            })
                        }
                    }
                }else{
                    utils.reportErr("#requestNoData#shop.js item getPromotionFlag code no equal 0，值为"+JSON.stringify(data));
                }
            }, error => {
                utils.reportErr("#requestFail#shop.js item getPromotionFlag.json fail: " + JSON.stringify(error));
            })
    },
    // 获取热销商品 商品里按销量排行的数据,档活动tab下的其它接口为空时显示该热销商品
    hotSaleInit() {
        this.requestParam = {};
        var param = {
            shopId: this.data.shopID,
            searchType: 3,
            sort: '1',
            pageIdx: 1,
            pageSize: 20
        }
        this.setData({
            allGoodList: [],
            requestParam: param,
            hasNext: true,
            currentType: 'hotSale'
        })
        this.requestSearchWare();
    },
    //活动tab促销信息的初始化方法
    initSalesFunc() {
        const that = this;
        let hasNext = false;
        let currentPromId = '';//当前选中促销title的ID
        let proTitles = [];//促销分类title的数组
        let currentTitle = ''//当前选中的促销分类title
        let proDescTxt={}//当前选中促销分类的名称，规则，时间等的集合
        let promProList=[] //第一个促销分类下的商品集合
        if (that.data.promotionInfo && that.data.promotionInfo.firstTabFirstPageSkuList && that.data.promotionInfo.firstTabFirstPageSkuList.skuList) {
            promProList = that.data.promotionInfo.firstTabFirstPageSkuList.skuList
            if (that.data.promotionInfo.firstTabFirstPageSkuList.hasNext) {
                hasNext = true
            }
        }
        if (that.data.promotionInfo && that.data.promotionInfo.currentPromotionTitleId) {
            currentPromId = that.data.promotionInfo.currentPromotionTitleId
        }
        if (that.data.promotionInfo && that.data.promotionInfo.promotionTitles && that.data.promotionInfo.promotionTitles.length > 0) {
            proTitles = that.data.promotionInfo.promotionTitles
            currentTitle = that.data.promotionInfo.promotionTitles[0].promotionTitle
            if (currentPromId == that.data.promotionInfo.promotionTitles[0].erpPromotionId) {
                let currProRule = that.data.promotionInfo.promotionTitles[0]
                let rule = '促销规则：以下商品' + currProRule.rules.join(",")
                let jmz = {};
                jmz.GetLength = function (str) {
                    return str.replace(/[\u0391-\uFFE5]/g, "aa").length;  //先把中文替换成两个字节的英文，在计算长度
                };
                proDescTxt = {
                    promTitle: currProRule.time,
                    promRule: rule,
                    promRuleOpen: false,//促销规则的超过两行展示的箭头是否显示
                    tipsLength: jmz.GetLength(rule)//促销规则的长度，用于判断是否要收起展示
                };
            }
        }
        var param = {
            venderId: this.data.shopInfo.venderId,
            type: 1,
            promotionTitleId: currentPromId,
            pageIdx: 1,
            pageSize: 20,
            promInit: true  //是否是初始化的tab下的促销数据，初始化的促销来源于活动tab接口，其它情况下来自促销接口
        };
        that.setData({
            proTitles: proTitles,
            allGoodList: that.formatJDPrice(promProList),
            requestParam: param,
            currentPromId: currentPromId,
            currPromIdx:0,//每次渲染当前title的index变为0
            proDescTxt: proDescTxt,
            promTabChange: false, //是否是店铺促销的tab切换
            hasNext: hasNext,
            currentTitle: currentTitle
        })
        that.initClientRect() //初始化获取促销的菜单tab距顶部的高度
    },
    //活动tab促销tab的切换方法
    promTabClick(e) {
        let currProRule = e.currentTarget.dataset.item
        let currPromIdx = e.currentTarget.dataset.idx//当前点击btn的index,因为上游有些title的erpPromotionId有重复，导致可能多个title一起变红
        let rule = '促销规则：以下商品' + currProRule.rules.join(",")
        let jmz = {};
        jmz.GetLength = function (str) {
            return str.replace(/[\u0391-\uFFE5]/g, "aa").length;  //先把中文替换成两个字节的英文，在计算长度
        };
        let proDescTxt = {
            promTitle: currProRule.time,
            promRule: rule,
            promRuleOpen: false,
            tipsLength: jmz.GetLength(rule)
        };
        let param = {
            venderId: this.data.shopInfo.venderId,
            type: 1,
            promotionTitleId: currProRule.erpPromotionId,
            pageIdx: 1,
            pageSize: 20,
            promInit: false
        };
        this.setData({
            proDescTxt: proDescTxt,
            currentPromId: currProRule.erpPromotionId,
            requestParam: param,
            allGoodList: [],
            hasNext: true,
            promTabChange: true,
            currentTitle: currProRule.promotionTitle,
            currPromIdx:currPromIdx
        })
        log.click({
            eid: "KMiniAppShop_PromotionTab",
            elevel: "",
            eparam: currProRule.promotionTitle,
            pname: "/pages/shop/shop",
            pparam: "",
        });
        this.getPromotionInfo();
    },
    // 店铺活动tab获取促销数据
    getPromotionInfo: function () {
        const that = this;
        that.setData({
            state: 1//显示正在加载状态
        });
        //判断第一页的促销数据是否是活动接口返回，是的话page从2开始。
        if (that.data.requestParam.promInit && that.data.requestParam.pageIdx === 1) {
            that.data.requestParam.pageIdx += 1;
        }
        let param = that.data.requestParam;
        request.getPromotionWares(
            param,
            (data) => {
                if(data.code*1===0){
                    let promList=[];
                    let list=[];
                    if (data.result&&data.result.skuList) {
                        if(data.result.skuList.length>0){
                            promList = that.formatJDPrice(data.result.skuList);
                            list = that.data.allGoodList.concat(promList);
                            that.data.requestParam.pageIdx += 1;
                        }else{
                            list = that.data.allGoodList
                        }
                        let hasNext = data.result.hasNext;
                        that.setData({
                            allGoodList: list,
                            hasNext: hasNext,
                            state: 0
                        });
                    }
                    //判断如果是店铺促销的tab切换
                    if (that.data.promTabChange) {
                        that.data.promTabChange = !that.data.promTabChange
                    }
                    //促销分类吸顶方法
                    if (that.data.menuTop&&!that.data.menuFixed) {
                        wx.pageScrollTo({
                            scrollTop: that.data.menuTop,
                            selector: '#navcontainer',
                            duration: 300,
                        });
                    }
                }else{
                    that.setData({
                        state: 0,
                        hasNext: false
                    });
                    utils.reportErr("#requestNoData#shop.js getPromotionInfo item getPromotionWares code no equal 0，值为"+data.code);
                }
            },
            error => {
                let state = 2;
                if (that.data.allGoodList && that.data.allGoodList.length) {
                    state = 3;
                }
                that.setData({
                    state: state
                });
                utils.reportErr("#requestFail#shop.js getPromotionInfo item getPromotionWares.json fail: " + JSON.stringify(error));
            }
        );
    },
    //查询菜单栏距离文档顶部的距离menuTop
    initClientRect: function () {
        var that = this;
        that.data.menuTop = 0
        wx.createSelectorQuery().select('#centerContainer').boundingClientRect(function (rect) {
            that.data.menuTop += rect.height;
        }).exec()
        wx.createSelectorQuery().select('#navcontainer').boundingClientRect(function (rect) {
            that.data.menuTop += rect.height + 10;
        }).exec()
    },
    //关注以及取消关注
    conternFn: function (shopId, follow) {
        var that = this;
        var param = {
            shopId: shopId,
            follow: !follow,
            award: "false"
        };
        request.getConternSuc(param, data => {
            if (data.code === 0 || data.code === "0") {
                if (data.optCode && data.optCode == "F10000" && data.follow == true) {
                    setTimeout(function () {
                        that.setData({
                            follow: !follow,
                            conternLoginStatus: false
                        })
                        //关注
                        if (that.data.follow == true) {
                            that.setData({
                                isShowHeart: true,
                                conternMsg: data.msg
                            })
                            setTimeout(function () {
                                that.setData({
                                    isShowHeart: false
                                })
                            }, 2000);
                            //关注成功埋点
                            log.click({
                                eid: "KMiniAppShop_FollowSuccessAuto",
                                event_name: "关注成功",
                                click_type: 0,
                                elevel: "",
                                eparam: "",
                                pname: "/pages/shop/shop",
                                pparam: ""
                            });
                        } else {
                            //取消关注
                            that.setData({
                                isShowHeart: false
                            })
                            log.click({
                                eid: "KMiniAppShop_CancelFollow",
                                event_name: "取消关注",
                                click_type: 1,
                                elevel: "",
                                eparam: "",
                                pname: "/pages/shop/shop",
                                pparam: ""
                            });

                        }

                    }, 300)

                } else if (data.optCode && data.optCode == "F0402" && data.follow == false) {
                    //已经关注过
                    that.setData({
                        follow: true,
                        isShowHeart: true,
                        conternLoginStatus: false,
                        conternMsg: data.msg
                    })
                    setTimeout(function () {
                        that.setData({
                            isShowHeart: false
                        })
                    }, 2000);
                }

            } else {
                utils.reportErr("#requestNoData#shop.js conternFn item getConternSuc fail: " );
            }

        }, error => {
            utils.reportErr("#requestFail#shop.js conternFn item getConternSuc fail: " + JSON.stringify(error));
        })



    },
    //关注有礼
    giftConternFn: function (shopId, activityId, follow) {
        var that = this;
        var param = {
            shopId: shopId,
            activityId: activityId,
            follow: follow
        };
        request.getGiftContern(param,
            data => {
                console.log(data);
                if (data.code === 0 || data.code === "0") {
                    if (that.data.activityId && data.result.giftCode == 200) {
                        setTimeout(function () {
                            that.setData({
                                follow: true,
                                isShowGift: true,
                                followType: 1,
                                conternLoginStatus: false,
                            })
                            log.click({
                                eid: "KMiniAppShop_FollowGiftSuccessAuto",
                                event_name: "店铺关注礼包发放成功自动上报",
                                click_type: 0,
                                elevel: "",
                                eparam: "",
                                pname: "/pages/shop/shop",
                                pparam: ""
                            });
                        }, 500)

                    }
                } else {
                    utils.reportErr("#requestNoData#shop.js item getGiftContern.json return code!==0: ");
                }

            }, error => {
                utils.reportErr("#requestFail#shopjs item getGiftContern.json fail: " + JSON.stringify(error));
            })
    },
    //弹窗
    getPopup: function () {
        var that = this;
        var source = "screenpendant";
        var appId = wx.getStorageSync("appid");
        wx.login({
            success: (res) => {
                if (res.code) {
                    var param = {
                        source: source,
                        appId: appId,
                        code: res.code
                    };
                    request.getPendant(param,
                        data => {
                            //弹窗数据，便于测试，保留
                            // data =  {"code":"0","message":"å“åº”æˆåŠŸ","result":{"screenParam":[{"appId":"wxaa3f0e693dd45d1d","iconAddress":"http://m.360buyimg.com/marketingminiapp/jfs/t1/9569/16/8907/112491/5c10a52bE138f6e4a/e06cbfb7a05be78d.jpg","id":92,"jumpLink":"https://wq.jd.com/cube/front/activePublish/rrbxdxdv3/13782.html?_wv=1&activenologin=1&_mlogin=1&suin=380794871&md5=cef1a346050a38b934d1adb84a51d5c2&PTAG=17053.1.1&utm_source=weixin&utm_medium=weixin&utm_campaign=t_1000072672_17053_001","jumpType":"1","screenType":"generalScreen","showEndDate":1545321600000,"showStartDate":1545148800000,"switchFlag":1},{"activityId":7,"couponList":[{"activityBeginTime":1544511656000,"activityEndTime":1546185599000,"activityKey":"FP_coacrzj","activityType":9,"addDays":0,"areaType":1,"auditState":0,"batchCount":35000,"batchId":145564138,"beginTime":1544198400000,"couponKind":0,"couponParam":{"couponType":0,"encryptedKey":"17e19646927943f99d39d91b12b4d737","ruleId":16513657},"couponStyle":0,"couponTitle":"å°ç¨‹åºæ´»åŠ¨ä¸“é¡¹108-8","couponType":1,"discount":8.0,"endTime":1546185599000,"expireType":5,"extNowCount":0,"limitStr":"å…¨å“ç±»(ç‰¹ä¾‹å•†å“é™¤å¤–)","nowCount":147,"platformType":0,"quota":108.0,"sendNum":1,"shopId":0,"venderId":0,"yn":1}],"iconAddress":"http://m.360buyimg.com/marketingminiapp/jfs/t1/18531/24/2125/112491/5c18f125E9eb02257/58ef0dc77ee3a42c.jpg","screenType":"centringScreen","version":"v1.1"}]}}
                            if (data.code === 0 || data.code === "0") {
                                if (data.result && data.result.screenParam && !data.result.pendantParam) {
                                    that.setData({
                                        pendant_open: false,
                                        ScreenParam: data.result.screenParam
                                    })
                                } else if (data.result && data.result.screenParam && data.result.pendantParam) {
                                    console.log("进来了")
                                    that.setData({
                                        pendant_open: true,
                                        ScreenParam: data.result.screenParam,
                                        PendantParam: data.result.pendantParam && data.result.pendantParam[0] || {}
                                    })
                                } else if (data.result && data.result.pendantParam && !data.result.screenParam) {
                                    that.setData({
                                        pendant_open: true,
                                        PendantParam: data.result.pendantParam && data.result.pendantParam[0] || {}
                                    })
                                }
                                // 新人红包浮层曝光埋点
                                if (that.data.ScreenParam[that.data.currentScreenIndex] && that.data.ScreenParam[that.data.currentScreenIndex].screenType == 'initBag') {
                                    console.log('================')
                                    let redPacketScreen=that.data.ScreenParam[that.data.currentScreenIndex];
                                    if(redPacketScreen.couponList&&redPacketScreen.couponList[0]&&redPacketScreen.couponList[0].couponParam&&redPacketScreen.couponList[0].couponParam.putKey){
                                        that.data.putKey=redPacketScreen.couponList[0].couponParam.putKey
                                    }
                                    log.click({
                                        eid: "NewcomerGift_FloatingExpo",
                                        elevel: "",
                                        event_name: "/红包浮层曝光/",
                                        click_type: 0,
                                        eparam: '',
                                        pname: "/pages/shop/shop",
                                        pparam: "",
                                        target: ""
                                    });
                                } else if (that.data.ScreenParam[that.data.currentScreenIndex] && that.data.ScreenParam[that.data.currentScreenIndex].screenType == 'centringScreen') {
                                    // 中心化弹屏浮层曝光埋点
                                    console.log('================')
                                    that.reportExposure("WShop_MovingScreenExpo", "/活动挂件弹屏曝光/")
                                }
                                // 插件弹屏挂件埋点
                                this.screenAndPendentLog(data.result.pendantParam && data.result.pendantParam[0] || {}, data.result.screenParam || [])


                            } else {
                                utils.reportErr("#requestNoData#shopjs getPopup item getPendant.json return code!=0: " );
                            }
                        }, error => {
                            utils.reportErr("#requestFail#shopjs getPopup item getPendant.json fail: " +  JSON.stringify(error));
                        })
                } else {
                    console.log('登录失败！' + JSON.stringify(res))
                }
            }
        })
    },
    //挂件
    getPendantFn: function () {
        var that = this;
        var source = "screenpendant";
        var appId = wx.getStorageSync("appid");
        wx.login({
            success: (res) => {
                if (res.code) {
                    console.log(res.code)
                    var param = {
                        source: source,
                        appId: appId,
                        code: res.code
                    };
                    request.getPendant(param,
                        data => {
                            // console.log(data.result.pendantParam&&data.result.pendantParam[0]);
                            if (data.code === 0 || data.code === "0") {
                                if (data.result && data.result.pendantParam) {
                                    that.setData({
                                        pendant_open: true,
                                        PendantParam: data.result.pendantParam && data.result.pendantParam[0] || {}
                                    })
                                } else {
                                    that.setData({
                                        pendant_open: false
                                    })
                                }
                                // 插件弹屏挂件埋点
                                this.screenAndPendentLog(data.result.pendantParam && data.result.pendantParam[0] || {}, data.result.screenParam || [])


                            } else {
                                utils.reportErr("#requestNoData#shopjs getPendantFn item getPendant.json retutn code !==0: ");
                            }

                        }, error => {
                            utils.reportErr("#requestFail#shopjs getPendantFn item getPendant.json fail: " + JSON.stringify(error));
                        })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })

    },
    //关闭弹窗
    closeScreen: function (e) {
        let that = this;
        let currIndex = that.data.currentScreenIndex
        //缓冲弹屏
        that.setData({
            currentScreenIndex: 99999
        })
        console.log('that.data.currentScreenIndex1');
        console.log(that.data.currentScreenIndex);
        setTimeout(function () {
            that.setData({
                currentScreenIndex: ++currIndex
            })
            console.log('that.data.currentScreenIndex2');
            console.log(that.data.currentScreenIndex);
            // if (that.data.ScreenParam[that.data.currentScreenIndex] && that.data.ScreenParam[that.data.currentScreenIndex].screenType == 'centringScreen') {
            //     // 点击中心化弹屏不再显示,但是允许过几天又有第二个中心化弹屏了，仍要弹出来，判断唯一值
            //     wx.setStorageSync("center_screen",that.data.ScreenParam[that.data.currentScreenIndex].activityId)
            // }
            // 新人红包浮层曝光埋点
            if (that.data.ScreenParam[that.data.currentScreenIndex] && that.data.ScreenParam[that.data.currentScreenIndex].screenType == 'initBag') {
                log.click({
                    eid: "NewcomerGift_FloatingExpo",
                    elevel: "",
                    event_name: "/红包浮层曝光/",
                    click_type: 0,
                    eparam: '',
                    pname: "/pages/shop/shop",
                    pparam: "",
                    target: ""
                });
            } else if (that.data.ScreenParam[that.data.currentScreenIndex] && that.data.ScreenParam[that.data.currentScreenIndex].screenType == 'centringScreen') {
                // 中心化弹屏浮层曝光埋点
                console.log('================')
                that.reportExposure("WShop_MovingScreenExpo", "/活动挂件弹屏曝光/")
            }

        }, 100)

    },
    jumpToOther: function (e) {
        let id = e.currentTarget.dataset.id;
        this.closeScreen('screen')
        //埋点
        log.click({
            eid: "WPendantScreen_SContent",
            elevel: "",
            event_name: "弹屏",
            click_type: 1,
            eparam: id,
            pname: "/pages/shop/shop",
            pparam: "",
            target: "",
            event: e
        });
    },
    //点击挂件或者弹窗进行授权
    toLoginPendant(e) {
        console.log("执行了")
        var that = this;
        var shopId = e.currentTarget.dataset.shopid ? e.currentTarget.dataset.shopid + '' : '';
        // let jdlogin_pt_key = utils.getPtKey() || wx.getStorageSync("jdlogin_pt_key");
        // var loginStatus = jdlogin_pt_key ? true : false;
        // console.log(e.currentTarget.dataset)
        var pluginUrl = e.currentTarget.dataset.plugurl || ''
        console.log(pluginUrl)
        //不校验登录
        this.plugFn(shopId, pluginUrl);

        // 原有逻辑
        // if (loginStatus) {
        //     this.plugFn(shopId, pluginUrl);
        // } else {
        //     utils.getUserInfo(e);
        //     this.setData({
        //         returnpage: '/pages/shop/shop',
        //         plugLoginStatus: true,
        //         pluginUrl: pluginUrl
        //
        //     });
        //     wx.setStorageSync('PluginUrl', pluginUrl)
        //     utils.globalLoginShow(this);
        // }
    },
    plugFn: function (shopId, pluginUrl) {
        console.log(shopId);
        var that = this;
        var shopId = shopId + '' || '';
        var myUrl = "isv.jd.com"
        var pluginUrl = pluginUrl || ''
        var param = {
            shopId: shopId,
            myUrl: myUrl
        };

        // 移除登录校验，直接跳转插件

        //在跳转插件时，1s后选择加载下一个页面
        if (this.data.ScreenParam[this.data.currentScreenIndex] && this.data.ScreenParam[this.data.currentScreenIndex].screenType == 'generalScreen') {
            console.log("普通弹屏：跳插件：打开中心化弹屏：进入了");
            setTimeout(function () {
                console.log("普通弹屏：跳插件：打开中心化弹屏：打开中心化");
                that.closeScreen('generalScreen')
            }, 500)
        }

        wx.setStorageSync("isRisk", "true")
        //
        // for (let i in pluginObj) {
        //     console.log(pluginObj[i])
        //     pluginObj[i].setToken(data.result.token)
        // }

        this.setData({
            screen_open: false,
            plugLoginStatus: false
        })

        //跳转中间页刷新登录态
        wx.navigateTo({
            url: "/pages/transition/transition?returnPage=" + encodeURIComponent(pluginUrl)
        })
        // let plugAppid = pluginUrl.slice(9).split('/')[0]
        // console.log('+++++++++++++++', plugAppid)
        // let subPlugConfig = extConfig.subPlugins[plugAppid]
        // console.log(subPlugConfig)
        // if (subPlugConfig) {
        //     wx.navigateTo({
        //         url: '/' + subPlugConfig.root + subPlugConfig.pages[0] + '?PluginUrl=' + encodeURIComponent(pluginUrl) + '&plugAppid=' + plugAppid + '&token=' + data.result.token
        //     });
        // } else {
        //     console.error('当前访问插件页面在ext.json中未配置')
        // }


        // 移除登录校验，直接跳转插件
        // request.getPlug(param, data => {
        //     console.log("访问成功了");
        //     console.log(data);
        //     //在跳转插件时，1s后选择加载下一个页面
        //     if (this.data.ScreenParam[this.data.currentScreenIndex] && this.data.ScreenParam[this.data.currentScreenIndex].screenType == 'generalScreen') {
        //         console.log("普通弹屏：跳插件：打开中心化弹屏：进入了");
        //         setTimeout(function () {
        //             console.log("普通弹屏：跳插件：打开中心化弹屏：打开中心化");
        //             that.closeScreen('generalScreen')
        //         }, 500)
        //     }
        //     if (data && data.code == "0" && data.result.token) {
        //         wx.setStorageSync("isRisk", "true")
        //         //
        //         // for (let i in pluginObj) {
        //         //     console.log(pluginObj[i])
        //         //     pluginObj[i].setToken(data.result.token)
        //         // }
        //
        //         this.setData({
        //             screen_open: false,
        //             plugLoginStatus: false
        //         })
        //         let plugAppid = pluginUrl.slice(9).split('/')[0]
        //         console.log('+++++++++++++++', plugAppid)
        //         let subPlugConfig = extConfig.subPlugins[plugAppid]
        //         console.log(subPlugConfig)
        //         if (subPlugConfig) {
        //             wx.navigateTo({
        //                 url: '/' + subPlugConfig.root + subPlugConfig.pages[0] + '?PluginUrl=' + encodeURIComponent(pluginUrl) + '&plugAppid=' + plugAppid + '&token=' + data.result.token
        //             });
        //         } else {
        //             console.error('当前访问插件页面在ext.json中未配置')
        //         }
        //
        //     } else {
        //         console.log("限流了")
        //         wx.setStorageSync("isRisk", "false");
        //         this.setData({
        //             screen_open: false,
        //             pendant_open: false
        //         })
        //     }
        // }, error => {
        //     utils.reportErr("item isLogin.json fail: " + error.msg);
        // })

    },
    //获取token
    getToken: function (shopId) {
        console.log(shopId);
        var that = this;
        var shopId = shopId + '' || '';
        var myUrl = "isv.jd.com"
        var param = {
            shopId: shopId,
            myUrl: myUrl
        };
        request.getPlug(param, data => {
            console.log("访问成功了");
            console.log(data);
            if (data && data.code == "0" && data.result.token) {
                wx.setStorageSync("isRisk", "true")
            } else {
                console.log("限流了")
                wx.setStorageSync("isRisk", "false");
                this.setData({
                    screen_open: false,
                    pendant_open: false
                })
            }
        }, error => {
            utils.reportErr("#requestFail#shopjs getToken item getPlug.json fail: " + JSON.stringify(error));
        })

    },
    //跳插件
    jumpToPlug(e) {
        console.log("点到图片上面了");
        let id = e.currentTarget.dataset.id;
        var source = e.currentTarget.dataset.source;
        console.log(e);
        switch (source) {
            case "pendant":
                //埋点
                log.click({
                    eid: "WPendantScreen_PContent",
                    elevel: "",
                    event_name: "挂件",
                    click_type: 1,
                    eparam: id,
                    pname: "/pages/shop/shop",
                    pparam: "",
                    target: "",
                    event: e
                });
                break;
            case "screen":
                //埋点
                log.click({
                    eid: "WPendantScreen_SContent",
                    elevel: "",
                    event_name: "弹屏",
                    click_type: 1,
                    eparam: id,
                    pname: "/pages/shop/shop",
                    pparam: "",
                    target: "",
                    event: e
                });
                break;
            default:
                break;
        }
    },
    //跳其他页面
    jumpToPage: function (e) {
        let link = e.target.dataset.path;
        let id = e.target.dataset.id;
        //埋点
        log.click({
            eid: "WPendantScreen_SContent",
            elevel: "",
            event_name: "弹屏",
            click_type: 1,
            eparam: id,
            pname: "/pages/shop/shop",
            pparam: "",
            target: "",
            event: e
        });
        this.closeScreen('screen')
        link = /^\//.test(link)?link:('/'+link)
        if(app.globalData.tabBarPathArr.indexOf(link)>-1){
            wx.switchTab({
                url: link,
            })
        } else {
            wx.navigateTo({
                url: link,
            })
        }
    },
    //弹屏跳转
    jumpToScreen: function (e) {
        console.log("跳转执行了");
        let type = e.target.dataset.type;
        let link = e.target.dataset.link;
        let id = e.target.dataset.id;
        this.closeScreen('screen')
        //埋点
        log.click({
            eid: "WPendantScreen_SContent",
            elevel: "",
            event_name: "弹屏",
            click_type: 1,
            eparam: id,
            pname: "/pages/shop/shop",
            pparam: "",
            target: "",
            event: e
        });
        switch (type) {
            case "1":
                //砍价活动
                wx.navigateTo({
                    url: '../../pages/activityH5/activityH5?mcURL=' + encodeURIComponent(link),
                })
                break;
            //福袋活动
            case "2":
                wx.navigateTo({
                    url: '../events/fudai/index/index?cubeId=' + link,
                })
                break;
            case "3":
                //jshop或者通天塔
                wx.navigateTo({
                    url: '../../pages/activityH5/activityH5?kActUrl=' + decodeURIComponent(link),
                })
                break;
            default:
                break;
        }
    },
    // 新人红包领取按钮
    getNewArrivalCoupon(e) {

        if (e && e.currentTarget) {
            this.setData({
                getRedBagParams: e.currentTarget.dataset
            })
        }
        let getRedBagParams = this.data.getRedBagParams
        let ruleId = getRedBagParams.ruleid || ''
        let encryptedKey = getRedBagParams.encryptedkey || ''
        let activityId = getRedBagParams.activityid || ''
        let putKey=this.data.putKey?encodeURIComponent(this.data.putKey):''
        if (loginStatus) {
            wx.showLoading({
                title: '领取中···',
            })
            if (wx.getStorageSync('wxId')) {
                let openId = wx.getStorageSync('wxId')
                let appKey = wx.getStorageSync('jdwcx').wxversion || ''
                let couponParams = {
                    appId: wx.getStorageSync("appid") || '',
                    putKey:putKey,
                    activityId,
                    openId: openId || '',
                    encryptedKey,
                    ruleId,
                    appKey
                }
                this.requestGetCoupon(couponParams)
            } else {
                const getOpenid = require('./shop_utils/getOpenid');
                getOpenid.kGetCleanOpenid().then((openid) => {
                    let openId = openid || ''
                    let appKey = wx.getStorageSync('jdwcx').wxversion || ''

                    wx.setStorageSync('wxId', openId)
                    let couponParams = {
                        appId: wx.getStorageSync("appid") || '',
                        putKey:putKey,
                        activityId,
                        openId,
                        encryptedKey,
                        ruleId,
                        appKey
                    }
                    this.requestGetCoupon(couponParams)
                }).catch( (res) => {
                    wx.hideLoading()
                    setTimeout(() => {
                        this.redPackeTipShow('抱歉服务器被挤爆了')
                    }, 3000)
                    let stringRes = JSON.stringify(res)
                    util.reportErr(("#requestFail#shopjs getOpenid.kGetCleanOpenid fail"), stringRes);
                })                
            }

        } else {
            this.setData({
                redPacketToLogin: true
            })
            utils.globalLoginShow(this);

        }
        log.click({
            eid: "NewcomerGift_FloatingGet",
            elevel: "",
            pname: "/pages/shop/shop",
            pparam: "",
            event_name: "登录领取",
            click_type: 1,
            eparam: ruleId,
            target: e && e.currentTarget || '',
            event: e || ''
        });
    },
    requestGetCoupon(couponParams) {
        // 调用领券接口
        request.newCusGetCoupon(couponParams,
            (res) => {

                if (res.code == 3) {
                    this.setData({
                        redPacketToLogin: true
                    })
                    utils.globalLoginShow(this);

                } else {
                    if (this.data.ScreenParam[this.data.currentScreenIndex] && this.data.ScreenParam[this.data.currentScreenIndex].screenType == 'initBag') {
                        this.closeScreen('newreward')
                    }
                    wx.hideLoading()

                    if (res.code == 0) {
                        this.redPackeTipShow('红包到账，快去消费吧')
                    } else if (res.code == 1002 || res.code == 15) {
                        this.redPackeTipShow('您已领过，去消费吧')
                    } else if (res.code == 17) {
                        this.redPackeTipShow('券已领光，抱歉来晚一步')
                    } else if (res.code == 1004) {
                        this.redPackeTipShow('抱歉活动暂未开始')
                    } else {
                        this.redPackeTipShow('抱歉活动已结束')
                    }
                }

            },
            (error) => {
                wx.hideLoading()
                if (this.data.ScreenParam[this.data.currentScreenIndex] && this.data.ScreenParam[this.data.currentScreenIndex].screenType == 'initBag') {
                    this.closeScreen('newreward')
                }
                setTimeout(() => {
                    if (this.data.getCoupontempTimes <= 3) {
                        this.requestGetCoupon(couponParams)
                        this.setData({
                            getCoupontempTimes: ++this.data.getCoupontempTimes
                        })
                    } else {
                        this.redPackeTipShow('抱歉服务器被挤爆了')
                    }

                }, 3000)

            })
    },
    // 新人红包的提示语显示动画
    redPackeTipShow(msg) {
        this.setData({
            redPacketMsg: msg,
            redPackeTipsOpc: 1
        })
        setTimeout(() => {
            this.setData({
                redPackeTipsOpc: 0
            })
        }, 3000)
    },
    // 中心化弹屏领取按钮
    getCenterScreenCoupon(e) {

        if (e && e.currentTarget) {
            this.setData({
                getCenterParams: e.currentTarget.dataset
            })
        }
        let getCenterParams = this.data.getCenterParams

        let ruleId = getCenterParams.ruleid || ''
        let encryptedKey = getCenterParams.encryptedkey || ''
        let activityId = getCenterParams.activityid || ''
        let activityType = '1';
        // 点击中心化弹屏不再显示,但是允许过几天又有第二个中心化弹屏了，仍要弹出来，判断唯一值
        // wx.setStorageSync("center_screen",activityId)
        wx.setStorageSync("center_screen_open", false)
        if (loginStatus) {
            wx.showLoading({
                title: '领取中···',
            })
            if (wx.getStorageSync('wxId')) {
                let openId = wx.getStorageSync('wxId')
                let appKey = wx.getStorageSync('jdwcx').wxversion || ''
                let couponParams = {
                    appId: wx.getStorageSync("appid") || '',
                    activityId,
                    openId: openId || '',
                    encryptedKey,
                    ruleId,
                    appKey,
                    activityType
                }
                this.requestGetCenterCoupon(couponParams)
            } else {
                const getOpenid = require('./shop_utils/getOpenid');
                getOpenid.kGetCleanOpenid().then((openid) => {
                    let openId = openid || ''
                    let appKey = wx.getStorageSync('jdwcx').wxversion || ''
                    wx.setStorageSync('wxId', openId)
                    let couponParams = {
                        appId: wx.getStorageSync("appid") || '',
                        activityId,
                        openId,
                        encryptedKey,
                        ruleId,
                        appKey,
                        activityType
                    }
                    this.requestGetCenterCoupon(couponParams)
                }).catch((res) =>{
                    wx.hideLoading()
                    setTimeout(() => {
                        this.redPackeTipShow('抱歉服务器被挤爆了')
                    }, 3000)
                    let stringRes = JSON.stringify(res)
                    util.reportErr(("#requestFail#shopjs getOpenid.kGetCleanOpenid fail"), stringRes);
                })
            }

        } else {
            this.setData({
                centerToLogin: true
            })
            utils.globalLoginShow(this);

        }
        log.click({
            eid: "WShop_MovingScreen",
            elevel: "",
            pname: "/pages/shop/shop",
            pparam: "",
            event_name: "活动挂件弹屏",
            click_type: 1,
            eparam: ruleId,
            target: e && e.currentTarget || '',
            event: e || ''
        });
    },
    requestGetCenterCoupon(couponParams) {
        // 调用领券接口
        request.centerGetCoupon(couponParams,
            (res) => {
                console.log('中心弹屏：领取优惠券');
                console.log(res);
                if (res.code == 3) {
                    this.setData({
                        centerToLogin: true
                    })
                    utils.globalLoginShow(this);

                } else {
                    if (this.data.ScreenParam[this.data.currentScreenIndex] && this.data.ScreenParam[this.data.currentScreenIndex].screenType == 'centringScreen') {
                        this.closeScreen('centerreward')
                    }
                    wx.hideLoading()

                    if (res.code == 0) {
                        this.centerTipShow('券已发放，快去使用吧')
                    } else if (res.code == 1002 || res.code == 15 || res.code == 14) {
                        this.centerTipShow('您已领过，去消费吧')
                    } else {
                        this.centerTipShow('活动过于火爆，稍后再试')
                    }
                }

            },
            (error) => {
                wx.hideLoading()
                if (this.data.ScreenParam[this.data.currentScreenIndex] && this.data.ScreenParam[this.data.currentScreenIndex].screenType == 'centringScreen') {
                    this.closeScreen('centerreward')
                }
                setTimeout(() => {
                    if (this.data.getCouponCenterTimes <= 3) {
                        this.requestGetCenterCoupon(couponParams)
                        this.setData({
                            getCouponCenterTimes: ++this.data.getCouponCenterTimes
                        })
                    } else {
                        this.centerTipShow('出了点小状况，优惠券与你擦肩而过')
                    }

                }, 3000)

            })
    },
    // 中心化弹屏的提示语显示动画
    centerTipShow(msg) {
        this.setData({
            redPacketMsg: msg,
            redPackeTipsOpc: 1
        })
        setTimeout(() => {
            this.setData({
                redPackeTipsOpc: 0
            })
        }, 1000)
    },
    onHide: function () {
        //自定义tab bar用
        // let isCustomTabbar = utils.setTabBar(this)
        // this.setData({
        //     isCustomTabbar: isCustomTabbar
        // })
        // let that = this;
        // that.setData({
        //     isSuperCode: false
        // })
        //that.repeatSetReportAdsData();
        //上报留存时长，需要在页面的onUnload、onHide事件中调用log.pageUnload()方法可实现页面留存时长统计
        log.pageUnload()
    },
    onUnload: function () {
        let that = this;
        //that.repeatSetReportAdsData() ;
        //上报留存时长，需要在页面的onUnload、onHide事件中调用log.pageUnload()方法可实现页面留存时长统计
        log.pageUnload()
    },
    /*
    * 新用户第一次进来 在onload时可能未获取jda，所以再onhide/onunload时再次检索
    * 检测广告直投是否已上报
    * jdaFlag 0 未上报  1已上报
     */
    // repeatSetReportAdsData : function(){
    //     let that = this;
    //     let platform = that.data.option.platform ? that.data.option.platform : '';
    //     if(platform && !that.data.jdaFlag){
    //         that.data.jdaFlag = 1 ;
    //         Ad.reportAdsData(that.data.option);
    //     }
    // },
    // 系统--分享
    onShareAppMessage: function (e) {
        var that = this;
        var guiderId = wx.getStorageSync('jd_guiderId');
        var options = that.data.option

        //分享埋点
        log.click({
            eid: 'KMiniAppShop_Share',
            elevel: '',
            pname: '/pages/shop/shop',
            pparam: '',
            target: '',
            event: e,
        });
        //分享裂变数据统计以及获取path的参数
        let sharePathData = shareFission.kReportShareData();
        return {
            title: that.data.shopInfo.shopName,
            desc: that.data.shareDes,
            path: guiderId ? ("/pages/shop/shop?guiderId=" + guiderId + '&' + sharePathData) : "/pages/shop/shop?" + sharePathData
        };
    },
    // repeatSetReportAdsData : function(){
    //     let that = this;
    //     let platform = that.data.option.platform ? that.data.option.platform : '';
    //     if(platform && !that.data.jdaFlag){
    //         that.data.jdaFlag = 1 ;
    //         Ad.reportAdsData(that.data.option);
    //     }
    // },
    // 系统--分享朋友圈
    onShareTimeline: function (e) {
        var that = this;
        var guiderId = wx.getStorageSync('jd_guiderId');

        //分享埋点
        log.click({
            eid: 'Wshop_Main_DialogToShare',
            elevel: '',
            pname: '/pages/shop/shop',
            pparam: '',
            target: '',
            event: e,
        });
        //分享裂变数据统计以及获取path的参数
        let sharePathData = shareFission.kReportShareData();
        return {
            query: guiderId ? ("guiderId=" + guiderId + '&' + sharePathData) : sharePathData
        };
    },
    loadLogo: function (e) {
        var w = e.detail.width;
        var h = e.detail.height;
        this.setData({
            logoType: w === h ? 1 : 2
        });
    },
    //店铺详情
    goShopDetail: function () {
        let venderId = this.data.shopInfo.venderId
        wx.navigateTo({
            url: '/pages/shop/shopDetail/shopDetail?venderId=' + venderId
        })
    },

    //促销分类
    sales: function () {
        return new Promise((resolve, reject) => {
            request.getShopPromotionTypes(
                data => {
                    var promlist = [];
                    // 目前接口无法啊支持套餐促销加车功能 暂时先屏蔽套餐促销tab类型
                    (data || []).map(function (item, index) {
                        if (item.type && item.type != 6) {
                            promlist.push(item);
                        }
                    });
                    this.setData({
                        promList: promlist || []
                    });
                    this.sales = () => {
                        return Promise.resolve()
                    }
                    resolve();
                },
                error => { }
            )
        })
    },
    /** 点击滚动到顶部 */
    backtoTop: function () {
        if (wx.pageScrollTo) {
            wx.pageScrollTo({
                scrollTop: 0
            });
        } else {
            wx.showModal({
                title: "提示",
                content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
            });
        }
    },
    floorClick: function (e) {
        let uid = e.currentTarget.dataset.uid;
        let templateid = e.currentTarget.dataset.templateid;
        log.click({
            eid: "WShop_ShopSelectionFloor",
            elevel: "",
            eparam: uid,
            pname: "/pages/shop/shop",
            pparam: "",
            target: "",
            event: e
        });
        if (templateid === 91) {
            // 自由布局八格
            let configs = e.currentTarget.dataset.configs;
            jump.clickActivity(configs);
        } else if (
            templateid === 17 ||
            templateid === 18 ||
            templateid === 84 ||
            templateid === 11 ||
            templateid === 82 ||
            templateid === 83 ||
            templateid === 16
        ) {
            // 11：轮播
            // 16：单列小图
            // 82：文字活动
            // 83：单列大图
            // 17：双列
            // 18：三列
            // 84：四列
            let item = e.currentTarget.dataset.item;
            jump.clickActivity(item);
        } else if (
            templateid === 6 ||
            templateid === 7 ||
            templateid === 8 ||
            templateid === 9 ||
            templateid === 19 ||
            templateid === 73 ||
            templateid === 74 ||
            templateid === 53
        ) {
            // 商品楼层
            // 6：双列
            // 7：上2下1
            // 8：左2右1
            // 9：上1下3
            // 19：超值单品，最多6个商品
            // 新品上架	73
            // 热卖商品	74
            // 商品推荐	53
            let wareId = e.currentTarget.dataset.wareid;
            jump.jumpToSkuDetail(wareId);
            return false;
        } else if (templateid === 132) {
            // 热区楼层	132
            let configs = e.currentTarget.dataset.configs;
            let pix = e.currentTarget.dataset.pix;
            let x = e.detail.x - e.currentTarget.offsetLeft;
            let y = e.detail.y - e.currentTarget.offsetTop;
            var that = this;
            for (let i = 0; i < configs.length; i++) {
                let item = configs[i];
                let coordinate = item.coordinate;
                let minX = coordinate.x;
                let maxX = coordinate.x + coordinate.w;
                let minY = coordinate.y;
                let maxY = coordinate.y + coordinate.h;
                if (
                    x >= minX * pix &&
                    x <= maxX * pix &&
                    y >= minY * pix &&
                    y <= maxY * pix
                ) {
                    // 热点命中
                    let configs = item && item.configs;
                    jump.clickActivity(configs);
                }
            }
            return false;
        }
    },

    // 格式化店铺精选数据
    formattedData: function (list) {
        if (!list) {
            return [];
        }
        var that = this;
        let newList = [];
        list.map(function (item, index) {
            if (item.dsConfig.products) {
                let list = item.dsConfig.products;
                item.dsConfig["products"] = that.formatJDPrice(list);
            } else if (item.templateId === 91) {
                let list = item.dsConfig.configs;
                var H = 0;
                if (list) {
                    list.map(function (item, index) {
                        let py = parseInt(item.y);
                        let ph = parseInt(item.h);
                        if (py + ph > H) {
                            H = py + ph;
                        }
                    });
                }
                item.dsConfig["cellsInHeight"] = H; //
            } else if (item.templateId === 132) {
                let width = item.dsConfig.width;
                let height = item.dsConfig.height;
                let pix = parseFloat((that.data.winWidth - 20) / width);
                item.dsConfig["drawWidth"] = pix * width;
                item.dsConfig["drawHeight"] = pix * height;
                item.dsConfig["pix"] = pix;
            }

            newList.push(item);
        });
        return newList;
    },
    moreNewProduct: function (e) {
        let uid = e.currentTarget.dataset.uid;
        let moduletype = e.currentTarget.dataset.moduletype;
        let title = e.currentTarget.dataset.name;
        let pages = getCurrentPages();
        if (pages.length === 1) {
            wx.navigateTo({
                url: "../shopRcmd/shopRcmd?uid=" +
                    uid +
                    "&moduletype=" +
                    moduletype +
                    "&name=" +
                    title
            });
        } else {
            wx.redirectTo({
                url: "../shopRcmd/shopRcmd?uid=" +
                    uid +
                    "&moduletype=" +
                    moduletype +
                    "&name=" +
                    title
            });
        }
    },

    //  第三方模板点击跳转
    didClickFloorItem: function (e) {
        jump.templateClick(e);
    },

    /** ------------------------------------  搜索  ------------------------------------*/
    bindfocus: function (event) {
        //  点击搜索框
        if (!searchReport) {
            log.click({
                eid: "KMiniAppShop_Search",
                elevel: "",
                eparam: "",
                pname: "/pages/shop/shop",
                pparam: "",
                target: "",
                event: event
            });

            searchReport = true;
        }

        this.setData({
            bDisplayMask: true,
            focus: true
        });
    },
    bindblur: function (event) {
        searchReport = false;
        this.setData({
            bDisplayMask: false,
            focus: false
        });
    },
    bindinput: function (event) {
        this.setData({
            searchText: event.detail.value
        });
    },
    deleteClick: function (event) {
        this.setData({
            searchText: "",
            bDisplayMask: false,
            focus: false
        });
    },
    clickSearch: function (event) {
        if (this.data.searchText) {
            log.click({
                eid: "WShop_Search",
                elevel: "",
                eparam: this.data.searchText,
                pname: "/pages/shop/shop",
                pparam: "",
                target: "",
                event: event
            });
            let pages = getCurrentPages();
            if (pages.length === 1) {
                wx.navigateTo({
                    url: "./shopSearch/shopSearch?keyWord=" + this.data.searchText
                });
            } else {
                wx.redirectTo({
                    url: "./shopSearch/shopSearch?keyWord=" + this.data.searchText
                });
            }
        } else {
            //  取消搜索框
            log.click({
                eid: "KMiniAppShop_SearchCancel",
                elevel: "",
                eparam: "",
                pname: "/pages/shop/shop",
                pparam: "",
                target: "",
                event: event
            });
        }
        this.setData({
            searchText: "",
            bDisplayMask: false,
            focus: false
        });
    },
    clickMask: function (event) {
        this.setData({
            bDisplayMask: false,
            focus: false,
            searchText: ""
        });
    },

    /** ------------------------------------  领取优惠券  ------------------------------------*/
    receiveCoupons: function (e) {
        var that = this;
        if (this.data.isRequestCoupons) {
            //  控制重复点击
            return;
        }
        this.setData({
            isRequestCoupons: true
        });
        let index = e.currentTarget.dataset.index;
        let item = e.currentTarget.dataset.item;
        let jdlogin_pt_key = utils.getPtKey() || wx.getStorageSync("jdlogin_pt_key");
        if (!jdlogin_pt_key) {
            this.toLogin();
            return false;
        }
        if (!item.applicability || !item.act || !item.couponId) {
            this.setData({
                isRequestCoupons: false
            });
            return;
        }
        this._getReceiveCoupon(item, index, jdlogin_pt_key,e);
    },
    // receiveCoupon 领取优惠券接口 New
    _getReceiveCoupon: function (item, index, pin,e) {
        wx.showToast({
            title: "数据加载中",
            icon: "loading",
            duration: 12000,
            mask: true
        });
        var body = {
            shopId: this.data.shopID,
            act: item.act,
            couponId: item.couponId,
            operation: "3"
        };
        var strBody = JSON.stringify(body);
        var obj = new Object();
        obj.body = strBody;
        obj.pt_key = pin;
        obj.source = "jd-jing";
        obj.screen =
            this.data.winWidth * this.data.pixelRatio +
            "*" +
            this.data.winHeight * this.data.pixelRatio;
        var url = app.globalRequestUrl + "/shopwechat/shophomesoa/receiveShopCoupon";
        var that = this;
        wx.request({
            url: url,
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: obj,
            success: function (res) {
                /** 数据处理 begin */
                var code = res.data.code;
                if (code == 0 || code == "0") {
                    var result = res.data;
                    if (result.processStatus === "999" || result.processStatus === 999) {
                        // 领劵成功
                        let couponIdArr=result.couponIdList//用于埋点
                        let couponIdStr=couponIdArr.length>0?couponIdArr.join(","):''//用于埋点
                        let coupons = that.data.coupons;
                        coupons[index]["applicability"] = false;
                        coupons[index]["couponStatus"] = 1; //1领取2失效3已抢完
                        that.setData({
                            coupons: coupons
                        });
                        log.click({
                            eid: "KMiniAppShop_Coupon",
                            elevel: "",
                            eparam: "GetCouponId=" + couponIdStr,
                            pname: "/pages/shop/shop",
                            pparam: "",
                            target: "",
                            event: e
                        });
                    }
                    that.setData({
                        showToast: result
                    });
                } else if (code == 3 || code == "3") {
                    // 登录态失效
                    that.toLogin();
                } else {
                    var res = {
                        processStatus: 0,
                        desc: "领取失败"
                    };
                    that.setData({
                        isShowToast: false,
                        showToast: res
                    });
                }
                /** 数据处理 end */
            },
            fail: function (res) {
                //  that.networkFail();
                var res = {
                    processStatus: 0,
                    desc: "网络异常"
                };
                that.setData({
                    isShowToast: false,
                    showToast: res
                });
            },
            complete: function (res) {
                wx.hideToast();
                that.setData({
                    isRequestCoupons: false
                });
                var code = res.data.code;
                if (code && (code === 0 || code === "0")) {
                    setTimeout(function () {
                        that.setData({
                            isShowToast: true
                        });
                    }, 500);

                    setTimeout(function () {
                        that.setData({
                            isShowToast: false
                        });
                    }, 2000);
                }
            }
        });
    },
    stopScroll() {
        return false
    },
    toLogin: function () {
        var that = this;
        //  this.setData({
        //    isLogin: true,
        //  })
        setTimeout(function () {
            that.setData({
                isRequestCoupons: false
            });
        }, 3000);
        utils.globalLoginShow(this);
    },
    sortFormId: function (e) {},
    formCoupon: function (e) {},
    formPendant: function (e) {},
    formScreen: function (e) {},
    //  分类搜索
    shopCategories: function (id) {
        var jsonString = JSON.stringify(this.data.shopCategories);
        jsonString = jsonString.replace(/&/g, "");
        log.click({
            eid: "KMiniAppShop_Category",
            elevel: "",
            eparam: "",
            pname: "/pages/shop/shop",
            pparam: "",
            target: "/pages/shop/shopCategories/index?shopCategories=" + jsonString,
            event: id
        });
        wx.navigateTo({
            url: "/pages/shop/shopCategories/index?shopCategories=" + jsonString
        });
    },
    conternFormId: function (e) {},
    //点击关注
    clickContern: function () {
        if (!this.data.couponTimer) {
            return;
        }
        this.setData({
            couponTimer: false
        })
        setTimeout(() => {
            this.setData({
                couponTimer: true
            })
        }, 1500)
        //点击关注埋点
        log.click({
            eid: "KMiniAppShop_Follow",
            event_name: "关注",
            click_type: 1,
            elevel: "",
            eparam: "",
            pname: "/pages/shop/shop",
            pparam: ""
        });
        var that = this;
        var shopId = this.data.shopID + "";
        var follow = this.data.follow;
        if (loginStatus == false) {
            //未登录
            that.setData({
                returnpage: "/pages/shop/shop",
                conternLoginStatus: true
            });
            that.loginModalShow();
            return false;
        } else {
            that.conternFn(shopId, follow)
        }
    },
    //点击关注有礼
    clickGiftContern: function () {
        var that = this;
        var shopId = this.data.shopID + "";
        var activityId = this.data.activityId + "";
        var follow = this.data.follow;
        if (loginStatus == false) {
            //未登录
            that.setData({
                returnpage: "/pages/shop/shop",
                conternLoginStatus: true
            });
            that.loginModalShow();
            return false;
        } else {
            this.giftConternFn(shopId, activityId, follow)
        }
    },
    //点击关闭关注有礼
    clickClose: function () {
        this.setData({
            isShowGift: false,
            conternLoginStatus: false,
            followType: 1,
            follow: true
        })
    },
    loginModalShow: function () {
        utils.globalLoginShow(this);
    },
    couponScroll: function (event) {
        //  /店铺首页领券楼层曝光量/
        if (coupoExpor) {
            coupoExpor = false;
            log.click({
                eid: "KMiniAppShop_CouponExpo",
                elevel: "",
                eparam: "",
                pname: "/pages/shop/shop",
                pparam: ""
            });
            setTimeout(function () {
                //  3s 后可如果滑动可再次上报
                coupoExpor = true;
            }, 3000);
        }
    },
    // 弹屏挂件中的插件埋点
    screenAndPendentLog(pendent, screen) {
        let that = this;
        let screenLogParams = ''
        let pendentLogParams = ''
        let pendentParam = pendent
        let ScreenParam = screen
        if (pendentParam.jumpType == 6) {
            pendentLogParams += `${pendentParam.id}_${pendentParam.appId}`
        }
        for (let i = 0; i < ScreenParam.length; i++) {
            if (ScreenParam[i].jumpType == 6) {
                screenLogParams += `${ScreenParam[i].id}_${ScreenParam[i].appId}`
            }
        }

        screenLogParams && console.log(screenLogParams, pendentLogParams)

        //埋点上报设置
        //加密key和openid都是异步获取 ，所以setLogPv封装成一个promise 来同步数据
        // utils.setLogPv({
        //     urlParam:  this.data.option, //onLoad事件传入的url参数对象
        //     title: "京东店铺", //网页标题
        //     shopid: this.data.shopID + "", //店铺id，店铺页pop商品页传店铺id，其他页面留空即可
        //     pname: "",
        //     pageId: "KeplerMiniAppShopHome",
        //     siteId: "WXAPP-JA2016-1", //开普勒小程序固定用：WXAPP-JA2016-1
        //     account: !wx.getStorageSync('jdlogin_pt_key') ? '-' : wx.getStorageSync('jdlogin_pt_key') //传入用户登陆京东的账号
        // }).then(function(data){
        //     log.set(data);


        // })

        setTimeout(function () {
            screenLogParams && that.reportExposure("WPendantScreen_SContentExpo", "/弹屏浮层曝光/", '', pendentLogParams)
            pendentLogParams && that.reportExposure("WPendantScreen_SContentExpo", "/弹屏浮层曝光/", '', screenLogParams)
        }, 100)
    },
    // 年货节活动店铺跳转
    isShowActivityIcon: function () {
        var isActivityShop = false;
        if (
            this.data.shopID === 35324 ||
            this.data.shopID === 15706 ||
            this.data.shopID === 53379 ||
            this.data.shopID === 609661 ||
            this.data.shopID === 1000004064
        ) {
            isActivityShop = true;
        }
        var begin = new Date("2018/1/10 00:00:00").getTime();
        var end = new Date("2018/2/23 00:00:00").getTime();
        var today = new Date().getTime();
        if (today >= begin && today <= end) {
            this.setData({
                isShowActivity: true && isActivityShop
            });
        } else {
            this.setData({
                isShowActivity: false && isActivityShop
            });
        }
    },
    // 网络异常点击重新加载
    onReload: function () {
        this.onReachBottom();
    },

    //tab component click callback
    onTabEvent: function (e) {
        var _this = this;
        var detail = e.detail;
        var key = detail.key;
        var searchSort = detail.searchSort;
        this.setData({
            switchKey: ""
        });
        if (key === "1001") {
            this.setData({
                requestParam: {},
                tabKey: key,
                placeHeight: 188,
                concernPlaceHeight: this.data.statusBarHeight,
                allGoodList: [],
                hasNext: true,
                state: 0
            });
            wx.pageScrollTo({
                scrollTop: _this.data.floorTop,
            });
        } else if (key === "1002") {
            if (this.data.requestParam.sort) {
                // 说明不是第一次
                this.data.requestParam.sort = searchSort;
                this.data.requestParam.pageIdx = 1;
                this.setData({
                    allGoodList: [],
                    hasNext: true,
                    tabKey: key,
                });
            } else {
                // 第一次
                var param = {
                    searchType: 3,
                    sort: searchSort,
                    pageIdx: 1,
                    pageSize: 20
                };
                this.setData({
                    tabKey: key,
                    requestParam: param,
                    placeHeight: 188,
                    concernPlaceHeight: this.data.statusBarHeight,
                    allGoodList: [],
                    hasNext: true
                });
            }
            this.requestSearchWare(param);
        } else if (key === "1003") {
            var param = {
                pageIdx: 1,
                pageSize: 20
            };
            this.setData({
                tabKey: key,
                requestParam: param,
                placeHeight: 188,
                concernPlaceHeight: this.data.statusBarHeight,
                allGoodList: [],
                hasNext: true
            });
            this.requestShopHotWares();
        } else if (key === "1005") {
            // 上新
            var param = {
                pageIdx: 1,
                pageSize: 20
            };
            this.setData({
                tabKey: key,
                requestParam: param,
                placeHeight: 188,
                concernPlaceHeight: this.data.statusBarHeight,
                allGoodList: [],
                hasNext: true
            });
            this.requestNewWareList();
        } else if (key === "1006") {
            // 店铺动态
            var param = {
                pageIdx: 1,
                pagesize: 20
            };
            this.setData({
                tabKey: key,
                requestParam: param,
                placeHeight: 188,
                concernPlaceHeight: this.data.statusBarHeight,
                allGoodList: [],
                hasNext: true
            });
            this.getShopActivityPage();
        } else if (key === "1004") {
            // 促销
            this.sales().then(() => {
                detail.promoInfo = {
                    ...this.data.promList[0]
                }
                if (detail.promo) {
                    // 点击子tab
                    let promo = detail.promo;
                    if (promo && promo.promRule) {
                        if (promo.promRule.indexOf("促销规则") >= 0) {
                            promo.promRule = promo.promRule;
                        } else {
                            promo.promRule = "促销规则：" + promo.promRule;
                        }

                        promo.promRuleOpen = false;
                        var jmz = {};
                        jmz.GetLength = function (str) {
                            return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
                        };
                        promo.tipsLength = jmz.GetLength(promo.promRule);
                    }
                    var plHeight = 188;
                    var concernPlHeight = 320
                    if (this.data.promList && this.data.promList.length) {
                        plHeight = 188 + 80;
                        concernPlHeight = 320 + 80;
                    }
                    if (promo && (promo.promRule || promo.promTitle)) {
                        plHeight = 188 + 60;
                        concernPlHeight = 320 + 60
                    }
                    var param = {
                        type: promo.type,
                        promoId: promo.promoId,
                        pageIdx: 1,
                        pageSize: 20
                    };
                    this.setData({
                        promo: promo,
                        tabKey: key,
                        requestParam: param,
                        placeHeight: plHeight,
                        concernPlaceHeight: this.data.statusBarHeight,
                        allGoodList: [],
                        hasNext: true
                    });
                } else {
                    // 点击tab 从列表元素获取第一个
                    console.log(detail)
                    var promo = {};
                    if (this.data.promList && this.data.promList.length) {
                        promo = detail.promoInfo;
                        if (promo && promo.promRule) {
                            if (promo.promRule.indexOf("促销规则") >= 0) {
                                promo.promRule = promo.promRule;
                            } else {
                                promo.promRule = "促销规则：" + promo.promRule;
                            }
                            promo.promRuleOpen = false;
                            var jmz = {};
                            jmz.GetLength = function (str) {
                                return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
                            };
                            promo.tipsLength = jmz.GetLength(promo.promRule);
                        }
                    }

                    var plHeight = 188;
                    var concernPlHeight = 320;
                    if (this.data.promList && this.data.promList.length) {
                        plHeight = 188 + 80;
                        concernPlHeight = 320 + 80;
                    }
                    if (promo && (promo.promRule || promo.promTitle)) {
                        plHeight = 188 + 60;
                        concernPlHeight = 320 + 60;
                    }

                    var param = {
                        type: promo && promo.type,
                        promoId: promo && promo.promoId,
                        page: 1,
                        pageSize: 20
                    };
                    this.setData({
                        promo: promo,
                        promoId: this.data.promList[0].promoId,
                        promoInfo: this.data.promList[0],
                        tabKey: key,
                        requestParam: param,
                        placeHeight: plHeight,
                        concernPlaceHeight: this.data.statusBarHeight,
                        allGoodList: [],
                        hasNext: true
                    });
                }
                this.getShopPromotionWareList();
            })
        } else if (key === "1007") {
            // 拼购
            var shopId = this.data.shopID || wx.getStorageSync("shopId");
            var param = {
                shopId: shopId,
                venderId: this.data.shopInfo.venderId,
                pageIdx: 1,
                pagesize: 20
            };
            this.setData({
                tabKey: key,
                requestParam: param,
                placeHeight: 188,
                concernPlaceHeight: this.data.statusBarHeight,
                allGoodList: [],
                hasNext: true
            });
            this.getFightBuyPage();
        } else if (key === "1008") {
            // 活动，包括秒杀闪购等
            var shopId = this.data.shopID || wx.getStorageSync("shopId");
            var param = {
                shopId: shopId,
                venderId: this.data.shopInfo.venderId,
                pageIdx: 1,
                pagesize: 20
            };
            this.setData({
                menuFixed:false,
                tabKey: key,
                requestParam: param,
                allGoodList: [],
                hasNext: true
            });
            this.getActivityInfo();
        } else {
            this.setData({
                placeHeight: 188,
                concernPlaceHeight: this.data.statusBarHeight,
                allGoodList: [],
                hasNext: true
            });
        }
    },
    //tab栏提交-formId
    formSale: function (e) {},
    promClick: function (e) {
        let item = e.currentTarget.dataset.item;
        if (item.promoId === this.data.promoId) {
            return;
        }
        log.click({
            eid: "KMiniAppShop_PromotionTab",
            elevel: "",
            eparam: item.name,
            pname: "/pages/shop/shop",
            pparam: "",
        });
        this.setData({
            promoId: item.promoId,
            promoInfo: item,
        })
        var param = {
            "key": '1004',
            promo: item
        }
        let param2 = {};
        param2.detail = param;
        this.onTabEvent(param2)

    },
    // 获取促销数据
    getShopPromotionWareList: function () {
        var that = this;
        var param = this.data.requestParam;
        that.setData({
            state: 1
        });
        request.getShopPromotionWareList(
            param,
            (data, hasNext) => {
                if (data) {
                    var list = this.data.allGoodList.concat(data);
                    that.setData({
                        allGoodList: list,
                        hasNext: hasNext,
                        state: 0
                    });
                    this.data.requestParam.page += 1;
                } else {
                    that.setData({
                        state: 0,
                        hasNext: false
                    });
                }
            },
            error => {
                var state = 2;
                if (this.data.allGoodList && this.data.allGoodList.length) {
                    state = 3;
                }
                that.setData({
                    state: state
                });
            }
        );
    }, // 获取店铺动态
    getShopActivityPage: function () {
        var that = this;
        var param = this.data.requestParam;
        //重新请求
        if (!that.data.isActivitySupport) {
            //设置下排序
            that.data.requestParam.searchType = 3
            that.data.requestParam.sort = 1
            that.data.requestParam.pageSize = 20
            that.requestSearchWare(that.data.requestParam);
            return;
        }

        that.setData({
            state: 1
        });
        request.getShopActivityPage(
            param,
            (data, hasNext) => {
                if (data) {
                    //只支持如下类型activityType,不在如下类型，则显示商品列表，不显示动态数据
                    let supportArr = [1, 3, 4, 5, 10, 12, 16]
                    let isAllSupport = 1;//默认是正常数据
                    data.map(item => {
                        if (item.activityType && supportArr.indexOf(item.activityType) > -1) {
                            isAllSupport = 0;
                        }
                        if (item.products && item.products.length > 6) {
                            item.products = item.products.slice(0, 6);
                        }
                    });
                    //下发类型全部不支持，直接丢弃数据，显示推荐商品
                    if (isAllSupport) {
                        that.setData({
                            isActivitySupport: 0,
                            state: 0
                        });
                        that.getShopActivityPage()
                        utils.reportErr("#behaviorUnnormal#getshopactivity error： " + (this.data.shopID || wx.getStorageSync("shopId")) + '_' + appId);
                        return;
                    }
                    var list = this.data.allGoodList.concat(data);
                    that.setData({
                        allGoodList: list,
                        hasNext: hasNext,
                        state: 0
                    });
                    this.data.requestParam.pageIdx += 1;
                } else {
                    that.setData({
                        state: 0,
                        hasNext: false
                    });
                }
            },
            error => {
                var state = 2;
                if (this.data.allGoodList && this.data.allGoodList.length) {
                    state = 3;
                }
                that.setData({
                    state: state
                });
            }
        );
    },
    // 获取上新数据
    requestNewWareList: function () {
        var that = this;
        var param = this.data.requestParam;
        that.setData({
            state: 1
        });
        request.newWareList(
            param,
            (data, hasNext) => {
                if (data) {
                    var list = [];
                    if (!this.data.allGoodList.length) {
                        list = data;
                    } else {
                        var last = this.data.allGoodList[this.data.allGoodList.length - 1];
                        var first = data[0];
                        if (last.date === first.date) {
                            var concatList = last.wareList.concat(first.wareList);
                            last.wareList = concatList;
                            var list1 = this.data.allGoodList;
                            list1.slice(list.length - 1, 1, last);
                            var list2 = data;
                            list2.splice(0, 1);
                            list = list1.concat(list2);
                        } else {
                            list = this.data.allGoodList.concat(data);
                        }
                    }

                    that.setData({
                        allGoodList: list,
                        hasNext: hasNext,
                        state: 0
                    });
                    this.data.requestParam.pageIdx += 1;
                } else {
                    that.setData({
                        state: 0,
                        hasNext: false
                    });
                }
            },
            error => {
                var state = 2;
                if (this.data.allGoodList && this.data.allGoodList.length) {
                    state = 3;
                }
                that.setData({
                    state: state
                });
            }
        );
    }, // 获取热销数据
    requestShopHotWares: function () {
        var that = this;
        var param = this.data.requestParam;
        that.setData({
            state: 1
        });
        request.getShopHotWares(
            param,
            (data, hasNext) => {
                if (data) {
                    var list = this.data.allGoodList.concat(data);
                    that.setData({
                        allGoodList: list,
                        hasNext: hasNext,
                        state: 0
                    });
                    this.data.requestParam.pageIdx += 1;
                } else {
                    that.setData({
                        state: 0,
                        hasNext: false
                    });
                }
            },
            error => {
                var state = 2;
                if (this.data.allGoodList && this.data.allGoodList.length) {
                    state = 3;
                }
                that.setData({
                    state: state
                });
            }
        );
    },
    // 获取全部商品
    requestSearchWare: function () {
        var that = this;
        var param = this.data.requestParam;
        that.setData({
            state: 1
        });
        const getOpenid = require('./shop_utils/getOpenid');
        getOpenid.kGetCleanOpenid().then((openid) => {
            param.openId = openid;
            that.getSearchWare(param)
        }).catch(function (res) {
            let stringRes = JSON.stringify(res)
            util.reportErr("#requestFail#shopjs getOpenid.kGetCleanOpenid fail", stringRes);
        })
    },
    getSearchWare: function(param){
        let that=this
        request.searchWare(
            param,
            (data, hasNext) => {
                if (data) {
                    var list = this.data.allGoodList.concat(data);
                    that.setData({
                        allGoodList: list,
                        hasNext: hasNext,
                        state: 0
                    });
                    this.data.requestParam.pageIdx += 1;
                } else {
                    that.setData({
                        state: 0,
                        hasNext: false
                    });
                }
            },
            error => {
                console.log('error.msg', error)
                utils.reportErr("#requestFail#shopjs item searchWare fail: " + error);

                var state = 2;
                if (this.data.allGoodList && this.data.allGoodList.length) {
                    state = 3;
                }
                that.setData({
                    state: state
                });
            }
        );
    },
    // 获取拼购数据
    getFightBuyPage() {
        var that = this;
        var param = this.data.requestParam;
        that.setData({
            state: 1
        });
        that.data.fightPage += 1
        request.getFightBuyFilter(
            param,
            data => {
                if (data) {
                    var fbdata = data.pingouList || [];
                    var list = [];
                    list = this.data.allGoodList.concat(fbdata);
                    var len = this.data.allGoodList.length
                    var pageIdx = param.pageIdx;
                    var pagesize = param.pagesize;
                    var totalNum = that.data.fightbuyNum || (data && data.totalNum);
                    if (!that.data.fightbuyNum) {
                        that.setData({
                            fightbuyNum: data.totalNum
                        });
                    }

                    var totalPage = Math.ceil(totalNum / pagesize);

                    var hasNext = true;
                    if (pageIdx >= totalPage) {
                        var hasNext = false;
                    }
                    that.setData({
                        allGoodList: list,
                        hasNext: hasNext,
                        state: 0
                    });
                    //几次综合读取拼购数据综合 小于12，再次尝试，最多尝试3次
                    that.data.tempFb += fbdata.length
                    this.data.requestParam.pageIdx += 1;
                    if (that.data.tempFb <= 12 && that.data.fightPage <= 3 && hasNext) {
                        that.getFightBuyPage();
                    } else {
                        that.data.fightPage = 0;
                        that.data.tempFb = 0
                    }
                } else {
                    that.setData({
                        state: 0,
                        hasNext: false
                    });
                }
            },
            error => {
                var state = 2;
                if (this.data.allGoodList && this.data.allGoodList.length) {
                    state = 3;
                }
                that.setData({
                    state: state
                });
            }
        );
    },
    getFightTab(data, index) {
        index = index || 0
        let that = this
        var shopId = this.data.shopID || wx.getStorageSync("shopId");
        request.getFightBuyFilter({
            shopId: shopId,
            venderId: data.shopInfo && data.shopInfo.venderId,
            pageIdx: (index + 1),
            pagesize: 20,
        },
            function (fbData) {
                if (fbData.totalNum == 0) {
                    that.defineTabs(data, fbData);
                    return;
                }
                var totalPage = Math.ceil(fbData.totalNum / 20);
                if (fbData.pingouList && fbData.pingouList.length > 0) {
                    that.defineTabs(data, fbData);
                } else {
                    if (index <= 3 && totalPage >= index) {
                        that.getFightTab(data, ++index)
                    } else {
                        fbData.totalNum = 0
                        that.defineTabs(data, fbData);
                    }
                }
            },
            err => {
                that.defineTabs(data);
            }
        );
    },
    //获取首页数据
    getShopHomeData: function () {
        var that = this;
        request.getShopHomeData(
            data => {
                if (data && data.shopInfo && data.shopInfo.venderId) {
                    // 如果是缓存中没有venderId或venderId不一致时，存储venderId
                    let storageVenderId = wx.getStorageSync('venderId');
                    if (!storageVenderId || storageVenderId != data.shopInfo.venderId) {
                        wx.setStorageSync('venderId', data.shopInfo.venderId);
                    }
                }
                this.setData({
                    // tabKey: "1001",
                    userInfoBac: data.shopInfo.signUrl,
                    activityId: data.activity && data.activity.activityId ? data.activity.activityId : ""
                });
                var shopId = that.data.shopID || wx.getStorageSync("shopId");
                console.log('shopId=====================', that.data.shopID, shopId);

                //获取拼购数据
                that.getFightTab(data, 0)

                //判断用户是否登录
                if (loginStatus) {
                    if (data.activity && data.activity.activityId && data.activity.shopGifts && data.activity.shopGifts.length > 0) {
                        that.setData({
                            giftMsg: data.activity.shopGifts

                        })
                        //是否从登录页面返回
                        if (that.data.conternLoginStatus) {
                            that.giftConternFn(shopId, data.activity.activityId, data.shopInfo.followed || '');
                        } else {
                            that.setData({
                                followType: 2
                            })
                        }

                    } else {
                        that.setData({
                            followType: 1,
                            follow: data.shopInfo.followed || ''
                        })
                        //是否从登录页面返回
                        if (that.data.conternLoginStatus) {
                            if (data.shopInfo.followed) {
                                that.conternFn(shopId, !data.shopInfo.followed)
                            } else {
                                that.conternFn(shopId, data.shopInfo.followed)
                            }
                        }

                    }
                } else {
                    that.setData({
                        followType: 1,
                        follow: data.shopInfo.followed || ''
                    })
                }
                wx.hideLoading()
            },
            error => {
                this.setData({
                  isApiError: true
                })
                utils.reportErr("#requestFail#shopjs item getShopHomeData.json fail: " + JSON.stringify(error));
                wx.hideToast();
                wx.hideLoading()
            }
        );
    },
    //关注数据格式转换
    changeConternData: function (data) {
        var followCount = data;
        return followCount = followCount >= 10000 ? (Math.floor(followCount / 1000) / 10) + '万' : followCount

    },
    defineTabs(data, fightBuyData) {
        var that = this;
        let shopInfo = data.shopInfo;
        let floors = data.floors;
        let hotNum = shopInfo.hotNum;
        let newNum = shopInfo.newNum;
        let promotionNum = shopInfo.promotionNum;
        let totalNum = shopInfo.totalNum;
        let shopActivityTotalNum = shopInfo.shopActivityTotalNum;

        let fightbuyNum =
            this.data.fightbuyNum || (fightBuyData && fightBuyData.totalNum);
        this.setData({
            fightbuyNum: fightBuyData && fightBuyData.totalNum || 0,
            conternData: that.changeConternData(shopInfo.followCount),
            follow: shopInfo.followed || '' //false：未关注   true：关注

        });
        var tabs = [];
        if (this.hasFloor(floors)) {
            tabs.push({
                name: "精选",
                key: "1001"
            });
        }

        if (totalNum && totalNum != 0) {
            tabs.push({
                name: "商品",
                key: "1002",
                num: totalNum
            });
        }
        if (fightbuyNum && fightbuyNum != 0) {
            tabs.push({
                name: "拼购",
                key: "1007",
                num: fightbuyNum
            });
        }
        // if (hotNum && hotNum != 0) {
        //     tabs.push({
        //         name: "热销",
        //         key: "1003",
        //         num: hotNum
        //     });
        // }
        // if (promotionNum && promotionNum != 0) {
        //     tabs.push({
        //         name: "促销",
        //         key: "1004",
        //         num: promotionNum
        //     });
        // }
        //活动++++
        tabs.push({
            name: "活动",
            key: "1008",
        });
        if (newNum && newNum != 0 && (!fightbuyNum || fightbuyNum == 0)) {
            tabs.push({
                name: "上新",
                key: "1005",
                num: newNum
            });
        }
        if (shopActivityTotalNum && shopActivityTotalNum != 0) {
            tabs.push({
                name: "动态",
                key: "1006",
                num: shopActivityTotalNum
            });
        }

        if (tabs && tabs.length) {
            this.setData({
                tabKey: this.data.tabKey || tabs[0].key
            });
        }

        floors = that.formattedData(floors);

        floors.map(function (item, index) {
            if (item.moduleType === "PD_TEMPLATE") {
                item.containerData = [{
                    containerData: item.dsConfig
                }];
            }
        });
        //  var t = modal.getData_PD_TEMPLATE();
        //  t.map(function (item, index) {
        //    if (item.moduleType === 'PD_TEMPLATE') {
        //      item.containerData = [{ "containerData": item.dsConfig }]
        //    }
        //  })

        var group = this.groupItems(floors, 5);
        var fl = [];
        group.forEach(function (item, index) {
            if (index <= that.data.floorIndex) {
                fl.push(item);
            } else {
                fl.push([]);
            }
        });

        this.data.floors = group;
        var obj = shop_util.getShopConfigure();
        if (obj.configure.shopName) {
            shopInfo.shopName = obj.configure.shopName;
        }
        that.setData({
            shopInfo: shopInfo,
            floorData: fl,
            coupons: shopInfo.coupons || [],
            couponsCount: shopInfo && shopInfo.coupons ? (shopInfo.coupons || []).length : 0,
            shopCategories: data.shopInfo.shopCategories || [],
            tabs: tabs
        });
        that.searchOptimize(shopInfo);

        //如果没有精选，则显示首个tab内容
        if (tabs && tabs[0] && tabs[0].key != '1001') {
            utils.reportErr("#behaviorUnnormal#getshopfloor error： " + (this.data.shopID || wx.getStorageSync("shopId")) + '_' + appId);
            tabs[0].sort = 0;
            that.onTabEvent({
                detail: tabs[0]
            });
        }
    },

    groupItems: function (items, itemsPerRow) {
        var itemsGroups = [];
        var group = [];
        items.forEach(function (item) {
            if (group.length === itemsPerRow) {
                itemsGroups.push(group);
                group = [item];
            } else {
                group.push(item);
            }
        });

        if (group.length > 0) {
            itemsGroups.push(group);
        }

        return itemsGroups;
    },

    // 是否有店铺精选tab
    hasFloor: function (floors) {
        var isFloor = false;
        var floorData = floors;
        if (!floorData) {
            return false;
        }
        for (var i = 0; i < floorData.length; i++) {
            let item = floorData[i];
            if (
                item.templateId === 132 ||
                item.templateId === 73 ||
                item.templateId === 74 ||
                item.templateId === 53 ||
                item.templateId === 91 ||
                item.templateId === 82 ||
                item.templateId === 83 ||
                item.templateId === 17 ||
                item.templateId === 84 ||
                item.templateId === 18 ||
                item.templateId === 16 ||
                item.templateId === 11 ||
                item.templateId === 19 ||
                item.templateId === 6 ||
                item.templateId === 7 ||
                item.templateId === 8 ||
                item.templateId === 9 ||
                item.moduleType === "PD_TEMPLATE"
            ) {
                isFloor = true;
                break;
            }
        }
        if (floorData && floorData.length === 1) {
            isFloor = false;
        }
        return isFloor;
    },

    // 滚动到底部加载更多数据
    onReachBottom: function () {
        if (!this.data.hasNext) {
            return;
        }
        if (this.data.tabKey === "1005") {
            this.requestNewWareList();
        } else if (this.data.tabKey === "1003") {
            this.requestShopHotWares();
        } else if (this.data.tabKey === "1002") {
            this.requestSearchWare();
        } else if (this.data.tabKey === "1006") {
            this.getShopActivityPage();
        } else if (this.data.tabKey === "1004") {
            this.getShopPromotionWareList();
        } else if (this.data.tabKey === "1001") {
            var that = this;
            for (var i = 0; i < this.data.floorData.length; i++) {
                let item = this.data.floorData[i];
                if (item.length === 0) {
                    let key = "floorData[" + i + "]";
                    var param = {};
                    var string = "floorData[" + i + "]";
                    param[string] = this.data.floors[i];
                    param['floorIndex'] = i;
                    this.setData(param);
                    break;
                }
            }
        } else if (this.data.tabKey === "1007") {
            this.getFightBuyPage();
        } else if (this.data.tabKey === "1008") {
            if (this.data.currentType !== 'hotSale' && !this.data.promTabChange && this.data.hasNext) {//这个判断是为了避免促销的tab切换的时候会被触发两次
                this.getPromotionInfo();
            }
            if (this.data.currentType === 'hotSale' && this.data.hasNext) {
                this.requestSearchWare();
            }
        }
    },
    // page滚动偏移监听
    onPageScroll: function (e) {
        var that = this;
        var scrollTop = e.scrollTop;
        // 当页面滚动距离scrollTop >= menuTop菜单栏距离文档顶部的距离时，菜单栏固定定位
        if (this.data.tabKey == 1008) {
            if (scrollTop >= this.data.menuTop ) {
              !this.data.menuFixed &&this.setData({ menuFixed: true})
            } else{
              this.data.menuFixed &&this.setData({ menuFixed: false })
            }
        }
        // 店铺精选
        if (this.data.tabKey == 1001) {
            that.data.floorTop = scrollTop
        }
        if (scrollTop > 1 && !this.data.isScroll) {
            this.setData({
                isScroll: true
            })
        } else if (scrollTop < 1 && this.data.isScroll) {
            this.setData({
                isScroll: false
            })
        }
        if (
            scrollTop >= app.globalData.systemInfo.windowHeight &&
            this.data.isShowTab
        ) {
            this.setData({
                isShowTab: false,
                scrollTop: scrollTop
            });
        } else if (
            scrollTop < app.globalData.systemInfo.windowHeight &&
            !this.data.isShowTab
        ) {
            this.setData({
                isShowTab: true,
                scrollTop: scrollTop
            });
        }

        if (scrollTop >= this.data.winHeight && !this.data.isShowBackTop) {
            this.setData({
                isShowBackTop: true
            });
        } else if (scrollTop < this.data.winHeight && this.data.isShowBackTop) {
            this.setData({
                isShowBackTop: false
            });
        }
    },


    jumpAllGoods: function () {
        if (this.data.tabs.length >= 2) {
            let key = this.data.tabs[1].key;
            this.setData({
                switchKey: key
            });
        }
    },
    formatJDPrice: function (list) {
        if (!list) {
            return false;
        }
        if (!list.length) {
            return false;
        }

        let newList = [];
        list.map(function (item, index) {
            newList.push(newItem(item, index));
        });

        function newItem(item, index) {
            if (checkPrice(item.jdPrice)) {
                item.preJDPrice =
                    item && item.jdPrice && item.jdPrice.toString().split(".")[0];
                item.sufJDPrice =
                    item && item.jdPrice && item.jdPrice.toString().split(".")[1];
                item.isJDPrice = item && item.jdPrice && true;
            } else {
                item.isJDPrice = item && item.jdPrice && false;
            }

            return item;
        }

        function checkPrice(me) {
            if (/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(me)) {
                return true;
            }
            return false;
        }
        return newList;
    },
    getContactInfo: function () {
        //只在shop模板时生效
        if (!app.globalData.isShop) return;

        let that = this;
        request.getContactInfo(function (data) {
            if (data && data.authorizerAppid) {
                that.setData({
                    contactInfo: data
                })
            }
        }, function () {
            // let data = {"id":1,"authorizerAppid":"1","configType":3,"applyState":1,"configDesc":"1111111111","configImage":"https://img30.360buyimg.com/wechat/jfs/t26284/338/1083680196/51439/6f18a250/5bc05be4Ne30a35df.png","configButton":"2222222222222"}
            // that.setData({
            //     contactInfo:data
            // })
            // console.log('that.data.contactInfo');
            // console.log(that.data.contactInfo);
        })
    },
    contactClick: function () {
        log.click({
            eid: "Wshop_PayAttention",
            elevel: "",
            event_name: "/头部去关注tab/",
            eparam: '',
            pname: "/pages/shop/shop",
            target: ""
        });
    },
    handleContact: function (e) {
        console.log("---handleContact:(e.path + '?' + e.query)");
        console.log(e);
        var data = e.detail || {}
        var parms = ''
        if (data.path) {
            if (typeof data.query == 'object') {
                for (var key in data.query) {
                    if (data.query.hasOwnProperty(key) === true) {
                        parms += (key + '=' + data.query[key] + '&');
                    }
                }
            }
            console.log("---handleContact:data.path + '?' + parms");
            console.log(data.path + '?' + parms);
            if (data.path === '/pages/shop/shop' || data.path == '/pages/cart/cart' || data.path == '/pages/personal/personal') {
                wx.switchTab({
                    url: data.path
                })
            } else {
                wx.navigateTo({
                    url: data.path + '?' + parms
                })
            }
        }

    },
    //组件内的埋点方法
    clickFunc: function (e) {
        console.log("_________________", e)
        this.pingClick(e.detail.eid, "", e.detail.eparam, e.detail.target || '', e.detail.ev, e.detail.pname, e.detail.event_name, e.detail.click_type)
    },
    //埋点方法调用
    pingClick: function (eid, elevel, eparam, target, event, pname, event_name, click_type) {
        var that = this;
        log.click({
            "eid": eid,
            "elevel": elevel,
            "eparam": eparam,
            "pname": pname,
            "pparam": "",
            "target": target, //选填，点击事件目标链接，凡是能取到链接的都要上报
            "event": event, //必填，点击事件event
            "event_name": event_name,
            "click_type": click_type
        });
    },
    /**
  * [reportExposure 上报曝光埋点]
  * @param  {[type]}  eventId      [事件id]
  * @param  {Boolean} isOnceReport [是否记录]
  * @return {[type]}               [description]
  */
    reportExposure(eventId, eventName, eparam, pparam) {
        let that = this
        log.exposure({
            "event_name": eventName,
            "pname": "京东店铺",
            "eid": eventId,
            "elevel": '',
            "eparam": eparam,
            "pparam": pparam,
            "pageId": "KeplerMiniAppShopHome",
            "target": '', //选填，点击事件目标链接，凡是能取到链接的都要上报

        })

    },

    /** 小程序SEO,数据上报微信 */
    searchOptimize: function (shopInfo) {
        if (seoShopids.length === 0 || seoShopids.indexOf(this.data.shopID) === -1) { // 防止多次上报同一店铺
            seoShopids.push(this.data.shopID);

            let shopName = extConfig.shopName || shopInfo.shopName || '小程序店铺';

            let tagsList = ['购物'];
            if (shopInfo.venderType * 1 === 1) { // 自营
                tagsList.push('自营')
            }
            let TAG_MATCH = [
                { match: '京东', value: '京东' },
                { match: '官方', value: '官方店' },
                { match: '旗舰', value: '旗舰店' },
                { match: '专营', value: '专营店' },
            ]
            for (let i = 0; i < TAG_MATCH.length; i++) {
                if (shopName.search(TAG_MATCH[i].match) > -1) {
                    tagsList.push(TAG_MATCH[i].value);
                }
            }
            let reportParams = {
                '@type': 'general', // general: 通用类型  merchant: 商品类型
                uniq_id: this.data.shopID+'', // shopid
                title: shopName, // 内容标题
                thumbs: [shopInfo.logoUrl], // 内容缩略图，店铺logo
                // cover: '', // 本次暂不支持此字段; 内容封面大图, 1张
                digest: '这是「' + shopName + '」，快进店逛逛吧~', // 内容摘要
                tags: tagsList, // 内容关键词
            }
            // console.log("===========小程序SEO+店铺首页数据=============")

            this.setData(
                {
                    'seoReportParams': reportParams
                }
            )

            let pages = getCurrentPages() //获取加载的页面
            let currentPage = pages[pages.length - 1] //获取当前页面的对象
            let path = currentPage.route //当前页面url
            let query = Object.assign(currentPage.options)

            let pageParam = {
                path: path,
                query: query
            }
            utils.submitPage(pageParam);
        }
    },
    // 超码曝光
    bindExpoPoint (data) {
        log.exposure(data.detail)
        // 如果有超码（超码曝光），则不展示关键词楼层
        this.setData({
            isShowContact: false
        })
    },
    // 超码点击
    bindClickPoint (data) {
        log.click(data.detail)
    }
});
