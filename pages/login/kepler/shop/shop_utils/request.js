/*
 * @Author: wuazhu
 * @Date: 2021-07-30 10:34:29
 * @LastEditTime: 2021-09-28 17:48:39
 */
import {getCookies, uniqueAttr, getMixCookies, getApolloIdCookies} from './cookies'
import {getPublicAgent} from './getMAgent'
import {jsonSerialize, getNonceStr} from './tools'
import { collectApi } from './checkApiData.js'

/**
 * 针对wx.request方法的二次封装
 *
 * @param {object} parameter - 参数
 */
export function request (parameter) {
  //请求url为必填项
  if (!parameter || parameter == {} || !parameter.url) {
    console.log('Data request can not be executed without URL.');
    return false;
  } else {
    var murl = parameter.url;
    var timestamp = new Date().getTime();
    var _uuid = getNonceStr(10) + timestamp
    if (murl.indexOf('?') > 0) {
      murl = murl + '&fromType=wxapp&timestamp=' + timestamp + '&uuid=' + _uuid;
    } else {
      murl = murl + '?fromType=wxapp&timestamp=' + timestamp + '&uuid=' + _uuid;
    }
    // 判断是否为预售  如果为预售 请求需要统一加 isPresale=true 字段
    var presale = wx.getStorageSync('presale')
    if (presale == '1') {
      murl = murl + '&isPresale=true'
    }
    var headerCookie = getCookies(parameter);//通用的cookie
    //判断是否有单独场景的cookie上报
    var selfCookie = parameter.selfCookie;
    selfCookie && (headerCookie = uniqueAttr(headerCookie + selfCookie));
    var selfAgent = '';
    let urlName = murl.split('?')[0]//如果该url链接在需要加agent的数组url里
    if (agentUrlArray().indexOf(urlName) > -1) {
      let action = murl.split('?')[0].split('/').pop()
      let paramString = murl.split('?')[1]
      selfAgent = getPublicAgent(action, parameter.data, paramString)
    }
    parameter.data = jsonSerialize(parameter.data);
    if (murl.indexOf('beta') != -1) {
      collectApi({
        url: murl,
        data: parameter.data || {},
        headerCookie: headerCookie,
        selfAgent: selfAgent,
        method: parameter.method || 'POST'
      })
    }
    wx.request({
      url: murl,
      data: parameter.data || {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': headerCookie,
        'M-Agent': selfAgent //安全校验字段
      },
      method: parameter.method || 'POST',
      success: function (res) {
        //写埋点用的加密pin
        // fix bug 登录态问题：多端融合的接口通过desPin来判断登录态,未下发表示未登录也要更新desPin，老接口只有下发了才更新desPin
        if (res.data && res.data.desPin) {
          wx.setStorageSync('desPin', res.data.desPin);
        }
        //缓存sid和userFlagCheck
        if (res.data && res.data.sid && res.data.userFlagCheck) {
          wx.setStorageSync('sid', res.data.sid);
          wx.setStorageSync('USER_FLAG_CHECK', res.data.userFlagCheck)
        } else if (res.data && res.data.cookie && res.data.cookie.sid && res.data.cookie.userFlagCheck) {
          //added by meiling.lu 2018.2.22 兼容新接口的cookie获取结构
          wx.setStorageSync('sid', res.data.cookie.sid);
          wx.setStorageSync('USER_FLAG_CHECK', res.data.cookie.userFlagCheck)
        }
        if (res.data && res.data.ulf_ad) {
          wx.setStorageSync('ulf_ad', res.data.ulf_ad);
        }
        parameter.success && parameter.success(res.data);
      },
      fail: function (e) {
        console.log(e.errMsg);
        console.log('==========>', murl);
        if (parameter.fail) {
          parameter.fail(e);
        } else {
          wx.showToast({
            title: '网络信号较差',
            icon: 'loading',
            duration: 3000
          });
        }
      },
      complete: function () {
        parameter.complete && parameter.complete();
      }
    });
  }
}

/**
 * promise封装的request方法
 *
 * @param {object} params - 参数
 * @returns promise object
 */
export function promiseRequest (params) {
  return new Promise(function (resolve, reject) {
    request({
      url: params.url,
      data: params.data,
      success: resolve,
      fail: reject
    });
  });
}

/**
 * promise封装的request方法
 *
 * @param {object} params - 参数
 * @returns promise object
 */
export function promiseRequestMix (params) {
  return new Promise(function (resolve, reject) {
    requestMix({
      url: params.url,
      data: params.data,
      success: resolve,
      fail: reject
    });
  });
}

/**
 * 针对多端融合,未来新接口对照老接口会多一层数据结构,兼容老版本接口,新增新的请求方法
 * add by wangjun
 * @param {object} parameter - 参数
 */
export function requestMix (parameter) {
  //请求url为必填项
  if (!parameter || JSON.stringify(parameter) == '{}' || !parameter.url) {
    console.log('Data request can not be executed without URL.');
    return false;
  } else {
    var murl = parameter.url;
    var timestamp = new Date().getTime();
    let _uuid = getNonceStr(10) + timestamp
    murl += (murl.indexOf('?') > 0 ? '&' : '?') + 'mpClientId=wxapp&timestamp=' + timestamp + '&uuid=' + _uuid;
    // 判断是否为预售  如果为预售 请求需要统一加 isPresale=true 字段
    var presale = wx.getStorageSync('presale')
    if (presale == '1') {
      murl = murl + '&isPresale=true'
    }
    var headerCookie = getMixCookies(parameter);//通用的cookie
    // 接口都需要在请求的时候加上阿波罗id,
    headerCookie += getApolloIdCookies(murl)
    //判断是否有单独场景的cookie上报
    var selfCookie = parameter.selfCookie;
    selfCookie && (headerCookie = uniqueAttr(headerCookie + selfCookie));
    var selfAgent = parameter.selfAgent || '';
    parameter.data = jsonSerialize(parameter.data);
    if (murl.indexOf('beta') != -1) {
      collectApi({
        url: murl,
        data: parameter.data || {},
        headerCookie: headerCookie,
        'M-Agent': (parameter.header && parameter.header['M-Agent']) || selfAgent, //安全校验字段
        method: parameter.method || 'POST'
      })
    }
    wx.request({
      url: murl,
      data: parameter.data || {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': headerCookie,
        'M-Agent': (parameter.header && parameter.header['M-Agent']) || selfAgent //安全校验字段
      },
      method: parameter.method || 'POST',
      success: function (res) {
        //写埋点用的加密pin
        if (res.data && Object.keys(res.data).indexOf('desPin') > -1) {
          wx.setStorageSync('desPin', res.data.desPin);
        }
        //缓存sid
        if (res.data && res.data.sid) {
          wx.setStorageSync('sid', res.data.sid);
        }
        if (res.data && (res.data.code == '0' || res.data.code == '000')) {
          // 如果有降级方案,会在下发外层data的同时,有一个config字段,保存了所有降级相关的内容,目前只有结算主接口order会下发降级方案
          if (res.data.data && !res.data.config) {
            parameter.success && parameter.success(res.data.data);
          } else if (res.data.data && res.data.config) {
            parameter.success && parameter.success(res.data.data, res.data.config);
          } else {
            // 梁哥说有的接口会没有data下发的可能,所以针对这种情况,又请求成功,什么都不返回,例如结算成功之后的数据上报norder/paySucceeded
            parameter.success && parameter.success(res.data);
          }
        } else if (res.data.code == 999) {
          // 999返回是未登录,目前暂时还用不上
          parameter.success && parameter.success(res.data);
        } else if (res.data && [503, 601, 100, 504, 505].indexOf(+res.data.code) > -1) {
          // @大促降级：页面主接口code=503限流,code=601上级接口降级 触发排队机制
          parameter.goToWaiting && parameter.goToWaiting(+res.data.code)
        } else {
          parameter.fail && parameter.fail(res.data.msg + '+' + res.data.code);
        }
      },
      fail: function (e) {
        parameter.fail && parameter.fail(e);
        console.log(e.errMsg);
        wx.showToast({
          title: '网络信号较差',
          icon: 'loading',
          duration: 3000
        });
      },
      complete: function () {
        parameter.complete && parameter.complete();
      }
    });
  }
}
var agentUrlArray = function () {
  let app = getApp({ allowDefault: true });
  app.globalFloorUrl = app.globalFloorUrl ? app.globalFloorUrl : ''//好物街使用，至于名称不统一问题是历史原因
  app.globalShopRequestUrl = app.globalShopRequestUrl ? app.globalShopRequestUrl : ''
  app.globalRequestUrl = app.globalRequestUrl ? app.globalRequestUrl : ''
  return [
    `${app.globalShopRequestUrl}/mktsoa/cm/homePage`,
    `${app.globalShopRequestUrl}/mktsoa/cm/openIdWxIdBind`,
    `${app.globalShopRequestUrl}/mktsoa/cm/intiverRelationBind`,
    `${app.globalShopRequestUrl}/mktsoa/cm/drawRedbag`,
    `${app.globalShopRequestUrl}/mktcomsoa/api/v1/chain/getLongChain/get-long-chain-by-short`,
    `${app.globalRequestUrl}/mk/api/v1/babel/activity/query_activity_pages`,
    `${app.globalShopRequestUrl}/mktsoa/api/v1/babel/activity/query-activity-status`,
    `${app.globalShopRequestUrl}/mktsoa/api/v1/centre/joy/query-activity-page-router`,
    `${app.globalShopRequestUrl}/mktsoa/api/v1/centre/joy/query-activity-new-page`,
    `${app.globalShopRequestUrl}/mktsoa/api/v1/centre/joy/draw-lottery`,
    `${app.globalShopRequestUrl}/mktcomsoa/api/v1/common/dict/getbycode`,
    `${app.globalShopRequestUrl}/mktsoa/api/v1/centre/joy/full_task`,
    `${app.globalShopRequestUrl}/mktcomsoa/api/v1/shop/follow/shop-follow`,
    `${app.globalShopRequestUrl}/mktsoa/api/v1/centre/joy/query-lottery-record-list`,
    `${app.globalShopRequestUrl}/mktsoa/api/v1/centre/joy/save_user_info`,
    `${app.globalShopRequestUrl}/mktsoa/api/v1/centre/joy/check-login-status`,
    `${app.globalShopRequestUrl}/mktsoa/wechat/getCardInfo.do`,
    `${app.globalShopRequestUrl}/mktsoa/api/v1/centre/joy/check_left_chance`,
    `${app.globalShopRequestUrl}/mktsoa/api/v1/centre/joy/page-query-goods-list`,
    `${app.globalShopRequestUrl}/mktsoa/api/v1/centre/joy/page-query-promotion-list`,
    `${app.globalShopRequestUrl}/mktsoa/api/v1/live/joy/query_live_activity_page`,
    `${app.globalShopRequestUrl}/mktsoa/api/v1/live/joy/assist_friend`,
    `${app.globalShopRequestUrl}/mktsoa/api/v1/live/joy/receive_coupon`,
    `${app.globalFloorUrl}/forward/group/group/getHomeData.do`,
    `${app.globalFloorUrl}/forward/group/group/checkGroupUser.do`,
    `${app.globalFloorUrl}/forward/group/group/queryGroup.do`,
    `${app.globalFloorUrl}/forward/group/group/assistGroup.do`,
    `${app.globalFloorUrl}/mktsoa/api/v1/decenter/joy/check-login`
    // `${app.globalFloorUrl}/forward/group/group/startGroup.do`//这个是页面上单用wx.request调的接口，咱不能接入公用方法
  ]
}