var app = getApp();
Component({
    properties: {
		showAddToast: { // 弹层依赖数据
			type: Boolean,
            value: false,
            observer: function(newVal, oldVal) {
                if(newVal){
                    this.checkShowFunc()
                }
            }
        },
        //是否是webview
        isWebview:{
            type: Boolean,
            value: false,
            observer:function(newVal) {
                console.log('newVal====',newVal)
                this.setData({
                    webviewFlag:newVal
                })
            }
        },
        isHaveHeader:{
            type: Boolean,
            value: false
        },
        guideToMyListInfo: {
            type: Object,
            value: {}
        }
    },
    data : {
        showToast:false,
        webviewFlag:false,
        isIphoneX: app && app.globalData && app.globalData.isIphoneX||false,
        guideInfo: {}
    },
    attached() {
        console.log('isHaveHeader',this.data.isHaveHeader)
    },
    methods: {
        /**
         * 引导弹框展示需要的信息 init
         * name: 存到storage中的参数名，默认所有页面公用一个过期时间戳，如果想单独使用时间戳，引入组件时单独传一个name即可
         * expiredTimestamp：过期时间，ms默认7天内只展示一次
         * text: 弹框内展示文案
         */
        initGuideInfo: function () {
            let { 
                name = 'addShowTime',
                expiredTimestamp = 7*24*3600*1000,
                text = '微信首页下拉即可快速访问店铺',
             } = this.data.guideToMyListInfo
            this.setData({
                guideInfo: { name, expiredTimestamp, text }
            })
        },
        //弹框的展示逻辑
        checkShowFunc:function(){
            this.initGuideInfo()
            let { name, expiredTimestamp } = this.data.guideInfo
            //店铺，门店通首页，和jshopH5页面只能展示一次，其中一个页面展示过了，其它页面就不再展示了，长时间未展示比如七天，则会再次显示
            const lastShowTime=wx.getStorageSync(name)||'';
            const nowTimestamp=Date.now();
            if(lastShowTime){
                if(nowTimestamp-lastShowTime>=expiredTimestamp){
                    wx.removeStorageSync(name)
                    wx.setStorageSync(name,nowTimestamp)
                    console.log('过期了，可以重新展示了')
                    this.showAddToast();
                }else{
                    this.data.showAddToast=false
                    console.log('未过期，不展示')
                }
            }else{
                console.log('第一次展示，没缓存')
                wx.setStorageSync(name,nowTimestamp)
                this.showAddToast();
                
            }
        },
        showAddToast:function(){
            this.setData({
                showToast:true
            })
            this.triggerEvent('toastShowExFunc')
            setTimeout(()=>{
                console.log('关闭弹窗+++++++++++======')
                this.setData({
                    showToast:false,
                    showAddToast:false
                })
            },8000)
        },
        //关闭弹框
        closeAddToast:function(){
            this.setData({
                showToast:false,
                showAddToast:false
            })
            this.triggerEvent('closeToast')
        }
    }
})
