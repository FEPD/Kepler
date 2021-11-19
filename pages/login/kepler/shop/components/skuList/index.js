// pages/shop/components/skuList/index.js
var log = require('../../shop_utils/keplerReport.js').init();
var shopBehavior = require('../../shop_utils/shopBehavior.js');

Component({
  behaviors: [shopBehavior],
  pageLifetimes: {
      show() {
          // 页面被展示
          this.setPin(log);
      },
  },
  attached(){
      this.setLogPv(log);
  },
  /**
   * 组件的属性列表
   */
  properties: {
    promoRule: {
      type: Object,
      value: '',
      observer: function (newVal, oldVal) {

      }
    },
    promoDesc:{
      type: Object,
      value: '',
      observer: function (newVal, oldVal) {

      }
    },
    promList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
      }
    },
    skuParam: {
      type: Object,
      value: '',
      observer: function (newVal, oldVal) {

      }
    },

    skuType: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {

      }
    },
    skuList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        if(newVal&&newVal.length==0){
          return
        }
        this.dealWithData();
      }
    },
    skuCategory: {
      type: String,
      value: '',
    },
    tabName: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    promFlagArr:[94,93,98,15,10,16,19,6,3,18,23,99]//促销标签支持的类型集合
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getRootPath: function () {
      const wxCurrPage = getCurrentPages() //获取当前页面的页面栈
      if (wxCurrPage[wxCurrPage.length - 1].route) {
          let route = wxCurrPage[wxCurrPage.length - 1].route
          let routeArr = route.split('/')
          routeArr.splice(-2, 2)
          var rootPath = routeArr.join('/') + '/'
      }
      if(rootPath.indexOf('/kepler/')!=-1){//交易插件分包方式引入
        return '/pages/login/kepler/'
      }else{
        return '/pages/'
      }
  },
    dealWithData:function(){
      let that=this;
      if(that.data.skuList&&that.data.skuList.length>0){
        that.data.skuList.map(function(item){
            item.sufJDPrice = item.sufJDPrice || '00'
          if(item.promotionList&&item.promotionList.length>0){
            //档促销标签数大于两个时，只显示两个
            if(item.promotionList.length>2){
              item.promotionList=item.promotionList.slice(0,2)
            }
            //为了确定是小程序支持的促销标签，给其增加一个字段isEnableFlag来判断
            for(let i=0;i<item.promotionList.length;i++){
              item.promotionList[i].isEnableFlag=false
              if(item.promotionList[i].promFlag&&that.data.promFlagArr.indexOf(item.promotionList[i].promFlag)!=-1){
                item.promotionList[i].isEnableFlag=true
              }
            }
          }
        })
      }
      that.setData({
        skuList:that.data.skuList
      })
    },
    click: function(e){
      let pageLength = getCurrentPages().length;
      var subKey = '';
      var eid = '';
      switch (this.data.skuType) {
        case '1002':// 全部商品
          {
            eid = "KMiniAppShop_AllGoodsProductid";
            let sort = this.data.skuParam.sort;
            if (parseInt(sort)  === 0){
              subKey = '推荐';
            } else if (parseInt(sort) === 1){
              subKey = '销量';
            } else if (parseInt(sort) === 2 || parseInt(sort) === 3) {
              subKey = '价格';
            } else if (parseInt(sort) === 5) {
              subKey = '新品';
            }
          }
          break;
        case '1003':// 热销
        case '1006':// 热销
          {
            eid = "KMiniAppShop_PromotionProductid";
            subKey = '热销';
          }
          break;
        case '1004':// 促销
          {
            eid = "KMiniAppShop_PromotionProductid";
            let promoId = this.data.skuParam.promoId;
            (this.data.promList || []).map(function (item, index) {
              if (item.promoId === promoId){
                subKey = item.name;
              }
            })

          }
          break;
        case '1005':// 上新
          {
            eid = "KMiniAppShop_NewProductid";
            let date = e.currentTarget.dataset.date;
            // subKey = date&&date.replace('本店上新', '');
            subKey = "" + this.formatDateTime(e.currentTarget.dataset.date);
          }
          break;
          case '1007'://拼购
          eid ="KMiniAppShop_PingouProductid";
          break;
          case '1008'://活动tab下的促销
          eid ="KMiniAppShop_PromotionProductid";
          break;
        default:
          { }
          break;
      }

      let wareId = e.currentTarget.dataset.item.wareId;
      let index = e.currentTarget.dataset.index +1;
      let rootPath = this.getRootPath()
      if (this.data.skuType == '1008'){
        var param = {
          "eid": eid,
          "eparam":`${this.properties.tabName}_${wareId}`,
          "target":rootPath+"product/product?wareId=" + wareId,
          "ev": e
        }
        this.triggerEvent('clickFunc', param)
        if (pageLength >= 8) {
          wx.redirectTo({
            url: rootPath + "product/product?wareId=" + wareId,
          })
        } else {
          wx.navigateTo({
            url: rootPath + "product/product?wareId=" + wareId,
          })
        }
        //拼购商品特殊处理埋点和页面跳转
      }else if(this.data.skuType == '1007'){
        let ulSkuId = e.currentTarget.dataset.item.SkuInf[0].ulSkuId;
        let strPromoPrice = e.currentTarget.dataset.item.SkuInf[0].strPromoPrice;

        var param = {
          "eid": eid,
          "eparam":ulSkuId,
          "target":(strPromoPrice == -1)?("/pages/product/product?wareId=" + ulSkuId):("../ftproduct/ftproduct?ulSkuId=" + ulSkuId),
          "ev": e
        }
        this.triggerEvent('clickFunc', param)
        if(strPromoPrice == -1){
          if (pageLength >= 8) {
            wx.redirectTo({
              url: rootPath + "product/product?wareId=" + ulSkuId,
            })
          } else {
            wx.navigateTo({
              url: rootPath + "product/product?wareId=" + ulSkuId,
            })
          }

        }else{
          wx.navigateTo({
            url: rootPath + "ftproduct/ftproduct?ulSkuId=" + ulSkuId,
          })
        }

      }else{
        if(this.properties.skuCategory == 'category'){
            var param = {
              "eid": 'Kepler_Shop_Category_Product',
              "eparam":`${wx.getStorageSync('shopId')}_${Math.round(index/2)}_${index%2?1:2}_${wareId}`,
              "target": "/pages/product/product?wareId=" + wareId,
              "ev": e,
              'event_name':'商品列表',
              'click_type':1
            }
            this.triggerEvent('clickFunc', param)
        }else{
            var param = {
              "eid": eid,
              "eparam": "" + subKey + "_" + wareId,
              "target": "/pages/product/product?wareId=" + wareId,
              "ev": e,
              'event_name':'商品列表',
              'click_type':1
            }
            this.triggerEvent('clickFunc', param)
        }
        if (pageLength >= 8) {
          wx.redirectTo({
            url: rootPath + "product/product?wareId=" + wareId,
          })
        } else {
          wx.navigateTo({
            url: rootPath + "product/product?wareId=" + wareId,
          })
        }
      }
    },
    tipsClick: function () {
      if(this.data.promoRule){
        let data = this.data.promoRule;
        data.promRuleOpen = !data.promRuleOpen;
        this.setData({ promoRule: data })
      }else if(this.data.promoDesc){
        let data = this.data.promoDesc;
        data.promRuleOpen = !data.promRuleOpen;
        this.setData({ promoDesc: data })
      }

    },
    formatDateTime: function(timeStamp) {
      var date = new Date();
      date.setTime(timeStamp);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      var h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      return y + '年' + m + '月' + d + '日';
    }
  }
})

