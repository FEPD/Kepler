// mjd/loginPluginFile/utils/loginUtils.js
let loginPlugin = requirePlugin("loginPlugin");
import { clearSitesAddress } from './sitesAddress.js'
/*
 * returnpage:从登陆页面跳回的页面
 * 返回：跳回方式
 */
function getJumpPageType(returnpage){
  let app = getApp();
  //此值传递给登录模块，决定由登录跳转到returnpage的方式是 switchTab还是navigator或者其他
  let jumpPageType;
  //获取globalData下维护tabBar的数组信息
  let tabBarPathArr = (app && app.globalData && app.globalData.tabBarPathArr) || [];
  //判断返回的页面是否是当前小程序的tabBar之一，是则跳转方式指定为 switchTab
  if(tabBarPathArr.indexOf(returnpage)!=-1){
    jumpPageType = 'switchTab';
  }
  return jumpPageType;
}



/**
 * 跳转登录
 *
 * @param {object} obj - 页面page this
 */
function globalLoginShow(obj) {
  wx.removeStorageSync('jdlogin_pt_key');
  wx.removeStorageSync('jdlogin_pt_pin');

  //决定跳入登录的方式 true:navigateTo,false:redirect。避免一级页面（如tabBar页面redirect到登录后返回将退出小程序）
  let isNavigateTo ;

  var returnPage = '';//页面data内配置returnpage填写期望登陆成功跳转的地址
  if (obj.data.returnpage){
    returnPage = obj.data.returnpage;
  }
  //此值传递给登录模块，决定由登录跳转到returnpage的方式是 switchTab还是navigator或者其他
  let pageType = getJumpPageType(returnPage);
  returnPage = encodeURIComponent(returnPage)
  //区分returnpage是Tabbar对应的页面还是其他页面。
  //tabBar页面data传’switchTab’,其他页面传’’,默认值为空。（因为tabBar页面回跳需要特殊处理，用该参数做以区分）
  // var pageType;
  // if (obj.data.fromPageType){
  //   pageType = obj.data.fromPageType;
  // }
  //区分要跳转登录页的当前页面是否是1级页面还是其他页面 fromPageLevel值为1时为一级页面（如tabBar页面）为0或者其他则非一级
  if (obj.data.fromPageLevel && obj.data.fromPageLevel==1){
    isNavigateTo = !!obj.data.fromPageLevel;
  }else{
    //默认逻辑
    isNavigateTo = (pageType&&pageType=='switchTab')?true:false;
  }
  // var wxversion = wx.getStorageSync('appid') ? wx.getStorageSync('appid') : '';
  // var appid = 604;
  // var tabNum = 2, isKepler = 1, isTest;
  setTimeout(function () {
    // loginPlugin.setStorageSync('jdlogin_params', JSON.stringify({
    //   returnPage,
    //   wxversion,
    //   appid,
    //   pageType,
    //   tabNum,
    //   isKepler,
    //   isTest
    // }))
    if (isNavigateTo) {
      wx.navigateTo({
        url: "/pages/login/index/index?returnPage=" + returnPage + "&pageType=" + pageType
      })
    } else {
      wx.redirectTo({
        url: "/pages/login/index/index?returnPage=" + returnPage + "&pageType=" + pageType
      })
    }
  }, 500)
}

/**
 * 退出登录
 *
 * @param {object} obj - 页面page this
 */
function Fgloballogout(obj, request) {
  wx.showLoading({
      title: '加载中',
  });
  let app = getApp();
  var returnPage = '';//页面data内配置returnpage填写期望登陆成功跳转的地址
  if (obj.data.returnpage){
    returnPage = obj.data.returnpage;
  } else {//如果没有则传前一页地址
    var arrpageShed = getCurrentPages(),
        strCurrentPage = arrpageShed[arrpageShed.length - 1].__route__;
    returnPage = '/'+strCurrentPage;
  }
  //区分returnpage是Tabbar对应的页面还是其他页面。
  //tabBar页面data传’switchTab’,其他页面传’’,默认值为空。（因为tabBar页面回跳需要特殊处理，用该参数做以区分）
  var pageType = getJumpPageType(returnPage);
  returnPage = encodeURIComponent(returnPage)
  // if (obj.data.fromPageType){
  //   pageType = obj.data.fromPageType;
  // }
  //决定跳入登录的方式 true:navigateTo,false:redirect。避免一级页面（如tabBar页面redirect到登录后返回将退出小程序）
  let isNavigateTo ;
  //区分要跳转登录页的当前页面是否是1级页面还是其他页面 fromPageLevel值为1时为一级页面（如tabBar页面）为0或者其他则非一级
  if (obj.data.fromPageLevel && obj.data.fromPageLevel==1){
    isNavigateTo = !!obj.data.fromPageLevel;
  }else{
    //默认逻辑
    isNavigateTo = (pageType&&pageType=='switchTab')?true:false;
  }
  loginPlugin.setStorageSync('jdlogin_params', JSON.stringify({ 'wxversion': wx.getStorageSync('appid'), 'appid': 604, returnPage: returnPage, pageType: pageType }))
  loginPlugin.logout({ callback: (res) => {
    let {isSuccess,err_code} = res;
      if(isSuccess&&!err_code){
        wx.removeStorageSync('sid');
        wx.removeStorageSync('USER_FLAG_CHECK');
        //  这两个移除暂时留着,   为了兼容h5登录,  h5登录路径修改后即可删除.
        wx.removeStorageSync('jdlogin_pt_key');
        wx.removeStorageSync('jdlogin_pt_pin');

        wx.removeStorageSync('itemCartNum');
        //产品要求退出登录的时候只清楚缓存中的详细地址，保留四级地址的id
        // @地址全站化 插件
        clearSitesAddress()
        // let sitesAddressObj = {
        //   regionIdStr: wx.getStorageSync('sitesAddress').regionIdStr,
        //   addressId: '',
        //   fullAddress: ''
        // }
        // wx.setStorageSync('sitesAddress', sitesAddressObj);
        if(app.globalConfig && app.globalConfig.isOperatorTemplate){
          wx.removeStorageSync('extuserid');
          //wx.removeStorageSync('customerinfo'); //史辰出了最新的清除方案，在全局onshow统一清除
          wx.removeStorageSync('unpl');
          wx.setStorageSync('isUserRelBinded', false);
        }
        // var wxversion = wx.getStorageSync('appid') ? wx.getStorageSync('appid') : '';
        // var appid = 604;
        // var tabNum = 2, isKepler = 1, isLogout = '1', isTest;
        setTimeout(function () {
          wx.hideLoading();
          // 支持在page页面定义跳转登录页的方式
          if (obj && obj.data && obj.data.hasOwnProperty('isLoginNavigateTo')) {
            isNavigateTo = obj.data.isLoginNavigateTo
          }
          if (isNavigateTo) {
            wx.navigateTo({
              url: "/pages/login/index/index?returnPage=" + returnPage + "&pageType=" + pageType + "&isLogout=1"
            })
          } else {
            wx.redirectTo({
              url:  "/pages/login/index/index?returnPage=" + returnPage + "&pageType=" + pageType + "&isLogout=1"
            })
          }
        }, 500)
      }
  }});
}
function getPtKey () {
  return loginPlugin.getStorageSync('jdlogin_pt_key') || wx.getStorageSync('jdlogin_pt_key') || '' ;
}
function getPtPin () {
  return loginPlugin.getStorageSync('jdlogin_pt_pin') || wx.getStorageSync('jdlogin_pt_pin') || '' ;
}
module.exports = {
  getPtKey,
  Fgloballogout,
  globalLoginShow,
  getJumpPageType,
  getPtPin
}
