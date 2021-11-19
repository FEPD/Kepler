var app = getApp();
var thirdTemplateJump = require('./thirdTemplateJump.js');
// 楼层点击
function clickActivity(configs) {
    if(!configs){
        return;
    }
    let configType = configs.configType;
    switch (configType) {
        case 1:// 跳转商品列表
        {
            let key = configs.key;
            let name = configs.name;
            jumpToSkuList(key, name);
        }
            break;
        case 4:// 跳转活动页
        {
            let redirectUrl = configs.redirectUrl;
            if (redirectUrl.indexOf('item.m.jd.com') > 0 || redirectUrl.indexOf('item.jd.com') > 0) {
                jumpToSkuDetail(redirectUrl);
            } else if (redirectUrl.indexOf('sale.jd.com') > 0 ||redirectUrl.indexOf('pro.m.jd.com') > 0 || redirectUrl.indexOf('h5.m.jd.com') > 0) {
                jumpToActivityH5(redirectUrl);
            }
            // else if (redirectUrl.indexOf('pro.m.jd.com') > 0 || redirectUrl.indexOf('h5.m.jd.com') > 0) {
            //     jumpToBabelHome(redirectUrl)
            // }
            else if (redirectUrl.indexOf('coupon.m.jd.com') > 0) {
                // 跳转单独领劵页面
                jumpToCouponHome(redirectUrl)
            }  else if (redirectUrl.indexOf('wqitem.jd.com/item/view') != -1 || redirectUrl.indexOf('m.jingxi.com/item/view') != -1){
                redirectUrl = redirectUrl.split('?')[1] || '';
                redirectUrl = redirectUrl.split('&') || []
                redirectUrl.forEach((item) => {
                    if (item.indexOf('sku') != -1) {
                        redirectUrl = item || ''
                    }
                })
                redirectUrl = redirectUrl.split('=')[1] || ''
                console.log('180911自定义链接修改+++++++++++++++++++++++++++++++' , linkUrl)
                jumpToSkuDetail(redirectUrl);
            }  else if (redirectUrl.indexOf('item.jd.com/') != -1){
                redirectUrl = redirectUrl.split('item.jd.com/')[1] || '';
                redirectUrl = redirectUrl.split('.') || []
                redirectUrl = redirectUrl[0] || ''
                console.log('180911自定义链接修改+++++++++++++++++++++++++++++++' , redirectUrl)
                jumpToSkuDetail(redirectUrl);
            }
        }
            break;
        case 3:// catid 搜索落地页
        {
            let catid = configs.cid;
            wx.navigateTo({
                url: "/pages/shop/shopSearch/shopSearch?cateId=" + catid,
            })
        }
            break;
        case 8:// 跳转商品详细
        {
            let productId = configs.productId;
            jumpToSkuDetail(productId);

        }
            break;
        case 15:// 跳转小程序内任一页面
        {
            let linkUrl = configs.linkUrl;
            jumpToPage(linkUrl);
        }
            break;
        case 16:// 跳转插件
        {
            let linkUrl = configs.linkUrl;
            jumpToPlugin(linkUrl);
        }
            break;
        default:
        { }
            break;
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
                wx.showToast({
                    title: '该页面不存在!',
                    icon: "none",
                    duration: 2500
                })
            }
        })
    }
}
//跳插件
function jumpToPlugin(jumpUrl) {
    if (jumpUrl) {
        wx.navigateTo({
            url: "/pages/transition/transition?returnPage=" + encodeURIComponent(jumpUrl)
        })
    }
}
//跳活动页面
function jumpToActivityH5(jumpUrl) {
    console.log("跳活动页面")
    if (jumpUrl) {
        let url = jumpUrl;
        wx.navigateTo({
            url: "/pages/activityH5/activityH5?kActUrl=" + decodeURIComponent(url)
        })
    }
}
// 跳商品详情
function jumpToSkuDetail(wareId) {
    console.log('跳转商品详情页面');
    if (wareId){
        if (wareId.indexOf('http') >= 0){
            wareId = wareId.split('?')[0];
            wareId = wareId.split('#')[0];
            wareId = wareId.substring(wareId.lastIndexOf("\/") + 1, wareId.length - 5);
        }
        let pages = getCurrentPages();
        if (wareId) {
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
}

// 跳商品单品列表
function jumpToSkuList(key,name) {
    console.log('跳转商品单品列表');
    if(key){
        wx.navigateTo({
            url: '/pages/shop/shopRcmd/shopRcmd?key=' + key + '&moduletype=PORMOTION&name=' + name,
        })
    }
}

// 跳通天塔
function jumpToBabelHome(redirectUrl) {
    console.log('跳通天塔');
    if (redirectUrl){
        let activityId = redirectUrl;
        activityId = activityId.split('?')[0];
        activityId = activityId.split('#')[0];
        activityId = activityId.substring(activityId.indexOf("active") + 7, activityId.indexOf("index") - 1);
        wx.navigateTo({
            url: '/pages/BabelHome/BabelHome?activityId=' + activityId,
        })
    }
}

// 跳JShop活动页
function jumpToJShopHome(redirectUrl) {
    console.log('跳JShop活动页');
    if (redirectUrl) {
        let appid = redirectUrl;
        appid = appid.split('?')[0];
        appid = appid.split('#')[0];
        appid = appid.substring(appid.lastIndexOf("\/") + 1, appid.length - 5);
        wx.navigateTo({
            url: '/pages/jshopHtml/jshopHtml?appId=' + appid,
        })
    }
}

// 跳独立领劵页
function jumpToCouponHome(redirectUrl) {
    console.log('跳独立领劵页');
    // https://coupon.m.jd.com/coupons/show.action?key=XXX&roleId=XXX&to=XXX
    // https://coupon.m.jd.com/coupons/show.action?key=4379b95224724499928b9e954dba4e22&roleId=7456544&to=levis.jd.com,
    if (redirectUrl) {
        let appid = redirectUrl;
        appid = appid.split('?');
        if(appid.length>=2){
            wx.navigateTo({
                url: "/pages/coupon/getCoupon/getCoupon?" + appid[1],
            })
        }
    }
}
// 第三方模板点跳转
function templateClick(e) {
    thirdTemplateJump.thirdTemplateJump(e);
}

module.exports = {
    clickActivity: clickActivity,
    templateClick: templateClick,
    jumpToSkuDetail: jumpToSkuDetail,
    jumpToSkuList: jumpToSkuList,
    jumpToBabelHome: jumpToBabelHome,
    jumpToJShopHome: jumpToJShopHome,
    jumpToActivityH5: jumpToActivityH5
}

