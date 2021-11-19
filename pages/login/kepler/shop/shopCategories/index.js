// pages/shop/shopCategories/index.js
var shopCategories = require('/model.js');
var request = require("../shop_utils/request.js");
var utils = require("../shop_utils/util");
var log = require("../shop_utils/keplerReport.js").init();
var shop_util = require('../shop_utils/shop_util')
var app = getApp()
var loginStatus = false; // 监听登陆状态，每次回到首页只要状态有改变即刷新首页接口
var searchReport = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isLogin:false,
      shopInfo: "", // 顶部banner 店铺基本信息
      shopCategories:[],
      logoType: 1, // 1 正方形 2 长方形
      isLogin: false,
      followType: 1,
      follow: false ,
      contactInfo:{},
      userInfoBac: '',
      bDisplayMask: false, // new
      searchText: "", // new
      bInputText: false, // new
      cateId: '',
      requestParam: { "searchType": 4, "sort": 1, "pageIdx": 1, "pageSize": 20 },// 请求参数
      logoType: 1, // 1 正方形 2 长方形
      pvFlag:true,
      state:1, // 1 请求中 2 首次异常 3 加载更多数据异常
      isShowBackTop:false,
      pageIndex: "",          // 当前分页,发送请求的参数
      nextPage: 0,           // 下一个分页
      tabIndex: 0,            // 选项卡的Index,发送请求的参数
      sortIndex: 0,
      tabItems: [],           // 选项卡
      list: [],               // 商品数据
      hasNext: true, // 是否加载完毕
      loadingfailed: false, // 数据异常
      imgUrl: 'http://njst.360buyimg.com/jdreact/program/',
      winWidth: 0,
      winHeight: 0,
      height_banner: 0,
      winScale: 1,
      platform: '',
      pixelRatio: 0,
      networkType:'',
      statusBarHeight:20,
      noneFollow:true,
      isIphoneX:app.globalData.isIphoneX,
      concernPlaceHeight:40,
      hotwords:'搜索本店内商品' ,
      isCustomTabbar:true,
      shopID:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.showLoading({
          title: '加载中',
      })
      //自定义tab bar用
      // let isCustomTabbar = utils.setTabBar(this)
      // this.setData({
      //     isCustomTabbar: isCustomTabbar
      // })
      let that = this
      if(options.shopCategories){
          this.setData({
              shopCategories: JSON.parse(options.shopCategories) || [],
          });
      }
      /** 获取系统信息 begin*/
      wx.getSystemInfo({
          success: function (res) {
              // success
              var winScale = (res.windowWidth / 375.0)//招牌图高度
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
                  statusBarHeight: res.statusBarHeight,
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
      var obj = shop_util.getShopConfigure();
      var shopID = obj.configure.shopID;
      this.setData({
          shopID: shopID
      })
      this.setSpv(options)
      //获取全部商品
      this.requestSearchWare();
  },
    setSpv(options){
        let that = this
        utils.setLogPv({
            urlParam: options||'', //onLoad事件传入的url参数对象
            //skuid:'testskuid', //单品页上报，传入商品id
            title: '店铺搜索', //网页标题
            shopid: this.data.shopID, //店铺id，店铺页pop商品页传店铺id，其他页面留空即可
            pname: '',
            pparam: this.data.shopID,
            pageId: 'Kepler_Shop_Category',
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      //自定义tab bar用
      // let isCustomTabbar = utils.setTabBar(this)
      // this.setData({
      //     isCustomTabbar: isCustomTabbar
      // })
      // 获取登录状态
      let jdlogin_pt_key = utils.getPtKey() || wx.getStorageSync("jdlogin_pt_key");
      let pt_key = jdlogin_pt_key ? true : false;
      if (loginStatus || pt_key) {
          console.log("刷新数据了")
          this.getShopHomeData();
      }
      loginStatus = pt_key;
      console.log("现在的登录状态是======》" + loginStatus)
      //如果未登录
      if (loginStatus == false) {
          this.setData({
              isLogin: false,
          })
      } else {
          this.setData({
              isLogin: true
          })
      }
      this.getShopHomeData();
      this.getHotWord()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
      //自定义tab bar用
      // let isCustomTabbar = utils.setTabBar(this)
      // this.setData({
      //     isCustomTabbar: isCustomTabbar
      // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
    // 滚动到底部加载更多数据
    onReachBottom: function () {
        if (!this.data.hasNext) {
            return;
        }
        this.requestSearchWare()
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
    // 网络异常点击重新加载
    onReload: function () {
        this.requestSearchWare()
    },
    // 获取全部商品
    requestSearchWare: function () {
        var that = this;
        var param = this.data.requestParam;
        if (this.data.cateId.length) {
            param.searchType = '5';
        } else {
            param.searchType = '4';
        }
        param.keyWord = this.data.searchText;
        param.cateId = this.data.cateId;
        that.setData({ state: 1 })
        const getOpenid = require('../shop_utils/getOpenid');
        getOpenid.kGetCleanOpenid().then((openid) => {
            param.openId = openid;
            that.getSearchWare(param)
        }).catch(function (res) {
            let stringRes = JSON.stringify(res)
            util.reportErr("#requestFail#getOpenid.kGetCleanOpenid fail:", stringRes);
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
    clickSearch: function (event) {
        //点击关注埋点
        log.click({
            eid: "Kepler_Shop_Category_Search",
            event_name: "关注",
            click_type: 1,
            elevel: "",
            eparam: this.data.shopID,
            pageId:"Kepler_Shop_Category",
            pname: "/pages/shop/shop",
            pparam: ""
        });
        wx.navigateTo({
            url: "/pages/shop/shopSearch/shopSearch?focus=true"
        });
    },
    clickMask: function (event) {
        this.setData({
            bDisplayMask: false,
            focus: false,
            searchText: ""
        });
    },
    //店铺详情
    goShopDetail:function(){
        let venderId = this.data.shopInfo.venderId
        wx.navigateTo({
            url:'/pages/shop/shopDetail/shopDetail?venderId='+venderId
        })
    },
    getShopHomeData: function () {
        var that = this;
        request.getShopHomeData(
            data => {
                //判断用户是否登录
                if (loginStatus) {
                    if (data.activity && data.activity.activityId && data.activity.shopGifts && data.activity.shopGifts.length > 0) {
                        that.setData({
                            followType: 2
                        })
                    } else {
                        that.setData({
                            followType: 1,
                            follow: data.shopInfo.followed || ''
                        })
                    }
                } else {
                    that.setData({
                        followType: 1,
                        follow: data.shopInfo.followed || ''
                    })
                }
                var obj = shop_util.getShopConfigure();
                if(obj.configure.shopName){
                    data.shopInfo.shopName =  obj.configure.shopName;
                }
                that.setData({
                    concernPlaceHeight: that.data.statusBarHeight*that.data.winScale,
                    conternData: that.changeConternData(data.shopInfo.followCount),
                    shopInfo: data.shopInfo,
                    userInfoBac: data.shopInfo.signUrl,
                    shopCategories: data.shopInfo.shopCategories || []
                });
                wx.hideLoading()
            },
            error => {
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
                utils.reportErr("#requestNoData#item getConternSuc.json return code !==0: " + JSON.stringify(data));
            }

        }, error => {
            utils.reportErr("#requestFail#item getConternSuc.json fail: "  + JSON.stringify(error));
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
                    utils.reportErr("#requestNoData#item getGiftContern.json return code !==0: " + JSON.stringify(data));
                }

            }, error => {
                utils.reportErr("#requestFail#item getGiftContern.json fail: " + JSON.stringify(error));
            })
    },
    loginModalShow: function () {
        utils.globalLoginShow(this);
    },
    conternFormId: function (e) {},
    // 获取首页数据
   /**
   * 全部商品
   */
  clickAllgood: function() {
    // redirectTo
    // navigateTo
    wx.navigateTo({
      url: '/pages/shop/shopSearch/shopSearch',
    })
  },
   /**
   * 查看全部
   */
  clickSeeAll: function(e) {
    var cateid = e.currentTarget.dataset.cateid;
    wx.navigateTo({
      url: '/pages/shop/shopSearch/shopSearch?cateId=' + cateid,
    })
  },
  clickBar: function(e) {
    var shopCategories = this.data.shopCategories;
    var index = e.currentTarget.dataset.index;
    var item = e.currentTarget.dataset.item;
    if (item.subCategories && item.subCategories.length>0){
      item.open = !item.open;
      shopCategories.splice(index, 1, item);
      console.log(shopCategories)
      this.setData({ shopCategories: shopCategories })
    }else{
      wx.navigateTo({
        url: '/pages/shop/shopSearch/shopSearch?cateId=' + item.id,
      })
    }
  },
  clickItem: function(e) {
    var id = e.currentTarget.dataset.item.id;
    var shopId = e.currentTarget.dataset.item.shopId;
    var title = e.currentTarget.dataset.item.title;
    wx.navigateTo({
      url: '/pages/shop/shopSearch/shopSearch?cateId=' + id,
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
    getHotWord(){
        var that = this;

        request.getHotWord((data, hasNext) => {
            if (data && data.data) {
                that.setData({
                    hotwords: data.data[0],
                })
            }
        }, (error) => {

        })
    },
      //组件内的埋点方法
    clickFunc: function (e) {
        this.pingClick(e.detail.eid, "", e.detail.eparam, e.detail.target, e.detail.ev,e.detail.pname,e.detail.event_name,e.detail.click_type)
    },
    //埋点方法调用
    pingClick: function (eid, elevel, eparam, target, event,pname,event_name,click_type) {
        var that = this;
        log.click({
        "eid": eid,
        "elevel": elevel,
        "eparam": eparam,
        "pname": pname||"",
        "pparam": "",
        "target": target||'', //选填，点击事件目标链接，凡是能取到链接的都要上报
        "event": event, //必填，点击事件event
        "event_name":event_name||'',
        "click_type":click_type||''
        });
    },
})
