var myPluginInterface = requirePlugin('myPlugin');
const app = getApp()
// 判断当前小程序版本是否支持基础库最低版本
function checkVersion () {
  const sdkRegister = myPluginInterface.getSdkIsRegister()
  if (!sdkRegister) {
		const appShowOptions = wx.getStorageSync('appShowOptions')
		myPluginInterface.appLaunch(app)
		myPluginInterface.appShow(appShowOptions, app)
	}
	let version = myPluginInterface.checkVersion();
	if (version == -1) {
	  // 当前小程序基础库版本较低，提示用户升级
	  wx.navigateTo({
	    url: 'plugin-private://wx1edf489cb248852c/pages/updateTip/updateTip'
	  });
	}
}

module.exports = {
	checkVersion
}