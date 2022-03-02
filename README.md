# 京东微信小程序交易流程插件使用Demo - 京东好物街

## 简介
  
京东交易流程插件，通过插件可实现京东商品的小程序内闭环购买。

## 插件申请使用地址

[申请地址](https://mp.weixin.qq.com/wxopen/pluginbasicprofile?action=intro&appid=wx1edf489cb248852c&token=&lang=zh_CN)

## 标准版（适用于所有接入者）
> 1. 自助申请小程序专属开普勒appkey [http://k.jd.com/](http://k.jd.com/)  
> 2. 微信公众平台申请使用好物街插件的权限  
> 3. ERP流程中心提交小程序备案申请，并督促通过（备案地址：ERP流程中心→流程申请→运营流程→京东移动应用备案申请）（京东外部接入者可忽略）  

## 扩展版(适用于京东内部接入者，京东外部接入者如有需求可联系我们）
> 1. 自助申请小程序专属开普勒appkey [http://k.jd.com/](http://k.jd.com/)  
> 2. 创建阿波罗应用[http://apl.jd.com/](http://apl.jd.com/)  ，获取阿波罗appid、appSecret，进入阿波罗后台，配置楼层  
> 3. ERP流程中心提交小程序备案申请，并督促通过（备案地址：ERP流程中心→流程申请→运营流程→京东移动应用备案申请）  
> 4. 微信公众平台申请使用好物街插件的权限  
> 5. 在微信小程序app.js的globalData中配置apolloId、apolloSecret信息接入插件

## 具体使用方法
 
### app.json
```
{
    "pages": [
        "pages/index/index",
        "pages/cart/cart",
        "pages/order/order"
    ],
    "permission": {
        "scope.userLocation": {
            "desc": "你的位置信息将用于小程序位置接口的效果展示"
        }
    },
    "subPackages": [{
            "root": "pages/login/",
            "pages": [
                "index/index",
                "web-view/web-view",
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
        },
        {
            "root": "pages/product",
            "pages": ["product"]
        },
        {
            "root": "pages/orderDetail",
            "pages": ["orderDetail"]
        },
        {
          "root": "pages/orderEvaluate",
          "pages": [
            "orderEvaluate"
          ]
        },
        {
          "root": "pages/orderEvaluateWebview",
          "pages": [
            "orderEvaluateWebview"
          ]
        },
        {
            "root": "pages/payment",
            "pages": ["payment"]
        },
        {
            "root": "pages/getCoupon",
            "pages": ["getCoupon"]
        },
        {
            "root": "pages/proxyUnion",
            "pages": ["proxyUnion"]
        },
        {
            "root": "pages/venderListH5",
            "pages": [ "venderListH5"]
        },
        {
            "root": "pages/vdistribution/",
            "pages": ["vdistribution"]
        },
        {
            "root": "pages/vstoreh5/",
            "pages": ["vstoreh5"]
        },
        {
            "root": "pages/guideAddress/",
            "pages": ["guideAddress"]
        }

    ],
    "plugins": {
        "myPlugin": {
            "version": "1.1.0",
            "provider": "wx1edf489cb248852c"
        },
        "loginPlugin": {
            "version": "1.2.0",
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
1. **index为demo演示首页，实际开发时请替换成开发者自己的首页。**  
2. plugins中myPlugin的版本号（version）改成对应的插件版本号即可。

### app.js
```
var myPluginInterface = requirePlugin('myPlugin');
App({
  onLaunch: function(options) {
    myPluginInterface.initStyle({})
  },
  onShow: function(options) {
    myPluginInterface.appShow(options, this);
  },
  globalData: {
    unionId: "1000072052", //联盟ID（选填）
    appkey: "wxgdtest", //小程序跟单标识（必填）
    customerinfo: "customerinfo_test", //渠道来源（选填）
    sendpay: "3", //导购小程序sendpay传1，事业部小程序sendpay传3。（必填）
    mpAppid: "wx1edf489cb248852c", //小程序appid（必填）
    pluginAppid: "wx1edf489cb248852c", //插件appid（必填）
    tabBarPathArr: ['/pages/index/index','/pages/cart/cart','pages/order/order'],//tabBar页面路径，有tabBar页面则传相应路径，没有传空数组即可（登录跳转需要）
    apolloId: 'd1543fc0e8274901be01a9d9fcfbf76e', (必填)  //阿波罗Id，标准版使用此默认值，扩展版使用申请好的阿波罗appid
    apolloSecret: '162f0903a33a445db6af0461c63c6a3b',(必填)  //阿波罗Secret, 标准版使用此默认值，扩展版使用申请好的阿波罗appSecret
    heildCart: 2,    //是否隐藏购物车以及加购按钮 1为隐藏
    noshowCustomerService: '0', //是否展示客服入口 1为隐藏(选填)
    logPluginName: "", // 引入的埋点插件名称(app.json内plugins引入的埋点插件)，默认值为''。引入埋点插件，可以使宿主小程序、交易插件统一标识(uuid)
    isPrivate: '', // 1-需要进行私域化。若要进行店铺过滤，isPrivate和shopIds字段必须都有值才能生效。
    shopIds: '', // 本期支持单个店铺过滤；保留当前传入shopid的商品，且屏蔽此外的其他店铺商品（若配置isPrivate=1但不配置shopIds 视为不进行私域化）
    livestreamBusinessId: '',  //直播专享价渠道ID（选填）
    errorPage: '', // 接入联盟必传，联盟错误兜底页路径，格式：/pages/**/**；使用场景：联盟逻辑时跳转的错误兜底页
  },
  globalRequestUrl: 'https://wxapp.m.jd.com', //插件request域名（必填）
  tabBar: {
    "color": "#2E2D2D",
    "selectedColor": "#E2231A",
    "backgroundColor": "#ffffff",
    "borderStyle": "black",
    "selectIndex":0,
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "https://newbuz.360buyimg.com/jdk/homeOff.png",
        "selectedIconPath": "https://newbuz.360buyimg.com/jdk/homeOn.png"
      },
      {
        "pagePath": "pages/cart/cart",
        "text": "购物车",
        "iconPath": "https://newbuz.360buyimg.com/jdk/cartOff.png",
        "selectedIconPath": "https://newbuz.360buyimg.com/jdk/cartOn.png"
      },
      {
        "pagePath": "pages/order/order",
        "text": "我的订单",
        "iconPath": "https://newbuz.360buyimg.com/jdk/personalOff.png",
        "selectedIconPath": "https://newbuz.360buyimg.com/jdk/personalOn.png"
      }
    ],
    "position": "bottom"
  }
})
```

Tips:  
1. globalData内的参数需要修改成插件调用方自己的，每个参数说明见下方**相关配置globalData**  
2. 该tabBar为我们自己写的自定义组件，非微信原生tabBar,跳转方式需要使用**wx.reLaunch**方式跳转


#### tabBar
1.在app.js里的tabbar对象里进行配置，可配参数见名直译
2.再所需页面引入以及传参规则
### 在所需页面的WXML中引入插件
```
<jdk-tabbar tabBar="{{tabbarConfig}}" logSet="{{logSet}}" bind:tabBarClick="tabBarClick"></jdk-tabbar>

```
### 在所需页面的js中 完整代码块
```
const app = getApp();
Page({
  data: {
    logSet:{
      urlParam:'',
      title: '首页', //网页标题
      siteId: 'WXAPP-JA2016-1', //开普勒小程序固定用：WXAPP-JA2016-1
      pageId: 'Wpersonal_index',
      pparam: '1'
  }
  },
  onLoad: function (options) {
    this.setData({
      tabbarConfig:app.tabBar,
      'logSet.urlParam':options
    })
  },
  tabBarClick:function(e){
    this.setData({
      "tabbarConfig.selectIndex":e.detail.index
    })
    if(e.detail.path!='pages/index/index'){
      wx.reLaunch({
        url: '/'+e.detail.path,
      })
    }

  }
})

tips：data里的logSet对象是埋点所需字段
```
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
| heildCart              | Number    | 否        |           |是否隐藏购物车以及加购按钮，1为隐藏                    
| tabBarPathArr          | Array     | 是        |           |tabBar页面路径，有tabBar页面则传相应路径，没有传空数组即可（登录跳转需要） |
| apolloId          	  | String     | 是        |           |阿波罗Id，标准版使用默认值d1543fc0e8274901be01a9d9fcfbf76e，扩展版使用申请好的阿波罗appid|
| apolloSecret           | String     | 是        |           |阿波罗Secret, 标准版使用默认值162f0903a33a445db6af0461c63c6a3b，扩展版使用申请好的阿波罗appSecret
| heildCart              | String     | 否        |           |是否隐藏购物车以及加购按钮 1为隐藏
| noshowCustomerService  | String     | 否        |           |是否展示客服入口 1为隐藏
| logPluginName          | String     | 否        |     ''    |引入的埋点插件名称(app.json内plugins引入的埋点插件), 引入埋点插件，可以使宿主小程序、交易插件统一标识(uuid)
| isPrivate              | String     | 否        |           | 1-需要进行私域化。若要进行店铺过滤，isPrivate和shopIds字段必须都有值才能生效。
| shopIds                | String     | 否        |           | 本期支持单个店铺过滤；保留当前传入shopid的商品，且屏蔽此外的其他店铺商品（若配置isPrivate=1但不配置shopIds 视为不进行私域化）
| livestreamBusinessId   | String     | 否        |           | 直播专享价渠道ID
| errorPage   | String     | 否        |           | 接入联盟必传，联盟错误兜底页路径，格式：/pages/**/**；使用场景：联盟逻辑时跳转的错误兜底页

### 页面修改配置文件JSON
以商品详情页为例
```
{
  "navigationBarTitleText": "商品详情",
  "enablePullDownRefresh": false,
  "usingComponents": {
    "jdk-product": "plugin://myPlugin/jdk-product"
  }
}
```
### 在页面的WXML中添加标签
```
<jdk-product wx:if="{{options}}" options="{{options}}" isTemplate="{{false}}" ></jdk-product>
<!-- 置顶按钮，放置在主页面，因为要监听页面滚动事件 -->
<view class="bottom-to-top {{isIphoneX? 'bottom-to-top-iphonex': ''}}" style="display:{{toTopDisplay}}" bindtap="toTopTap"></view>
```
### 页面JS文件中处理
```
var plugin = requirePlugin("myPlugin");
const util = require('../utils/util.js');
let app = getApp();
Page({
  data:{
    option:{
      apolloId: app.globalData.apolloId ? app.globalData.apolloId : 'd1543fc0e8274901be01a9d9fcfbf76e',       //阿波罗Id
      apolloSecret: app.globalData.apolloSecret ? app.globalData.apolloSecret :'162f0903a33a445db6af0461c63c6a3b',   //阿波罗secret
      moudleId: "product"                               //标识阿波罗组件加载商祥页
    },
    refreshCount:0,     // 避免进来onload和onShow同时多余请求
    scrollTop: 0,        //滚动距离
    pageStyle: 'position: relative',
    wrapStyle: '',
    toTopDisplay: 'none',    // 是否展示回到顶部按钮
    screenHeight:0,         // 屏幕高度
    rootPath:'' //全局根目录
  },
  onLoad: function(options) {
    const that = this;
    if (plugin && options.isLocGuider == '1') {
      plugin.setStorageSync('isLocGuider', true);
    }
    options = plugin ? plugin.initItemOptions(options) : options;
    const curPages = getCurrentPages();
    this.pageIndex = curPages.length;
    const pageStackLists = that.setBasicInfo()
    this.setData({
      isIphoneX: !!((app && app.globalData && app.globalData.isIphoneX) || (plugin.getStorageSync('isIphoneX'))),
      options: Object.assign({}, this.data.option, {
        wareId: options.wareId,
        skuId: options.wareId,
        pageParams: options,
        pageIndex: curPages.length,
        wxCurrPage: pageStackLists
      })
    })
    this.updateShareurl(options.wareId)
    util.checkVersion()
    plugin.emitter.on('goPage' + this.pageIndex, this.goPage.bind(this));
    plugin.emitter.on('scrollToPostion' + this.pageIndex, this.scrollToPostion.bind(this))
    plugin.emitter.on('getScrollTop' + this.pageIndex, this.getScrollTop.bind(this))
    plugin.emitter.on('updateSkuId' + this.pageIndex, this.updateSkuId.bind(this))
    this.data.refreshCount++;
  },
  onUnload () {
    // 页面卸载时，注销发布事件
    plugin.emitter.off('goPage' + this.pageIndex);
    plugin.emitter.off('scrollToPostion' + this.pageIndex)
    plugin.emitter.off("getScrollTop" + this.pageIndex);
    plugin.emitter.off('updateSkuId' + this.pageIndex)
  },
  onShow:function(){
    const that = this;
    that.getRootPath();//获取全局根目录
    // 存储当前用户所在位置经纬度
    this.getUserAuthSetting();
  },
  getScrollTop() {
    return this.data.scrollTop
  },
  // 切换商祥skuId
  updateSkuId (skuId) {
    this.updateShareurl(skuId)
    this.setData({
      options: Object.assign({}, this.data.options, {
        wareId: skuId,
        skuId: skuId,
      })
    })
  },
  // 更新shareurl
  updateShareurl (skuId) {
    const that = this;
    skuId = skuId || that.data.options.skuId
    // 设置分享链接，增加分佣spreadUrl
    const app = getApp();
    const unionId = (app && app.globalData && app.globalData.unionId) || ''
    that.data.shareUrl = ''
    if (unionId) {
      plugin.getSpreadUrl(skuId, unionId).then((res)=>{
        that.data.shareUrl = `spreadUrl=${res.shortUrl}`
      }, (res)=> {})
    }
  },
  // 触底函数
  onReachBottom:function(e){
    plugin.emitter.emit('reachBottom' + this.pageIndex, e)
    //图文详情触底加载
    // this.product.methods.showProductDetail();
  },
  // 动态控制滚动条
  scrollToPostion ({ type, top, duration }) {
    const pageScroll = {
      scrollTop: this.data.scrollTop + 50,
      duration: 200
    }
    if (type === 1) {
      pageScroll.scrollTop = top
      pageScroll.duration = duration || 0
    }
    wx.pageScrollTo(pageScroll)
  },
  // 监听页面滚动
  onPageScroll:function(e){
    this.data.scrollTop = e.scrollTop;
    if (e.scrollTop > this.data.screenHeight) {
      if (this.data.toTopDisplay == 'none') {
        this.setData({
          toTopDisplay: "block"
        })
      }
    } else {
      if (this.data.toTopDisplay == 'block') {
        this.setData({
          toTopDisplay: "none"
        })
      }
    }
  },
  //返顶处理
  toTopTap:function(e){
    wx.pageScrollTo({
      scrollTop: Math.random() * 0.001,
      duration: 300
    })
    plugin.emitter.emit('buryingPoint' + this.pageIndex, 'click', {
      "eid": "WProductDetail_BackTop",
      "pparam": this.data.options.skuId+ '_1',
      "target": "", //选填，点击事件目标链接，凡是能取到链接的都要上报
      "event": e //必填，点击事件event            
    })
  },
  getRootPath: function () {
    const wxCurrPage = getCurrentPages();//获取当前页面的页面栈
    if (wxCurrPage[wxCurrPage.length - 1].route) {
      this.data.rootPath = wxCurrPage[wxCurrPage.length - 1].route;
    }
  },
  // 存储当前用户所在位置的经纬度
  getUserAuthSetting: function () {
    let that = this;
    wx.getSetting({
      success (res) {
        if (res && res.authSetting && res.authSetting && res.authSetting['scope.userLocation']) {
          plugin.saveLngLat()
        } else {
            // 如果用户未授权，清楚缓存中的经纬度
            let _lng = that.data.options && that.data.options.pageParams && that.data.options.pageParams.lng;
            let _lat = that.data.options && that.data.options.pageParams && that.data.options.pageParams.lat;
            if (_lng && _lat) {
              plugin.setStorageSync('user_lng', _lng)
              plugin.setStorageSync('user_lat', _lat)
            } else {
              plugin.removeStorageSync('user_lng')
              plugin.removeStorageSync('user_lat')
            }
        }
      }
    })
  },
  setBasicInfo() {
    const that = this;
    // 获取可视区域
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      },
    });
    let pageStackLists = []
    const wxCurrPage = getCurrentPages();//获取当前页面的页面栈
    wxCurrPage.forEach(item => {
      pageStackLists.push({
        route: item && item.route
      })
    })
    return pageStackLists
  },
  /**
   * [onShareAppMessage 商祥页分享]
   */
  onShareAppMessage: function (ev) {
    plugin.emitter.emit('buryingPoint' + this.pageIndex, 'click', {
      eid: 'WProductDetail_ShareSuccess',
      event: ev //必填，点击事件event            
    })
    // 如果是导购员，分享链接拼接经纬度信息
    let _sharePath = `/${this.data.rootPath}?wareId=${this.data.options.skuId}`
    _sharePath = this.data.shareUrl ? `${_sharePath}&${this.data.shareUrl}` : _sharePath
    const res = plugin.emitter.emit("onShareAppMessageFn" + this.pageIndex, ev, _sharePath);
    return res;
  },
  /**
     * [goPage description]
     * @param  {[type]} pageInfo [description]
     * @param  {[type]} jumpMode [跳转方式：navigateTo，navigateBack， redirectTo]
     * @param  {[type]} url [条状路径]
     * @return {[type]}          [description]
     */
  goPage(pageInfo) {
    if (!pageInfo || !pageInfo.jumpMode || !pageInfo.url) {
      return;
    }
    wx[pageInfo.jumpMode]({
      url: pageInfo.url,
      success() {},
      fail(err) {
        console.log(err);
      },
    });
  },
})
```
Tips：跳转到商祥的链接一定要携带wareId（商品的sku），否则商祥将不展示内容
### 联盟中间页
联盟中间页当前的兜底方案是跳小程序首页，插件接入方可根据自身需求修改`proxyUnion/config.js`文件内的`handleError`方法，将其中传入的跳转链接改为自己所需的地址。也可以修改`app.js`文件内的`errorPage`字段
### 支付回调函数
插件中提供了支付成功的和支付失败的回调函数（payment中的`paymentSuccess`和`paymentFail`），开发者可根据需求做相应的处理
### Other
其他页面调用代码见demo:
[https://github.com/FEPD/Kepler](https://github.com/FEPD/Kepler)

### 常见问题
##### 1. 支持的tabbar两种方式：
###### 方式一： 微信小程序原生tabbar, 接入方法见微信小程序官方文档
另外需要更改几项插件内的配置：
  1. 在app.js文件中配置 globalData.tabBarPathArr
  2. 在app.js文件中配置的tabBar数组列表，将其删除
  3. 在tab页面引入jdk-tabbar组件，将其从宿主页面内删除
###### 方式二： 接入交易插件提供的tabBar组件<font color="#f00">（demo默认接入方式）</font>
步骤：
  1. 在app.js文件中配置 globalData.tabBarPathArr
  2. 在app.js文件中配置 tabBar 数组列表
  3. 在tab页面引入jdk-tabbar组件，接入试例可查看提供的接入demo中的/pages/cart/cart.wxml，从页面引入jdk-tabbar组件