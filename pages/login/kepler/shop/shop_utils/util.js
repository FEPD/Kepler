var Promise = require('./lib/promise.js');
var individMark = require('./individualMark.js');

import {request, requestMix, promiseRequest, promiseRequestMix } from './request'
import { getPtKey, globalLoginShow, getJumpPageType } from './loginUtils.js'
import {reportErr} from './reportErrorAlarm.js';
import {
  transfer2Array, doubleClick, compareVersion, getPhoneModel
} from './tools.js';
import { getTradeCookies, getJda, jointUrl } from './cookies'
import { formatDate, addDate, formatTime } from './formatDates'
import { encryptBy3DES, decryptBy3DES, toGenerateFingerPrint, getSecretPtKey } from './encryption'
import {
  checkInBlackList, isLogin, globallogout, loginSuccessCb,
  setLogPv, submitPage, umpMonitor
} from './operation'


var Mmd5 = require('./Mmd5.js')
var jumpTo = require('./navigate.js')
var storage = require('./storage.js')

// 发布订阅
var Emitter = require('./emitter.js');
var emitter = new Emitter();


/**
 * button触发获取用户信息后，存储用户信息
 *
 * @param {object} e - 事件参数
 */
function getUserInfo (e) {
  if (e.detail.encryptedData && e.detail.iv && e.detail.errMsg == 'getUserInfo:ok') {
    wx.setStorageSync('wxuserinfo', e.detail);
  } else {
    wx.removeStorageSync('wxuserinfo');
    console.log('用户拒绝授权')
  }
}


/** 请求 购物车清理查询接口 */
function queryCartClean (param) {
  let app = getApp({ allowDefault: true });
  request({
    url: `${app.globalRequestUrl}/kwxp/cart/cartClearQuery.json`,
    // url: `https://wxappbeta1.jd.com/kwxp/cart/cartClearQuery.json`,
    method: 'POST',
    data: {},
    success: function (res) {
      let failFlag = (res && JSON.stringify(res) == '{}') || (res.cart && JSON.stringify(res.cart) == '{}') || (Object.prototype.hasOwnProperty.call(res.cart, 'resultCode') && res.cart.resultCode != 0);
      if (!failFlag) {
        if (res && res.cart && res.cart.clearCartInfo && res.cart.clearCartInfo.length > 0) { // 为每个商品增加选中标识
          res = handleCartCleanResult(res)
        }
        param.successCall && param.successCall(res)
      } else {
        param.failCall && param.failCall()
        reportErr('#requestNoData#cart cartClearQuery.json error: ' + JSON.stringify(res));
      }
    },
    fail: function (e) {
      param.failCall && param.failCall()
      reportErr('#requestFail#cart cartClearQuery.json fail: ' + JSON.stringify(e.errMsg));
    }
  })
}

/** 处理快速清理接口数据格式 */
function handleCartCleanResult (res) {
  let groupCheckList = [];
  let itemCheckList = [];
  for (let i = 0; i < res.cart.clearCartInfo.length; i++) {
    let item = res.cart.clearCartInfo[i];
    groupCheckList.push(false)
    itemCheckList.push([...Array(item.groupDetails.length)].map(_ => false))
  }
  res = Object.assign(res, {groupCheckList, itemCheckList})
  return res;
}

/**
 * 判断一张券是否是渠道券，商详、购物车、结算页、个人中心我的优惠券列表都有用到
 */
function isChannelCoupon (extInfoStr) {
  if (!extInfoStr) {
    return false;
  }
  let _infoList = extInfoStr;
  if (typeof extInfoStr == 'string') {
    _infoList = JSON.parse(extInfoStr);
  }
  if (_infoList && _infoList.length > 0) {
    let mpchannelId = wx.getStorageSync('mpChannelId')
    for (let i = 0; i < _infoList.length; i++) {
      if (_infoList[i].id == mpchannelId) {
        return true
      }
    }
    return false
  }
  return false
}

/**
 * 1. Storage如果没有KTC，直接将当前roomId存入Storage
 * 2. 如果Storage中有roomId且与当前roomId不一致，则将当前roomId存入Storage
 * 3. 如果Storage中有roomId且与当前roomId一致，则不做任何处理
 * ------------------
 * 4、修改2020年06月17日11:11:14，每次进来都需要更新时间，且加入custom_params参数
 * @param {*} roomId
 * @param {*} custom_params
 */
function refreshKtcRoomId (roomId, custom_params) {
  const oldKtc = wx.getStorageSync('ktc');
  // Storage中无Ktc，直接覆盖
  if (!oldKtc) {
    custom_params = typeof custom_params == 'string' ? decodeURIComponent(custom_params) : 'vNull|vNull#vNull#vNull';
    wx.setStorageSync('ktc', `room_id=${roomId}&custom_params=${custom_params}&zb_live_tm=${Date.now()}`)
    return
  }
  const oldKtcObj = {}
  let oldKtcArr = oldKtc.split('&');
  for (let i = 0;i < oldKtcArr.length;i++) {
    let oldKtcArrI = oldKtcArr[i].split('=');
    oldKtcObj[oldKtcArrI[0]] = oldKtcArrI[1] || '';
  }
  custom_params = typeof custom_params == 'string' ? decodeURIComponent(custom_params) : oldKtcObj.custom_params;
  wx.setStorageSync('ktc', `room_id=${roomId}&custom_params=${custom_params || 'vNull|vNull#vNull#vNull'}&zb_live_tm=${Date.now()}`)
  // const roomIdMatch = oldKtc.match(/room_id=([^&]+)/);
  // // Storage中Ktc中无法匹配到room_id，直接覆盖
  // if(!roomIdMatch) {
  //   wx.setStorageSync('ktc',`room_id=${roomId}&zb_live_tm=${Date.now()}`)
  //   return
  // }
  // const oldRoomId = roomIdMatch[1];
  // // 老的ktc中room_id与传入的不匹配，直接覆盖
  // if(roomId!=oldRoomId) {
  //   wx.setStorageSync('ktc',`room_id=${roomId}&zb_live_tm=${Date.now()}`)
  // }
}

/*
* 商详落地最优折扣处理skuSource参数
*/
function checkoutSkuSource (wareInfo) {
  // 默认是普通商品 0
  let skuSource = 0;
  if (wareInfo.property && wareInfo.property.isOP) {
    skuSource = 6;
  } else if (wareInfo.miaoshaInfo && wareInfo.miaoshaInfo.miaosha) {
  // 秒杀 1
    skuSource = 1;
  } else if (wareInfo.flashInfo && wareInfo.flashInfo.state * 1 === 2) {
  // 闪购
    skuSource = 2;
  } else if (wareInfo.yuShouInfo && wareInfo.yuShouInfo.isYuShou) {
  // 预售
    skuSource = 4;
  }
  return skuSource;
}

// 兼容getUserProfile和getUserInfo获取头像和昵称
// 整个流程https://cf.jd.com/pages/viewpage.action?pageId=468500521 产品张鹏
function userInfoOrUserProfile () {
  return new Promise((resolve, reject) => {
    let userProfile = wx.getStorageSync('wxuserinfo');
    let reason1 = !(userProfile && userProfile.userInfo && userProfile.userInfo.nickName && userProfile.userInfo.avatarUrl);
    let reason2 = (userProfile.userInfo && userProfile.userInfo.nickName == '微信用户');
    if (reason1 || reason2) {
      const version = wx.getSystemInfoSync().SDKVersion
      let res = compareVersion(version, '2.10.4')
      if (res > 0) {
        wx.getUserProfile({
          desc: '仅用于展示用户头像及昵称',
          success: (res) => {
            wx.setStorageSync('wxuserinfo', res)
            resolve()
          },
          fail: (err) => {
            resolve(err)
          }
        })
      } else {
        wx.getUserInfo({
          success: (res) => {
            wx.setStorageSync('wxuserinfo', res)
            resolve()
          },
          fail: (err) => {
            resolve(err)
          }
        })
      }
    } else {
      resolve()
    }
  })
}

// @大促降级：页面主接口code=601 触发排队机制，范围：商详&结算 --start
/**
 *
 * @jumpType {*} param 跳转方式
 * @returnPage {*} param 返回时的回跳路径
 * @thisBarTitle {*} param 即将跳转的错误页标题
 */
function getWaitingUrl (options = {}) {
  let {
    thisBarTitle = '', returnPage = '', returnPageOptions = {},
    jumpType = 'redirectTo', jumpBackType = 'redirectTo', code
  } = options
  let errorText = ''

  if (code) {
    switch (+code) {
    case 503: //限流
    case 601: //上游接口降级
      // 拼接跳回页面的参数
      let params = ''
      Object.keys(returnPageOptions).forEach(key => {
        if (returnPageOptions[key]) {
          params += `${key}=${returnPageOptions[key]}`
        }
      })

      returnPage = returnPage ? encodeURIComponent(params ? `${returnPage}?${params}` : returnPage) : ''
      break
    case 100: // 非法入参
      errorText = '正在努力修复中~'
      returnPage = ''
      break
    case 504: // 结算全球购白名单
      errorText = '暂不支持全球购业务哦~'
      returnPage = ''
      break
    case 505: // 不支持购买sku黑名单
      errorText = '暂不支持该商品购买哦~'
      returnPage = ''
      break
    }
  }

  let url = `/pages/error/error?jumpBackType=${jumpBackType}` + (thisBarTitle ? `&thisBarTitle=${thisBarTitle}` : '') + (returnPage ? `&returnPage=${returnPage}` : '') + (errorText ? `&errorText=${errorText}` : '')
  console.log('=============错误页url=============>', url)
  return { jumpType, url }
}
// @大促降级：页面主接口code=601 触发排队机制，范围：商详&结算 --end


module.exports = {
  addDate,
  formatDate,
  formatTime,
  transfer2Array,
  reportErr,
  globalLoginShow,
  // operation
  loginSuccessCb,
  globallogout,
  isLogin,
  setLogPv,
  umpMonitor,
  //operation end
  // 请求
  request,
  requestMix,
  promiseRequest,
  promiseRequestMix,
  // 请求end
  getUserInfo,
  getPhoneModel,
  getJumpPageType,
  getPtKey,
  getSecretPtKey,
  getJda,
  // 加解密
  encryptBy3DES,
  decryptBy3DES,
  toGenerateFingerPrint,
  // 加解密end
  emitter,
  submitPage,
  queryCartClean,
  handleCartCleanResult,
  compareVersion,
  jointUrl,
  getTradeCookies,
  checkInBlackList,
  isChannelCoupon,
  refreshKtcRoomId,
  checkoutSkuSource,
  doubleClick,
  jumpTo,
  storage,
  userInfoOrUserProfile,
  getWaitingUrl
}
