var app = getApp({allowDefault: true});
//const CookieUtils = require('./cookie.js');
// const CookieUtils = require('./wx.cookie.js');
const CookieUtils = app.globalData.wxCookie;
const Md5Utils = require('./Mmd5.js').Mmd5();
const Promise = require('./lib/promise.js');
var utils = require('./util.js');
/**
 *上报设备信息，如屏幕亮度、系统信息、网络类型等
 */

//所需信息及对应获取方法
let wantInfos = [
    {
        method: wx.getScreenBrightness,
        infos: [['screenBrightness','value']]
    },
    {
        method: wx.getSystemInfo,
        infos: ['brand', 'model', 'pixelRatio', 'screenWidth', 'screenHeight', 'windowWidth', 'windowHeight', 'language', 'version', 'system', 'platform', 'fontSizeSetting', 'SDKVersion']
    },
    {
        method: wx.getNetworkType,
        infos: ['networkType']
    }
]
let shshshfpa = CookieUtils.getCookie('shshshfpa');
let shshshfpb = CookieUtils.getCookie('shshshfpb');
let cookie_pin = CookieUtils.getCookie('jdpin') || CookieUtils.getCookie('pin');
let sID = CookieUtils.getCookie('shshshsID');
let fg;

//生成 shshshfpa
function getUniq() {
    let uniq = "";
    for (let i = 1; i <= 32; i++) {
        let n = Math.floor(Math.random() * 16.0).toString(16);
        uniq += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20)) uniq += "-"
    }
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    uniq += "-" + timestamp;
    return uniq
}
function setSID(time, squence, sid) {
    if (sid != undefined) {
        sid = sid.split("_")[0];
        squence = Number(squence + 1);
        return sid + '_' + squence + '_' + time
    } else {
        sid = Md5Utils.hex_md5(getUniq());
        return sid + '_' + squence + '_' + time
    }
}
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
/**
 * 匹配获取结果及所需字段
 * @param res
 * @param properties
 * @returns {Array}
 */
function getJson(res, properties) {
    let result = [];
    properties.forEach(function (obj) {
        let temp = null;
        if (isArray(obj)) {
            temp = {
                key: obj[0],
                value: isArray(res[obj[1]]) ? res[obj[1]].join(';') : res[obj[1]]||'unknown'
            }
        } else {
            temp = {
                key: obj,
                value: isArray(res[obj]) ? res[obj].join(';') : res[obj]||'unknown'
            }
        }
        result.push(temp)
    })
    return result;
}
/**
 * 封装获取设备信息的promise对象
 */
function getPromise(getWhat) {
    return new Promise((resolve, reject) => {
        getWhat.method({
            complete: function (res) {
                let temp = getJson(res, getWhat.infos)
                resolve(temp)
            }
        })
    })
}
/**
 * promise数组
 * @returns {Array}
 */
function getPromises() {
    //方法兼容性，过滤掉不兼容的方法
    let okwantInfos=wantInfos.filter((obj)=>obj.method)
    let promises = okwantInfos.map(what => {
        return getPromise(what);
    })
    return promises;
}
/**
 * 初始化一些cookie及数据
 * @param properties
 */
function initData(properties) {
    let systemKeys = ["brand", "model", "pixelRatio", "screenWidth", "screenHeight", "system", "platform"]
    //获取变量shshshfpa并写入cookie
    if (!shshshfpa) {
        shshshfpa = getUniq()
        CookieUtils.setCookie({data: {'shshshfpa': {value: shshshfpa, maxAge: 3153E3}}})
    }
    //获取并写入系统信息
    let systemValues = properties.reduce((result, item) => {
        if (systemKeys.indexOf(item.key) > -1) {
            return result + item.value + ',';
        }
        return result + '';
    }, '')

    fg = Md5Utils.hex_md5(systemValues.substring(0, systemValues.length - 1))
    CookieUtils.setCookie({data: {'shshshfp': {value: fg, maxAge: 3153E3}}})
}
/**
 * 上报hf_data,一天上报一次,一些用户信息
 * @param properties
 */
function sendHf(properties) {
    let now_time = new Date()
    now_time.setHours(0,0,0,0);
    now_time=now_time.getTime()
    let hf_time = CookieUtils.getCookie('hf_time')||0;
    // let hf_time=1;
    if (hf_time < now_time) {
        let hf_body = {
            browser_info: fg,
            client_time: new Date().getTime(),
            period: 24,
            shshshfpa: shshshfpa,
            whwswswws: shshshfpb,
            msdk_version: '2.1.1',
            cookie_pin: cookie_pin,
            visitkey: CookieUtils.getCookie('visitkey'),
            wid: CookieUtils.getCookie('wq_uin'),
            open_id: CookieUtils.getCookie('open_id'),
            nickName: CookieUtils.getCookie('nickName'),
            avatarUrl: CookieUtils.getCookie('avatarUrl')
        };
        properties.map(item => {
            hf_body[item.key] = item.value;
        })
        let hf_data = {
            "appname": "jdwebm_xcx",
            "jdkey": "",
            "whwswswws": shshshfpb,
            "businness": "wechat_xcx",
            "body": hf_body
        }
        sendRequest(hf_data, 'hf')
    }
}
/**
 * pv是每次访问都有上报 用户的浏览信息
 */
function sendPv() {
    if (!sID) {
        sID = setSID((new Date()).getTime(), 1);
        CookieUtils.setCookie({data: {'shshshsID': {value: escape(sID), maxAge: 1800}}})
    } else {
        let squence = Number(sID.split("_")[1])
        sID = setSID(new Date().getTime(), squence, sID)
        CookieUtils.setCookie({data: {'shshshsID': {value: escape(sID), maxAge: 1800}}})
    }
    let pages = typeof (getCurrentPages) === 'function' ? getCurrentPages() : [];
    let defaultRef = pages && pages.length ? pages[pages.length - 1].route || pages[pages.length - 1].__route__ : 'pages/index/index';
    let pv_body = {
        sid: sID.split("_")[0],
        squence: sID.split("_")[1],
        create_time: sID.split("_")[2],
        shshshfpa: shshshfpa,
        whwswswws: shshshfpb,
        browser_info: fg,
        page_name: 'http://wq.jd.com/wxapp/' + defaultRef,
        msdk_version: '2.1.1',
        cookie_pin: cookie_pin,
        wid: CookieUtils.getCookie('wq_uin')
    }
    let pv_data = {
        "appname": "jdwebm_pv",
        "jdkey": "",
        "whwswswws": shshshfpb,
        "businness": "wechat_xcx",
        "body": pv_body
    }
    sendRequest(pv_data, 'pv')
}
function reportInfo(properties) {
    initData(properties);
    sendHf(properties);
    sendPv();
}
/**
 * 上报数据
 * @param data
 * @param type
 * https://blackhole.m.jd.com/getinfo
 */
function sendRequest(data, type) {
    let errMsg=["成功", "无效的接口名称", "网络接收出错", "数据出错", "创建软指纹失败", "无效的软指纹", "空的软指纹"];
    let para={
        url: 'https://wxapp.m.jd.com/blackhole/getinfo',
        data: {'body':JSON.stringify(data)},
        method: 'POST',
        priority: 'REPORT',
        success:(body) => {
            if(body.code==0){
                type == "hf"&&CookieUtils.setCookie({data: {'shshshfpb': {value: body.whwswswws, maxAge: 3153E3}}})
                type == "hf"&&CookieUtils.setCookie({data: {'hf_time': {value: new Date().getTime(), maxAge: 3153E3}}})
            }
        },
        fail:(e) => {
            console.log(e);
        }
    };
    utils.request(para);
}
/**
 * 设备信息上报入口
 * @constructor
 */
function Jdwebm() {
    let promises=getPromises();
    Promise.all(promises).then(res => {
        // let bvalue=res[1].concat(res[2]);
        // let evalue=res[5];
        let bluetooth=[{key:'bluetooth',value:''}];
        let beacons=[{key:'beacons',value:''}];
        // res.splice(1,2);
        // res.splice(3,1);
        res=res.concat(bluetooth,beacons)
        let result = res.reduce((total, item) => {
            return total.concat(item);
        }, [])
        reportInfo(result)
    }).catch(err => {
        console.log(err)
    })
}
module.exports = {
    Jdwebm:Jdwebm,
    CookieUtils:CookieUtils
};