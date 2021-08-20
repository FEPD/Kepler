export let config = {
  appid: 604,
  returnPage: undefined,
  pageType: undefined,
  isLogout: undefined, 
  noWXinfo: undefined,
  h5path: undefined,
  logoPath: undefined,
  isTest: undefined, //1 预发接口，改为undefined 调用线上接口
  isKepler: true,
  navigationBarColor: undefined,
  navigationBarTitle: undefined,
  tabNum: 2,
  // requestHost:'https://wxapplogin.m.jd.com',
  // logPluginName: "DDDDDDDDD", // 埋点插件的名字 例如：'log-plugin'
  selfTipsDialog:false, // 是否弹窗展示协议授权，默认为false，如果为true，author必须为false
  author: true,  
  // selfTips: [{  //无特殊需求不需要配置
    //   tip:'我是测试1',
    //   url: 'm.jd.com'
    // }, {
    //   tip:'我是测试2',
    //   url:'https://pro.m.jd.com/mall/active/2hqsQcyM5bEUVSStkN3BwrBHqVLd/index.html'
    // }]
}