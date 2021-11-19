// pages/shop/thirdTemplate/jdVideo/jdVideo.js
var dataPool = require('../utils/dataPool.js');
var log = require("../../shop_utils/keplerReport").init();
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     */
    properties: {
        styles: {
            type: Object,
            value: ''
        },
        urlRefer: {
            type: String,
            value: ''
        },
        editProperty: {
            type: Object,
            value: ''
        },
        isVieoShow:{
            type:Boolean
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        videoData:'',
        winWidth:'',
        winHeight: '',
        winScale: '',
        platform: '',
        pixelRatio: '',
        marginTop: '',
        marginBottom: '',
    },

    attached: function () {
        this._setSystemInfo();
        this._setLayoutStyle();
        this._getVideoData();
        this.videoContext = wx.createVideoContext('myVideo')
    },

    /**
     * 组件的方法列表
     */
    methods: {
        _getVideoData: function () {

            var videoData;
            if (this.properties.editProperty) {
                videoData = this.properties.editProperty[0].nodeText;
            }
            console.log(videoData)
            this.setData({
                videoData: videoData
            })
        },
        onPlay:function(e){
            var shopid = wx.getStorageSync("shopId");
            var videoId = e.currentTarget.dataset.videoid;
            this.setData({
                isVieoShow:true
            })
            var param = {
                "eid": "Wshop_MainFloorMBrowse",
                "eparam": shopid + "_" + videoId,
                "ev": e,
                "pname": "/pages/shop/shop",
                'event_name':'店铺首页视频楼层',
                'click_type':1
              }
              this.triggerEvent('middleClickFunc', param)
            //自动播放
            this.videoContext.play();
        },
        _setSystemInfo:function(){
            var that = this;
            /** 获取系统信息 begin*/
            wx.getSystemInfo({
                success: function (res) {
                    // success
                    var winScale = (res.windowWidth / 320.0)//招牌图高度
                    var platform = res.platform
                    var pixelRatio = res.pixelRatio;

                    that.setData({
                        winWidth: res.windowWidth,
                        winHeight: res.windowHeight,
                        winScale: winScale,
                        platform: res.platform,
                        pixelRatio: pixelRatio,
                    });
                }
            });
        },
        _setLayoutStyle: function () {
            var marginTop = this.properties.styles["marginTop"] || 0;
            if (marginTop > 0) {
                marginTop = marginTop * this.data.winScale;
            }

            var marginBottom = this.properties.styles["marginBottom"] || 0;
            if (marginBottom > 0) {
                marginBottom = marginBottom * this.data.winScale;
            }

            this.setData({
                marginTop: marginTop,
                marginBottom: marginBottom,
            })

        },

    }
})
