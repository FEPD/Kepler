/*
 * @Author: wuazhu
 * @Date: 2021-07-30 18:23:44
 * @LastEditTime: 2021-07-30 18:42:03
 */
import { getParameter } from './cookies'
import { collectApi } from './checkApiData.js'
import {reportErr} from './reportErrorAlarm.js';
import { request } from './request'
import { getPtKey, Fgloballogout } from './loginUtils.js'
import { jsonSerialize } from './tools'
import { getSecretPtKey } from './encryption.js'

// 校验是否在黑名单列表
export function checkInBlackList () {
  return new Promise((resolve, reject) => {
    let app = getApp({ allowDefault: true });
    let param = {
      appId: wx.getStorageSync('appid')
    }
    var obj = getParameter(param)
    var url = app.globalRequestUrl + '/shopwechat/shophomesoa/checkIsIntoBlackList';
    if (url.indexOf('beta') != -1) {
      collectApi({
        url: url,
        data: obj,
        headerCookie: '',
        'M-Agent': '',
        method: 'POST'
      })
    }
    wx.request({
      url: url,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: obj,
      success: function (res) {
        if (res && res.data && res.data.code * 1 == 0) {
          resolve(res.data.flg)
        } else {
          reportErr('#requestNoData#item checkIsIntoBlackList.json return code !=0: ' + JSON.stringify(res));
          return false;
        }
      },
      fail: function (err) {
        reportErr('#requestFail#item checkIsIntoBlackList.json fail: ' + JSON.stringify(err));
        return false;
      }
    });
  })
}


/**
 * [isLogin 判断是否登录]
 * @return {Boolean} []
 */
export function isLogin () {
  let app = getApp({ allowDefault: true });
  request({
    url: app.globalRequestUrl + '/kwxitem/wxdetail/isLogin.json?fromType=wxapp',
    success: function (data) {
      if (data.code == '999') {//未登录
        return false;
      } else {
        return true;
      }
    },
    fail: function (e) {
      reportErr('#requestFail#util.js item isLogin.json fail: ', e);
      return false;
    }
  });
}


/**
 * 退出登录
 *
 * @param {object} obj - 页面page this
 */
export function globallogout (obj) {
  Fgloballogout(obj, request)
}

/**
 * 登录成功的回调函数
 */
export function loginSuccessCb () {
  let app = getApp({ allowDefault: true });
  if (app.globalConfig && app.globalConfig.needBindUserRel) {
    var bindUrFn = require('bindUserRel.js');
    bindUrFn.bindUserRel();
  }
}


/**
 * @description 主流程页面onload里pv上报set的数据
 * @author huzhouli
 * @date 2018-10-31
 */
export function setLogPv (jsonData) {
  
  return new Promise((resolve, reject) => {
    let app = getApp({ allowDefault: true });
    let customerinfo = wx.getStorageSync('customerinfo') || '';
    let kscene;
    try {
      kscene = wx.getStorageSync('scene')
    } catch (e) {
      // 获取场景值失败
      reportErr('#catchError#scene getStorageSync fail');
    }
    //微信直播相关数据
    let ktc = wx.getStorageSync('ktc') || '';
    // ktc = ktc ? encodeURIComponent(ktc):'';
    let pvNeedData = {
      siteId: (app.globalData && app.globalData.siteId) || 'WXAPP-JA2016-1', //开普勒小程序固定用：WXAPP-JA2016-1
      appid: wx.getStorageSync('appid') || 'appidIsEmpty',
      scene: wx.getStorageSync('scene') || 'sceneIsEmpty',
      customerInfo: decodeURIComponent(customerinfo),
      k_cus: decodeURIComponent(customerinfo),
      kscene: kscene || 'sceneIsEmpty',
      kepler_value: app.hwjBean || wx.getStorageSync('kepler_value') || 'nc_code',
      cus_tm: wx.getStorageSync('cus_tm') || '',
      ktc: ktc
    }
    if (wx.getStorageSync('kepler_value') && wx.getStorageSync('kepler_value') == 'kepler_qrcode_1') {
      pvNeedData.ext = { 'kepler_value': wx.getStorageSync('kepler_value')}
    }
    //广告进入S
    let setPvDataObj = pvNeedData;
    let adData = wx.getStorageSync('ad');  //非空的话 说明是广告进入

    if (adData) {
      setPvDataObj.pparam = setPvDataObj.pparam ? (setPvDataObj.pparam + '&ad=' + adData) : ('ad=' + adData)
    }
    //广告进入E
    let sharematrixType = wx.getStorageSync('sharematrixType') || '';
    if (sharematrixType) {
      setPvDataObj.pparam = setPvDataObj.pparam ? (setPvDataObj.pparam + '&sharematrixType=' + sharematrixType) : ('sharematrixType=' + sharematrixType)
    }
    //从微信购物单跳转进来S
    let fromWxOrderList = wx.getStorageSync('fromWxOrderList') || '';
    if (fromWxOrderList) {
      setPvDataObj.pparam = setPvDataObj.pparam ? (setPvDataObj.pparam + '&wxShoppingListScene =' + fromWxOrderList) : ('wxShoppingListScene =' + fromWxOrderList);
    }
    //从微信购物单跳转进来E

    //obj必须是json格式并且非空
    if (typeof (jsonData) === 'object' && Object.prototype.toString.call(jsonData).toLocaleLowerCase() === '[object object]' && JSON.stringify(jsonData) !== '{}') {
      for (let item in jsonData) {
        if (item == 'pparam' && setPvDataObj[item]) {
          setPvDataObj[item] = jsonData[item] + '&' + setPvDataObj[item]
        } else {
          setPvDataObj[item] = jsonData[item]
        }
      }
    }
    const resolveCallback = function (data) {
      getSecretPtKey(function (secretPtKey, isAsync) {
        //如果是同步返回ptkey加密值，则设置标记为true
        data.cipherPin = secretPtKey
        resolve(data)
      });
    };
    const getOpenid = require('./getOpenid');
    getOpenid.kGetCleanOpenid(app).then((openid) => {
      setPvDataObj.openid = openid;
      setPvDataObj.kopenid = openid;
      resolveCallback(setPvDataObj);
    }).catch(() => {
      setPvDataObj.openid = 'acquisitionFailure';
      setPvDataObj.kopenid = 'acquisitionFailure';
      resolveCallback(setPvDataObj);
    });
  })

}


export function submitPage (param) {
  let app = getApp({ allowDefault: true });
  let innerParam = {
    path: param.path,
    query: jsonSerialize(param.query),
    recommendable: true
  }
  let endParam = {
    pages: [innerParam]
  }

  request({
    url: `${app.globalRequestUrl}/transfer/invoke/submitPages`,
    method: 'POST',
    data: {
      pages: JSON.stringify(endParam)
    },
    success: function (res) {
      console.log(res)
    }
  })
}

// ump 监控埋点
export function umpMonitor (type) {
  if (!type) {
    return
  }
  var appid = wx.getStorageSync('appid');
  if (!appid) {
    return
  }
  let app = getApp({ allowDefault: true });
  wx.request({
    url: app.globalRequestUrl + '/kact/act/udo?appid=' + appid + '&type=' + type,
    data: {},
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'GET',
    success: function (res) {
      console.log('ump 监控埋点')
    }
  })
}


