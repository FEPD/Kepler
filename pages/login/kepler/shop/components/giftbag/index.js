// pages/shop/components/giftbag/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        giftMsg:{
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
        closeFn:function(e){
            var myEventOption = { bubbles: false, composed: true } // 触发事件的选项
            this.triggerEvent('clickContainerClose', null, myEventOption)
        }
    }
})
