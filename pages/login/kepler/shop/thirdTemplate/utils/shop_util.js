function getShopConfigure(){

  var shopKey = 'shop_beijingts';
    var obj = {
      shop_beijingts: {// 北京图书大厦旗舰店
        shopID: 120726,// 店铺id
          shopName: '北京图书大厦旗舰店',
          JDM_AppId: 'kepler-wx-wxshop-beijingts',//用于加密
          wxVersion: 'wxshop_beijingts',// 用于支付标识
        },
      shop_wfujingts: {// 王府井书店旗舰店
        shopID: 128792 ,// 店铺id
        shopName: '王府井书店旗舰店',
        JDM_AppId: 'kepler-wx-wxshop-wfujingts',//用于加密
        wxVersion: 'wxshop_wfujingts',// 用于支付标识
      },
      shop_yayunts: {// 亚运村图书大厦
        shopID: 58409 ,// 店铺id
        shopName: '亚运村图书大厦',
        JDM_AppId: 'kepler-wx-wxshop-yayunts',//用于加密
        wxVersion: 'wxshop_yayunts',// 用于支付标识
      },
      shop_zhguancts: {// 中关村图书大厦旗舰店
        shopID: 47381 ,// 店铺id
        shopName: '中关村图书大厦旗舰店',
        JDM_AppId: 'kepler-wx-wxshop-zhguancts',//用于加密
        wxVersion: 'wxshop_zhguancts',// 用于支付标识
      },
        shop_dd:{// 叮咚（DingDong）京东自营旗舰店
            shopID:1000039942,// 店铺id
            shopName:'叮咚官方旗舰店',
            JDM_AppId:'kepler-wx-wxshop-dd',//用于加密
            wxVersion:'wxshop_dd',// 用于支付标识
        },
        shop_feishi:{// 百草味京东自营旗舰店
            shopID:1000003120,// 店铺id
            shopName:'菲诗小铺官方旗舰店',
            JDM_AppId:'kepler-wx-wxshop-feishi',//用于加密
            wxVersion:'wxshop_feishi',// 用于支付标识
        },
        shop_bcw:{// 百草味京东自营旗舰店
            shopID:1000003685,// 店铺id
            shopName:'百草味京东自营旗舰店',
            JDM_AppId:'kepler-wx-wxshop-bcw',//用于加密
            wxVersion:'wxshop_bcw',// 用于支付标识
        },
        shop_lppz:{// 良品铺子京东自营旗舰店
            shopID:1000006804,// 店铺id
            shopName:'良品铺子京东自营旗舰店',
            JDM_AppId:'kepler-wx-wxshop-lppz',//用于加密
            wxVersion:'wxshop_lppz',// 用于支付标识
        },
        shop_td:{// 淘豆京东自营旗舰店
            shopID:1000073642,// 店铺id
            shopName:'淘豆京东自营旗舰店',
            JDM_AppId:'kepler-wx-wxshop-td',//用于加密
            wxVersion:'wxshop_td',// 用于支付标识
        },
        shop_ksw:{// 口水娃京东自营旗舰店
            shopID:1000007563,// 店铺id
            shopName:'口水娃京东自营旗舰店',
            JDM_AppId:'kepler-wx-wxshop-ksw',//用于加密
            wxVersion:'wxshop_ksw',// 用于支付标识
        },
        shop_Ileven:{// Ileven京东自营旗舰店
            shopID:1000078075,// 店铺id
            shopName:'ileven京东自营旗舰店',
            JDM_AppId:'kepler-wx-wxshop-Ileven',//用于加密
            wxVersion:'wxshop_Ileven',// 用于支付标识
        },
        shop_3MJS:{// 3M净水京东自营旗舰店
            shopID:1000002305,// 店铺id
            shopName:'3M净水京东自营旗舰店',
            JDM_AppId:'kepler-wx-wxshop-mjs',//用于加密
            wxVersion:'wxshop_mjs',// 用于支付标识
        },
        shop_jycf:{// 九阳厨房电器京东自营旗舰店
            shopID:1000001465,// 店铺id
            shopName:'九阳厨房电器京东自营旗舰店',
            JDM_AppId:'kepler-wx-wxshop-jycf',//用于加密
            wxVersion:'wxshop_jycf',// 用于支付标识
        },
        shop_Levis:{// Levi's 官方旗舰店	"
            shopID:68668,// 店铺id
            shopName:'Levi\'s 官方旗舰店',
            JDM_AppId:'kepler-wx-wxshop-Levi',//用于加密
            wxVersion:'wxshop_Levi',// 用于支付标识
        },
        shop_twb:{// 天王表旗舰店	"
            shopID:169763,// 店铺id 
            shopName:'天王手表旗舰店',
            JDM_AppId:'kepler-wx-wxshop-twb',//用于加密
            wxVersion:'wxshop_twb',// 用于支付标识
        },
    };

    var objC = new Object();
     objC.client = 'apple';
     objC.appClientVersion = '5.7.0';
     objC.configure = obj[shopKey];
     return objC;
}


module.exports = {
    getShopConfigure: getShopConfigure,
};