export let config = {
  wxversion: 'wx1edf489cb248852c',
  appid: 604,
  returnPage: undefined,
  pageType: undefined,
  isLogout: undefined,
  noWXinfo: undefined,
  h5path: undefined,
  logoPath: undefined,
  isTest: undefined,  //1 预发接口，改为undefined 调用线上接口
  isKepler: true,
  navigationBarColor: undefined,
  navigationBarTitle: undefined,
  author:true, //增加协议勾选框 默认为不展示
  tabNum: 2,
  requestHost:'https://wxapplogin.m.jd.com',
  selfTips: [{
    tip: '《京东用户注册协议》',
    url: 'https://wxapplogin.m.jd.com/static/registration.html'
  }, {
    tip: '《京东隐私政策》',
    url: 'https://wxapplogin.m.jd.com/static/private.html'
  }]
}
