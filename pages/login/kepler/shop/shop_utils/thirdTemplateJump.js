var app = getApp();
var utils = require('../shop_utils/onLaunch.js');
var log = require('../shop_utils/keplerReport').init();
var setLogPv = require('./setLogPv.js');

function thirdTemplateJump(e) {
    console.log('第三方模板跳转')
    console.log(e);
    getTemplateDetail(e)
}

function getTemplateDetail(e) {
    if(!e){
        return false;
    }
    var detail = e.detail;
    var item = e.item;
    var key = e.key;
    if (detail && typeof(detail)==='object'){
        analyzeObj(detail)
    } else if (detail && typeof(detail) === 'string'){
        jumpToSkuList(detail);
    } else if (item && typeof(item) ==='object') {
        analyzeObj(item)
    } else if (item && typeof(item) === 'string') {
        jumpToSkuList(item);
    } else if (key && typeof(key)==='object'){
        analyzeObj(key)
    } else if (key && typeof(key) === 'string') {
        jumpToSkuList(key);
    }
}

function analyzeObj(obj) {
    if (obj.configDataType || obj.configDataType===0) {
        jumpEventTemplate(obj);
    } else if (obj.skuId) {
        jumpToSkuDetail(obj.skuId);
    } else {
        getTemplateDetail(obj);
    }
}

function jumpEventTemplate(detail) {

    if (detail) {
        var dataSourceType = '';// 0对应于纯图片,  1对应于SKU， 2对应于PROMOTION,
        var configDataType = detail.configDataType;// 当dataSourceType为2时
        switch (configDataType) {
            case 0:// 默认
            { }
                break;
            case 1:// 单品列表
            {
                let skuids = detail.configDataValue&&detail.configDataValue.skuIds;
                if (typeof skuids === 'string' && skuids.split(",").length===1) {
                    jumpToSkuDetail(skuids)
                    return;
                }
                let key = detail.key;
                let title = detail.configDataValue && detail.configDataValue.title;
                jumpToSkuList(key,title);
            }
                break;
            case 2:// 优惠券
            { }
                break;
            case 3:// 店铺分类 {"cid":1111 } cid:店铺分类id
            {
                let cid = detail.configDataValue && detail.configDataValue.cid;
                jumpToShopSearch(cid);
            }
                break;
            case 4:// 手机版活动 { "activityId":1111 } activityId:活动id
            {
                let jumpUrl = detail.configDataValue && detail.configDataValue.jumpUrl;
                jumpToActivityH5(jumpUrl);
            }
                break;
            case 5:// 电脑版活动
            { }
                break;
            case 6:// 店铺详情 { "shopDetail":"18833" } shopDetail: 如果存在值，表示配制了店铺详情，否则无
            { }
                break;
            case 7:// 自定义链接
            {
                let linkUrl = detail.configDataValue && detail.configDataValue.linkUrl;
                if(linkUrl){
                    if (linkUrl.indexOf('coupon.m.jd.com') >= 0) {
                        // 跳转单独领劵页面
                        jumpToCouponHome(linkUrl)
                    } else if (linkUrl.indexOf('item.m.jd.com/product/') >= 0){
                        //处理链接为item.m.jd.com的跳转商详页
                        linkUrl = linkUrl.split('?')[0];
                        linkUrl = linkUrl.split('#')[0];
                        linkUrl = linkUrl.substring(linkUrl.lastIndexOf("\/") + 1, linkUrl.length - 5);
                        jumpToSkuDetail(linkUrl);
                    } else if (linkUrl.indexOf('item.m.jd.com/ware/view.action') != -1){
                        linkUrl = linkUrl.split('?')[1] || '';
                        linkUrl = linkUrl.split('&') || []
                        linkUrl.forEach((item) => {
                            if (item.indexOf('wareId') != -1) {
                                linkUrl = item || ''
                            }
                        })
                        linkUrl = linkUrl.split('=')[1] || ''
                        console.log('180911自定义链接修改+++++++++++++++++++++++++++++++' , linkUrl)
                        jumpToSkuDetail(linkUrl);
                    }  else if (linkUrl.indexOf('wqitem.jd.com/item/view') != -1 || linkUrl.indexOf('m.jingxi.com/item/view') != -1){
                        linkUrl = linkUrl.split('?')[1] || '';
                        linkUrl = linkUrl.split('&') || []
                        linkUrl.forEach((item) => {
                            if (item.indexOf('sku') != -1) {
                                linkUrl = item || ''
                            }
                        })
                        linkUrl = linkUrl.split('=')[1] || ''
                        console.log('180911自定义链接修改+++++++++++++++++++++++++++++++' , linkUrl)
                        jumpToSkuDetail(linkUrl);
                    }  else if (linkUrl.indexOf('item.jd.com/') != -1){
                        linkUrl = linkUrl.split('item.jd.com/')[1] || '';
                        linkUrl = linkUrl.split('.') || []
                        linkUrl = linkUrl[0] || ''
                        console.log('180911自定义链接修改+++++++++++++++++++++++++++++++' , linkUrl)
                        jumpToSkuDetail(linkUrl);
                    } else{
                        jumpToWebView(linkUrl);
                    }

                }
            }
                break;
            case 9:// 会员中心页
            { }
                break
            case 15:// 跳转小程序内任一页面
            {
                let linkUrl = detail.configDataValue && detail.configDataValue.linkUrl;
                jumpToPage(linkUrl);
            }
                break;
            case 16:// 跳转插件
            {
                let linkUrl = detail.configDataValue && detail.configDataValue.linkUrl;
                jumpToPlugin(linkUrl);
            }
                break;
            default:
            { }
                break;
        }
    }
}

//跳插件
function jumpToPage(jumpUrl) {
    if (jumpUrl) {
        // 如果不是绝对路径，则修改成绝对
        !(/^\//.test(jumpUrl)) && (jumpUrl = '/' + jumpUrl)
        wx.navigateTo({
            url: jumpUrl,
            fail:function () {
                //尝试navigate，如果失败，尝试switchTab
                wx.switchTab({
                    url:jumpUrl,
                    fail:function () {
                        wx.showToast({
                            title: '该页面不存在!',
                            icon: "none",
                            duration: 2500
                        })
                    }
                })
            }
        })
    }
}
//跳插件
function jumpToPlugin(jumpUrl) {
    if (jumpUrl) {
        let url = jumpUrl;
        wx.navigateTo({
            url: "/pages/transition/transition?returnPage=" + encodeURIComponent(jumpUrl)
        })
    }
}

//跳活动页面
function jumpToActivityH5(jumpUrl){
    console.log("跳活动页面")
    if (jumpUrl){
        let url = "https://sale.jd.com/m/act/"+jumpUrl+".html";
        wx.navigateTo({
            url: "/pages/activityH5/activityH5?kActUrl="+url
        })
    }
}
// 跳独立领劵页
function jumpToCouponHome(redirectUrl) {
    console.log('跳独立领劵页');
    if (redirectUrl) {
        let appid = redirectUrl;
        appid = appid.split('?');
        if (appid.length >= 2) {
            // log.set({
            //     pageId: 'KeplerMiniAppShopHome',
            // });
            setLogPv.setLogPv(log,function () {
                log.click({
                    "eid": "KMiniAppShop_Activityid",
                    "elevel": "",
                    "eparam": "1",
                    "pname": "/pages/shop/shop",
                    "pparam": "",
                    "target": '/pages/coupon/getCoupon/getCoupon?" + appid[1]',
                    "event": "jumpToJShopHome",
                });
            })

            wx.navigateTo({
                url: "/pages/coupon/getCoupon/getCoupon?" + appid[1],
            })
        }
    }
}


// 跳商品详情
function jumpToSkuDetail(wareId) {
    if (wareId) {
        // log.set({
        //     pageId: 'KeplerMiniAppShopHome',
        // });
        setLogPv.setLogPv(log,function () {
            log.click({
                "eid": "KMiniAppShop_Productid",
                "elevel": "",
                "eparam": "" + wareId,
                "pname": "/pages/shop/shop",
                "pparam": "",
                "target": "/pages/product/product?wareId=" + wareId,
                "event": "jumpToSkuDetail",
            });
        })

        let pages = getCurrentPages();
        if (pages.length === 1) {
            wx.navigateTo({
                url: "/pages/product/product?wareId=" + wareId,
            })
        } else {
            wx.redirectTo({
                url: "/pages/product/product?wareId=" + wareId,
            })
        }
    }
}

// 跳商品单品列表
function jumpToSkuList(key,title) {
    if (key) {
        // log.set({
        //     pageId: 'KeplerMiniAppShopHome',
        // });
        setLogPv.setLogPv(log,function () {
            log.click({
                "eid": "KMiniAppShop_Activityid",
                "elevel": "",
                "eparam": "0",
                "pname": "/pages/shop/shop",
                "pparam": "",
                "target": '/pages/shop/shopRcmd/shopRcmd?key=' + key + '&moduletype=PORMOTION' + '&template=1' + '&name=' + title,
                "event": "jumpToSkuList",
            });
        })

        wx.navigateTo({
            url: '/pages/shop/shopRcmd/shopRcmd?key=' + key + '&moduletype=PORMOTION' + '&template=1' +'&name='+title,
        })
    }
}

// 跳搜索落地页
function jumpToShopSearch(catid) {
    if (catid) {
        // log.set({
        //     pageId: 'KeplerMiniAppShopHome',
        // });
        setLogPv.setLogPv(log,function () {
            log.click({
                "eid": "KMiniAppShop_Activityid",
                "elevel": "",
                "eparam": "0",
                "pname": "/pages/shop/shop",
                "pparam": "",
                "target": "/pages/shop/shopSearch/shopSearch?cateId=" + catid,
                "event": "jumpToShopSearch",
            });
        })

        wx.navigateTo({
            url: "/pages/shop/shopSearch/shopSearch?cateId=" + catid,
        })
    }
}

// 跳JShop活动页
function jumpToJShopHome(activityId) {
    if (activityId) {
        // log.set({
        //     pageId: 'KeplerMiniAppShopHome',
        // });
        setLogPv.setLogPv(log,function () {
            log.click({
                "eid": "KMiniAppShop_Activityid",
                "elevel": "",
                "eparam": "1",
                "pname": "/pages/shop/shop",
                "pparam": "",
                "target": '/pages/jshopHtml/jshopHtml?appId=' + activityId,
                "event": "jumpToJShopHome",
            });
        })

        wx.navigateTo({
            url: '/pages/jshopHtml/jshopHtml?appId=' + activityId,
        })
    }
}

// 跳通天塔
function jumpToWebView(redirectUrl) {
    // var linkUrl = 'https://pro.m.jd.com/wq/active/4JyrCs5S2KcoLvBakGAtoRwXC7jr/index.html?wxAppName=Kepler&wxAppId=XXX&siteId=WXAPP-JA2016-1';

    // jumpToWebView(linkUrl);
    // return;
    if (redirectUrl) {
        let extConfig = utils.getExtConfig();
        let wxAppId = extConfig.appid;
        redirectUrl = redirectUrl + (redirectUrl.indexOf('?') > -1?'&':'?') + 'wxAppName=Kepler&wxAppId=' + wxAppId+'&siteId=WXAPP-JA2016-1';
        // log.set({
        //     pageId: 'KeplerMiniAppShopHome',
        // });
        setLogPv.setLogPv(log,function () {
            log.click({
                "eid": "KMiniAppShop_Activityid",
                "elevel": "",
                "eparam": "1",
                "pname": "/pages/shop/shop",
                "pparam": "",
                "target": '/pages/activityH5/activityH5?kActUrl=' + encodeURIComponent(redirectUrl),
                "event": "jumpToWebView",
            });
        })
        wx.navigateTo({
            url: '/pages/activityH5/activityH5?kActUrl=' + encodeURIComponent(redirectUrl),
        })
    }
}

module.exports = {
    thirdTemplateJump: thirdTemplateJump,
}

