// pages/shop/components/collage/index.js
var dataPool = require('../utils/dataPool.js');
var log = require("../../shop_utils/keplerReport.js").init();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        dataList:{
            type:Array
        },
        editProperty: {
            type: Object,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
    },
    attached: function () {
    },

    /**
     * 组件的方法列表
     */
    methods: {
        jumpToFt:function(e){
            let link = e.currentTarget.dataset.link
            var skuData = '';
            var skuItem='';
            // 新增
            // item.m.jd.com/product/56756511151.html
            if(link.indexOf('item.m.jd.com') > -1){
                skuData = link.split("item.m.jd.com/product/")[1]
                skuItem = skuData.split(".html")[0]
            }else{
                skuData = link.split("?")[1];
                skuItem=skuData.split("=")[1];
            }
            var skuid = e.currentTarget.dataset.skuid;
            var num = e.currentTarget.dataset.num;
            var status = e.currentTarget.dataset.state;
            var shopid=wx.getStorageSync("shopId");
            console.log(skuItem);
            var param = {
                "eid": "Wshop_MainFloorGPurchase",
                "eparam": shopid+"_"+skuid+"_"+num+"_"+status,
                "ev": e,
                "pname": "/pages/shop/shop",
                'event_name':'店铺首页拼购楼层',
                'click_type':1
              }
              this.triggerEvent('middleClickFunc', param)
            wx.navigateTo({
                url: '../../pages/ftproduct/ftproduct?ulSkuId='+skuItem,
            })
        }

    }
})
