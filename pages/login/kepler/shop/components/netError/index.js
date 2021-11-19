var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

    
    netState: {
      type: Number,
      value: 0,
      observer: function (newVal, oldVal) {

        console.log('netError')
        console.log(newVal)
      }
    },


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

    onReachBottom: function(){
      console.log('重新加载');
      this.triggerEvent('reloadevent')
    }

  }
})
