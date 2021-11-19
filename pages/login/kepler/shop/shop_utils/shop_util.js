/*
 * @Author: wuazhu
 * @Date: 2020-11-17 17:53:27
 * @LastEditTime: 2021-07-19 18:59:28
 */
var utils = require('./onLaunch.js');
function getShopConfigure () {
  let extConfig = utils.getExtConfig();
  var objC = new Object();
  objC.client = 'apple';
  objC.appClientVersion = '5.7.0';
  objC.configure = extConfig;
  return objC;
}

module.exports = {
  getShopConfigure: getShopConfigure
};