/**
 * 模板需要的公共方法
 */
import { request, reportErr } from './util.js';

/**
 * 获取第三方平台自定义的数据字段
 *
 * @returns 自定义的数据字段
 */
function getExtConfig() {
    //获取店铺信息、活动ID、appid等自定义字段
    if (wx.getExtConfigSync) {
        let extConfig = wx.getExtConfigSync();
        console.log('extConfig===',extConfig)
        //应该是shopID，但是配置里传的是shopId，所以需要兼容处理一下，虽然这样写很蛋疼，逃~
        if (extConfig.shopId) {
            extConfig['shopID'] = extConfig['shopId'];
            delete extConfig['shopId'];
        }
        return extConfig;
    } else {
        // 如果不支持wx.getExtConfigSync提示用户升级微信客户端
        wx.redirectTo({
            url: 'pages/upgrade/upgrade'
        })
    }
}

/**
 * 将自定义数据写入缓存
 *
 * @param {object} initQuery - 当前打开路径后的参数
 * @param {object} extConfig - 第三方平台自定义的数据字段
 * @param {object} that - app.js中的this
 */
function setStorageAll(initQuery, extConfig ,that) {
    console.log("source与kxcxtype")
    console.log("source="+extConfig.source+",kxcxtype="+extConfig.kxcxtype)
    
    if (extConfig && extConfig.source) {
      that.globalData.source = extConfig.source
    }
    if (extConfig && extConfig.kxcxtype) {
      that.globalData.kxcxtype = extConfig.kxcxtype
    }
    var globalWxappStorageName = that.globalData.wxappStorageName;
    if (extConfig && extConfig.shopID) {
        wx.setStorageSync('shopId', extConfig.shopID);
    }
    // 如果有venderId,用venderId,只有好物街使用appid
    if (extConfig && (extConfig.venderid || extConfig.venderId) ) {
        let venderId = extConfig.venderid || extConfig.venderId;
        wx.setStorageSync('venderId', venderId);
    }
    if (extConfig && extConfig.activityUrl) {
        //jshop首页嵌入h5的URL
        let activity = extConfig.activityUrl.indexOf('?');
        let urlData = `wxAppName=Kepler&siteId=WXAPP-JA2016-1&wxAppId=${extConfig.appid}`;
        let newActivityUrl = '';
        if(activity>=0){
            let activitySplit = extConfig.activityUrl.split('?');
            let activityUrl = activitySplit[0];
             // wxAppName & siteId出现这2个字段 先删除
            let activityUrlParam = activitySplit[1].replace(/&?(wxAppName|siteId)=[^&]*&?/g,'');
            newActivityUrl = activityUrlParam.length>0 ? `${activityUrl}?${activityUrlParam}&${urlData}` : `${activityUrl}?${urlData}`
        }
        else{
            newActivityUrl = `${extConfig.activityUrl}?${urlData}`;
        }
        wx.setStorageSync('activityUrl', newActivityUrl);
    } else {
        wx.removeStorageSync('activityUrl');
    }
    //活动id
    if (extConfig && extConfig.activityId) {
        wx.setStorageSync('activityId', extConfig.activityId);
    }
    //wxVersion跟单使用
    if (extConfig && extConfig.wxVersion) {
        let dataObj = wx.getStorageSync(globalWxappStorageName) || {};
        dataObj.wxversion = extConfig.wxVersion;
        wx.setStorageSync(globalWxappStorageName, dataObj);
    }
    //页面传参的unionId优先级更高
    // if (initQuery.unionId){
    //     let dataObj = wx.getStorageSync(globalWxappStorageName) || {};
    //     dataObj.unionid = initQuery.unionId;
    //     wx.setStorageSync(globalWxappStorageName, dataObj);
    // }else if(extConfig && extConfig.unionid){
    //     let dataObj = wx.getStorageSync(globalWxappStorageName) || {};
    //     dataObj.unionid = extConfig.unionid;
    //     wx.setStorageSync(globalWxappStorageName, dataObj);
    // }
    // 生成平台输入优先级更高
    if (extConfig && extConfig.unionid) {
        let dataObj = wx.getStorageSync(globalWxappStorageName) || {};
        dataObj.unionid = extConfig.unionid;
        wx.setStorageSync(globalWxappStorageName, dataObj);
    } else if (initQuery.unionId) {
        let dataObj = wx.getStorageSync(globalWxappStorageName) || {};
        dataObj.unionid = initQuery.unionId;
        wx.setStorageSync(globalWxappStorageName, dataObj);
    }

    if (extConfig && extConfig.appid) {
        wx.setStorageSync('appid', extConfig.appid);
    }
    //渠道id
    if (extConfig && extConfig.mpChannelId) {
        wx.setStorageSync('mpChannelId', extConfig.mpChannelId);
    }
  //企业导购字段
    if (extConfig && extConfig.ifShow) {
        wx.setStorageSync('ifShow',  extConfig.ifShow);
    }
    //customerinfo为渠道来源
    if (initQuery && initQuery.customerinfo) {
        const oldCus =  wx.getStorageSync('customerinfo')||'';
        if(initQuery.customerinfo!=oldCus){
            wx.setStorageSync('customerinfo', initQuery.customerinfo);
            //通过cus_tm控制customerinfo的时效性，在全局onshow统一清除
            const cusTime = Date.now();
            wx.setStorageSync('cus_tm', cusTime)
        }
    }
}

/**
 * 获取导购员id
 *
 * @param {object} initQuery - 当前打开路径后的参数
 * @param {object} extConfig - 第三方平台自定义的数据字段
 * @param {object} that - app.js的this
 */
function getSellerInfo(initQuery, extConfig, that) {
    let shopId = extConfig && extConfig.shopID;
    let pin = initQuery.pin;
    request({
        url: `${that.globalRequestUrl}/kwxitem/wxappshare/getSellerInfo.json?pin=${pin}&shopid=${shopId}`,
        success: (res) => {
        if (res.value && res.value.sellerid){
        //将导购员id存入缓存
        wx.setStorageSync('extuserid', res.value.sellerid);
    }
},
    fail: (e) => {
        reportErr("#requestFail#getSellerInfo.json fail: " + e.errMsg);
    }
})
}

module.exports = {
    getExtConfig: getExtConfig,
    setStorageAll: setStorageAll,
    getSellerInfo: getSellerInfo
}
