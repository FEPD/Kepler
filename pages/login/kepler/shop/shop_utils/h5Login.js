var Mmd5 = require('Mmd5.js');
var Promise = require('./lib/promise.js');
var utils = require('./util.js')

//获取应用实例
var app = getApp({allowDefault: true});
function jshopH5Login (returnpage) {
  var h5Url = '',
    activityUrl = encodeURIComponent(wx.getStorageSync('activityUrl')) || '';//jshop首页嵌入h5的URL

  promiseGentoken().then(function (res) {
    if (res.data.err_code == 0) {
      h5Url = decodeURIComponent(res.data.url + '?to=' + activityUrl + '&tokenkey=' + res.data.tokenkey);
      wx.setStorageSync('h5NewUrl', h5Url);
    }
  }).then(function () {
    if (returnpage) {
      wx.redirectTo({
        url: returnpage
      });
    }
  })
}

function promiseGentoken () {
  var guid = wx.getStorageSync('jdlogin_guid') || '',
    lsid = wx.getStorageSync('jdlogin_lsid') || '',
    // pt_pin = encodeURIComponent(wx.getStorageSync('jdlogin_pt_pin')|| ''),
    // pt_token = wx.getStorageSync('jdlogin_pt_token') || '',
    pt_key = utils.getPtKey(),  //登录状态
    appid = 269,  // wx.getStorageSync('appid'),
    ts = parseInt(new Date() / 1000),
    h5Data = 'appid=' + appid + '&pt_key=' + pt_key + '&ts=' + ts + 'dzHdg!ax0g927gYr3zf&dSrvm@t4a+8F',
    Mmd5Fun = Mmd5.Mmd5(),
    md5H5Data = Mmd5Fun.hex_md5(h5Data);

  return new Promise(function (resolve, reject) {
    wx.request({
      url: 'https://wxapp.m.jd.com/wxapplogin/cgi-bin/app/wxapp_gentoken',
      data: {
        appid: appid,
        ts: ts,
        sign: md5H5Data
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'guid=' + guid + '; lsid=' + lsid + '; pt_key=' + pt_key
      },
      success: resolve,
      fail: reject
    });
  });
}
module.exports = {
  jshopH5Login,
  promiseGentoken
}
