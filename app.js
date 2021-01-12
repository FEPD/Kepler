//app.js
//var myPluginInterface = requirePlugin('myPlugin');
App({
  onLaunch: function(options) {
    //myPluginInterface.initStyle({})
  },
  onShow: function(options) {
    //myPluginInterface.appShow(options, this);
  },
  globalData: {
    unionId: "1000072052", //联盟ID（选填）
    appkey: "wxgdtest", //小程序跟单标识（必填）
    customerinfo: "customerinfo_test", //渠道来源（选填）
    sendpay: "3", //导购小程序sendpay传1，事业部小程序sendpay传3。（必填）
    mpAppid: "wx1edf489cb248852c", //小程序appid（必填）
    pluginAppid: "wx1edf489cb248852c", //插件appid（必填）
    tabBarPathArr: ['../index/index','../cart/cart','../order/order'],//tabBar页面路径，有tabBar页面则传相应路径，没有传空数组即可（登录跳转需要）

    // 预发环境
    // apolloId: '89f5bc2d5c9b4c68b3c03aaad4d0af4f',
    // apolloSecret: '94cac8db22814664a4e5ae8cabfe7566',
    noshowRedpacket: 0,//0表示展示红包楼层，1表示关闭
    // 正式环境
    apolloId: 'd1543fc0e8274901be01a9d9fcfbf76e',  //阿波罗Id，标准版使用此默认值，扩展版使用申请好的阿波罗appid
    apolloSecret: '162f0903a33a445db6af0461c63c6a3b',  //阿波罗Secret, 标准版使用此默认值，扩展版使用申请好的阿波罗appSecret
    heildCart: 2, //是否隐藏购物车以及加购按钮 1为隐藏
    noshowRedpacket: 0,//超新星等屏蔽红包楼层的小程序使用，传1不显示红包楼层,传0显示
  },
  globalRequestUrl: 'https://wxapp.m.jd.com', //插件request域名（必填）
  tabBar: {
    "color": "#2E2D2D",
    "selectedColor": "#E2231A",
    "backgroundColor": "#ffffff",
    "borderStyle": "black",
    "selectIndex":0,
    "list": [
      {
        "pagePath": "pages/login/kepler/index/index",
        "text": "首页",
        "iconPath": "https://newbuz.360buyimg.com/jdk/homeOff.png",
        "selectedIconPath": "https://newbuz.360buyimg.com/jdk/homeOn.png"
      },
      {
        "pagePath": "pages/login/kepler/cart/cart",
        "text": "购物车",
        "iconPath": "https://newbuz.360buyimg.com/jdk/cartOff.png",
        "selectedIconPath": "https://newbuz.360buyimg.com/jdk/cartOn.png"
      },
      {
        "pagePath": "pages/login/kepler/order/order",
        "text": "我的订单",
        "iconPath": "https://newbuz.360buyimg.com/jdk/personalOff.png",
        "selectedIconPath": "https://newbuz.360buyimg.com/jdk/personalOn.png"
      }
    ],
    "position": "bottom"
  }
})

