// pages/shop/thirdTemplate/jdGrid/jdGrid.js
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
    editProperty: {
      type: Object,
      value: ''
    },
    foreach: {
      type: Object,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    skuList:[],

    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg'
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
    endIndex:'',
    position:'',
    column:'',
    cellWidth:'',
    foreachFiltered:'',
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
      var width = this.properties.styles["width"] || 0;
      var column = this.properties.styles["column"] || 1;
      var cellWidth;
      var halfWidth;
      if (width > 0) {
        halfWidth = width * this.data.winScale/2 + 'px';
        cellWidth = (width * this.data.winScale)/column + 'px';
        width = width * this.data.winScale + 'px';
      }
      if (width == '-1') {
        width = '100%'
      }
      if (width == '-2') {
        width = '100%'
      }

      var height = this.properties.styles["height"] || 0;
      if (height > 0) {
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
        halfWidth: halfWidth,
        position:position,
        column:column,
        cellWidth:cellWidth,
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
      }

      foreachFiltered.template.children = childrenFiltered;


      this.setData({
        foreachFiltered:foreachFiltered
      })

      }
    },

    _getSkuList: function () {

      var editProperty = this.properties.editProperty;
      var arrayName = this.properties.foreach["arrayName"];
      var skuList = dataPool.execStr(editProperty, arrayName) || [];

      var endIndex =  this.properties.foreach["endIndex"];
      if (this.properties.foreach["endIndex"]) {
        endIndex = this.properties.foreach["endIndex"];
      }else{
        endIndex = 100;
      }

      var skuListHttp =[]
      for (var i = skuList.length - 1; i >= 0; i--) {
        var item = skuList[i]
        if (item.imageUrl) {
          item.imageUrl = 'http:'+item.imageUrl
        }
        skuListHttp[i] = item;
      }


      this.setData({
        skuList :skuListHttp,
        endIndex:endIndex
      })

    },

    _tapGridItem:function(e){
    var index = e.currentTarget.dataset.index;
    var item = this.data.skuList[index];
    var eventDetail = {index:index,item:item};
    var myEventDetail = eventDetail; // detail对象，提供给事件监听函数
    var myEventOption =  { bubbles: false, composed: true } // 触发事件的选项
    console.log('GridParam')
    console.log(eventDetail)
    this.triggerEvent('clickFloorItem',myEventDetail,myEventOption)
    },

  }
})
