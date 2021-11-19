// pages/shop/components/collage/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataList:{
       type:Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
        getinteger:function(money){
             var a=money.split(".")[0]
             return a;
        }
  }
})
