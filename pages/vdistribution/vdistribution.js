// var log = require('../../utils/keplerReport.js').init();
Page({
    data: {
      options: {},
      skuList: []
    },
    onLoad: function (options) {
      this.setData({ options })
      this.distribution = this.selectComponent('#distribution')
    },
    onHide: function () {
      //上报留存时长，需要在页面的onUnload、onHide事件中调用log.pageUnload()方法可实现页面留存时长统计
      // log.pageUnload()
    },
    onUnload: function () {
      //上报留存时长，需要在页面的onUnload、onHide事件中调用log.pageUnload()方法可实现页面留存时长统计
      // log.pageUnload()
    },
    // 跳页
    goPage: function (e) {
      let param = e.detail;
      if (param && param.jumpWay && param.jumpUrl) {
        wx[param.jumpWay]({
          url: param.jumpUrl
        })
      }
    },
    // 跳回
    distrBack: function () {
      const wxCurrPage = getCurrentPages();//获取当前页面的页面栈
      console.log('当前页面栈', wxCurrPage);
      if (wxCurrPage[wxCurrPage.length - 1].__route__.indexOf('/vdistribution/vdistribution') != -1) {
        wx.navigateBack();
      }
    },
    goOpenSettion: function (e) {
      let that = this;
      that.setData({
        'skuList': e.detail.skuList
      });
      that.getLocation().then((reponse) => {
        that.longitude = reponse.longitude;
        that.latitude = reponse.latitude;
        console.log('地理位置11111', that.longitude, that.latitude)
        let storeParamObj = {
          'longitude': that.longitude,
          'latitude': that.latitude,
          'channel': '4',
          'listSkuInfo': e.detail.skuList
        };
        let url = that.distribution.getStoreh5(storeParamObj)
        wx.redirectTo({ url })
      }, (errMsg) => {
        that.distribution.selectError(errMsg);
      })
  
    },
    locationErr: function () {
      let that = this;
      // 当地址授权之后,同意但是依旧没没办法获取到地址的时候,使用兜底方案
      // 就是把结算页获取的地址定位信息传到H5页
  
      let storeParamObj = {
        'longitude': that.data.options.longitudeString,
        'latitude': that.data.options.latitudeString,
        'channel': '4',
        'listSkuInfo': that.data.skuList
      };
      let url = that.distribution.getStoreh5(storeParamObj)
      wx.redirectTo({ url })
    },
    getLocation (params) {
      let that = this
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
                              that.locationErr();
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
  })
