/*
 * @Author: baoruirui
 * @Date: 2020-04-10 13:00:24
 * @Last Modified by: baoruirui
 * @Last Modified time: 2020-04-10 14:37:25
 * 统一管理阿波罗配置
 */


/**
 * 获取阿波罗配置信息：APOLLO_ID、APOLLO_SECRET
 * 黄金流程可能存在以下场景：
 *      商详连预发域名+线上阿波罗 & 结算连预发域名+预发阿波罗
 *      满足上述场景：通过增加environment=1参数，
 * 满足的所有场景：
 *  线上域名+线上阿波罗，调用如下：getApolloConfig()
 *  预发域名+预发阿波罗，调用如下：getApolloConfig()
 *  预发域名+线上阿波罗，调用如下：getApolloConfig({environment: 1})
 *
 * 只要是线上域名，无论environment值为多少，都会返回线上阿波罗配置。保证线上服务连接的是线上阿波罗配置。
 *
 * @param {environment} param0 environment=1: 预发域名返回线上阿波罗
 */
function getApolloConfig ({ environment = 0} = {}) {
  let app = getApp({ allowDefault: true });
  let globalRequestUrl = app && app.globalRequestUrl;
  console.log('environment==============', environment)
  // 默认：线上阿波罗配置
  let config = {
    APOLLO_ID: (app && app.globalConfig && app.globalConfig.apolloId) ||  'd1543fc0e8274901be01a9d9fcfbf76e',
    APOLLO_SECRET: (app && app.globalConfig && app.globalConfig.apolloSecret) || '162f0903a33a445db6af0461c63c6a3b'
  };
    // 只有当 (beta域名 && environment=0) 时，会返回预发阿波罗配置
  if (globalRequestUrl && globalRequestUrl.indexOf('beta') !== -1 && !environment) {
    config.APOLLO_ID = '89f5bc2d5c9b4c68b3c03aaad4d0af4f'
    config.APOLLO_SECRET = '94cac8db22814664a4e5ae8cabfe7566'
  }
  return config
}

/**
 * cookie增加阿波罗配置信息
 * cookie拼接格式：apolloId=${APOLLO_ID};apolloSecret=${APOLLO_SECRET};
 *
 * 预发域名+预发阿波罗，调用如下：getCookiesApolloConfig()
 * 线上域名+线上阿波罗，调用如下：getCookiesApolloConfig()
 * 预发域名+线上阿波罗，调用如下：getCookiesApolloConfig({environment: 1})
 *
 * @param {*} param0
 */
function getCookiesApolloConfig ({ environment = 0} = {}) {
  let config = getApolloConfig({environment});
  return `apolloId=${config.APOLLO_ID};apolloSecret=${config.APOLLO_SECRET};`
}

module.exports = {
  getApolloConfig,
  getCookiesApolloConfig
}