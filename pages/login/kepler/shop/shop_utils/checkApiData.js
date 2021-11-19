/*
 * @Date: 2020-12-08 14:30:53
 * @FilePath: /mpFactory/mjd/public/utils/checkApiData.js
 * @Autor: wangjiguang
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-29 16:02:30
 * @Description:
 */
function collectApi (obj) {
  if (!obj) {return}
  let _key = obj.url.split('?')[0]
  let checkApiObj = wx.getStorageSync('checkApiObj') || {}
  checkApiObj[_key] = obj
  // console.log('checkApiObj---------', checkApiObj)
  wx.setStorage({
    key: 'checkApiObj',
    data: checkApiObj,
    success: function () {
      // console.log(wx.getStorageInfoSync())
    },
    fail: function () {

      wx.removeStorageSync('checkApiObj')
    }
  })
}

module.exports = {
  collectApi
}