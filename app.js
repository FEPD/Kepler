/*
 * @Author: wuazhu
 * @Date: 2021-07-13 10:35:06
 * @LastEditTime: 2022-09-09 13:56:14
 */
//app.js
var myPluginInterface = requirePlugin('myPlugin');
App({
  onLaunch: function(options) {
    myPluginInterface.initStyle({})
    myPluginInterface.appLaunch(this)
  },
  onShow: function(options) {
    myPluginInterface.appShow(options, this);

    // 交易插件支持宿主小程序数据跟单--storage存入场景值，在交易插件提单时上报埋点
    //wx.setStorageSync('orderChain-scene', options.scene);

  },
  
  globalData: {
    unionId: "1000072052", //联盟ID（选填）
    appkey: "wxgdtest", //小程序跟单标识（必填）
    customerinfo: "customerinfo_test", //渠道来源（选填）
    sendpay: "3", //导购小程序sendpay传1，事业部小程序sendpay传3。（必填）
    mpAppid: "wx1edf489cb248852c", //小程序appid（必填）
    pluginAppid: "wx1edf489cb248852c", //插件appid（必填）
    tabBarPathArr: ['../index/index','../cart/cart','../order/order'],//tabBar页面路径，有tabBar页面则传相应相对路径，没有传空数组即可（登录跳转需要）

    // EZR 小程序使用
    businessType: '', // EZR写 '3;'注意是字符串3和分号;
    // 预发环境
    // apolloId: '89f5bc2d5c9b4c68b3c03aaad4d0af4f',
    // apolloSecret: '94cac8db22814664a4e5ae8cabfe7566',
    noshowRedpacket: 0,//0表示展示红包楼层，1表示关闭
    // 正式环境
    apolloId: 'd1543fc0e8274901be01a9d9fcfbf76e',  //阿波罗Id，标准版使用此默认值，扩展版使用申请好的阿波罗appid
    apolloSecret: '162f0903a33a445db6af0461c63c6a3b',  //阿波罗Secret, 标准版使用此默认值，扩展版使用申请好的阿波罗appSecret
    heildCart: 2, //是否隐藏购物车以及加购按钮 1为隐藏
    noshowCustomerService: '0', //是否展示客服入口 不为1则展示
    logPluginName: "", // 引入的埋点插件名称(app.json内plugins引入的埋点插件)，默认值为''。引入埋点插件，可以使宿主小程序、交易插件统一标识(uuid)
    isPrivate: '', // 1-需要进行私域化。若要进行店铺过滤，isPrivate和shopIds字段必须都有值才能生效。
    shopIds: '', // 本期支持单个店铺过滤；保留当前传入shopid的商品，且屏蔽此外的其他店铺商品（若配置isPrivate=1但不配置shopIds 视为不进行私域化）
    livestreamBusinessId: '',  //直播专享价渠道ID（选填）
    errorPage: '/pages/index/index', // 必传，错误兜底页路径，格式：/pages/**/**；使用场景：联盟逻辑时跳转的错误兜底页
    UEDTheme: '' //UED主题样式
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
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "https://newbuz.360buyimg.com/jdk/homeOff.png",
        "selectedIconPath": "https://newbuz.360buyimg.com/jdk/homeOn.png"
      },
      {
        "pagePath": "pages/cart/cart",
        "text": "购物车",
        "iconPath": "https://newbuz.360buyimg.com/jdk/cartOff.png",
        "selectedIconPath": "https://newbuz.360buyimg.com/jdk/cartOn.png"
      },
      {
        "pagePath": "pages/order/order",
        "text": "我的订单",
        "iconPath": "https://newbuz.360buyimg.com/jdk/personalOff.png",
        "selectedIconPath": "https://newbuz.360buyimg.com/jdk/personalOn.png"
      }
    ],
    "position": "bottom"
  }
})

