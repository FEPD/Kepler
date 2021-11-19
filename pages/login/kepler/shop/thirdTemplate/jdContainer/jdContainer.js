// pages/shop/thirdTemplate/jdContainer/jdContainer.js
var dataPool = require('../utils/dataPool.js');
var log = require("../../shop_utils/keplerReport").init();
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
    },
    './jdImage': {
      type: 'child', // 关联的目标节点应为子节点
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
    editProperty: {
      type: Object,
      value: ''
    },
    foreach: {
      type: Object,
      value: ''
    },
    isAbsolute:{
      type: Object,
      value: ''
    },
    sizeRule:{
        type:String,
        value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

    justifyContent: null,
    lines: null,
    width: '',
    height: '',
    marginLeft: '',
    marginRight: '',
    marginTop: '',
    marginBottom: '',
     paddingLeft:'',
     paddingTop:'',
     paddingRight:'',
     paddingBottom:'',
    winWidth: '',
    winHeight: '',
    winScale: '',
    platform: '',
    pixelRatio: '',
    backgroundColor: '',
    positionAsFather:'',
    position:'',
    skuList: [],
    foreachFiltered:'',
    editProperty:'',
  },

  attached: function () {
    this._setSystemInfo();
    this._setLayoutStyle();
    this._getSkuList();
    this._FilterForEach();
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
      var width = dataPool.execStr(this.properties.editProperty, this.properties.styles["width"]) || 0;

      if (width > 0) {
        width = width * this.data.winScale + 'px';
      }
      if (width == '-1') {
        width = this.data.winWidth+'px';
        var left = dataPool.execStr(this.properties.editProperty, this.properties.styles["marginLeft"]) || 0;
        width = (this.data.winWidth - left * this.data.winScale)+'px';
      }
      if (width == '-2') {
        width = this.data.winWidth+'px';
        var left = dataPool.execStr(this.properties.editProperty, this.properties.styles["marginLeft"]) || 0;
        width = (this.data.winWidth - left * this.data.winScale)+'px';
      }

      var height = dataPool.execStr(this.properties.editProperty, this.properties.styles["height"]) || 0;
      if (height > 0) {
        height = height * this.data.winScale + 'px';
      }
      if (height == '-1') {
        height = ''
      }
      if (height == '-2') {
        height = ''
      }

      var marginLeft = dataPool.execStr(this.properties.editProperty, this.properties.styles["marginLeft"]) || 0;
      if (marginLeft > 0) {
        marginLeft = marginLeft * this.data.winScale;
      }

      var marginTop = dataPool.execStr(this.properties.editProperty, this.properties.styles["marginTop"]) || 0;
      if (marginTop > 0) {
        marginTop = marginTop * this.data.winScale;
      }
      var visible = dataPool.execStr(this.properties.editProperty, this.properties.styles["visible"]);
      if (typeof visible == 'string' &&  visible == 'false') {
        visible = false;
      }else{
        visible = true;
      }

      var marginRight = this.properties.styles["marginRight"] || 0;
      if (marginRight > 0) {
        marginRight = marginRight * this.data.winScale;
      }

      var marginBottom = this.properties.styles["marginBottom"] || 0;
      if (marginBottom > 0) {
        marginBottom = marginBottom * this.data.winScale;
      }

    var paddingLeft = this.properties.styles["paddingLeft"] || 0;
    if (paddingLeft > 0) {
      paddingLeft = paddingLeft * this.data.winScale;
    }

    var paddingTop = this.properties.styles["paddingTop"] || 0;
    if (paddingTop > 0) {
      paddingTop = paddingTop * this.data.winScale;
    }

    var paddingRight = this.properties.styles["paddingRight"] || 0;
    if (paddingRight > 0) {
      paddingRight = paddingRight * this.data.winScale;
    }

    var paddingBottom = this.properties.styles["paddingBottom"] || 0;
    if (paddingBottom > 0) {
      paddingBottom = paddingBottom * this.data.winScale;
    }

      var backgroundColor = '#ffffff' ;
      //  兼容新版热区
      // var backgroundColor = 'none' ;
      if (this.properties.styles["backgroundColor"]) {
        var styleBg = this.properties.styles["backgroundColor"];
        backgroundColor = dataPool.execStr(this.properties.editProperty, styleBg) ;
      }

    var positionAsFather = 'static';
    if (this.properties.isAbsolute && this.properties.isAbsolute["layout"]) {
       positionAsFather = this.properties.isAbsolute["layout"];
    }
    if (!positionAsFather)
    {
      positionAsFather = 'static';
    }

    var position = 'static';
    if (this.properties.styles["layout"]) {
       position = this.properties.styles["layout"];
     }

      this.setData({
        width: width,
        height: height,
        marginLeft: marginLeft,
        marginTop: marginTop,
        marginRight: marginRight,
        marginBottom: marginBottom,
        paddingLeft:paddingLeft,
        paddingTop:paddingTop,
        paddingRight:paddingRight,
        paddingBottom:paddingBottom,
        backgroundColor: backgroundColor,
        positionAsFather:positionAsFather,
        position: position,
        visible:visible
      })

    },

    _FilterForEach:function(){
      if (this.properties.foreach){

      var foreach = this.properties.foreach;
      var editProperty = this.properties.editProperty;
      var children ;
      var childrenFiltered;
      var foreachFiltered = foreach;

      if (this.properties.foreach.template.children) {
        children = this.properties.foreach.template.children;
        childrenFiltered =  dataPool.filterForEach(editProperty, children);
      }else if (foreach.template.conditions && foreach.template.conditions[0] && foreach.template.conditions[0].children) {
          children = foreach.template.conditions[0].children;
          childrenFiltered =  dataPool.filterForEach(editProperty, children);
      }

      foreachFiltered.template.children = childrenFiltered;


      this.setData({
        foreachFiltered:foreachFiltered,
        editProperty:editProperty,
      })

      }
    },

    _getSkuList: function () {

      if (!this.properties.foreach){
        return;
      }
      var editProperty = this.properties.editProperty;
      var arrayName = this.properties.foreach["arrayName"];
      var skuList = dataPool.execStr(editProperty, arrayName);

      var skuListHttp =[]
      for (var i = skuList.length - 1; i >= 0; i--) {
        var item = skuList[i]
        if (item.imageUrl) {
          item.imageUrl = 'http:'+item.imageUrl
        }
        skuListHttp[i] = item;
      }
      this.setData({
        skuList: skuListHttp
      })

    },

    _clickItem: function(e){
    var index = e.currentTarget.dataset.index;
    var item = this.data.skuList[index];
    var eventDetail = {index:index,item:item};
    var myEventDetail = eventDetail; // detail对象，提供给事件监听函数
    var myEventOption =  { bubbles: false, composed: true } // 触发事件的选项
    console.log('containerParamClick')
    console.log(eventDetail)
    var param = {
      "eid": 'Wshop_MainFloorPicture',
      "eparam":''+index,
      "ev": e,
      "pname": "/pages/shop/shop",
      'event_name':'图片热区',
      'click_type':1
    }
    this.triggerEvent('middleClickFunc', param)
    this.triggerEvent('clickContainerItem',myEventDetail,myEventOption)

    },

  }
})
