var app = getApp();
var shop_util = require('./shop_util');
var shopId = shop_util.getShopConfigure().configure.shopID;
var utils = require('./util.js');

// 首页
var url_getShopHomeData = app.globalRequestUrl+ '/shopwechat/shophomesoa/getShopHomeData';
// 搜索
var url_searchWare = app.globalRequestUrl + '/shopwechat/shophomesoa/searchWare';
// 热销
var url_getShopHotWares = app.globalRequestUrl + '/shopwechat/shophomesoa/getShopHotWares';
// 促销
var url_getShopPromotionWareList = app.globalRequestUrl + '/shopwechat/shophomesoa/getShopPromotionWareList';
// 活动tab下的促销
var url_getPromotionWares = app.globalRequestUrl + '/shopwechat/shophomesoa/getPromotionWares';
// 促销类型
var url_getShopPromotionTypes = app.globalRequestUrl + '/shopwechat/shophomesoa/getShopPromotionTypes';
// 上新
var url_newWareList = app.globalRequestUrl + '/shopwechat/shophomesoa/newWareList';
// 动态
var url_getShopActivityPage = app.globalRequestUrl + '/shopwechat/shophomesoa/getShopActivityPage';
// 活动
var url_getCampaignPageTab = app.globalRequestUrl + '/shopwechat/shophomesoa/getCampaignPageTab';
//拼购
var url_fightBuy = app.globalFbUrl + "/index/getPingouLstInfo";
//拼购（过滤下架的））
var url_fightBuyFileter = app.globalRequestUrl + '/shopwechat/shophomesoa/getPingouSkuInfo';
//关注以及取消关注
var url_successContern = app.globalRequestUrl + '/shopwechat/shophomesoa/followShopWechat';

//领取关注大礼包
var url_getGift = app.globalRequestUrl + "/shopwechat/shophomesoa/followHaveGift";
//挂件以及弹窗
var url_pendant = 'https://wxapp.m.jd.com' + "/shopwechat/shophomesoa/queryISVAndRed"
// 领取新人红包
var url_newCusGetCoupon = app.globalRequestUrl + '/mk/coupon/receiveGiftBagCoupon.do'

//中心化弹屏领券
var url_centerCoupon = app.globalRequestUrl +  '/mk/coupon/receiveCoupon.do'
// 获取openid
var url_getSessionOpenid = 'https://kepler-wechat.m.jd.com/open/getSessionOpenid'
//插件
var url_plug = app.globalRequestUrl + "/shopwechat/shophomesoa/getToken";
//插件
var url_contact = app.globalRequestUrl + "/shopwechat/shophomesoa/getCustomerServiceMsg";
//店铺热词 ?body={"shopId":"1000002520"}
var url_hotword = app.globalRequestUrl + "/shopwechat/shophomesoa/getHotword";

function _getParameter(param) {
    var o = { shopId: wx.getStorageSync('shopID') };
    let area = param.area
    // 店铺搜索引入地址全栈
    if(area){
        param.area = undefined
    }
    var strBody = JSON.stringify(Object.assign(o, param));
    let jdlogin_pt_key = utils.getPtKey() || wx.getStorageSync('jdlogin_pt_key')||'';
    var obj = new Object();
    obj.body = strBody;
    obj.pt_key = jdlogin_pt_key;
    obj.screen = (app.globalData.systemInfo.windowWidth * app.globalData.systemInfo.pixelRatio) + '*' + (app.globalData.systemInfo.windowHeight * app.globalData.systemInfo.pixelRatio)
    obj.client = 'wx';
    obj.clientVersion = '7.1.2';
    obj.source = param.source || 'jd-jing';
    if(area && area.regionIdStr){
        let addr = decodeURIComponent(area.regionIdStr)
        obj.area = addr.replace(/,/g,'_');
    }
    return obj;
}

function request(url, param, success, fail) {
    var obj = _getParameter(param)
    var url = url;
    var that = this;
    wx.request({
        url: url,
        header: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        data: obj,
        success: function (res) {
            var code = res.data? res.data.code:'1';
            //客服消息推送 authorizerAppid
            if (code === 0 || code === '0' || (res.data && res.data.authorizerAppid)) {
                success && success(res.data)
            } else {
                fail && fail(res)
            }
        },
        fail: function (res) { fail && fail(res) },
        complete: function (res) { }
    });
}
function fbrequest(url, param, success, fail) {
    var obj = param
    var shopId = param.shopId || ''
    var pageIndex = param.pageIdx || ''
    var pageSize = param.pagesize || ''
    if (pageIndex == '') {
        var url = url + '?body={"shopId":' + shopId + '}';
    } else {
        var url = url + '?body={"shopId":' + shopId + ',"pageIndex":' + pageIndex + ',"pageSize":' + pageSize + '}';
    }
    var that = this;
    wx.request({
        url: url,
        header: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'post',
        success: function (res) {
            var code = res.data? res.data.code:'1';
            if (code === 0 || code === '0') {
                success && success(res.data)
            } else {
                fail && fail()
            }
        },
        fail: function (res) { fail && fail() },
        complete: function (res) { }
    });
}
function fbrequestFilter(url, param, success, fail) {
    var obj = param
    var shopId = param.shopId || ''
    var venderId = param.venderId || ''
    var pageIndex = param.pageIdx || ''
    var pageSize = param.pagesize || ''
    if (pageIndex == '') {
        var url = url + '?body={"shopId":' + shopId + ',"venderId":' + venderId +'}';
    } else {
        var url = url + '?body={"shopId":' + shopId + ',"venderId":' + venderId + ',"pageIndex":' + pageIndex + ',"pageSize":' + pageSize + '}';
    }
    var that = this;
    wx.request({
        url: url,
        header: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        method: 'post',
        success: function (res) {
            var code = res.data? res.data.code:'1';
            if (code === 0 || code === '0') {
                success && success(res.data)
            } else {
                fail && fail()
            }
        },
        fail: function (res) { fail && fail() },
        complete: function (res) { }
    });
}
//插件
function conPlug(url, param, success, fail) {
  var shopId = param.shopId || '';
  var myUrl = param.myUrl || '';
  var obj = {
    shopId: shopId,
    myUrl: myUrl
  }
  var body = JSON.stringify(obj)
  var url = url + "?body=" + body;
  var that = this;
  utils.request({
    url: url,
    method: 'post',
    success: function (res) {
      success && success(res)
    },
    fail: function (res) { fail && fail() },
    complete: function (res) { }
  });
}

//弹窗以及挂件
function conPendant(url, param, success, fail) {
    var source = param.source || '';
    var appId = param.appId || '';
    var js_code = param.code || '';
    var obj = {
      source: source,
      appId: appId,
      js_code: js_code,
      version:'v1.1'//调用最新接口版本
    }
    var body = JSON.stringify(obj)
    var url = url + "?body=" + body;
    var that = this;
    utils.request({
        url: url,
        method: 'post',
        success: function (res) {
            success && success(res)
        },
        fail: function (res) { fail && fail() },
        complete: function (res) { }
    });
}
//领取关注有礼礼包
function congift(url, param, success, fail){
    var shopId = param.shopId || '';
    var activityId = param.activityId||'';
    var follow = param.follow;
    var obj={
        shopId:shopId,
        activityId: activityId,
        follow: follow
    }
    var body=JSON.stringify(obj)
    var url = url +"?body="+body ;
    var that = this;
    utils.request({
        url: url,
        method: 'post',
        success: function (res) {
            success && success(res)
        },
        fail: function (res) { fail && fail() },
        complete: function (res) { }
    });
}
/**
 * 插件
 */
function getPlug(param, success, fail) {
  var conparam = param;
  conPlug(url_plug, conparam, (data) => {
    success && success(data)
  }, (error) => {
    fail && fail(error)
  })
}


//关注以及取消关注
function conSucrequest(url, param, success, fail) {
    var shopId = param.shopId || '';
    var follow = param.follow || '';
    var award = param.award || '';
    var obj = {
        shopId: shopId,
        follow: follow,
        award: award
    }
    var body = JSON.stringify(obj)
    var url = url + "?body=" + body;
    var that = this;
    utils.request({
        url: url,
        method: 'post',
        success: function (res) {
            success && success(res)
        },
        fail: function (res) { fail && fail() },
        complete: function (res) { }
    });
}
// 中心化弹屏领取优惠券
function centerGetCoupon(params, success, fail) {
    console.log(params)
    var body = JSON.stringify(params)
    var url = `${url_centerCoupon}?appId=${params.appId}&activityId=${params.activityId}&activityType=${params.activityType}&ruleId=${params.ruleId}&encryptedKey=${params.encryptedKey}&appKey=${params.appKey}`;
    var that = this;
    let openId = params.openId
    utils.request({
        url: url,
        method: 'post',
        selfCookie: `openId=${openId};`,
        success: function (res) {
            success && success(res)
        },
        fail: function (res) { fail && fail(res) },
        complete: function (res) { }
    });
}
// 新人红包领取优惠券
function newCusGetCoupon(params, success, fail) {
  console.log(params)
  var body = JSON.stringify(params)
  var url = `${url_newCusGetCoupon}?appId=${params.appId}&activityId=${params.activityId}&ruleId=${params.ruleId}&encryptedKey=${params.encryptedKey}&appKey=${params.appKey}&putKey=${params.putKey}`;
  var that = this;
  let openId = params.openId
  utils.request({
    url: url,
    method: 'post',
    selfCookie: `openId=${openId};`,
    success: function (res) {
      success && success(res)
    },
    fail: function (res) { fail && fail(res) },
    complete: function (res) { }
  });
}
// 新人红包领取优惠券
function getSessionOpenid(params, success, fail) {
  console.log(params)
  var body = JSON.stringify(params)
  var url = `${url_getSessionOpenid}?appid=${params.appId}&code=${params.code}`;
  var that = this;
  utils.request({
    url: url,
    method: 'post',
    success: function (res) {
      success && success(res)
    },
    fail: function (res) { fail && fail(res) },
    complete: function (res) { }
  });
}
/**
 * 用于全部商品，热销
 * 对价格做format，preJDPrice为小数点前价格，sufJDPrice为小数点后价格
 * @param list 商品list
 * @param priceName 秒杀价格处理的字段，如果是jdPrice则不需要传，
 * @returns {Array}  添加了preJDPrice sufJDPrice
 */
function formatJDPrice(list) {
    if (!list) {
        return [];
    }

    if (!list.length) {
        return false;
    }
    let newList = [];
    list.map(function (item, index) {
        newList.push(
            newItem(item, index)
        )
    })
//普通商品
    function newItem(item, index) {
        if (checkPrice(item.jdPrice)) {
            item.preJDPrice = item && item.jdPrice && item.jdPrice.toString().split(".")[0];
            item.sufJDPrice = item && item.jdPrice && item.jdPrice.toString().split(".")[1];
            item.isJDPrice = item && item.jdPrice && true;
        } else {
            item.isJDPrice = item && item.jdPrice && false;
        }

        return item;
    }
    function checkPrice(me) {
        if ((/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(me))) {
            return true;
        }
        return false;
    }
    return newList


}
function formatFbPrice(list) {


    let newList = [];
    list.pingouList && list.pingouList.map(function (item, index) {
        newItem(item, index)
    })

    function newItem(item, index) {
        var SkuInf = item.SkuInf[0]
        if(SkuInf && (SkuInf.strPromoPrice != -1)){
            SkuInf.prestrPromoPrice = SkuInf.strPromoPrice.toString().split(".")[0];
            SkuInf.sufstrPromoPrice = SkuInf.strPromoPrice.toString().split(".")[1];
        }else{
            SkuInf.prestrPromoPrice = SkuInf.jdprice.toString().split(".")[0];
            SkuInf.sufstrPromoPrice = SkuInf.jdprice.toString().split(".")[1];
        }


        return item;
    }
    return list
}


/**
 * 首页
 * success 成功回调
 * fail 失败回调
 */
function getShopHomeData(success, fail) {
    request(url_getShopHomeData, {}, (data) => {
        if (data) {
            success && success(data.result)
        } else {
            fail && fail()
        }
        }, (error) => {
            fail && fail(error)
        })
    }

/**
 * 全部商品
 * param 参数
 * success 成功回调
 * fail 失败回调
 */
function searchWare(param, success, fail) {
    param.area = wx.getStorageSync('sitesAddress');
    // 门店通搜索加参数
    if(app.globalData.mvpType == 'x_project'){
        param.source = "h5-kepler"
        param.noshow = 1
    }
    request(url_searchWare, param, (data) => {
        var result = data.result;
    var list = result && result.wareInfo || [];
    var pageIdx = result.pageIdx;
    var totalPage = result.totalPage;
    var hasNext = true;
    var orighasNext = result.hasNext;
    if (pageIdx >= totalPage) {
        hasNext = false;
    }
    success && success(formatJDPrice(list), hasNext && orighasNext)
}, (error) => {
        fail && fail(error)
    })
}

/**
 * 热销
 * param 参数
 * success 成功回调
 * fail 失败回调
 */
function getShopHotWares(param, success, fail) {
    request(url_getShopHotWares, param, (data) => {
        var list = data.result || [];
    var pageIdx = data.pageIdx;
    var totalPage = data.totalPage;
    var hasNext = true;
    if (pageIdx >= totalPage) {
        hasNext = false;
    }
    success && success(formatJDPrice(list), hasNext)
}, (error) => {
        fail && fail(error)
    })
}
/**
 * 拼购
 */
function getFightBuy(param, success, fail) {
    var fbparam = param
    fbrequest(url_fightBuy, fbparam, (data) => {
        var list = data.result || {};

    success && success(formatFbPrice(list))
}, (error) => {
        fail && fail(error)
    })
}
/**
 * 拼购(过滤已下架)
 */
function getFightBuyFilter(param, success, fail) {
    var fbparam = param
    fbrequestFilter(url_fightBuyFileter, fbparam, (data) => {
        var list = data.result || {};

    success && success(formatFbPrice(list))
}, (error) => {
        fail && fail(error)
    })
}
/**
 * 关注以及取消关注
 */
function getConternSuc(param, success, fail) {
    var conparam = param
    conSucrequest(url_successContern, conparam, (data) => {
        // console.log("关注成功");
        success && success(data)
}, (error) => {
        fail && fail(error)
    })
}
/**
 * 领取关注有礼大礼包
 */
function getGiftContern(param, success, fail) {
    var conparam = param
    congift(url_getGift, conparam, (data) => {
        success && success(data)
}, (error) => {
        fail && fail(error)
    })
}
/**
 * 弹窗以及挂件
 */
function getPendant(param, success, fail) {
    var conparam = param
    conPendant(url_pendant, conparam, (data) => {
        success && success(data)
}, (error) => {
        fail && fail(error)
    })
}

/**
 * 上新
 * param 参数
 * success 成功回调
 * fail 失败回调
 */
function newWareList(param, success, fail) {
    request(url_newWareList, param, (data) => {
        var result = data.result;
    var list = result.result || [];
    var pageIdx = result.pageIdx;
    var totalPage = result.totalPage;
    var orighasNext = result.hasNext;
    var hasNext = true;
    if (pageIdx >= totalPage) {
        hasNext = false;
    }
    list.map(function (item, index) {
        item.wareList = formatJDPrice(item.wareList);
    })
    // && list 预防下发数据为空
    success && success(list, hasNext && orighasNext && list)
}, (error) => {
        fail && fail(error)
    })
}

/**
 * 店铺动态
 * param 参数
 * success 成功回调
 * fail 失败回调
 */
function getShopActivityPage(param, success, fail) {
    request(url_getShopActivityPage, param, (data) => {
        var activity = data.activity;
        var hasNext = activity && activity.length === 20 ? true : false;
        success && success(activity, hasNext)
    }, (error) => {
            fail && fail(error)
        })
    }


/**
 * 促销类型
 * success 成功回调
 * fail 失败回调
 */
function getShopPromotionTypes(success, fail) {
    request(url_getShopPromotionTypes, {}, (data) => {
        var result = data.result;
        if (result) {
            var promList = result.promList || [];
            success(promList)
        } else {
            fail && fail("")
        }
    }, (error) => {
            fail && fail(error)
        })
    }

/**
 * 促销sku
 * success 成功回调
 * fail 失败回调
 */
function getShopPromotionWareList(param, success, fail) {
    request(url_getShopPromotionWareList, param, (data) => {

        if (!data) {
        fail()
        return;
    }

    // 促销分类 1- 单品，4 - 赠品，6 - 套装，10 - 总价
    if (data.otherMap && data.type === 10) {
        var promList = data.otherMap.promList;
        var hasNext = promList && promList.length === 20 ? true : false;
        success && success(formatJDPrice(promList), hasNext)
    } else if (data.wareList && (data.type === 4 || data.type === 1)) {
        var promList = data.wareList;
        var hasNext = promList && promList.length === 20 ? true : false;
        success && success(formatJDPrice(promList), hasNext)
    } else if (data.suitList && data.type === 6) {
        var suitList = data.suitList;
        var hasNext = suitList && suitList.length === 20 ? true : false;
        suitList.map(function (item, index) {
            item.preJDPrice = item && item.suitPrice && item.suitPrice.toString().split(".")[0];
            item.sufJDPrice = item && item.suitPrice && item.suitPrice.toString().split(".")[1];
            item.open = true;
        })
        success && success(suitList, hasNext)
    } else {
        success && success([], false)
    }

}, (error) => {
        fail && fail(error)
    })
}
/**
 * 活动tab下的促销sku
 * success 成功回调
 * fail 失败回调
 */
function getPromotionWares(param, success, fail) {
    request(url_getPromotionWares, param, (data) => {
        if (data) {
            success && success(data)
        }else{
            fail && fail("")
        }
    }, (error) => {
            fail && fail(error)
        })
    }
/**
 * 获取店铺活动信息
 * success 成功回调
 * fail 失败回调
 */
function getCampaignPageTab(param,success, fail) {
    var that = this;
    param.area = wx.getStorageSync('sitesAddress');
    request(url_getCampaignPageTab, param, (data) => {
        if (data) {
            success && success(data)
        } else {
            fail && fail("")
        }
    }, (error) => {
        fail && fail(error)
    })
}

/**
 * 获取客服消息
 * success 成功回调
 * fail 失败回调
 */
function getContactInfo(success, fail) {
    request(url_contact, {appId:wx.getStorageSync("appid")}, (data) => {
        if (data) {
            success(data||{})
        } else {
            fail && fail()
        }
    }, (error) => {
        fail && fail(error)
    })
}
/**
 * 获取店铺热词
 * success 成功回调
 * fail 失败回调
 */
function getHotWord(success, fail) {
    var that = this;
    request(url_hotword, {shopId:wx.getStorageSync("shopId")}, (data) => {
        if (data) {
            success(data||{})
        } else {
            fail && fail()
        }
    }, (error) => {
        fail && fail(error)
    })
}

module.exports = {
    getShopHomeData: getShopHomeData,
    searchWare: searchWare,
    getShopHotWares: getShopHotWares,
    newWareList: newWareList,
    getShopActivityPage: getShopActivityPage,
    getShopPromotionTypes: getShopPromotionTypes,
    getShopPromotionWareList: getShopPromotionWareList,
    getFightBuy: getFightBuy,
    getFightBuyFilter: getFightBuyFilter,
    getConternSuc: getConternSuc,
    getGiftContern: getGiftContern,
    getPendant: getPendant,
    getCampaignPageTab:getCampaignPageTab,
    newCusGetCoupon,
    centerGetCoupon,
    getSessionOpenid,
    getPlug,
    getContactInfo,
    getHotWord,
    getPromotionWares
}
