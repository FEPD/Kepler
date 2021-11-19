/*
 * @Date: 2021-01-07 15:41:22
 * @FilePath: /mpFactory/mjd/public/utils/tools.js
 * @Autor: wangjiguang
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-08-13 20:10:48
 * @Description:
 */
//获得随机数
export function getNonceStr (len) {
  var result = '';
  var characters = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxLength = characters.length;
  var newlen = len || 32;
  var randomIdx ;
  for (var i = 0;i < newlen; i++) {
    randomIdx = Math.floor(Math.random() * maxLength);
    result += characters.charAt(randomIdx);
  }
  return result;
}

/**
 * 将对象转换为数组
 *
 * @param {object} obj - 目标对象
 * @returns 转换后的数组
 */
export function transfer2Array (obj) {
  var arrKey = [];
  var arrValue = [];
  for (var k in obj) {
    arrKey.push(k);
    arrValue.push(obj[k]);
  }
  return { 'arrKey': arrKey, 'arrValue': arrValue };
}


/**
 * JSON 数据转为请求 query 类型
 * @param {Object} json
 * @returns String  a=2&b=3
 */
export function jsonSerialize (json) {
  var str = '';
  for (var key in json) {
    str += key + '=' + encodeURIComponent(json[key]) + '&';
  }
  return str.substring(0, str.length - 1);
}


// 防抖函数
export function debounce (fn, delay) {
  let timer = null
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
// 节流函数
export function throttle (fn, delay) {
  let last = +new Date()
  return function (...args) {
    let now = +new Date()
    if (now - last < delay) {
      return
    }
    last = now
    fn.apply(this, args)
  }
}

// 双击
export function doubleClick (fn) {
  let last = 0
  return function () {
    let current = +new Date()
    if (current - last <= 300) {
      return fn.apply(this, arguments)
    } else {
      last = current
    }
  }
}


/*
 * 小程序版本号比对（官方的代码）
 *
 * @param {String} v1 getApp().systemInfo.SDKVersion
 * @param {String} v2 版本号
 * @returns number - 1:大于 v2 版本号，0:等于 v2 版本号，-1:小于 v2 版本号
 */
export function compareVersion (v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

/**
 * 判断用户手机类型
 *
 * @param {*} appObj - this
 */
export function getPhoneModel (appObj) {
  wx.getSystemInfo({
    success: res => {
      console.log('手机信息res' + res.model)
      let modelmes = res.model;
      if (modelmes.search('iPhone X') != -1 || modelmes.search('iPhone11') != -1 || modelmes.search('iPhone12') != -1 || modelmes.search('iPhone13') != -1) {
        appObj.globalData.isIphoneX = true
      }
    }
  })
}


export function getPluginVersion () {
  let version = '';
  if (wx.getAccountInfoSync()) {
    // console.log(parseInt(wx.getAccountInfoSync().plugin.version));
    let v = wx.getAccountInfoSync().plugin.version
    version = parseInt(v) >= 0 ? v : '3.0.2';
  } else {
    version = '3.0.2'
  }
  return version;
}