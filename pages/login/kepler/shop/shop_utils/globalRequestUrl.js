// 控制所有服务端接口地址，按模块化分，方便开发测试时可更改单模块地址
let app = getApp({ allowDefault: true });
let requestUrl = app.globalRequestUrl || 'https://wxapp.m.jd.com'

let homeDir = '/khome',
  pDir = '/kitem',
  cartDir = '/kwxp',
  cartMix = '/kcart',
  tradeDir = '/ktrade'

let globalRequestUrl = {
  Base: requestUrl,
  Home: `${requestUrl}${homeDir}`,    // 个人中心模块地址
  Product: `${requestUrl}${pDir}`,    // 商详模块地址
  Trade: `${requestUrl}${tradeDir}`,  // 结算模块地址
  Cart: `${requestUrl}${cartDir}`,  // 购物车模块
  CartMix: `${requestUrl}${cartMix}`  // 购物车模块
}

module.exports = globalRequestUrl