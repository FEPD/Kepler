var plugin = requirePlugin("myPlugin");
const util = require('../utils/util.js');
let app = getApp();

Page({

    data: {
        distData: {},
        options: {},
        pDir: '/kwxp',
        toastFlag: false,
    },
    onLoad: function (options) {
        let that = this;
        console.log(options)
        if (options.storeId) {
            //从h5页面选择地址之后返回的
            that.setData({
                options: {
                    venderId: wx.getStorageSync("venderId"),
                    skuList: wx.getStorageSync("skuList"),
                    storeName: options.storeName,
                    storeAddress: options.storeAddress,
                    storeId: options.storeId,
                    currentShipmentType: 8
                }
            })
        } else {
            that.setData({
                options: {
                    venderId: options.venderId,
                    skuList: JSON.parse(options.skuList),
                    globalBuy: options.isGlobalPayment == "true" ? "HK" : "",
                    latitudeString: options.latitudeString,
                    longitudeString: options.longitudeString
                }
            })
            wx.setStorageSync('venderId', options.venderId);
            wx.setStorageSync('skuList', that.data.options.skuList);
        }
        this.getaAllData();
        this.distribution = this.selectComponent('#distribution')
    },
    getaAllData: function () {
        this.tradeCookieSet();
        var that = this;
        const URL = plugin.tradeRequestUrl + that.data.pDir + '/norder/payShipment.json?venderId=' + this.data.options.venderId + "&globalBuy=" + this.data.options.globalBuy;
        plugin.request({
            url: URL,
            selfCookie: this.data.tradeCookie,
            success: function (data) {
                that.setData({
                    distData: data
                })
            },
            fail: function (e) {
                util.reportErr("distribution payShipment.json: " + e);
                wx.redirectTo({
                    url: '../error/error'
                });
            }
        });
    },
    onUnload: function () {

    },
    goToVstoreh5: function (e) {
        wx.redirectTo({
            url: `../vstoreh5/vstoreh5?params=${JSON.stringify(e.detail.param)}`
        })
    },
    distrBack: function () {
        const wxCurrPage = getCurrentPages();//获取当前页面的页面栈
        console.log(wxCurrPage);
        if (wxCurrPage[wxCurrPage.length - 1].__route__ == "pages/vdistribution/vdistribution") {
            wx.navigateBack();
        }
    },
    goOpenSettion: function (e) {
        let that = this;
        that.setData({ 
            "skuList": e.detail.skuList
        });
        console.log(that.data.options)
        getLocation(that).then((reponse) => {
            that.longitude = reponse.longitude;
            that.latitude = reponse.latitude;
            console.log("地理位置11111", that.longitude, that.latitude)
            let storeParamObj = {
                "longitude": that.longitude,
                "latitude": that.latitude,
                "channel": "3",
                "listSkuInfo": e.detail.skuList
            };
            wx.redirectTo({
                url: `../vstoreh5/vstoreh5?params=${JSON.stringify(storeParamObj)}`
            })

        }, (errMsg) => {
            that.distribution.selectError();
        })

    },
    locationErr: function () {
        let that = this;
        // 当地址授权之后,同意但是依旧没没办法获取到地址的时候,使用兜底方案
        // 就是把结算页获取的地址定位信息传到H5页
        
        let storeParamObj = {
            "longitude": that.data.options.longitudeString,
            "latitude": that.data.options.latitudeString,
            "channel": "3",
            "listSkuInfo": that.data.skuList
        };
        wx.redirectTo({
            url: `../vstoreh5/vstoreh5?params=${JSON.stringify(storeParamObj)}`
        })
    },
    tradeCookieSet: function () {
        var tradeCookie = plugin.getTradeCookies(plugin.tradeRequestUrl);
        this.setData({
            tradeCookie: tradeCookie
        })
    },
})
function getLocation(obj, params) {
    let type = params && params.type ? params.type : 'wgs84';
    let altitude = params && params.altitude ? params.altitude : false;

    let promise = new Promise(function (resolve, reject) {
        if (wx.getLocation) {
            wx.getLocation({
                type: type,
                altitude: altitude,
                success: function (reponse) {
                    resolve(reponse);
                },
                fail: function () {
                    console.log("wwwwwwwwwwwwwwwwwwwww")
                    wx.showModal({
                        title: '打开设置页面进行授权',
                        content: '需要获取您的地理位置，请到小程序的设置中打开地理位置授权',
                        confirmText: '去设置',
                        success: function (confirmReponse) {
                            if (confirmReponse.confirm) {
                                wx.openSetting({
                                    success: function (setReponse) {
                                        if (setReponse.authSetting['scope.userLocation']) {
                                            wx.getLocation({
                                                altitude: false,
                                                success: function (reponse) {
                                                    resolve(reponse);
                                                },
                                                fail: function () {
                                                    obj.locationErr();
                                                    // reject();
                                                }
                                            })
                                        } else {
                                            reject();
                                        }
                                    }
                                })
                            } else {
                                reject('获取地理位置失败');
                            }
                        },
                        fail: function () {
                            reject();
                        }
                    })
                }
            })
        }
    })
    return promise;
}