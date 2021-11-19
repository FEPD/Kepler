/**
 * @author huzhouli <huzhouli@jd.com>
 * @description APP推送、jzone推送等
 * 需求文档：''
 */

var app = getApp({ allowDefault: true })
function setTransferOpenId(self) {
    let that = self || app;
    const util = require('./util');
    let clearOpenId = wx.getStorageSync('oP_key') ? wx.getStorageSync('oP_key') : '';
    if (clearOpenId) {
        requestReportApi(that, clearOpenId)
    }
    else {
        const getOpenid = require('./getOpenid');
        getOpenid.kGetCleanOpenid(app).then((openid) => {
            if (openid) {
                wx.setStorageSync('oP_key', openid); //将openId缓存起来，上报给大数据
                requestReportApi(that, openid)
            }
        }).catch(function (res) {
            let stringRes = JSON.stringify(res)
            util.reportErr(("#requestFail#invoke report fail"), stringRes);
        })
    }

}
function requestReportApi(that, clearOpenId) {
    const util = require('./util');
    let requestHost = 'https://wxapp.m.jd.com';
    let extConfigData = '';
    if (that.globalWxclient == 'tempwx') {
        let onLaunch = require('./onLaunch.js');
        extConfigData = onLaunch.getExtConfig();
    }
    let extAppid = extConfigData ? extConfigData.appid && extConfigData.appid : '';
    let storsgeAppid = that.globalData ? that.globalData.appid : wx.getStorageSync('appid');

    //渠道信息
    let pubSign = wx.getStorageSync('keDc'); //渠道
    let pubAppid = wx.getStorageSync('pubAppid');//公众号appid
    let pubOpenid = wx.getStorageSync('pubOpenid');//公众号openid
    let activeid = wx.getStorageSync('activeid');//消息卡片id

    // ehc数据上报,且优先级低于jzone
    let kepler_value_ehc = wx.getStorageSync('kepler_value_ehc');//消息卡片id
    if(kepler_value_ehc && !pubSign){
                //openid出现了_,导致以往的分割逻辑(_分割)出现问题，为兼容线上已有的按照_分割的传输,这里新增以^^^方式的分割。已有的_,用拼凑的方式进行处理，并见数据上报观察，通知使用方修改拼接规则
        //新方式分割
        if(kepler_value_ehc.indexOf('^^^')>-1){
            let ehcData= kepler_value_ehc.split('^^^');
            pubSign = ehcData[0] || ''
            pubAppid = ehcData[1] || ''
            pubOpenid = ehcData[2] || ''
        }else{
            //老方式分割 为兼容线上已投放链接，老解析方式不能下掉要兼容（appid暂时认为没有下划线，此兼容方式仅仅是过渡处理）
            //会增加数据监控，发现使用方，通知其修改拼凑规则
            let ehcData= kepler_value_ehc.split('_');
            pubSign = ehcData[0] || ''
            pubAppid = ehcData[1] || ''
           // pubOpenid = ehcData[2] || ''
            let arrLeftElements = ehcData.slice(2);
            if(arrLeftElements && arrLeftElements.length){
                pubOpenid = arrLeftElements.reduce(function(result,item){
                    return result+'_'+item
                });
            }else{
                pubOpenid = '';
            }
            //此方案为临时方案，认为appid里无_下划线。需要增加数据监控，统计业务方
            util.reportErr(`#behaviorUnnormal#the ehc param is split by underline _. appid=${extAppid || storsgeAppid}`);
        }
        activeid = ''
    }
    getLoginCode().then((res)=>{
        util.request({
            url: requestHost + '/transfer/invoke/report',
            data: {
                appid: extAppid || storsgeAppid,
                openid: clearOpenId,
                pubSign: pubSign,
                pubAppid: pubAppid,
                pubOpenid: pubOpenid,
                activeid: activeid,
                wxcode:res
            },
            success: function (res) {
                if (!res || res.errcode != 0) {
                    let stringRes = JSON.stringify(res)
                    util.reportErr("#requestNoData#setOpenid.js invoke report errcode:", stringRes);
                }else{
                    //ehc上报成功，移除kepler_value_ehc
                    wx.removeStorageSync('kepler_value_ehc');
                }
            },
            fail: function (res) {
                let stringRes = JSON.stringify(res)
                util.reportErr("#requestFail#setOpenid.js invoke report fail", stringRes);
            }
        })
    })
}
function getLoginCode(){
    const util = require('./util');
    return new Promise((resolve)=>{
        wx.login({
            success: function (res) {
                if (res && res.code) {
                    resolve(res.code)
                }
            },
            fail: function (res) {
                resolve('')
                let stringRes = JSON.stringify(res)
                util.reportErr("#requestFail#setOpennidJS getlogincode fail:", stringRes);
            }
        })
    })
}

module.exports = {
    setTransferOpenId
};
