/*
 * @Author: wuazhu
 * @Date: 2021-07-28 11:36:48
 * @Description: cookie 操作相关
 * @LastEditTime: 2021-07-30 18:11:20
 */
import { getPtKey } from './loginUtils.js'
import { getSitesAddress } from './sitesAddress.js';
import { getCookiesApolloConfig } from './apolloConfig.js'

var individMark = require('./individualMark.js');


/**
 * 给cookie中所有的attr去重，保留最后一个同名attr的值
 * @param {*} attr
 */
export function uniqueAttr (cookies) {
  let res = {}
  cookies.split(';').forEach(item => {
    let [key, value] = item.split('=')
    key && (res[key] = value)
  })
  return Object.keys(res).map(key => `${key}=${res[key]};`).join('')
}

/**
 * 整合cookies,结合多端融合后的cookie
 * add by wangjun
 * @returns 返回cookies
 */
export function getMixCookies (parameter) {
  let app = getApp({ allowDefault: true });
  var value = '';
  try {
    var sid = wx.getStorageSync('sid')
    // USER_FLAG_CHECK后端已经不下发了
    // ulf_ad之前是为了兼容sid,新的已经不保留,直接删除
    // sid的校验
    if (sid) {
      value = 'sid=' + sid + ';';
    }
    //京东登录用来校验的身份的字段
    var pt_key = getPtKey();
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

    // x项目-导购员id
    let employeeId = wx.getStorageSync('employeeId');
    if (employeeId) {
      // value = value + `extuserid=${employeeId};`
      // 门店通启用新定义的导购员id
      value = value + `subUnionId=${employeeId};`
    }
    // x项目新增店铺id
    let _shopId = wx.getStorageSync('shopID') || wx.getStorageSync('shopId');
    if (_shopId) {
      value = value + `shopId=${_shopId};`
    }
    // x项目新增mvpType字段
    let _mvpType = app && app.globalData && app.globalData.mvpTypeComplete
    if (_mvpType) {
      value = value + `mpClientSubType=${_mvpType};`
    }

    // appId
    let appId = wx.getStorageSync('appid');
    if (appId) {
      value = value + `appid=${appId};`
    }

    // 增加源码插件标识， mpClientType： 1-源码 2-插件
    value = value + 'mpClientType=1;'

    // venderId
    let venderId = wx.getStorageSync('venderId');
    if (venderId) {
      value = value + `venderId=${venderId};`
    }

    value = setSheildShopIds({ app, parameter, value })

    // 渠道化id
    let mpChannelId = wx.getStorageSync('mpChannelId');
    // mpChannelId="5869"

    /* start add by baoruirui, 群享价需求：根据超码渠道id获取对应渠道价 */
    let _cmGroupinfo = wx.getStorageSync('cmGroupinfo')
    let _isCmCodeSkuId = wx.getStorageSync('isCmCodeSkuId')
    if (_cmGroupinfo && _cmGroupinfo.id && _isCmCodeSkuId) {
      mpChannelId = _cmGroupinfo.id
    }

    /* end add by baoruirui, 群享价需求：根据超码渠道id获取对应渠道价 */

    if (mpChannelId) {
      value = value + `mpChannelId=${mpChannelId};`
    }

    // appType
    let appType = wx.getStorageSync('appType');
    if (appType) {
      value = value + `appType=${appType};`
    }
    // __jda 为了防止黑产,需要对融合后的接口,增加jda的参数,这个参数目前只有商详评价接口加,后续都需要,留给未来
    let __jda = wx.getStorageSync('__jda');
    if (__jda) {
      value = value + `__jda=${__jda};`
    }
    // sharematrix系统推广进入（内部系统跟单使用）
    let sharematrixType = wx.getStorageSync('sharematrixType') ? wx.getStorageSync('sharematrixType') : '';
    if (sharematrixType) {
      value = value + `sharematrix=${sharematrixType};`
    }

    // wxclient是否为模版小程序
    let wxclient = app ? app.globalWxclient : getApp({ allowDefault: true }).globalWxclient;
    let openid = wx.getStorageSync('oP_key') ? wx.getStorageSync('oP_key') : ''
    if (wxclient == 'tempwx') {
      value = value + 'openid=' + openid + ';' + 'wxclient=tempwx;'

    } else {
      value = value + 'openid=' + openid + ';' + 'wxclient=gxhwx;'
    }
    //全站地址
    let sitesAddress = getSitesAddress();
    if (sitesAddress && sitesAddress.regionIdStr) {
      value = value + `regionAddress=${sitesAddress.regionIdStr};`
    }
    if (sitesAddress && sitesAddress.addressId) {
      value = value + `commonAddress=${sitesAddress.addressId};`
    }
    if (sitesAddress && sitesAddress.commonTude) {
      value = value + `commonTude=${sitesAddress.commonTude};`
    }
    //用户收货信息加密
    value += 'ie_ai=1;'

    //cookie里需要增加mpClientVersion这个标识，以兼容不同版本
    value = value + 'mpClientVersion=1.1;';

    //商详走多端融合后和购物车是两个系统，未登录时临时购物车有问题，加一个标识 等购物车更新接口后可删除
    value = value + 'systemSource=0;'

    //新加5个字段备用
    let keplerValue = app.hwjBean || wx.getStorageSync('kepler_value') || 'nc_code';
    let ktc = wx.getStorageSync('ktc') || '';
    let ktu = wx.getStorageSync('ktu') || '';
    let ext = wx.getStorageSync('ext') || '';
    let scene = wx.getStorageSync('scene') || 'sceneIsEmpty';
    value = `${value}kepler_value=${keplerValue};ktc=${ktc};ktu=${ktu};ext=${ext};scene=${scene};`

  } catch (e) {
    console.log(e);
  }
  return value;
}


// cookie增加shieldShopids，用于过滤
function setSheildShopIds ({ app, parameter, value }) {

  /* start add by baoruirui, 增加shieldShopids（以后可能需要传递多个shopID），用于购物车、凑单页、订单中心屏蔽非本店铺相关商品、订单 */
  if ((app ? app.globalWxclient : getApp({ allowDefault: true }).globalWxclient) == 'tempwx') {
    let shieldShopids = wx.getStorageSync('shopID') || wx.getStorageSync('shopId');
    if (shieldShopids) {
      value = value + `shieldShopids=${shieldShopids};`
    } else { // jshoph5模板 ext.json不下发shopId，activityId字段值为shopId
      console.log('jshoph5 activityid...')
      let extConfig = wx.getExtConfigSync() ? wx.getExtConfigSync() : ''
      if (extConfig && extConfig.activityId) {
        value = value + `shieldShopids=${extConfig.activityId};`
      }

    }
    // 模板小程序：购物车相关接口cookie增加apolloId和apolloSecret配置；个性化小程序不加；且兼容已有的结算接口已在cookie传apolloId相关配置；
    if (parameter.url.indexOf('/kwxp/cart') > -1) { // 只针对 kwxp/cart接口增加apolloId配置
      if (!(parameter && parameter.selfCookie && parameter.selfCookie.indexOf('apolloId') > -1 && parameter.selfCookie.indexOf('apolloSecret') > -1)) {
        value = value + getCookiesApolloConfig({environment: 0})
      }
    }
  }
  return value;

  /* end add by baoruirui, 增加shieldShopids（以后可能需要传递多个shopID），用于购物车、凑单页、订单中心屏蔽非本店铺相关商品、订单 */
}


//结算页的cookie设置
export function getTradeCookies () {
  var value = '';
  value = value + getCookiesApolloConfig();
  value = value + 'sdkClient=plugin_miniapp;';
  value = value + 'sdkVersion=3.0.2;';
  value = value + 'sdkName=checkout;';
  return value
}


/*
*  多端融合统一添加apolloId和相关参数
*  add by wangjun
*/
export function getApolloIdCookies (murl) {
  var app = getApp({ allowDefault: true });
  var value = '';
  // if (app && app.globalRequestUrl) {
  //   try {
  //     if (app.globalRequestUrl.indexOf('beta') != -1) {
  //       value = value + `apolloId=89f5bc2d5c9b4c68b3c03aaad4d0af4f;`;
  //       value = value + `apolloSecret=94cac8db22814664a4e5ae8cabfe7566;`;
  //     } else {
  //       value = value + `apolloId=d1543fc0e8274901be01a9d9fcfbf76e;`;
  //       value = value + `apolloSecret=162f0903a33a445db6af0461c63c6a3b;`;
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // } else {
  //   value = value + `apolloId=d1543fc0e8274901be01a9d9fcfbf76e;`;
  //   value = value + `apolloSecret=162f0903a33a445db6af0461c63c6a3b;`;
  // }
  value = value + getCookiesApolloConfig()
  if (murl.indexOf('kitem') != -1) {
    value = value + 'sdkVersion=1.1.0;';
    value = value + 'sdkName=productDetail;';
  } else if (murl.indexOf('ktrade') != -1) {
    value = value + 'sdkVersion=3.0.2;';
    value = value + 'sdkName=checkout;';
  }
  value = value + 'sdkClient=plugin_miniapp;';
  return value
}


/**
 * 整合cookies
 *
 * @returns 返回cookies
 */
export function getCookies (parameter) {
  let app = getApp({ allowDefault: true });
  var value = '';
  try {
    var sid = wx.getStorageSync('sid')
    var USER_FLAG_CHECK = wx.getStorageSync('USER_FLAG_CHECK')
    var ulf_ad = wx.getStorageSync('ulf_ad');
    //sid和USER_FLAG_CHECK是主流程后端用来校验身份信息的字段
    if (sid && USER_FLAG_CHECK) {
      value = 'sid=' + sid + ';USER_FLAG_CHECK=' + USER_FLAG_CHECK + ';';
    }
    //通用下单接口返回的校验身份的字段
    if (ulf_ad) {
      value = value + 'ulf_ad=' + ulf_ad + ';'
    }
    //京东登录用来校验的身份的字段
    var pt_key = getPtKey();
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
    // if (app && app.globalConfig && app.globalConfig.isTriTemplate) {
    //   //统计来源
    //   var oExtuserid = wx.getStorageSync('sceneCode');
    //   if (oExtuserid) {
    //     value = value + `extuserid=${oExtuserid};`
    //   }
    // }

    // x项目-导购员id
    let employeeId = wx.getStorageSync('employeeId');
    if (employeeId) {
      // value = value + `extuserid=${employeeId};`
      // 门店通启用新定义的导购员id
      value = value + `subUnionId=${employeeId};`
    }
    // x项目新增店铺id
    let _shopId = wx.getStorageSync('shopID') || wx.getStorageSync('shopId');
    if (_shopId) {
      value = value + `shopId=${_shopId};`
    }
    // x项目新增mvpType字段
    let _mvpType = app && app.globalData && app.globalData.mvpTypeComplete
    if (_mvpType) {
      value = value + `mpClientSubType=${_mvpType};`
    }

    // 导购员业绩数据-mySubunionId
    let mySubunionId = wx.getStorageSync('mySubunionId')
    if (mySubunionId) {
      value = value + `mySubunionId=${mySubunionId};`
    }

    // appId
    let appId = wx.getStorageSync('appid');
    if (appId) {
      value = value + `appid=${appId};`
    }

    // venderId
    let venderId = wx.getStorageSync('venderId');
    if (venderId) {
      value = value + `venderId=${venderId};`
    }

    value = setSheildShopIds({ app, parameter, value })

    // /kcart/cart购物车页面 优惠券相关接口 增加apolloId配置
    if (parameter && parameter.url.indexOf('/kcart/cart') > -1) {
      if (!(parameter && parameter.selfCookie && parameter.selfCookie.indexOf('apolloId') > -1 && parameter.selfCookie.indexOf('apolloSecret') > -1)) {
        value = value + getCookiesApolloConfig({environment: 0})
      }
    }

    // 渠道化id
    let mpChannelId = wx.getStorageSync('mpChannelId');
    // mpChannelId="5869"

    /* start add by baoruirui, 群享价需求：根据超码渠道id获取对应渠道价 */
    let _cmGroupinfo = wx.getStorageSync('cmGroupinfo')
    let _isCmCodeSkuId = wx.getStorageSync('isCmCodeSkuId')
    if (_cmGroupinfo && _cmGroupinfo.id && _isCmCodeSkuId) {
      mpChannelId = _cmGroupinfo.id
    }

    /* end add by baoruirui, 群享价需求：根据超码渠道id获取对应渠道价 */

    if (mpChannelId) {
      value = value + `mpChannelId=${mpChannelId};`
    }

    // appType
    let appType = wx.getStorageSync('appType');
    if (appType) {
      value = value + `appType=${appType};`
    }
    // sharematrix系统推广进入（内部系统跟单使用）
    let sharematrixType = wx.getStorageSync('sharematrixType') ? wx.getStorageSync('sharematrixType') : '';
    if (sharematrixType) {
      value = value + `sharematrix=${sharematrixType};`
    }

    // wxclient是否为模版小程序
    let wxclient = app ? app.globalWxclient : getApp({ allowDefault: true }).globalWxclient;
    let openid = wx.getStorageSync('oP_key') ? wx.getStorageSync('oP_key') : ''
    if (wxclient == 'tempwx') {
      value = value + 'openid=' + openid + ';' + 'wxclient=tempwx;'

    } else {
      value = value + 'openid=' + openid + ';' + 'wxclient=gxhwx;'
    }

    // openIdkey（消息推送使用）
    // let oikey = wx.getStorageSync('oi_key');
    // if (oikey) {
    //   value = value + `oikey=${oikey};`
    // }
    //全站地址
    let sitesAddress = getSitesAddress();
    if (sitesAddress && sitesAddress.regionIdStr) {
      value = value + `regionAddress=${sitesAddress.regionIdStr};`
    }
    if (sitesAddress && sitesAddress.addressId) {
      value = value + `commonAddress=${sitesAddress.addressId};`
    }
    if (sitesAddress && sitesAddress.commonTude) {
      value = value + `commonTude=${sitesAddress.commonTude};`
    }
    //用户收货信息加密
    value += 'ie_ai=1;'

    //cookie里需要增加mpClientVersion这个标识，以兼容不同版本
    value = value + 'mpClientVersion=1.1;';

    //新加5个字段备用
    let keplerValue = app.hwjBean || wx.getStorageSync('kepler_value') || 'nc_code';
    let ktc = wx.getStorageSync('ktc') || '';
    ktc = ktc ? encodeURIComponent(ktc) : '';
    let ktu = wx.getStorageSync('ktu') || '';
    let ext = wx.getStorageSync('ext') || '';
    let scene = wx.getStorageSync('scene') || 'sceneIsEmpty';
    value = `${value}kepler_value=${keplerValue};ktc=${ktc};ktu=${ktu};ext=${ext};scene=${scene};`

    //品牌模板增加X项目的导购能力的小程序 （mvpType=0为标识），mpClientSubType传值2
    let mvpType = app.globalData && app.globalData.mvpTypeComplete;
    if (mvpType == 'x_0') {
      value = `${value}mpClientSubType=2;`
    }

  } catch (e) {
    console.log(e);
  }
  return value;
}


//手动拼jda 此方法由大数据研发 李吉文 提供
export function getJda () {
  var jda = wx.getStorageSync('__jda');
  if (!jda) {
    var now = (new Date()).getTime();
    jda = [
      1, now + '' + parseInt(Math.random() * 2147483647),
      now, now, now, 0
    ].join('.');
    wx.setStorageSync('__jda', jda);
  }
  return jda;
}


/**
 * x项目-拼接参数【isGuide=true】标识x项目
 * @param {*} url
 * @param {*} mvpType 是否x项目
 */
export function jointUrl (url, mvpType) {
  let app = getApp({ allowDefault: true });
  const mvpTypeComplete = app && app.globalData && app.globalData.mvpTypeComplete
  if (!mvpType) {
    mvpType = app && app.globalData && app.globalData.mvpType
  }
  if (mvpType == 'x_1' || (mvpTypeComplete && mvpTypeComplete.indexOf('x_1') > -1)) {
    if (url.indexOf('?') > -1) {
      return url + '&isGuide=true'
    } else {
      return url + '?isGuide=true'
    }
  }
  return url;
}

// 获取 param
export function getParameter (param) {
  let app = getApp({ allowDefault: true });
  var strBody = JSON.stringify(param);
  let jdlogin_pt_key = wx.getStorageSync('jdlogin_pt_key');
  var obj = new Object();
  obj.body = strBody;
  obj.pt_key = jdlogin_pt_key;
  obj.screen = (app.globalData.systemInfo.windowWidth * app.globalData.systemInfo.pixelRatio) + '*' + (app.globalData.systemInfo.windowHeight * app.globalData.systemInfo.pixelRatio)
  obj.client = 'wx';
  obj.clientVersion = '7.1.2';
  obj.source = 'jd-jing';
  return obj;
}