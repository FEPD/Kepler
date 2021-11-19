/**
 * @author Cxy <chenxiaoyong3@jd.com>
 * @version 2.0.0
 * @description 主要承接微信内广告跳转到小程序的上报业务
 * 需求文档：http://cf.jd.com/pages/viewpage.action?pageId=103910118
 */

import { request, getJda } from './util'

/**
 * is
 * @param {any} type 期望的数据类型
 * @param {any} val  需要校验的值
 * @returns {Boolean}
 */
function is (type, val) {
  var toString = ({}).toString;
  return toString.call(type) === toString.call(val);
}

/**
 * buildURLQueryString
 * @param {Object} params
 * @param {Boolean} flag
 * @returns {String}
 */

function buildURLQueryString (params, flag) {
  if (is({}, params)) {
    var arr = [];
    for (var key in params) {
      var value = params[key];
      if (is([], value)) {
        for (var i = 0, length = value.length; i < length; i += 1) {
          if (is([], value[i]) || is({}, value[i])) {
            var tmp = {};
            tmp[key + '[' + i + ']'] = value[i];
            arr.push(buildURLQueryString(tmp, true));
          } else {
            arr.push(key + '[]=' + value[i]);
          }
        }
      } else if (is({}, value)) {
        for (var k in value) {
          if (is([], value[k]) || is({}, value[k])) {
            var tmp = {};
            tmp[key + '[' + k + ']'] = value[k];
            arr.push(buildURLQueryString(tmp, true));
          } else {
            arr.push(key + '[' + k + ']=' + value[k]);
          }
        }
      } else {
        if (flag) {
          arr.push('[' + key + ']=' + value);
        } else {
          arr.push(key + '=' + value);
        }
      }
    }
    return arr.join('&');
  } else {
    return '';
  }
}

/**
 * getCurrentPageRoute
 * @returns {String}
 */
function getCurrentPageRoute () {
  try {
    var pages = getCurrentPages();
    var currentPage = pages.slice(-1)[0];
    if (currentPage) {
      return currentPage.__route__;
    } else {
      return '';
    }
  } catch (err) {
    console.error(err);
    return '';
  }
}

/**
 * isAdsURL 判断是否从广告跳入小程序
 * @param {String|Number} platform
 * @returns {Boolean}
 */
function isAdsURL (platform) {
  return Boolean(platform);
}

/**
 * generateJDV 生成广告部所需的jdv，此jdv和大数据的jdv有所区别,是个定制的jdv
 * jdv格式： hash|source|campaign|medium|term|updatetime
 * @param {Object} params
 * @returns {String}
 */
function generateJDV (params) {
  var jdv = wx.getStorageSync('__jdv').split('|');
  var arr = [void (0), params.utm_source, params.utm_campaign, params.utm_medium, params.utm_term, void (0)];
  if (jdv.length === arr.length) {
    for (var i = 0, length = arr.length; i < length; i += 1) {
      if (!arr[i]) {
        if (jdv[i]) {
          arr[i] = jdv[i];
        } else {
          arr[i] = '-';
        }
      }
    }
    return arr.join('|');
  } else {
    return jdv.join('|');
    console.log('广告部所需jdv拼装失败，已返回本地jdv。');
  }
}

/**
 * buildRequestParams 生成上报参数
 * @param {Object} params 小程序页面的请求参数
 * @returns {Object}
 */
function buildRequestParams (params) {
  var dict = {};
  var param = Object.assign({}, params);

  dict.from = param.platform == 99 ? 'jtclick' : (param.from || '');
  dict.gdt_vid = param.gdt_vid || '';
  dict.platform = param.platform || '';
  dict.cid = param.cid || '';
  dict.csrc = param.csrc || '';
  dict.isop = param.platform == 99 ? '1' : (param.isop || '');
  dict.gaid = param.gaid || '';
  dict.gsid = param.gsid || '';

  // UTM参数
  dict.utm_campaign = param.utm_campaign || (param.platform == 1 ? 't_256716187_1' : (param.platform == 2 ? 't_1000072653_1' : ''));
  dict.utm_medium = param.utm_medium || 'weixin_shouq';
  dict.utm_source = param.utm_source || 'jdzt_wxsq_refer_null';
  dict.utm_term = param.utm_term || param.gdt_vid;

  dict.mt = param.mt || '';
  dict.vid = param.vid || '';
  dict.jtsid = param.sid || '';
  dict.jtpin = param.pin || '';

  // 构建turl的UTM参数
  param.utm_campaign = dict.utm_campaign;
  param.utm_medium = dict.utm_medium;
  param.utm_source = dict.utm_source;
  param.utm_term = dict.utm_term;

  // turl
  var route = getCurrentPageRoute();
  if (route) {
    dict.turl = encodeURIComponent(route + '?' + buildURLQueryString(param));
  } else {
    dict.turl = '';
  }

  // wxVersion
  dict.wxVersion = wx.getStorageSync('appid');

  // tempwx 模版小程序
  let app = getApp({ allowDefault: true });
  var tempwx = app.globalWxclient;
  if (tempwx === 'tempwx') {
    dict.wxclient = tempwx;
  }

  dict.jda = getJda();

  return dict;
}

/**
 * report 广告上报请求
 * @param {Object} params
 */
function report (params) {
  wx.login({
    success: (res) => {
      if (res.code) {
        request({
          url: `${getApp({ allowDefault: true }).globalRequestUrl}/kwxitem/report/zhitou.json`,
          data: Object.assign({ code: res.code }, params),
          success: (res) => {
            console && console.log('Ad request success:', res);
          },
          fail: (err) => {
            console && console.log('Ad request error:', err);
          }
        });
      } else {
        console.log(res.errMsg)
      }
    },
    fail: () => {
      console.log('wx.login调用失败');
    }
  });
}

/**
 * reportAdsData 供外部应用调用
 * @param {Object} params
 */
function reportAdsData (params) {
  if ('platform' in params) {
    if (!params.platform) {
      params.platform = '19999';  // 标记有platform字段，但没有值的情况
    }
    if (isAdsURL(params.platform)) {
      var app = getApp({ allowDefault: true });
      var reqParams = buildRequestParams(params);
      // 页面内pv上报时 所需参数
      (params.platform == 1 || params.platform == 2) && wx.setStorageSync('ad', 'zhitou');
      (params.platform == 99) && wx.setStorageSync('ad', 'jingteng');

      app.globalData.__ad__ = {
        jda: reqParams.jda,
        jdv: generateJDV(reqParams),
        reqParams: reqParams
      };
      report(reqParams);
    }
  } else {
    // pass
  }
}

module.exports = {
  reportAdsData
};