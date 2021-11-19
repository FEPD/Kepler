/**
 * @author huzhouli <huzhouli@jd.com>
 * @description 主要承接内部推广系统所需上报字段
 * 需求文档：''
 * @see [替换需求文档链接]
 */

import { request, reportErr} from './util';
let app = getApp();

/**
 * 标准化url
 * @param {String} url url链接
 * @param {Object} params GET参数
 * @returns {String} 经过标准化后的链接
 */
function normalizeUrl (url, params) {
  if (params === undefined) {
    return url;
  }
  const querystring = stringifyQuery(params);
  if (querystring === null) {
    return url;
  }
  if (url.indexOf('?') === -1) {
    return url + '?' + querystring;
  }
  return url + '&' + querystring;
}

/**
 * 编码查询字符串
 * @param {Object} params 待编码对象 {key: value}
 * @returns {String} URL安全的查询字符串 key=value&key2=value2
 */
function stringifyQuery (params) {
  //持续decodeURIComponent直到decode完
  let jsonParams = params || {};
  let stringParams = JSON.stringify(jsonParams);
  let encodedParams = stringParams;

  let decodeParams = '';
  let decodeJsonParams = '';
  while (true) {
    decodeParams = decodeURIComponent(encodedParams);
    if (decodeParams == encodedParams) {
      decodeJsonParams = JSON.parse(decodeParams)
      break;
    }
    encodedParams = decodeParams;
  }
  const parts = Object.keys(decodeJsonParams).map(key => `${key}=${encodeURIComponent(decodeJsonParams[key])}`);
  if (parts.length === 0) {
    return null;
  }
  return parts.join('&');
}

/**
 * setSharelog 处理上报数据
 * @param {Object} data
 */
function setSharelog (data) {
  const dataJSON = data || {};
  const kRandomNumberS = kRandomNumber();
  dataJSON.appid = wx.getStorageSync('appid') || '';
  dataJSON.ptKey = wx.getStorageSync('pt_key') || '';
  dataJSON.sharetime = wx.getStorageSync('sharetimeVoluation') || wx.getStorageSync('sharetime') || kRandomNumberS;
  dataJSON.sharetime2 = wx.getStorageSync('sharetimeTVoluation') || wx.getStorageSync('sharetime2') || kRandomNumberS;
  dataJSON.fissionLevel = wx.getStorageSync('fissionLevel') || '';
  dataJSON.openid = wx.getStorageSync('oP_key') || dataJSON.sharetime;
  dataJSON.path =  wx.getStorageSync('pagesPath');
  // dataJSON.pagePath = pagesArr.length>0?pagesArr[length-1]:'没获取到path';
  //sharetime=2019&sharetime2=2019888
  const dataString = JSON.stringify(dataJSON);
  request({
    url: normalizeUrl('https://wxapp.m.jd.com/ae/getSharelog', { k: dataString }),
    success: (res) => {
      if (res.code == 0) {
        wx.setStorageSync('sharetimeVoluation', dataJSON.sharetime);
        wx.setStorageSync('sharetimeTVoluation', dataJSON.sharetime2);
        delete dataJSON.sharetime;
        delete dataJSON.sharetime2;
      } else {
        reportErr(('#requestNoData#getSharelog no code'), res);
      }
    },
    fail: (err) => {
      reportErr(('#requestFail#getSharelog code fail'), err);
    }
  });
}


/**
 * kProcessData 供外部应用调用
 * @param {Object} params
 */
function kProcessData (options) {
  const option = options || {};
  option.customerinfo && wx.setStorageSync('customerinfo', option.customerinfo);
  option.sharetime && wx.setStorageSync('sharetime', option.sharetime);
  option.sharetime2 && wx.setStorageSync('sharetime2', option.sharetime2);
  option.fissionLevel && wx.setStorageSync('fissionLevel', option.fissionLevel);

  //获取页面path

  let PagesPathArr = getCurrentPages() || [];
  if (PagesPathArr.length > 0) {
    PagesPathArr.length == 1 && PagesPathArr[0] && PagesPathArr[0].route && wx.setStorageSync('pagesPath', PagesPathArr[0].route);
    if (PagesPathArr.length > 1) {
      for (let i = 0;i < PagesPathArr.length;i++) {
        PagesPathArr[i] && PagesPathArr[i].route && wx.setStorageSync('pagesPath', PagesPathArr[i].route)
      }
    }
  }

}

/**
 *
 * kGetSharePathData 供外部应用调用
 * @param {Object} params
 * @returns {String}
 */
function kGetSharePathData (params) {
  const kRandomNumberS = kRandomNumber();
  let sharetimeVoluation = wx.getStorageSync('sharetimeVoluation') || '';
  let sharetimeTVoluation = wx.getStorageSync('sharetimeTVoluation') || '';
  let customerinfo = wx.getStorageSync('customerinfo') || '';
  let sharetimeData = wx.getStorageSync('sharetime') || '';
  let sharetime2Data = wx.getStorageSync('sharetime2') || '';
  let fissionLevel = wx.getStorageSync('fissionLevel') || kRandomNumberS;

  if (!sharetimeVoluation) {
    !sharetimeData && !sharetime2Data && wx.setStorageSync('sharetime', kRandomNumberS);
    sharetimeData && !sharetime2Data && wx.setStorageSync('sharetime', sharetimeData);
    sharetimeData && sharetime2Data && wx.setStorageSync('sharetime', sharetime2Data);
    wx.setStorageSync('sharetime2', kRandomNumberS)
  } else {
    wx.setStorageSync('sharetime', sharetimeVoluation)
    wx.setStorageSync('sharetime2', sharetimeTVoluation)
  }

  let sharetime = wx.getStorageSync('sharetime');
  let sharetime2 = wx.getStorageSync('sharetime2');

  if (params !== undefined) {
    let qrSharePathData = {};
    if (customerinfo) {
      qrSharePathData = {
        sharetime,
        sharetime2,
        fissionLevel,
        customerinfo
      }
    } else {
      qrSharePathData = {
        sharetime,
        sharetime2,
        fissionLevel
      }
    }
    kProcessData(qrSharePathData);
    const stringQrsharePathData = JSON.stringify(qrSharePathData);
    return stringQrsharePathData
  }

  let sharePathData = {};
  if (customerinfo) {
    sharePathData = {
      sharetime,
      sharetime2,
      fissionLevel,
      customerinfo
    }
  } else {
    sharePathData = {
      sharetime,
      sharetime2,
      fissionLevel
    }
  }
  kProcessData(sharePathData);
  console.log('sharematrixSharePathData', sharePathData);
  return stringifyQuery(sharePathData);
}

/**
 * @returns {String} 随机字符串
 */
function kRandomNumber () {
  let nowDate = Date.now();
  let fissionLevel = nowDate.toString() + parseInt(Math.random() * 2147483647, 10);
  return fissionLevel;
}

/**
 * reportAdsData 供外部应用调用
 * @param {Object} params
 */
function kReportSharelogData (params) {
  const openid = wx.getStorageSync('oP_key');
  if (openid) {
    setSharelog(params);
  } else {
    const getOpenid = require('./getOpenid');
    getOpenid.kGetCleanOpenid().then((openid) => {
      setSharelog(params);
    }).catch(() => {
      setSharelog(params);
    });
  }


}

module.exports = {
  kReportSharelogData,
  kProcessData,
  kGetSharePathData
};
