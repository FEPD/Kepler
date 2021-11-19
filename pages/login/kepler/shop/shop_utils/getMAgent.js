var CryptoJS = require('./lib/crypto-js.js');
var Mmd5 = require('./Mmd5.js')
 /**
 * getPublicAgent 获取m-agent头部信息的方法
 *
 * @param address - 方法名
 * @param params - 接口参数
 * @returns string
 */
function getPublicAgent(address,params,paramString) {
    if(!address){
      throw new Error('getPublicAgent方法address参数缺失')
      return;
    }
    let tokenVersion='0'//旧版本用0表示，新版本用1表示
    let app = getApp({ allowDefault: true });
    let channel ='kepler.jd.com';//渠道，固定
    let packageName ='com.jd.kepler';//包名，固定
    let clientType = 'wxapp';//client类型
    let sysPlatform =app&&app.globalData&&app.globalData.systemInfo&&app.globalData.systemInfo.platform||'android_huawei';//系统平台，默认安卓-华为
    if(sysPlatform.indexOf('/')>-1){sysPlatform.replace('/','-')}//处理系统平台有/的情况
    let sysVersion=app&&app.globalData&&app.globalData.systemInfo&&app.globalData.systemInfo.system||'0';//系统版本，默认0
    let screenRatio='0x0'// 分辨率，默认0x0
    if(app&&app.globalData&&app.globalData.systemInfo&&app.globalData.systemInfo.system){
      screenRatio=`${app.globalData.systemInfo.screenWidth}x${app.globalData.systemInfo.screenHeight}`
    }
    let myUuid='0';//客户端唯一标识
    let time = Date.now();//请求时间
    let token=''
  
    if(tokenVersion==='0'){
      let playToekn = `${address}|${time}|${address}`;
      token = Mmd5.Mmd5().hex_md5(playToekn)
    }else{
      try {
          if(!params){
            params={}
          }
          //这里的参数只有params可能为空，所以只对它校验
          token = getTokenV2(address,params,time,myUuid,clientType,paramString)//token
          //console.log('token=====',token)
      } catch (e) {
          reportErr('#catchError#getMAgentJS getTokenV2 catch:'+e); // 获取M-agent公共方法中的getTokenV2方法异常
      }
    }
    let value = '';//返回的m-agent值
    value = `${channel}/${packageName}/${clientType}/${sysPlatform}/${sysVersion}/${screenRatio}/${myUuid}/${time}/${token}/${tokenVersion}`;
    // 参数说明：渠道 / 包名 / client类型 / 系统平台 / 系统版本 / 分辨率 / 客户端唯一标识 / 请求时间 / TOKEN / token版本/token版本
    return value;
   }
    /**
     * getTokenV2，v2版本的获取token的方式
     *
     * @param action - 接口方法名称
     * @param params - 接口方法的所有参数
     * @param time - 接口方法的所有参数
     * @param uuid - 客户端唯一标识
     * @param client - 客户端类型
     * @returns string
     */
   function getTokenV2(action,postParams,time,uuid,client,getParamStr){
        let keyStr=getBinaryKey(time)//获取密钥
        let getParamObj=strToJson(getParamStr) //获取get方式的query参数的对象
        let params=Object.assign({},getParamObj,postParams)//将get和post方式的请求参数放在同一个数组
        let paramStr=orderJsonParam(params) //对所有参数按字典顺序排序并拼成以&符链接的string
        let varStr=`${action}|${time}|${action}|${paramStr}|${uuid}|${client}`
        let val=Mmd5.Mmd5().hex_md5(varStr) 
        let token=encryptByAes(val,keyStr)
        return token
    }
    /**
     * aes加密方法
     *
     * @param ciphertext - 要加密的字符串
     * @param key - 密钥字符串
     * @returns string
     */
    function encryptByAes(val,keyStr){
        let key = CryptoJS.enc.Utf8.parse(keyStr);//字符串类型的key用之前需要用uft8先parse一下才能用
        //CryptoJS生成的密文是一个对象，如果直接将其转为字符串是一个Base64编码过的，在encryptedData.ciphertext上的属性转为字符串才是后端需要的格式
        let encryptedData=CryptoJS.AES.encrypt(val, key,{mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
        return encryptedData.ciphertext.toString();
    }
    /**
     * aes解密方法
     *
     * @param ciphertext - 要解密的字符串
     * @param key - 密钥字符串
     * @returns string
     */
    function decryptByAES(ciphertext, key) {
        var keyHex = CryptoJS.enc.Utf8.parse(key);//字符串类型的key用之前需要用uft8先parse一下才能用
        // 由于加密后的密文为128位的字符串，那么解密时，需要将其转为Base64编码的格式。
        // 那么就需要先使用方法CryptoJS.enc.Hex.parse转为十六进制，再使用CryptoJS.enc.Base64.stringify将其变为Base64编码的字符串，此时才可以传入CryptoJS.AES.decrypt方法中对其进行解密
        var encryptedHexStr = CryptoJS.enc.Hex.parse(ciphertext);
        var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        var decrypt = CryptoJS.AES.decrypt(encryptedBase64Str, keyHex, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
        return CryptoJS.enc.Utf8.stringify(decrypt).toString();//解密后，需要按照Utf8的方式将明文转为字符串
    }
     /**
     * getBinaryKey 获取密钥的方法
     *
     * @param time - 时间戳
     * @returns string
     */
    function getBinaryKey(time){
        let key=time.toString(2)//time换算成二进制取末尾31位并取反，结果保持16位，不够的话末尾补0
        let length = key.length;
        key = key.substring(length - 31, length)
        key = ~(parseInt(key,2))+'' 
        if (key.length < 16) { // 不足16位末尾补0
            key = key + '0'.repeat(16 - key.length)
        }
        return key;
   }
  /**
   * 将params按key的字典排序组成类似key1=value1&key2=value2...的字符串
   *
   * @param {object} params - 参数
   * @returns json字符串
   */
  function orderJsonParam(param){
    let unordered=param;
    let ordered={}
    Object.keys(unordered).sort().forEach(function(key) {
        ordered[key] = unordered[key];
    });
    return jsonSerialize(ordered)
  }
  /**
   * 将json对象，以&拼接成字符串
   *
   * @param {object} params - 参数
   * @returns string
   */
  function jsonSerialize(json) {
    var str = '';
    for (var key in json) {
      str += key + '=' + encodeURIComponent(json[key]) + '&';
    }
    return str.substring(0, str.length - 1);
  }
   /**
   * 将以&拼接的字符串转成json对象
   *
   * @param {object} params - 参数
   * @returns object
   */
  function strToJson(str){
    if(!str){
      return {}
    }
    let arr=str.split("&");
    let obj={}
    for(let i=0;i<arr.length;i++){
      let item=arr[i].split("=")
      obj[item[0]]=item[1]
    }
    return obj
  }
  /**
 * report crash log
 *
 * @param {String} errorMsg - exception msg
 */
function reportErr(errorMsg, dim4, dim5) {
  let app = getApp({ allowDefault: true });
  //获取当前页面
  var arrpageShed = getCurrentPages();
  var strCurrentPage = (arrpageShed && arrpageShed.length > 0) ? arrpageShed[arrpageShed.length - 1].__route__ : '';
  var url = app.globalRequestUrl + '/aspp/log/upload.do?data=';
  var errJson = {},
    systemInfoObj = {},
    errString = '';
  var systemInfo = wx.getSystemInfoSync();
  if (systemInfoObj) {
    systemInfoObj = {
      'brand': systemInfo.brand,
      'model': systemInfo.model,
      'version': systemInfo.version,
      'system': systemInfo.system,
      'SDKVersion': systemInfo.SDKVersion
    }
  }
  if (errorMsg) {
    errJson.product = 'wxminiprogram';
    errJson.logtime = new Date();
    errJson.ua = JSON.stringify(systemInfoObj);
    errJson.dim1 = errorMsg;
    errJson.dim2 = strCurrentPage;
    errJson.dim3 = wx.getStorageSync('appid');
    errJson.dim4 = dim4;
    errJson.dim5 = dim5;
    errString = JSON.stringify(errJson);
    url += errString;
    wx.request({ url: url });
  }
}
  module.exports = {
    getPublicAgent
  }