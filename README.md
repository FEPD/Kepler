# 京东微信小程序交易流程插件使用Demo - 京东好物街

## 简介
	
京东交易流程插件，通过插件可实现京东商品的小程序内闭环购买。

## 插件申请使用地址

[申请地址](https://mp.weixin.qq.com/wxopen/pluginbasicprofile?action=intro&appid=wx1edf489cb248852c&token=&lang=zh_CN)

## 快速开始

### app.json

```
{
  "pages": [
    "pages/index/index",
    "pages/product/product",
    "pages/cart/cart",
    "pages/proxyUnion/proxyUnion",
    "pages/order/order",
    "pages/orderDetail/orderDetail",
    "pages/payment/payment",
    "pages/getCoupon/getCoupon"
  ],
  "subPackages": [
    {
      "root": "pages/login/",
      "pages": [
        "index/index",
        "main/main",
        "union/union",
        "web-view/web-view",
        "consignee/consignee",
        "wv-common/wv-common"
      ]
    },
    {
      "root": "pages/trade/",
      "pages": ["trade"]
    },
    {
      "root": "pages/addressul/",
      "pages": ["addressul"]
    },
    {
      "root": "pages/address/",
      "pages": ["address"]
    },
    {
      "root": "pages/paySuccess/",
      "pages": ["paySuccess"]
    }
  ],
  "plugins": {
    "myPlugin": {
      "version": "1.0.0",
      "provider": "wx1edf489cb248852c"
    },
    "loginPlugin": {
      "version": "1.1.3",
      "provider": "wxefe655223916819e"
    }
  },
  "window": {
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTextStyle": "black"
  }
}
```

Tips:
1. **index为demo演示首页，实际开发时请替换成开发者自己的首页。**
2. plugins中myPlugin的版本号（version）改成对应的插件版本号即可。

### app.js

```
var myPluginInterface = requirePlugin('myPlugin');
App({
  onLaunch: function(options) {
    
  },
  onShow: function(options) {
    myPluginInterface.appShow(options, this);
  },
  globalData: {
    unionId: "4298", //联盟ID（选填）
    appkey: "wxgdtest", //小程序跟单标识（必填）
    customerinfo: "customerinfo_test", //渠道来源（选填）
    sendpay: "3", //导购小程序sendpay传1，事业部小程序sendpay传3。（必填）
    mpAppid: "wx1edf489cb248852c", //小程序appid（必填）
    pluginAppid: "wx1edf489cb248852c", //插件appid（必填）
    tabBarPathArr: ['/pages/index/index', '/pages/cart/cart'],//tabBar页面路径，有tabBar页面则传相应路径，没有传空数组即可（登录跳转需要）
  },
  globalRequestUrl: 'https://wxapp.m.jd.com', //插件request域名（必填）
})
```

Tips:
1. globalData内的参数需要修改成插件调用方自己的，每个参数说明见下方**相关配置globalData**


#### appShow

关键数据写缓存，以及分佣处理（**非常关键必须调用！！！**）

| 参数名       | 类型       | 默认值     | 说明               |
| ----------- | --------- | --------- | ------------------ |
| options     | Object    |           | onShow方法的参数    | 
| this        | Object    |           | App this           |

#### 相关配置globalData

| 属性名                  | 类型       |必填       | 默认值     | 说明                                                            |
| ---------------------- | --------- | --------- | --------- | -------------------------------------------------------------  |
| unionId                | String    | 否        |           |联盟ID                                                           | 
| appkey                 | String    | 是        |           |小程序跟单标识                                                     |
| customerinfo           | String    | 否        |           |渠道来源                                                          |
| sendpay                | String    | 是        |           |导购小程序sendpay传1，事业部小程序sendpay传3                          |
| mpAppid                | String    | 是        |           |小程序appid                                                       |
| pluginAppid            | String    | 是        |           |插件appid：wx1edf489cb248852c                                     |
| tabBarPathArr          | Array     | 是        |           |tabBar页面路径，有tabBar页面则传相应路径，没有传空数组即可（登录跳转需要） |

### 页面修改配置文件JSON

以商品详情页为例
```
{
  "navigationBarTitleText": "商品详情",
  "enablePullDownRefresh": true,
  "usingComponents": {
    "jdk-product": "plugin://myPlugin/jdk-product"
  }
}
```

### 在页面的WXML中添加标签

```
<jdk-product wx:if="{{wareId}}" id="product" wareId="{{wareId}}" options="{{options}}" buyDisabled="{{buyDisabled}}" 
bind:gotologin="goToLogin" 
bind:gotopay="goToPay"
bind:toTop="toTopTap"
bind:gotocart="goToCart"
bind:goToChooseAddress="goToChooseAddress"
bind:getProductName="getProductName"
></jdk-product>
```

### 页面JS文件中处理

```
var plugin = requirePlugin("myPlugin");
var log = plugin.keplerReportInit();//埋点上报方法
const util = require('../utils/util.js');

Page({
  data:{
  },
  onLoad: function(options) {
    util.checkVersion();
    //处理商品sku参数
    this.setData({
      wareId:options.wareId,
      options: options
    })
    this.product = this.selectComponent('#product');
  },
  onShow:function(){
    let that = this;
    //防止用户多次点击（一定要加！！！）
    this.setData({
      buyDisabled: false,
    })
    //地址选择数据同步
    this.product.methods.getAddressStorage();
    //同步缓存中购物车角标数
    this.product.methods.updateCartNum();
    this.product.methods.firstCheckIsLogin();

    // 设置分享链接，增加分佣spreadUrl
    let app = getApp();
    let unionId = (app.globalData && app.globalData.unionId) || ''
    if (unionId) {
      plugin.getSpreadUrl(that.data.wareId, unionId).then((res)=>{
        that.data.shareUrl = `/pages/product/product?wareId=${that.data.wareId}&spreadUrl=${res.shortUrl}`
      })
    } else {
      that.data.shareUrl = `/pages/product/product?wareId=${that.data.wareId}`
    }
  },
  onReachBottom:function(){
    //图文详情触底加载
    this.product.methods.showProductDetail();
  },
  onPageScroll:function(e){
    //监听页面滑动
    this.product.methods.pageScroll(e);
  },
  //跳转登录
  goToLogin: function (e){
    let resultObj = e.detail;
    if (resultObj.jumpWay =='navigate'){
      wx.navigateTo({
        url: resultObj.loginUrl,
      });
    } else if (resultObj.jumpWay == 'redirect'){
      wx.redirectTo({
        url: resultObj.loginUrl,
      })
    }
  },
  //去结算
  goToPay:function(e){
    wx.navigateTo({
      url: e.detail.url,
    })
  },
  //返顶处理
  toTopTap:function(){
    wx.pageScrollTo({
      scrollTop: Math.random() * 0.001,
      duration: 300
    })
  },
  //跳转购物车
  goToCart: function () {
    wx.redirectTo({
      url: '/pages/cart/cart',
    })
  },
  goToChooseAddress:function(e){
    let wareId = e.detail && e.detail.wareId ? e.detail.wareId : '';
    wx.navigateTo({
      url: `plugin-private://wx1edf489cb248852c/pages/chooseaddress/chooseaddress?wareId=${wareId}`,
    })
  },
  getProductName:function(e){
    let productName = e.detail && e.detail.productName ? e.detail.productName : '';
    this.data.productName = productName;
  },
  /**
   * [onShareAppMessage 商祥页分享]
   */
  onShareAppMessage: function (ev) {
    return {
      title: this.data.productName,
      path: this.data.shareUrl ? this.data.shareUrl : `/pages/product/product?wareId=${that.data.wareId}`,
      success: function (res) {
        log.click({
          "eid": "WProductDetail_ShareSuccess",
          "elevel": "",
          "eparam": "",
          "pname": "",
          "pparam": "",
          "target": "", //选填，点击事件目标链接，凡是能取到链接的都要上报
          "event": "" //必填，点击事件event
        });        
      }
    }
  }
})
```

Tips：跳转到商祥的链接一定要携带wareId（商品的sku），否则商祥将不展示内容

### 联盟中间页

联盟中间页当前的兜底方案是跳小程序首页，插件接入方可根据自身需求修改`proxyUnion.js`文件内的`goToIndex`方法，将其中传入的跳转链接改为自己所需的地址

### 支付回调函数

插件中提供了支付成功的和支付失败的回调函数（payment中的`paymentSuccess`和`paymentFail`），开发者可根据需求做相应的处理

## License

MIT License

Copyright (c) 2018 Kepler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
