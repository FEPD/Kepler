// pages/shop/components/coupon/index.js
const utils = require("../../shop_utils/util");
var log = require("../../shop_utils/keplerReport").init();
var individMark = require("../../shop_utils/individualMark.js");
const obj_path = {
    '999': 'http://m.360buyimg.com/marketingminiapp/jfs/t1/9526/38/1545/2738/5bced829Eb84ac3f9/a631073e5de8ac19.png',
    '14': 'http://m.360buyimg.com/marketingminiapp/jfs/t1/9526/38/1545/2738/5bced829Eb84ac3f9/a631073e5de8ac19.png',
    '15': 'http://m.360buyimg.com/marketingminiapp/jfs/t1/9526/38/1545/2738/5bced829Eb84ac3f9/a631073e5de8ac19.png',
    '8': 'http://m.360buyimg.com/marketingminiapp/jfs/t1/16/2/12379/2722/5bced812Ef18da63e/2a37ad7d38e3b21a.png',
    '11': 'http://m.360buyimg.com/marketingminiapp/jfs/t1/16/2/12379/2722/5bced812Ef18da63e/2a37ad7d38e3b21a.png',
    '16': 'http://m.360buyimg.com/marketingminiapp/jfs/t1/7002/11/1493/2662/5bced83cE8bea8678/7247c8ff593c33aa.png',
    '17': 'http://m.360buyimg.com/marketingminiapp/jfs/t1/7002/11/1493/2662/5bced83cE8bea8678/7247c8ff593c33aa.png'
};
var app = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        columns: {
            type: Number,
            value: 1,
        },
        editProperty: {
            type: Array,
            value: [],
            observer: function (newVal, oldVal, changedPath) {
                if (newVal !== oldVal) {
                    this.couponState()
                    this.setData({
                        bizCode: {}
                    })
                }
                // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
                // 通常 newVal 就是新设置的数据， oldVal 是旧数据
            }
        }

    },

    /**
     * 组件的初始数据
     */
    data: {
        bizCode: {},
        isShowToast: false,
        editPropertys: [],
        showToast: {
            processStatus: "",
            desc: ""
        },
        winScale:1
    },
    attached: function () {
        this._setSystemInfo();
    },
    /**
     * 组件的方法列表
     */
    methods: {
        _setSystemInfo: function () {

            var that = this;
            /** 获取系统信息 begin*/
            wx.getSystemInfo({
                success: function (res) {
                    // success
                    var winScale = (res.windowWidth / 375)

                    that.setData({
                        winScale: winScale
                    });
                }
            });
        },
        couponState() {
            setTimeout(() => {
                let editProperty = this.data.editProperty;
                let ary = []
                for (let i = 0; i < editProperty.length; i++) {
                    let item = editProperty[i];
                    let state = item.state;
                    let path = obj_path[state];
                    item.path = path;
                    item.imageUrl = item.imageUrl.indexOf('https:') > -1 ? item.imageUrl : 'https:' + item.imageUrl;
                    ary.push(item)
                }
                this.setData({
                    editPropertys: ary
                })
                //  console.log('-------------------------------', this.data.editProperty) // 页面参数 paramA 的值
            }, 50)
        },
        getCookies() {
            let app = getApp();
            var value = '';
            try {
                var sid = wx.getStorageSync('sid')
                var USER_FLAG_CHECK = wx.getStorageSync('USER_FLAG_CHECK')
                //sid和USER_FLAG_CHECK是主流程后端用来校验身份信息的字段
                if (sid && USER_FLAG_CHECK) {
                    value = 'sid=' + sid + ';USER_FLAG_CHECK=' + USER_FLAG_CHECK + ';';
                }
                //京东登录用来校验的身份的字段
                var pt_key = utils.getPtKey() || wx.getStorageSync('jdlogin_pt_key')
                if (pt_key) {
                    value = value + 'pt_key=' + pt_key + ';'
                }
                //分佣标识
                var unpl = wx.getStorageSync('unpl')
                if (unpl) {
                    value = value + 'unpl=' + unpl + ';';
                }
                var globalWxappStorageName = wx.getStorageSync('wxappStorageName');
                var appSign = wx.getStorageSync(globalWxappStorageName);
                //跟单
                if (appSign && appSign.wxversion) {
                    value = value + 'appkey=' + appSign.wxversion + ';';
                }
                //渠道来源
                var oCustomerinfo = individMark.getCustomerinfo();
                if (oCustomerinfo) {
                    value = value + `kepler-customerInfo=${oCustomerinfo};`
                }
                if (app && app.globalConfig && app.globalConfig.isTriTemplate) {
                    //统计来源
                    var oExtuserid = individMark.getExtuserid();
                    if (oExtuserid) {
                        value = value + `extuserid=${oExtuserid};`
                    }
                }

                // appId
                let appId = wx.getStorageSync('appid');
                if (appId) {
                    value = value + `appid=${appId};`
                }

                // 渠道化id
                let mpChannelId = wx.getStorageSync('mpChannelId');
                if (mpChannelId) {
                    value = value + `mpChannelId=${mpChannelId};`
                }

                // wxclient是否为模版小程序
                let wxclient = getApp().globalWxclient;
                if (wxclient == 'tempwx') {
                    value = value + `wxclient=tempwx;`
                } else {
                    value = value + `wxclient=gxhwx;`
                }

                // openIdkey（消息推送使用）
                // let oikey = wx.getStorageSync('oi_key');
                // if (oikey) {
                //     value = value + `oikey=${oikey};`
                // }
                //全站地址
                let sitesAddress = wx.getStorageSync('sitesAddress');
                if (sitesAddress && sitesAddress.regionIdStr) {
                    value = value + `regionAddress=${sitesAddress.regionIdStr};`
                }
                if (sitesAddress && sitesAddress.addressId) {
                    value = value + `commonAddress=${sitesAddress.addressId};`
                }


            } catch (e) {
                console.log(e);
            }
            return value;
        },
        receiveCoupons(e) {
            let that=this;
            console.log(e.currentTarget.dataset)
            let item = e.currentTarget.dataset.item
            let index = e.currentTarget.dataset.index
            let jdlogin_pt_key = wx.getStorageSync("jdlogin_pt_key");
            var shopid = wx.getStorageSync("shopId");
            let roleId = e.currentTarget.dataset.roleid;
            let receiveState = e.currentTarget.dataset.receivestate;
            if (!jdlogin_pt_key) {
                let returnpage = "/pages/shop/shop";
                if(app.globalData && app.globalData.mvpType == 'x_project'){
                    returnpage = "/pages/xcode/xcode/xcode"
                }

                this.setData({
                    returnpage: returnpage
                })
                utils.globalLoginShow(this);
                return false;
            }
            if (item.path) {
                return;
            }
            console.log(item)
            let obj = {
                body: {
                    source: '1',
                    ruleId: item.roleId,
                    couponKey: item.encryptedKey,
                    childActivityUrl: 'pages/shop'
                },
                client: "android",
                clientVersion: "7.0.2",
                language: 'zh_CN',
                country: 'cn'
            }

            wx.request({
                url: app.globalRequestUrl + '/shopwechat/shophomesoa/getCoupon',
                data: obj,
                header: {
                    "content-type": "application/x-www-form-urlencoded",
                    'Cookie': this.getCookies()
                },
                method: 'GET',
                success: (res) => {
                    var param = {
                        "eid": 'Wshop_MainFloorCReceive',
                        "eparam":shopid + "_" + roleId + "_" + receiveState,
                        "ev": e,
                        "pname": "/pages/shop/shop",
                        'event_name':'店铺首页优惠券楼层',
                        'click_type':1
                      }
                    that.triggerEvent('middleClickFunc', param)
                    let result = res && res.data && res.data.result
                    if (result && result.bizCode == '999') {
                        let path = obj_path['999']
                        this.setData({
                            isShowToast: true,
                            bizCode: {
                                ...this.data.bizCode,
                                [index]: path
                            },
                            showToast: {
                                processStatus: "",
                                desc: result.desc
                            },
                        })
                        setTimeout(() => {
                            this.setData({
                                isShowToast: false
                            });
                        }, 1500);
                    }
                    console.log(this.data.bizCode)
                },
                fail: function () {
                    // fail
                },
                complete: (res) => {

                }
            })
        }

    }
})
