// pages/shop/thirdTemplate/jdImage/jdImage.js
var dataPool = require('../utils/dataPool.js');

Component({

    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },

    relations: {
        './jdTemplate': {
            type: 'parent', // 关联的目标节点应为子节点
            linked: function(target) {
                // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
            },
            linkChanged: function(target) {
                // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
            },
            unlinked: function(target) {
                // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
            }
        }
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
        editProperty:{
            type: Object,
            value: ''
        },
        source:{
            type: String,
            value: ''
        },
        isAbsolute:{
            type: Object,
            value: ''
        },
        events:{
            type: Object,
            value: ''
        },
        dataMap:{
            type: Object,
            value: ''
        },
    },

    /**
     * 组件的初始数据
     */
    data: {

        isCircle:'',
        radius:'',
        width: '',
        height: '',
        marginLeft: '',
        marginRight: '',
        marginTop: '',
        marginBottom: '',
        winWidth: '',
        winHeight: '',
        winScale: '',
        platform: '',
        pixelRatio: '',
        url: null,
        imageUrl:'',
        sourceData:null,
        positionAsFather:'',
        eventParam:'',
    },

    attached: function () {

        this._setSystemInfo();
        this._setLayoutStyle();
        this._getImageData();

        this._getSourceData();

        if (this.properties.events) {
            this._getEvent();
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
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
            var radius;
            var width = dataPool.execStr(this.properties.editProperty, this.properties.styles["width"]) || 0;

            if (width > 0) {
                radius = width * this.data.winScale/2 ;
                width = width * this.data.winScale + 'px';
            }
            if (width == '-1') {
                radius = 0;
                width = '100%'
            }
            if (width == '-2') {
                radius = 0;
                width = '100%'
            }

            var editProperty = this.properties.editProperty;
            var heightStyle = this.properties.styles["height"]
            var height = dataPool.execStr(editProperty, heightStyle) || 0;

            if (height > 0) {
                radius = radius < height * this.data.winScale / 2 ? radius : height * this.data.winScale;
                height = height * this.data.winScale + 'px';
            }
            if (height == '-1') {
                radius = 0
                height = '100%'
            }
            if (height == '-2') {
                radius = 0
                height = '100%'
            }

            var marginLeft = this.properties.styles["marginLeft"] || 0;
            if (marginLeft > 0) {
                marginLeft = marginLeft * this.data.winScale;
            }

            var marginTop = this.properties.styles["marginTop"] || 0;
            if (marginTop > 0) {
                marginTop = marginTop * this.data.winScale;
            }

            var marginRight = this.properties.styles["marginRight"] || 0;
            if (marginRight > 0) {
                marginRight = marginRight * this.data.winScale;
            }

            var marginBottom = this.properties.styles["marginBottom"] || 0;
            if (marginBottom > 0) {
                marginBottom = marginBottom * this.data.winScale;
            }

            var radius = height;

            var positionAsFather = 'static';
            if (this.properties.isAbsolute && this.properties.isAbsolute["layout"]) {
                positionAsFather = this.properties.isAbsolute["layout"];
            }

            this.setData({
                width: width,
                height: height,
                marginLeft: marginLeft,
                marginTop: marginTop,
                marginRight: marginRight,
                marginBottom: marginBottom,
                backgroundColor: 'green',
                radius: radius,
                positionAsFather: positionAsFather,

            })

        },

        _getImageData: function () {


            var imageUrl = dataPool.execStr(this.properties.editProperty, this.properties.urlRefer);

            if (this.properties.dataMap) {
                var mapUrl = this.properties.dataMap["url"]
                var mapValue = mapUrl["value"]
                imageUrl = dataPool.execStr(this.properties.editProperty, mapValue);
            }

            var httpUrl = 'http:'+imageUrl;

            this.setData({

                imageUrl: httpUrl
            })

        },

        _getSourceData: function () {

            var sourceData;
            if(this.properties.source){
                sourceData = dataPool.execStr(this.properties.editProperty, this.properties.source);
            }

            if (this.properties.dataMap) {
                var source = this.properties.dataMap["source"]
                var sourceValue = source ? source["value"]:"";
                sourceData = dataPool.execStr(this.properties.editProperty, sourceValue);
                // console.log(sourceData)
            }

            this.setData({

                sourceData:sourceData||''
            })

        },

        _getEvent: function () {
            var events = this.properties.events;
            var event ;
            if (events) {
                event = events[0];
            }else{
                return;
            }
            var actions = event.actions;
            var action = actions[0];
            var params = action.params;
            var param = params[0];
            var paramValue = param["paramValue"];
            var valueFilter = dataPool.execStrForSkuKey(this.properties.editProperty, paramValue);

            this.setData({
                eventParam: valueFilter
            })

        },

        _clickImage: function(e){
            var myEventDetail ={'key':this.data.eventParam} // detail对象，提供给事件监听函数
            var myEventOption = {} // 触发事件的选项
            // console.log(myEventDetail)
            this.triggerEvent('clickImage',myEventDetail,myEventOption);
        },

        _clickHotarea:function(e){
            var clickIndex = e.currentTarget.dataset.index;
            var param = this.data.sourceData[clickIndex];
            var myEventDetail = param // detail对象，提供给事件监听函数
            var myEventOption = {} // 触发事件的选项

            this.triggerEvent('clickImage',myEventDetail,myEventOption);
        },

    }
})
