import { getPtKey } from './loginUtils.js'

// 微信环境下初始设置
const ENV_OBJ = wx
const openId_key = 'oP_key'
const ENV = 'wx'

// taro环境下初始设置
// const ENV_OBJ = Taro
// const openId_key = 'user_openid'
// const ENV = 'taro'

/**
 * @description: 新异常上报接口 可在后台配置ump告警
 * @param {errorMsg, dim4, dim5} 
 * @return: 
 * @author: wangjiguang
 */
function reportAlarm (param = {}) {
  let errJson = commonErrInfo();
  let _index = param.errorMsg.indexOf('#', 1) + 1;
  // 拼接版本号
  errJson.errorMsg = _index > 0 ? (param.errorMsg.slice(0, _index) + errJson.ua.miniVersion + param.errorMsg.slice(_index)) : (errJson.ua.miniVersion + param.errorMsg)
  param.dim4 && (errJson.errorStack = param.dim4); //dim4 exception 对象
  param.dim5 && (errJson.dim5 = param.dim5);//dim 字段待确定
  let pointName = param.pointName || 'fe-common';
  let url = `https://wxapp.m.jd.com/goldouter/mp/report/${pointName}/error`;
  //京东登录用来校验的身份的字段 非必填项
  let pt_key = getPtKey();
  pt_key && (pt_key=`pt_key=${pt_key};`);
  //openid非必填项
  let openid = `openid=${ENV_OBJ.getStorageSync(openId_key) || ''};`
  //appid必填项
  let appid = `appid=${errJson.appid || ''};`
  ENV_OBJ.getNetworkType({
    success: res => {
      if(res && res.networkType){
        errJson.netWorkType=res.networkType
      }
      ENV_OBJ.request({
        url: url,
        data: errJson || {},
        header: {
          'Content-Type': 'application/json',
          'Cookie': pt_key+openid+appid
        },
        method: 'POST',
        fail: function (e) {
          reportLog({errorMsg:'reportAlarm fail', dim4:e});
        }
      });
    },
    fail: err=> {
      reportLog({errorMsg:'getNetwork error', dim4: err});
      ENV_OBJ.request({
        url: url,
        data: errJson || {},
        header: {
          'Content-Type': 'application/json',
          'Cookie': pt_key+openid+appid
        },
        method: 'POST',
        fail: function (e) {
          reportLog({errorMsg:`reportAlarm fail - ${param.errorMsg}`, dim4:e});
        }
      });
    }
  })
}

/**
 * @description: 错误上报--老接口
 * @param {errorMsg, dim4, dim5} 
 * @return: 
 * @author: wangjiguang
 */
function reportLog(param={}) {
  let errJson = commonErrInfo();
  //let app = getApp({ allowDefault: true });

  errJson.dim1 = param.errorMsg.replace(/#/g, '');
  errJson.ua = JSON.stringify(errJson.ua);
  errJson.dim2 = errJson.page;//错误发生页
  errJson.dim3 = errJson.appid;
  param.dim4 && (errJson.dim4 = param.dim4);//字段待明确
  //param.dim5 && (errJson.dim5 = param.dim5);//字段待明确

  ENV_OBJ.getNetworkType({
    success: res => {
      if(res && res.networkType){
        errJson.dim5 = res.networkType
      }
      let errString = JSON.stringify(errJson);
      let url = `https://wxapp.m.jd.com/aspp/log/upload.do?data=${errString}`;
      ENV_OBJ.request({ url: url });
    },
    fail: err=> {
      reportLog({errorMsg:'getNetwork error', dim4: err});
      let errString = JSON.stringify(errJson);
      let url = `https://wxapp.m.jd.com/aspp/log/upload.do?data=${errString}`;
      ENV_OBJ.request({ url: url });
    }
  })
}
/**
 * @description: 处理公共错误处理
 * @param {type} 
 * @return: 
 * @author: wangjiguang
 */
function commonErrInfo() {
  //获取当前页面
  let arrpageShed = getCurrentPages();
  let strCurrentPage = (arrpageShed && arrpageShed.length > 0) ? arrpageShed[arrpageShed.length - 1].__route__ : '';
  //设备信息
  let systemInfoObj = {};
  let systemInfo = ENV_OBJ.getSystemInfoSync();
  if (systemInfo) {
    systemInfoObj = {
      'brand': systemInfo.brand,
      'model': systemInfo.model,
      'version': systemInfo.version,
      'system': systemInfo.system,
      'SDKVersion': systemInfo.SDKVersion
    }
  }
  let product;
  let miniVersion = '';
  if (ENV == 'wx') {
    let miniProgram =  wx.getAccountInfoSync && wx.getAccountInfoSync().miniProgram
    miniVersion = miniProgram && miniProgram.envVersion
    systemInfoObj.wxVersion = miniProgram && miniProgram.version
    product = 'wxminiprogram'
  } else {
    miniVersion = process.env.TARO_ENV === 'swan' ? '1.16.2' : '1.4.13'
    product = process.env.TARO_ENV === 'swan' ? 'swanminiprogram' : 'ttminiprogram'
  }
  systemInfoObj.miniVersion = miniVersion;
  // 记录页面栈，捕捉页面跳转记录
  let _pageStack = []
  if (arrpageShed && arrpageShed.length > 0) {
    arrpageShed.forEach((item)=>{
      // getCurrentPages获取页面栈，有可能获取到的item是null,比如直播页, item.options会报错
      _pageStack.push({
        options: item && item.options,
        path: item && item.__route__
      })
    })
  }
  
  return {
    product: product,
    logtime: new Date(),
    ua: systemInfoObj,
    appid: ENV_OBJ.getStorageSync('appid'),
    page: strCurrentPage,
    pageStack: _pageStack
  }
}

/**
 * @description: 上报错误接口
 * @param {errorMsg, dim4, dim5} 
 * @return: 
 * @author: wangjiguang
 */
export function reportErr(errorMsg, dim4, dim5) {
  if(!errorMsg) return; 
  //app级别的error捕获--> 以`#appOnError#`开头
  //页面级别的error捕获--> 以`#pageOnError#`开头
  //try-catch里异常捕获--> 以`#catchError#`开头
  //data数据请求异常(in request fail) --> 以`#requestFail#`开头
  //in else branch 返回数据不是预期数据 --> 以`#requestNoData#`开头
  //行为异常(比如未加载完全用户离开页面等) --> 以`#behaviorUnnormal#`开头
  //时间打点记录，操作超出预估时间告警 --> 以`#timeRecord#`开头
  //如果上边未识别,则走默认pointName
  
  let pointLists = ['appOnError', 'pageOnError', 'catchError', 'requestFail', 'requestNoData', 'behaviorUnnormal', 'timeRecord']
  let prefix = ENV == 'wx' ? 'wxmini-' : (process.env.TARO_ENV === 'swan' ? 'swanmini-' : 'ttmini-');
  let _matchArr = errorMsg.match(/^#(.+)#/);
  let pointIndex = _matchArr && _matchArr.length > 0 && _matchArr[1] ? pointLists.indexOf(_matchArr[1]) : -1
  let pointName = pointIndex != -1 ? `${ prefix }${ _matchArr[1] }` : 'fe-common';
  // 如果是前五项报错，上报新版错误上报系统，如果是后两项，上报老版错误上报系统
  reportAlarm({
    errorMsg, dim4, dim5,pointName
  });
  // if (pointIndex <= 4) {
  //   reportAlarm({
  //     errorMsg, dim4, dim5,pointName
  //   });
  // } else {
  //   reportLog({
  //     errorMsg, dim4, dim5,pointName
  //   })
  // }
 
}




// // 老版本错误上报======================
// //微信小程序所涉及的所有页面文件夹分类,异常上报接口仅识别以下pointName,否则上报的异常将不记录不报警。未在册需要向服务端添加pointName
// const ARR_pointName = ['pages-shop', 'pages-cart', 'pages-personal', 'pages-jshopH5', 'pages-vipIndex', 'pages-web-h5', 'pages-registerMember', 'pages-supplement', 'pages-integral', 'pages-kabin', 'pages-agreement', 'pages-vipActivityUrl', 'pages-vipListUrl', 'pages-phoneBbs', 'pages-phone', 'pages-vipIndexBridge', 'pages-webViewTest', 'pages-transition', 'pages-proxy', 'pages-plug', 'pages-login', 'pages-payment', 'pages-buyingDetails', 'pages-baolishenquan', 'pages-pay', 'pages-payWebview', 'pages-product', 'pages-ftproduct', 'pages-login-receive', 'pages-accountBind', 'pages-error', 'pages-webViewError', 'pages-chat', 'pages-appointment', 'pages-preferbuy', 'pages-venderListH5', 'pages-wxappBridge', 'pages-activityH5', 'pages-jshopHtml', 'pages-BabelHome', 'pages-order', 'pages-orderDetail', 'pages-orderEvaluate', 'pages-orderEvaluateWebview', 'pages-orderTrack', 'pages-protocolTxt', 'pages-upgrade', 'pages-address', 'pages-assess', 'pages-distribution', 'pages-coupon', 'pages-addressul', 'pages-myFeedback', 'pages-orderSubmitSuccess', 'pages-chooseaddress', 'pages-facture', 'pages-piecelist', 'pages-service', 'pages-productUserAddress', 'pages-sharematrixB', 'pages-redPacketTxt', 'pages-adpage', 'pages-riskRulesTxt', 'pages-globalAgreement', 'pages-authorizationWebview', 'pages-userNotice', 'pages-cmData', 'pages-codenew', 'pages-product', 'pages-activityH5', 'grade-0', 'grade-1'];
// //开关cookie有时间一天
// const SWITCH_MAX_AGE = 3600 * 24;

// /**
//  * @Author: meiling.lu
//  * @Date: 2020-03-24 15:40:37
//  * @msg: 通过前端开关接口
//  * @param {type} 
//  * @return: 
//  */
// function getReportErrSwitch() {
//   let app = getApp({ allowDefault: true });
//   return new Promise(function (resolve, reject) {
//     wx.request({
//       url: `${app.globalRequestUrl || 'https://wxapp.m.jd.com'}/goldouter/switch/getConfig?key=wx_app_reportErr_config`,
//       method: 'POST',
//       success: resolve,
//       fail: reject
//     });
//   })
// }
// /**
//  * @Author: meiling.lu
//  * @Date: 2020-03-24 11:23:46
//  * @msg: 新异常上报接口 可在后台配置ump告警
//  * @param {errorMsg} 错误具体描述信息
//  * @return: 
//  */
// function reportErrUMP(errorMsg, dim4, dim5) {
//   //https://wxapp.m.jd.com/goldouter/mp/report/{pointName}/error
//   let errJson = commonErrInfo();
//   errorMsg && (errJson.errorMsg = decodeURIComponent(errorMsg));
//   let prefix = (wx && 'wxmini-') || (tt && 'ttmini-') || (swan && 'swanmini-') || '' 
//   let _matchArr = errJson.errorMsg ? errJson.errorMsg.match(/^#(.+)#/) : null
//   let errorGrade = _matchArr && _matchArr.length > 0 ? _matchArr[1] : null
//   dim4 && (errJson.errorStack = dim4); //dim4 exception 对象
//   dim5 && (errJson.dim5 = dim5);//dim 字段待确定
//   let app = getApp({ allowDefault: true });
//   let pointName = `fe-common`;
//   //上报异常页面
//   if (errJson.page) {
//     let arrUnit = errJson.page.split('/');
//     //形如 pages-cart模块上报
//     if (arrUnit.length >= 2) {
//       let pn = errorGrade ? `${ prefix }${ errorGrade }` : `${arrUnit[0]}-${arrUnit[1]}`;
//       if (errorGrade || ARR_pointName.indexOf(pn) != -1) {
//         pointName = pn;
//       }
//     }
//   }
//   let url = `${app.globalRequestUrl}/goldouter/mp/report/${pointName}/error`;
//   //京东登录用来校验的身份的字段 非必填项
//   let pt_key = getPtKey();
//   pt_key && (pt_key=`pt_key=${pt_key};`);
//   //openid非必填项
//   let openid = `openid=${wx.getStorageSync('oP_key') || ''};`
//   //appid必填项
//   let appid = `appid=${wx.getStorageSync('appid') || ''};`
//   wx.request({
//     url: url,
//     data: errJson || {},
//     header: {
//       'Content-Type': 'application/json',
//       'Cookie': pt_key+openid+appid
//     },
//     method: 'POST',
//     fail: function (e) {
//       reportErrOld('reportErrUMP fail',e);
//     }
//   });
// }

// /**
// * report crash log
// *
// * @param {String} errorMsg - exception msg
// */
// function reportErrOld(errorMsg, dim4, dim5) {

//   let errJson = commonErrInfo(errorMsg);
//   let app = getApp({ allowDefault: true });

//   errJson.dim1 = errorMsg;
//   errJson.dim2 = errJson.page;//错误发生页
//   errJson.dim3 = errJson.appid;
//   errJson.dim4 = dim4;//字段待明确
//   errJson.dim5 = dim5;//字段待明确

//   let errString = JSON.stringify(errJson);
//   let url = `${app.globalRequestUrl}/aspp/log/upload.do?data=${errString}`;
//   wx.request({ url: url });
// }

// /**
//  * @Author: meiling.lu
//  * @Date: 2020-03-24 15:38:30
//  * @msg: 获得异常上报基本信息
//  */
// function commonErrInfo() {
//   //获取当前页面
//   let arrpageShed = getCurrentPages();
//   let strCurrentPage = (arrpageShed && arrpageShed.length > 0) ? arrpageShed[arrpageShed.length - 1].__route__ : '';

//   //设备信息
//   let systemInfoObj = {};
//   let systemInfo = wx.getSystemInfoSync();
//   if (systemInfo) {
//     systemInfoObj = {
//       'brand': systemInfo.brand,
//       'model': systemInfo.model,
//       'version': systemInfo.version,
//       'system': systemInfo.system,
//       'SDKVersion': systemInfo.SDKVersion
//     }
//   }
//   return {
//     product: 'wxminiprogram',
//     logtime: new Date(),
//     ua: JSON.stringify(systemInfoObj),
//     appid: wx.getStorageSync('appid'),
//     page: strCurrentPage
//   }
// }
// /**
//  * @Author: meiling.lu
//  * @Date: 2020-03-26 15:07:38
//  * @msg: reportErr作为判断函数，读取配置开关。
//  * 开opened:执行UMP异常上报；关closed：执行reportErrOld老上报接口
//  * @param {type} 
//  * @return: 
//  */
// export function reportErr(errorMsg, dim4, dim5) {
//   let app = getApp({ allowDefault: true });
//   //获得cookie
//   let wxCookie = app.globalData && app.globalData.wxCookie;
//   if (!wxCookie) {
//     wxCookie = require('./wx.cookie.js');
//     app.globalData.wxCookie = wxCookie;
//   }
//   try {
//       //cookie存储关于此开关的值
//       let wx_app_reportErr_switch_state = wxCookie.getCookie('wx_app_reportErr_switch');
//       //cookie中无存储，视为首次，请求开关，并将之同步至cookie中存储
//       if (!wx_app_reportErr_switch_state) {
//         getReportErrSwitch().then(res => {
//           let config = res && res.data && res.data.config && res.data.config.wx_app_reportErr_config || "{}";
//           if(config) config = JSON.parse(config);
//           if (config.switch && config.switch == '1') {//走新的异常上报接口            
//             wxCookie.setCookie({ data: { 'wx_app_reportErr_switch': { value: 'opened', maxAge: config.maxAge || SWITCH_MAX_AGE } } })
//             reportErrUMP(errorMsg, dim4, dim5);
//           } else {
//             wxCookie.setCookie({ data: { 'wx_app_reportErr_switch': { value: 'closed', maxAge: config.maxAge || SWITCH_MAX_AGE } } })
//             reportErrOld(errorMsg, dim4, dim5)
//           }
//         }).catch(error => {
//           wxCookie.setCookie({ data: { 'wx_app_reportErr_switch': { value: 'closed', maxAge: SWITCH_MAX_AGE } } })
//           reportErrOld(encodeURIComponent("请求控制异常上报开关接口异常，具体信息：") + JSON.stringify(error));
//         })
//         //非第一次进入,只要状态有值，不进行接口请求,从cookie里取开关状态值
//       } else if ('opened' == wx_app_reportErr_switch_state) {
//         reportErrUMP(errorMsg, dim4, dim5)
//       } else {
//         reportErrOld(errorMsg, dim4, dim5);
//       }
//   } catch (error) {
//     //老接口将页面异常信息上报
//     reportErrOld(errorMsg, dim4, dim5);
//     //上报此方法本身发生的异常
//     reportErrOld('reportErr 方法本身出错', error);
//     //出现异常，将开关关掉，时间一天
//     wxCookie.setCookie({ data: { 'wx_app_reportErr_switch': { value: 'closed', maxAge: SWITCH_MAX_AGE } } })
//   }
// }

