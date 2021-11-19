/**
 * @author huzhouli <huzhouli@jd.com>
 * 初始化时将所需字段存进storage
 * @param {Object} options app.js里onshow里的options
 */
function setGlobalStorageAll(options) {
    //options.query
    //这是jzone1期需求数据结构-- eDc=jzoneMsg&gzh_appid=xxx&gzh_openid=xxx&active_id=xxx
    //jzone二期需求 数据结构-- eDc=jzone{mpAppid}_{mpOpenid}_{MpScene}_{activityId}
    console.log('setGlobalStorageAll',options)
    //如果是jzone渠道
    wx.removeStorageSync('kepler_value');
    wx.removeStorageSync('keDc');
    //群信息
    wx.removeStorageSync('groupData');
    // 门店通分享者openid
    wx.removeStorageSync('mdtSharerOpenId')
    //处理渠道信息
    if(options && options.query){
        let opQuery = options.query;
        let keDc = opQuery.eDc||'' ; //全频道渠道字段
        // options.query.eDc && wx.setStorageSync('keDc',options.query.eDc);
        // options.query.gzh_appid && wx.setStorageSync('pubAppid',options.query.gzh_appid);
        // options.query.gzh_openid && wx.setStorageSync('pubOpenid',options.query.gzh_openid);
        // options.query.active_id && wx.setStorageSync('activeid',options.query.active_id);

        if(keDc){
            let jzoneData= keDc.split('_');
            switch(jzoneData[0]){
                case 'jzone':
                jzoneData[0]== 'jzone' && wx.setStorageSync('keDc','jzoneMsg');
                jzoneData[1] && wx.setStorageSync('pubAppid',jzoneData[1]);
                jzoneData[2] && wx.setStorageSync('pubOpenid',jzoneData[2]);
                jzoneData[4] && wx.setStorageSync('activeid',jzoneData[4]);
                wx.setStorageSync('kepler_value',`kepler_${keDc}`);
                break;
                default :
                wx.setStorageSync('kepler_value','nc_code');
            }
        }
        else if(opQuery.outLinkId){
            //openscene
            let webLinkData = `kepler_weblink_${opQuery.outLinkId}_${opQuery.channel||'none'}`
            wx.setStorageSync('kepler_value',webLinkData);
        }
        else if(opQuery.weChatOa){
            //openscene
            let webLinkData = `kepler_wechatoa_${opQuery.weChatOa||'none'}`
            wx.setStorageSync('kepler_value',webLinkData);
        }
        else{
            wx.setStorageSync('kepler_value','nc_code');
        }

        // eHc 保留jzone渠道eDc字段之前逻辑，eHc做通用上报appid、openid
        // eHc = mpSign_mpAppId_mpOpenId ,mpSign为来源唯一标识
        let keHc = opQuery.eHc||'' ; //来源字段
        if(keHc){
            wx.setStorageSync('kepler_value_ehc',`${keHc}`);
        }
    }
    if(options && options.encryptedData){//获取用户群信息
        let groupData = {};
        groupData.encryptedData = options.encryptedData;
        groupData.iv = options.iv && options.iv;
        wx.setStorageSync('groupData',groupData);
    }
}

module.exports = {
    setGlobalStorageAll
};
