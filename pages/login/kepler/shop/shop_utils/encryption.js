/*
 * @Author: wuazhu
 * @Date: 2021-07-29 15:05:31
 * @LastEditTime: 2021-07-30 18:43:23
 */

import { request } from './request';
import { getPtKey } from './loginUtils.js'
import {reportErr} from './reportErrorAlarm.js';

var CryptoJS = require('./lib/crypto-js.js');


//3des加密
export function encryptBy3DES (message, key) {
  var keyHex = CryptoJS.enc.Utf8.parse(key);
  var encrypted = CryptoJS.TripleDES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}
//3des解密
export function decryptBy3DES (ciphertext, key) {
  var keyHex = CryptoJS.enc.Utf8.parse(key);
  var decrypted = CryptoJS.TripleDES.decrypt({
    ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
  }, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * 若cookies、shshshfp、shshshfpa、shshshfpb任意一个不存在 重新获取生成参数
 *
 */
export function toGenerateFingerPrint () {
  try {
    let app = getApp({ allowDefault: true });
    console.log('toGenerateFingerPrint====', app)
    //获取软指纹三个参数
    let wxCookie = app.globalData.wxCookie;
    if (!wxCookie) {
      wxCookie = require('./wx.cookie.js');
      app.globalData.wxCookie = wxCookie;
    }
    let shshshfp = wxCookie.getCookie('shshshfp'),
      shshshfpa = wxCookie.getCookie('shshshfpa'),
      shshshfpb = wxCookie.getCookie('shshshfpb');
    if (!shshshfp || !shshshfpa || !shshshfpb) {
      //initialize fingerprint（独立领券页和商祥页领券使用）生成软指纹参数
      const fingerPrint = require('./fingerPrint.js');
      let Jdwebm = fingerPrint.Jdwebm;
      Jdwebm && Jdwebm();
    }
  } catch (e) {
    console.log('fingerPrint error:', e);
  }
}

/**
 * @description 获取加密的ptkey
 * @author Meiling.lu
 * @date 2018-09-18
 */
export function getSecretPtKey (cb) {
  //当前ptKey值
  let currentPtKey = getPtKey();
  // 如果为空 则不必加密 直接返回 无效字符'-'
  if (!currentPtKey) {
    cb && cb('', false);
    return;
  }
  let app = getApp({ allowDefault: true });
  //initial_pt_key 用于存储/标识ptkey更新前的值
  let initailPtKey = wx.getStorageSync('initial_pt_key');
  //加密后的ptkey值
  let secretPtKey = wx.getStorageSync('secret_pt_key');
  let isNeedGetSecretPtKey = false;
  //首次或ptKey有更新时，需生成加密ptkey 并更新initial_pt_key值便于再次请求判断减少请求频次
  if (!initailPtKey || !secretPtKey || initailPtKey != currentPtKey) {
    isNeedGetSecretPtKey = true;
    //存储当前ptkey值
    wx.setStorageSync('initial_pt_key', currentPtKey);
  } else {
    cb && cb(secretPtKey, false);
    return;
  }

  if (isNeedGetSecretPtKey) {
    request({
      url: app.globalRequestUrl + '/coupon/cipher/encrypt',
      data: {
        'applicationId': 'wxchatApplets',
        'businessId': '001',
        'type': '2',
        'cipherToken': 'C42D0DFCA7533AEE22E2D3AD072B8000'
      },
      success: function (res) {
        //code 返回0表示加解密成功
        if (res && res.code && res.code == '000') {
          wx.setStorageSync('secret_pt_key', res.data);
          cb && cb(res.data, true);
        } else {
          console.log('ptkey加密返回码-->' + res && res.code);
          cb && cb('', true);
        }
      },
      fail: function (e) {
        cb && cb('', true);
        reportErr(('#requestFail#utilJS ptkey fail:'), e);
      }
    });
  }
}