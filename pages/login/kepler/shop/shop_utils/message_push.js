// @wangjigaung 2018-03-19
// 模版消息推送

let util = require('./util.js');
// @jianglun 根据相关政策，屏蔽所有模板推送请求
const isShield = true;

// 通过code获取用户加密标识，并存入缓存
function getOpenIdKey(globalRequestUrl, extConfigObj) {
    let requestUrl = globalRequestUrl ? globalRequestUrl : getApp({ allowDefault: true }).globalRequestUrl;

    let promise = new Promise((resolve, reject) => {
        if (!extConfigObj || !extConfigObj.appid) {
            reject();
            return;
        }
        wx.login({
            success: function (res) {
                let code = res.code;
                util.request({
                    // url: requestUrl + '/kwxhome/myJd/initOpenIdKey.json',
                    url: requestUrl + '/kwxhome/myJd/getOpenId.json',
                    method: 'POST',
                    data: {
                        wxcode: code,
                        wxAppId: extConfigObj.appid,
                        clientType: extConfigObj.isIndividual ? 'gxhwx' : 'tempwx'
                    },
                    success: function (response) {
                        if (response && response.openIdKey) {
                            wx.setStorageSync('oP_key', response.openIdKey);
                            resolve();
                        } else {
                            reject();
                            wx.removeStorageSync('oP_key');
                        }
                    }
                })
            },
            fail: function () {
                reject();
            },
            complete: function () {
                resolve()
            }
        })

    })
    return promise;
}
// 通过code获取用户非加密标识
function getCleanOpenId(app) {
    const getOpenid = require('./getOpenid');
    return new Promise((resolve, reject) => {
        getOpenid.kGetCleanOpenid(app)
            .then(openId => resolve({ openId }))
            .catch((err) => reject(err));
    });
}
function setCleanOpenId(that) {
    let extConfigData = '';
    if (that.globalWxclient == 'tempwx') {
        let onLaunch = require('./onLaunch.js');
        extConfigData = onLaunch.getExtConfig();
        let clearOpenId = wx.getStorageSync('oP_key') ? wx.getStorageSync('oP_key') : '';

        if (clearOpenId) {
            requestSaveOpenid(that,extConfigData,clearOpenId);
        }
        else {
            getCleanOpenId(that).then(function (data) {
                if (data && data.openId) {
                    wx.setStorageSync('oP_key', data.openId); //将openId缓存起来，上报给大数据
                    requestSaveOpenid(that,extConfigData,data.openId)
                }
            }).catch(function (res) {
                let stringRes = JSON.stringify(res)
                util.reportErr("#requestFail#messagePushJS setCleanOpenId fail:", res); // 获取openid失败
            })
        }
    }

}
function requestSaveOpenid(that,extConfigData,clearOpenId){
    if (isShield) {
        console.log('！模板推送已屏蔽');
        return false;
    }
    util.request({
        url: that.messagePushRequestUrl + '/sendTemplateMsg/saveOpenid',
        data: {
            appid: extConfigData ? extConfigData.appid : that.globalData.appid,
            businessType: 666666,
            openid: clearOpenId
        },
        success: function (res) {
            if (!res || res.status != 0) {
                let stringRes = JSON.stringify(res)
                util.reportErr("#requestNoData#messagePushJs saveOpenid errstatus:", res);
            }

        },
        fail: function (res) {
            let stringRes = JSON.stringify(res)
            util.reportErr("#requestFail#messagePushJs saveOpenid  fail:", res);
        }
    })
}

// 请求接口
function _requestFun(requestUrl, data) {
    util.request({
        url: requestUrl,
        method: 'POST',
        data: data,
        success: function (response) {

        },
        fail: function () {

        },
        complete: function () {

        }
    })
}
// 发起接口请求请求
function pushFormIdRequest(data) {
    if (isShield) {
        console.log('！模板推送已屏蔽');
        return false;
    }
    // console.log('dataddd====', data)
    let oP_key = wx.getStorageSync('oP_key');
    let requestUrl = getApp({ allowDefault: true }).messagePushRequestUrl + '/sendTemplateMsg/saveCacheFormId';
    let requestData = {
        // identityKey: oP_key,
        openid: oP_key,
        cacheFormJson: JSON.stringify(data)
    }
    _requestFun(requestUrl, requestData);
}

function sendMsgFrontRequest(data) {
    if (isShield) {
        console.log('！模板推送已屏蔽');
        return false;
    }
    let oP_key = wx.getStorageSync('oP_key');
    data.identityKey = oP_key;
    data.encrypt = false;
    let requestUrl = getApp({ allowDefault: true }).messagePushRequestUrl + '/sendTemplateMsg/sendMsgFront';
    let requestData = {
        frontInfoBoJson: JSON.stringify(data)
    };
    _requestFun(requestUrl, requestData);
}
// 前端发送模版消息
function sendMsgFront(data) {
    let app = getApp({ allowDefault: true });
    if (app.globalConfig && app.globalConfig.isMessagePush) {
        let extConfig = {};

        if (app.globalWxclient == 'tempwx') {
            let onLaunch = require('./onLaunch.js');
            data.appId = onLaunch.getExtConfig().appid;
            extConfig = onLaunch.getExtConfig();
        } else {
            extConfig = {
                appid: app.globalData && app.globalData.appid ? app.globalData.appid : '',
                isIndividual: true
            }
            data.appId = app.globalData && app.globalData.appid ? app.globalData.appid : '';
        }

        data.identityKey = wx.getStorageSync('oP_key');
        data.encrypt = false;
        data.pin = util.getPtKey();

        if (data.identityKey) {
            sendMsgFrontRequest(data);
        } else {
            getOpenIdKey(app.globalRequestUrl, extConfig).then(() => sendMsgFrontRequest(data), () => {
                wx.removeStorageSync('oP_key');
            });
        }
    }
}
// 消息推送
function messagePush(data) {
    // console.log('data------====', data);
    if (!data.formId || data.formId == 'the formId is a mock one') {
        console.log('message_push=======', data)
        return;
    }
    let app = getApp({ allowDefault: true });
    if (app.globalConfig && app.globalConfig.isMessagePush) {

        if (wx.getStorageSync('oP_key')) {
            pushFormIdRequest(data);
        } else {
            let extConfig = {};
            if (app.globalWxclient == 'tempwx') {
                let onLaunch = require('./onLaunch.js');
                extConfig = onLaunch.getExtConfig();
            } else {
                extConfig = {
                    appid: app.globalData && app.globalData.appid ? app.globalData.appid : '',
                    isIndividual: true
                }
            }
            getOpenIdKey(app.globalRequestUrl, extConfig).then(() => pushFormIdRequest(data), () => {
                wx.removeStorageSync('oP_key');
            });
        }
    }
}

module.exports = {
    messagePush: messagePush,
    getOpenIdKey: getOpenIdKey,
    sendMsgFront: sendMsgFront,
    getCleanOpenId: getCleanOpenId,
    setCleanOpenId: setCleanOpenId
}
