/**
 * 个性化小程序打通登录态（登录插件）
 * 文档：https://cf.jd.com/pages/viewpage.action?pageId=117544277
 */

let promise = null;
function tokentologin(options) {
    console.log('进到了kConnectLogin.JS', options)
    if (promise !== null) {
        return promise;
    }
    promise = new Promise((resolve) => {

        if (options && options.query && options.query.kConnectLogin && options.query.kConnectLogin == 1 && options.query.token) {
            console.log('进来到了打通登录态方法');
            getPluginLogin(options, resolve);

        }
        else {
            resolve(resolve);
            console.log('token为空');
        }
    })
    return promise;
}
function getPluginLogin(options, resolve) {
    const utils = require('./util.js');
    const loginUtil = require('../pages/login/util.js').default;
    const plugin = requirePlugin("loginPlugin");

    loginUtil.h5Init();
    plugin.transferTokenToLogin({
        tokenkey: options.query.token
    }).then((res = {}) => {
        console.log('transferTokenToLogin方法返回值', res);
        wx.removeStorageSync('sid');
        res.pt_key && wx.setStorageSync("jdlogin_pt_key", res.pt_key)
        res.pt_pin && wx.setStorageSync("jdlogin_pt_pin", res.pt_pin)
        res.expire_time && wx.setStorageSync("jdlogin_expire_time", res.expire_time)
        res.refresh_time && wx.setStorageSync("jdlogin_refresh_time", res.refresh_time);
        resolve(res)
    }, function (err) {
        utils.reportErr("#requestFail#kConnectLoginJS getPluginLogin fail:",err); // 登录插件token换pin不成功
        resolve(err);
    });
}

module.exports = {
    tokentologin: tokentologin
}