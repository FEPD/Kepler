/**
* 检测URL是否合法
* @param {String} url URL链接
* @param {Array} keys 需要检测的字段名数组
* @return {Boolean}
* 1. 如果链接不是http且不是//开头，返回false
* 2. 如果链接不包含任何参数，返回false
* 3. 如果链接仅包含一个wxAppName参数，返回false
* 4. 如果传入的链接包含所有字段且字段值不为空，返回true，否则返回false
 */
function checkH5UrlParams(url, keys) {
    keys = keys || [];
    if (!url || (url.indexOf('http') !== 0 && url.indexOf('//') !== 0)) {
        return false
    }
    if (url.indexOf('?') === -1) {
        return false;
    }
    const querystring = url.substring(url.indexOf('?') + 1)
    const pairs = querystring.split('&');
    const params = {};
    for (const pair of pairs) {
        let [name, value] = pair.split('=');
        name = decodeURIComponent(name);
        value = decodeURIComponent(value);
        params[name] = value;
    }
    const paramsArr = Object.keys(params); // 开始校验
    // url无任何参数
    if (paramsArr.length === 0) {
        return false;
    }
    // 只有wxAppName1个参数
    if (paramsArr.length === 1 && params.wxAppName !== undefined) {
        return false;
    }
    // 检测传入的keys数组
    for (const key of keys) {
        if (!params[key]) {
            return false;
        }
    }
    return true;
}
/**
 * 
 * 仅供验证使用，不参与业务
 */
function checkH5UrlParamsRedirectOnFailure(url, keys, errorPage) {
    errorPage = errorPage || '/pages/webViewError/webViewError';

    const checkH5UrlParamsFlag = checkH5UrlParams(url, keys);

    if (!checkH5UrlParamsFlag) {
        wx.redirectTo({
            url: errorPage
        });
    }

}
module.exports = {
    checkH5UrlParams,
    checkH5UrlParamsRedirectOnFailure
};