var utils = require("../shop_utils/util");

module.exports = {
    setLogPv:function (log,callback){
        //埋点上报设置
        //埋点上报设置1
    //加密key和openid都是异步获取 ，所以setLogPv封装成一个promise 来同步数据
    utils.setLogPv({
        title: "京东店铺", //网页标题
        pname: "",
        pageId: "KeplerMiniAppShopHome",
        siteId: "WXAPP-JA2016-1", //开普勒小程序固定用：WXAPP-JA2016-1
        account: (utils.getPtKey() || !wx.getStorageSync('jdlogin_pt_key') ) ? '-' : (utils.getPtKey() || wx.getStorageSync('jdlogin_pt_key')) //传入用户登陆京东的账号
      }).then(function(data){
        log.set(data);
        typeof callback === 'function' && callback();
      })
        // let pvData = utils.setLogPv({
        //     title: "京东店铺", //网页标题
        //     pname: "",
        //     pageId: "KeplerMiniAppShopHome",
        //     siteId: "WXAPP-JA2016-1", //开普勒小程序固定用：WXAPP-JA2016-1
        //     account: (utils.getPtKey() || !wx.getStorageSync('jdlogin_pt_key') ) ? '-' : (utils.getPtKey() || wx.getStorageSync('jdlogin_pt_key')) //传入用户登陆京东的账号
        // })
        // log.set(pvData.setPvData);
    },
    setPin(log){
        //that.data.pvFlag为true 上报pv
        //获得加密的ptkey值并上报
        utils.getSecretPtKey(function(secretPtKey) {
            //埋点上报数据初始化
            log.set({
                cipherPin: secretPtKey,
                pageId: "KeplerMiniAppShopHome",
            });
        })
    }
}
