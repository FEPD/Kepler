// pages/shop/thirdTemplate/jdText/jdText.js
var dataPool = require('../utils/dataPool.js');

const GRAVITY_LEFT_TOP = 1;
const GRAVITY_CENTER_TOP = 2;
const GRAVITY_RIGHT_TOP = 3;
const GRAVITY_LEFT_CENTER = 4;
const GRAVITY_CENTER_CENTER = 5;
const GRAVITY_RIGHT_CENTER = 6;
const GRAVITY_LEFT_BOTTOM = 7;
const GRAVITY_CEITER_BOTTOM = 8;
const GRAVITY_RIGHT_BOTTOM = 9;

const LINE_TYPE_NONE = 0;
const LINE_TYPE_CENTER = 2;
const LINE_TYPE_BOTTOM = 3;

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
    title: {
      type: String,
      value: '标题'
    },
    styles: {
      type: Object,
      value: ''
    },
    editProperty: {
      type: Object,
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
     style:null,
     textDecoration: null,
     textAlign: null,
     justifyContent:null,
     lines:null,
     width:'',
     height:'',
     marginLeft:'',
     marginRight:'',
     marginTop:'',
     marginBottom:'',
     paddingLeft:'',
     paddingTop:'',
     winWidth:'',
     winHeight:'',
     winScale:'',
     platform:'',
     pixelRatio:'',
     backgroundColor:'',
     fontWeight:'',
     fontSize:'',
     lineHeight:'',
     textDecorationLine:'',
     text:null,
     visible:true,
     valueRefer:null,
     positionAsFather:'',
     eventParam:'',
  },

  attached:function() {

    this._setSystemInfo();
    this._setLayoutStyle();
    this._setTextFlexStyle();
    this._getGravityStyle();
    this._getLineNumber();
    this._getFontStyle();
    this._getLineStyle();
    this._getTextData();
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

  _setLayoutStyle:function(){
    var width = dataPool.execStr(this.properties.editProperty, this.properties.styles["width"]) || 0;
    var fontSize = this.properties.styles["fontSize"] || 0;
    var lines = this.properties.styles["lines"] || 0;
    var lineHeight= fontSize + 'px';
;

    var height = dataPool.execStr(this.properties.editProperty, this.properties.styles["height"]) || 0;

    if (height > 0) {
     if (lines > 0) {
         lineHeight = height * this.data.winScale/lines +'px';
      }

      height = height * this.data.winScale + 'px';

    }
    if (height == '-1') {
     height = '100%'
     var faHeight = this.properties.isAbsolute["height"] || 0;
     if (faHeight > 0) {
        height = faHeight * this.data.winScale +'px';
        lineHeight = faHeight * this.data.winScale +'px';
     }


    }
    if (height == '-2') {
      height = '100%';

    }

    if (width > 0) {
      width = width * this.data.winScale + 'px';
    }else if (width == '-1') {
      var left = this.properties.styles["marginLeft"] || 0;
      width = this.data.winWidth - left* this.data.winScale;
      width = width + 'px';
    }else if (width == '-2') {
      var left = this.properties.styles["marginLeft"] || 0;
      width = this.data.winWidth - left* this.data.winScale;
      width = width + 'px';
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

    var paddingLeft = this.properties.styles["paddingLeft"] || 0;
    if (paddingLeft > 0) {
      paddingLeft = paddingLeft * this.data.winScale;
    }

    var paddingTop = this.properties.styles["paddingTop"] || 0;
    if (paddingTop > 0) {
      paddingTop = paddingTop * this.data.winScale;
    }

    var positionAsFather = 'static';
    if (this.properties.isAbsolute && this.properties.isAbsolute["layout"]) {
       positionAsFather = this.properties.isAbsolute["layout"];

    }

     this.setData({
         width : width,
         height: height,
         marginLeft: marginLeft,
         marginTop: marginTop,
         marginRight: marginRight,
         marginBottom: marginBottom,
        paddingLeft:paddingLeft,
         paddingTop:paddingTop,
         backgroundColor:'',
         positionAsFather: positionAsFather,
         lineHeight:lineHeight,
     })

  },

  _setTextFlexStyle:function(){
      var justifyContent;

      let gravity = this.properties.styles["gravity"] || GRAVITY_LEFT_TOP;

      switch (Number(gravity)) {
        case GRAVITY_LEFT_TOP:
        case GRAVITY_CENTER_TOP:
        case GRAVITY_RIGHT_TOP:
          justifyContent = "flex-start";
          break;

        case GRAVITY_LEFT_CENTER:
        case GRAVITY_CENTER_CENTER:
        case GRAVITY_RIGHT_CENTER:
          justifyContent = "center";
          break;


        case GRAVITY_LEFT_BOTTOM:
        case GRAVITY_CEITER_BOTTOM:
        case GRAVITY_RIGHT_BOTTOM:
          justifyContent = "flex-end";
          break;

        default:
          justifyContent = "flex-start";
          break;
      }

      this.setData({
        justifyContent:justifyContent,
      })

  },

  _getGravityStyle:function() {
    var textAlign;

    let gravity = this.properties.styles["gravity"] || GRAVITY_LEFT_TOP;

    switch (Number(gravity)) {
      case GRAVITY_LEFT_TOP:
      case GRAVITY_LEFT_CENTER:
      case GRAVITY_LEFT_BOTTOM:
        textAlign = "left";
        break;

      case GRAVITY_CENTER_TOP:
      case GRAVITY_CENTER_CENTER:
      case GRAVITY_CEITER_BOTTOM:
        textAlign = "center";
        break;

      case GRAVITY_RIGHT_TOP:
      case GRAVITY_RIGHT_CENTER:
      case GRAVITY_RIGHT_BOTTOM:
        textAlign = "right";
        break;

      default:
        textAlign = "left";
        break;
    }

    this.setData({
      textAlign:textAlign
    })

  },

  _getLineNumber:function(){
    let lines = this.properties.styles["lines"];
    this.setData({
      lines: lines
    })
  },

  _getFontStyle:function() {
    var fontWeight ;
    let weight = this.properties.styles["fontWeight"] || 0;

     if (weight > 400) {
      fontWeight = "bold";
    } else {
      fontWeight = "normal";
    }

    this.setData({
      fontWeight : fontWeight
    })
  },

	_getLineStyle:function() {

    var textDecorationLine ;

    let lineType = this.properties.styles["lineType"] ;

    switch (Number(lineType)) {
      case LINE_TYPE_CENTER:
        textDecorationLine = "line-through";
        break;
      case LINE_TYPE_BOTTOM:
        textDecorationLine = "underline";
        break;
      default:
        textDecorationLine = "none";
        break;
    }

    this.setData({
      textDecorationLine: textDecorationLine
    })
  },

  _getTextData:function(){

    var visiStyle = this.properties.styles["visible"]
    var visible;
    if (visiStyle) {
        visible = dataPool.execStr(this.properties.editProperty, this.properties.styles["visible"]);
    }

    var valueRefer = dataPool.execStr(this.properties.editProperty, this.properties.title);

   if (this.properties.dataMap) {
        var mapUrl = this.properties.dataMap["value"]
        var mapValue = mapUrl["value"]
        valueRefer = dataPool.execStr(this.properties.editProperty, mapValue);
     }

      var editProperty = this.properties.editProperty;

      if (visible == undefined || visible == true) {
          visible = 'true'
      }else if (visible == false) {

      }


    this.setData({
      visible:visible,
      valueRefer: valueRefer
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


  _tapText:function(e){
    console.log('textClick')
    var myEventDetail = {'key':this.data.eventParam}; // detail对象，提供给事件监听函数
    var myEventOption = {}; // 触发事件的选项
    this.triggerEvent('clickTextWord',myEventDetail,myEventOption);
   },

  //  methods 结束
  }
})
