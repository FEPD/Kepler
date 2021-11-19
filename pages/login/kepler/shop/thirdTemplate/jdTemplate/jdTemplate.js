// pages/shop/thirdTemplate/jdTemplate/jdTemplate.js
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },

    relations: {
        './jdText': {
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
        },
        './jdLine': {
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
        },
        './jdList': {
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
        },
        './jdSlider': {
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
        },
        './jdGrid': {
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
        },
        './jdContainer': {
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
        thirdTemplates: {
            type: Object,
            value: ''
        },
        floorExtInfo:{
            type:Object
        },
        isVieoShow:{
            type:Boolean
        },
        sizeRule:{
            type:String,
            value:''
        }
    },

    attached: function () {
        this._initData();

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

        _initData: function () {
            var thirdTemplates = this.properties.thirdTemplates;
            // console.log('thirdTemplates is');
            // console.log(thirdTemplates);
        },

        didClickFloorItem: function(e){

            var eventDetail = {item:e};
            var myEventDetail = eventDetail; // detail对象，提供给事件监听函数
            var myEventOption =  { bubbles: true, composed: true } // 触发事件的选项
            // console.log('templateParamClick')
            // console.log(eventDetail)
            this.triggerEvent('clickTemplateItem',myEventDetail,myEventOption)

        },
         //组件内的埋点方法
        middleClickFunc: function (e) {
            this.triggerEvent("clickFunc",e.detail);
        },
    }
})
