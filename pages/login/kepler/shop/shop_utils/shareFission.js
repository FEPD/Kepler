/**
 * @author huzhouli <huzhouli@jd.com>
 * @description 主要承接内部推广系统所需上报字段
 */
const Promise = require('./lib/promise');
import { request, reportErr } from './util';

/**
 * 编码查询字符串
 * @param {Object} params 待编码对象 {key: value}
 * @returns {String} URL安全的查询字符串 key=value&key2=value2
 */
function stringifyQuery() {
    //持续decodeURIComponent直到decode完
    const fissionLevel = wx.getStorageSync('fissionLevel') || wx.getStorageSync('oP_key') || 'u_' + kRandomNumber();
    const kUuidfrom = wx.getStorageSync('oP_key') || 'u_' + kRandomNumber();
    let customerinfo = wx.getStorageSync('customerinfo') || '';
    let shareParam = wx.getStorageSync('mdtSelfShareParam') || ''
    // 用户的pin和openId拼接而成的短链，只在x项目中使用
    let _shortUnionId = wx.getStorageSync('shortUnionId')
    const jsonParams = {
        fissionLevel: fissionLevel,
        kUuidfrom: kUuidfrom
    };
    if(customerinfo){
        jsonParams.customerinfo = customerinfo
    }
    if (_shortUnionId) {
        jsonParams.shortUnionId = _shortUnionId
    }
    if (shareParam) {
        jsonParams.shareParam = shareParam
    }
    const parts = Object.keys(jsonParams).map(key => {
        return `${key}=${encodeURIComponent(jsonParams[key])}`;
    });
    if (parts.length === 0) {
        return null;
    }
    return parts.join('&');
}
/**
 * @returns {String} 随机字符串
 */
function kRandomNumber() {
    const nowDate = Date.now();
    const fissionLevel = nowDate.toString() + parseInt(Math.random() * 2147483647, 10);
    return fissionLevel;
}

/**
 * getOpenid 获取openid
 * @param {Object}  用户唯一标识
 * 取不到时将 u_随机数 存到stotage里
 */
function getOpenidPromise() {
    return new Promise(function (resolve) {
        const openid = wx.getStorageSync('oP_key') || wx.getStorageSync('shareFissionUuid') || '';
        if (openid) {
            resolve(openid);
            return;
        }
        const getOpenid = require('./getOpenid');
        getOpenid.kGetCleanOpenid().then(openid => {
            resolve(openid)
        }).catch(() => {
            const empryOpenid = 'u_' + kRandomNumber();
            wx.setStorageSync('shareFissionUuid', empryOpenid);
            resolve(empryOpenid);
        });
    });
}

/**
 * kReportShareData 点击分享调用
 * @param {Object} data 分享参数
 * retrun {string} pagePath 分享参数
 */
function kReportShareData(data) {
    let k = data || {};
    k.fissionLevel = wx.getStorageSync('fissionLevel') || wx.getStorageSync('oP_key') || 'u_' + kRandomNumber();
    setShareData(k);
    return stringifyQuery(k);
};

/**
 * kReportShareCardData 点击分享卡片上报---有分享者uuid时才上报
 * @param {Object} options 页面参数
 */
function kReportShareCardData(options) {
    const pageData = options || {};
    const k = {
        cate: 0 //点击卡片标识
    };

    if (!pageData.query) {
        return;
    }

    pageData.query.fissionLevel && wx.setStorageSync('fissionLevel', pageData.query.fissionLevel);//产品方提出的分享裂变字段
    const oldCus = wx.getStorageSync('customerinfo');
    if(pageData.query.customerinfo && pageData.query.customerinfo!= oldCus){
        wx.setStorageSync('customerinfo', pageData.query.customerinfo);
        //通过cus_tm控制customerinfo的时效性，在全局onshow统一清除
        const cusTime = Date.now();
        wx.setStorageSync('cus_tm', cusTime)
    }


    if (pageData.query.kUuidfrom) {
        k.cate = 1;
        k.kUuidfrom = pageData.query.kUuidfrom;
        k.fissionLevel = pageData.query.fissionLevel || '';

        if (!pageData.shareTicket) {//获取用户群信息
            setShareData(k);
            return;
        }
        //群信息S
        getGroupData(k, pageData.shareTicket).then(function (data) {
            setShareData(data);
        })

    }//群信息E

}
/**
 * getGroupData 获取群信息
 * @param {Object}  k 、shareTicket k上报参数 shareTicket群标识
 * 改成异步 promise
 */
function getGroupData(k, shareTicket) {
    return new Promise(function (resolve) {
        wx.getShareInfo({
            shareTicket: shareTicket,
            success: function (res) {
                k.encryptedData = res.encryptedData;
                k.iv = res.iv;
                //获取用户code
                wx.login({
                    success: function (res) {
                        k.jsCode = res.code;
                        resolve(k);
                    },
                    fail: function (res) {
                        resolve(k);
                        reportErr(("#requestFail#shareFissionJS wxlogin fail:"), JSON.stringify(res));
                    }
                })
            },
            fail: function (res) {
                resolve(k);
                reportErr(("#requestFail#shareFissionJS getShareInfo fail:"), JSON.stringify(res));
            }
        })
    })
}
/**
 * setShareData 初次点击分享卡片、分享时需要上报
 * @param {Object} data 需要上报的数据
 */
function setShareData(data) {
    const k = data || {};
    getOpenidPromise().then(function (openid) {
        k.kUuid = openid || 'uError';
        const dataString = encodeURIComponent(JSON.stringify(k));
        request({
            url: 'https://wxapp.m.jd.com/ae/getSharelog?k=' + dataString,
            success: (res) => {
                if (res.code != 0) {
                    reportErr(("#requestNoData#getSharelog no code:"), JSON.stringify(res));
                }
            },
            fail: (err) => {
                reportErr(("#requestFail#getSharelog code fail:"), JSON.stringify(err));
            }
        });
    })
};

module.exports = {
    kReportShareCardData,
    kReportShareData,
};
