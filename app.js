//app.js
var myPluginInterface = requirePlugin('myPlugin');
App({
  onLaunch: function(options) {
    
  },
  onShow: function(options) {
    myPluginInterface.appShow(options, this);
  },
  globalData: {
    unionId: "4298", //联盟ID（选填）
    appkey: "wxgdtest", //小程序跟单标识（必填）
    customerinfo: "customerinfo_test", //渠道来源（选填）
    sendpay: "4", //sendpay91位打2-导购小程序，4-事业部小程序。101位打1，且103位打3。（必填）
    mpAppid: "wx1edf489cb248852c", //小程序appid（必填）
    pluginAppid: "wx1edf489cb248852c", //插件appid（必填）
    tabBarPathArr: ['/pages/index/index', '/pages/cart/cart'],//tabBar页面路径，有tabBar页面则传相应路径，没有传空数组即可（登录跳转需要）
  },
  globalRequestUrl: 'https://wxapp.m.jd.com', //插件request域名（必填）
})