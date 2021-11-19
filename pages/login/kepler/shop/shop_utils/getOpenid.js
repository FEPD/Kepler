const Promise = require('./lib/promise');
const util = require('./util');
/**
 * @author huzhouli <huzhouli@jd.com>
 * 获取openid
 */
const OPENID_KEY = 'oP_key';
let promise = null;

/**
 * 获取未加密的openid
 * @param {Object} app
 * @returns {Promise<String>} openid Promise
 */
function kGetCleanOpenid(appdata) {
    let app = appdata || {};
    //app.globalRequestUrl = app.globalRequestUrl||'https://wxappbeta.m.jd.com'
    let requestUrl = 'https://wxapp.m.jd.com'
    if (promise !== null) {
        return promise;
    }
    promise = new Promise((resolve, reject) => {
        const openid = wx.getStorageSync(OPENID_KEY);
        let extConfigData = '';
        if (openid) {
            resolve(openid);
            return;
        }
        if (app.globalWxclient && app.globalWxclient == 'tempwx') {
            const onLaunch = require('./onLaunch.js');
            extConfigData = onLaunch.getExtConfig();    
        }
        else {
            extConfigData = {
            appid: app.globalData && app.globalData.mpAppid ? app.globalData.mpAppid : '',
            isIndividual: true
            }
        }
        wx.login({
            success: function (res) {
                let code = res.code;
                
                util.request({
                    url: requestUrl + '/transfer/invoke/getOpenid',
                    method: 'POST',
                    data: {
                        wxcode: code || '',
                        wxAppId: extConfigData.appid || '',
                        clientType: extConfigData.isIndividual ? 'gxhwx' : 'tempwx'
                    },
                    success: function (response) {
                        console.log(response);
                        if (!response || !response.openid) {
                            let stringRes = JSON.stringify(response);
                            util.reportErr("#requestNoData#getOpenidJS no openid:",response);
                            reject();
                            return;
                        }
                        // console.log(setPvDataObj, '获取openId成功 获取openId成功')
                        wx.setStorageSync(OPENID_KEY, response.openid);
                        resolve(response.openid);
                    },
                    fail: function (res) {
                        let stringRes = JSON.stringify(res)
                        util.reportErr("#requestFail#getOpenidJS getOpenid fail:",res);
                        reject();
                    }
                })
            },
            fail: function (re) {
                let stringRe = JSON.stringify(re)
                util.reportErr("#requestFail#getOpenid wxlogin fail:",stringRe); // 获取用户code不成功走到了fail
                reject();
            }
        })
    });
    return promise;
}

module.exports = {
    kGetCleanOpenid
};