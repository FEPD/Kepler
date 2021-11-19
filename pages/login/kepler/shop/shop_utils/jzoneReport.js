/**
 * @author huzhouli <huzhouli@jd.com>
 * @description jzone流量上报，从推送卡片进入时调一次接口
 * 需求文档：''
 */

var app = getApp({ allowDefault: true })

function jzoneRecordClick() {
    const util = require('./util');
    let requestHost = 'https://wxapp.m.jd.com';

       //渠道信息
       let pubSign = wx.getStorageSync('keDc'); //渠道
       let pubAppid = wx.getStorageSync('pubAppid');//公众号appid
       let pubOpenid = wx.getStorageSync('pubOpenid');//公众号openid
       let activeid = wx.getStorageSync('activeid');//消息卡片id

    util.request({
        url: requestHost + '/transfer/invoke/recordClick',
        data: {
            pubSign: pubSign,
            pubAppid: pubAppid,
            pubOpenid: pubOpenid,
            activeid: activeid
        },
        success: function (res) {
            if (!res || res.errcode != 0) {
                let stringRes = JSON.stringify(res)
                util.reportErr("#requestNoData#invoke recordClick errcode:", res);
            }
        },
        fail: function (res) {
            let stringRes = JSON.stringify(res)
            util.reportErr("#requestFail#invoke recordClick fail:", res);
        }
    })
}

module.exports = {
    jzoneRecordClick
};
