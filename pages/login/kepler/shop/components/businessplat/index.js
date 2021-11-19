// pages/shop/components/floatImage/index.js
const app = getApp();
var log = require("../../shop_utils/keplerReport.js").init();
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
     * 组件的属性列表oo
     */
    properties: {
        PendantParam: {
            type: Object
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        top: app.globalData.systemInfo.windowHeight - 146,
        left: app.globalData.systemInfo.windowWidth - 74,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        jumpToOther: function (e) {
            let id = e.currentTarget.dataset.id;
            //埋点
            var param = {
                "eid": 'WPendantScreen_PContent',
                "eparam": id,
                "pname":"/pages/activityH5/activityH5",
                "ev": e,
                "event_name": "挂件",
                "click_type": 1,
            }
            this.triggerEvent('clickFunc', param)
        },
        jumpToPage: function (e) {
            console.log(e.target.dataset);
            let link = e.target.dataset.path;
            let id = e.target.dataset.id;
            //埋点
            var param = {
                "eid": 'WPendantScreen_PContent',
                "eparam": id,
                "pname":"/pages/activityH5/activityH5",
                "ev": e,
                "event_name": "挂件",
                "click_type": 1,
            }
            this.triggerEvent('clickFunc', param)
            link = /^\//.test(link)?link:('/'+link)
            if(app.globalData.tabBarPathArr.indexOf(link)>-1){
                wx.switchTab({
                    url:  link,
                })
            } else {
                wx.navigateTo({
                    url: link,
                })
            }
        },
        jumpClick: function (e) {
            let type = e.target.dataset.type;
            let link = e.target.dataset.link;
            let id = e.target.dataset.id;
            //埋点
            var param = {
                "eid": 'WPendantScreen_PContent',
                "eparam": id,
                "pname":"/pages/activityH5/activityH5",
                "ev": e,
                "event_name": "挂件",
                "click_type": 1,
            }
            this.triggerEvent('clickFunc', param)
            switch (type) {
                case "1":
                    //砍价活动
                    wx.navigateTo({
                        url: '../../pages/activityH5/activityH5?mcURL=' + encodeURIComponent(link),
                    })
                    break;
                //福袋活动
                case "2":
                    wx.navigateTo({
                        url: '../events/fudai/index/index?cubeId=' + parseInt(link),
                    })
                    break;
                case "3":
                    //jshop或者通天塔
                    wx.navigateTo({
                        url: '../../pages/activityH5/activityH5?kActUrl=' + decodeURIComponent(link),
                    })
                    break;
                default:
                    break;
            }

        }

    }
})
