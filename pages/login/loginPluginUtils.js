let loginPlugin = requirePlugin("loginPlugin");
import { config } from './loginConfig.js'
function goBack() {
  let params = loginPlugin.getLoginParams(),
    { returnPage, pageType} = params;
  if(!returnPage){
    console.log('没有returnPage,无法跳转')
    return
  }
  if (pageType !== 'h5') {
    returnPage = decodeURIComponent(returnPage);
  }
  switch (pageType) {
    case 'switchTab':
      wx.switchTab({
        url: returnPage
      })
      break
    case 'h5':
      redirectToH5({page: returnPage})
      break
    case 'reLaunch':
      wx.reLaunch({ url: returnPage})
      break
    default:
      redirectPage(returnPage)
  }
}

function redirectPage(url) {
  wx.redirectTo({
    url
  });
}

function redirectToH5({ page, wvroute}) {
  let url = loginPlugin.formH5Url({ page: decodeURIComponent(page), wvroute})
  redirectPage(url)
}


function handleComponentRedirect(params={}){
  let { url, isNavigateTo } = params;
  if (url) {
    if (!isNavigateTo){
      redirectPage(url);
      return
    }
    wx.navigateTo({url})
  } else {
    goBack();
  }
}

function setLoginParamsStorage(obj){
  let params = loginPlugin.getLoginParams()||{};
  let loginParams = config;
  if (loginPlugin.isObject(obj)) {
    loginParams = { ...params, ...config, ...obj }
  } else {
    console.log('登录参数必须为对象')
  }
  loginPlugin.setLoginStorageSync(loginParams);
}
module.exports = {
  setLoginParamsStorage,
  handleComponentRedirect,
  redirectToH5,
  redirectPage,
  goBack
}
