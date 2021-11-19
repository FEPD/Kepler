// pages/shop/thirdTemplate/jdLine/jdLine.js
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
  },

  /**
   * 组件的初始数据
   */
  data: {
     width:'',
     height:'',
     marginLeft:'',
     marginRight:'',
     marginTop:'',
     marginBottom:'',
     winWidth:'',
     winHeight:'',
     winScale:'',
     platform:'',
     pixelRatio:'',
     backgroundColor:'',
  },

    attached:function() {

    this._setSystemInfo();
    this._setLayoutStyle();

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

    if (width > 0) {
      width = width * this.data.winScale + 'px';
    }
    if (width == '-1') {
      width = height
    }
    if (width == '-2') {
      width = height
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

 

     this.setData({
         width : width,
         height: height,
         marginLeft: marginLeft,
         marginTop: marginTop,
         marginRight: marginRight,
         marginBottom: marginBottom,
         
         
     })

  },

  }
})
