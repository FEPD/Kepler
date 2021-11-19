// pages/shop/thirdTemplate/jdSlider/jdSlider.js
var dataPool = require('../utils/dataPool.js');
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
    items: {
      type: Array,
      value: ''
    },
    editProperty: {
      type: Object,
      value: ''
    },
    foreach: {
      type: Object,
      value: ''
    },
    sizeRule:{
        type:String,
        value:''
    },
    version:{
        type:String,
        value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    slide_array:[],
    imgArray:[],

    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],

    width: '',
    height: '',
    halfWidth: '',
    marginLeft: '',
    marginRight: '',
    marginTop: '',
    marginBottom: '',
    winWidth: '',
    winHeight: '',
    winScale: '',
    platform: '',
    pixelRatio: '',
    isPointDisplay:'',

  },

  attached: function () {
    this._setSystemInfo();
    this._getSlideList();
    this._setLayoutStyle();
  },

  /**
   * 组件的方法列表
   */
  methods: {

    _setSystemInfo: function () {

      var that = this;
      /** 获取系统信息 begin*/
      wx.getSystemInfo({
        success: function (res) {
          // success
          // var winScale = (res.windowWidth / 320.0)//招牌图高度
          var winScale = (res.windowWidth / (that.properties.sizeRule||320.0))//招牌图高度,默认iphone5
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
      var width = this.properties.styles["width"] || 0;

      if (width > 0) {

        width = width * this.data.winScale + 'px';
      }
      if (width == '-1') {
        width = '100%'
      }
      if (width == '-2') {
        width = '100%'
      }

      var height = this.properties.styles["height"] || 0;
      //兼容新装修模板轮播图
      if(height == '$slide_array.[0].h'){
        height = this.data.slide_array[0].h * this.data.winScale + 'px';
      }
      else if(height > 0) {
        height = height * this.data.winScale + 'px';
      }
      else {
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

      var position = this.properties.foreach.template.style["layout"] ||
'relative';


      this.setData({
        width: width,
        height: height,
        marginLeft: marginLeft,
        marginTop: marginTop,
        marginRight: marginRight,
        marginBottom: marginBottom,
      })

    },

    _getSlideList: function () {

      var editProperty = this.properties.editProperty;
      var arrayName = this.properties.foreach["arrayName"];
      var slide_array = dataPool.execStr(editProperty, arrayName);

      var imgArray=[]
      for (var i = slide_array.length - 1; i >= 0; i--) {
        var item = slide_array[i];
        var imgUrl = 'http:'+item.imageUrl;
        imgArray[i]=imgUrl;
      }

      var isPointDisplay = this.properties.styles["isPointDisplay"];
      if(imgArray.length > 1){
        isPointDisplay = true;
      }else{
        isPointDisplay = false;
      }

      this.setData({
        slide_array: slide_array,
        imgArray: imgArray,
        isPointDisplay: isPointDisplay,
      })
    },

    _tapSlideItem:function(e){
    var index = e.currentTarget.dataset.index;
    var item = this.data.slide_array[index];
    var version = this.properties.version;
    var eventDetail = {index:index,item:item,version:version};
    var myEventDetail = eventDetail; // detail对象，提供给事件监听函数
    var myEventOption =  { bubbles: false, composed: true } // 触发事件的选项
    console.log('slideParam')
    console.log(eventDetail)
    //   新版轮播图埋点
    if(version == '2'){
        var param = {
          "eid": "Wshop_MainFloorBanner",
          "eparam":''+index,
          "ev": e,
          "pname": "/pages/shop/shop",
          'event_name':'轮播图',
          'click_type':1
        }
        this.triggerEvent('middleClickFunc', param)
    }

    this.triggerEvent('clickFloorItem',myEventDetail,myEventOption)
   },

  }
})
