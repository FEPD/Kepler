
Component({
   /**
   * 组件的属性列表
   */
  properties: {
    skuInfo: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        if (!newVal) {
          return;
        }
        if(newVal.currentTime){
          this.data.currentTime=newVal.currentTime
        }
        this.intData();
      }
    },
    secList: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        if (!newVal) {
          return;
        }
        if(newVal.currentTime){
          this.data.currentTime=newVal.currentTime
        }
        this.initSecList();
      }
    },
    skuType: {
      type: String,
      value: "",
      observer: function (newVal, oldVal) {
        if (!newVal) {
          return false
        }
        this.setData({
          skuType:newVal
        })
      }
    },
    moduleType: {
      type: String,
      value: "",
      observer: function (newVal, oldVal) {
        if (!newVal) {
          return false
        }
        this.setData({
          moduleType:newVal
        })
      }
    },
  },
  lifetimes:{
    attached:function(){
      this.triggerEvent('refresh');
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
      if (this.data.countDownTimer) {
        clearInterval(this.data.countDownTimer);
        this.data.countDownTimer = '';
      }
    },
  },
  pageLifetimes: {
    hide:function(){
      // 在组件实例被从页面节点树移除时执行
      if (this.data.countDownTimer) {
        clearInterval(this.data.countDownTimer);
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    imgListWidth: 0,
    commodityInfo:{},
    moreInfo:false,
    skuList:[],
    countDownTimer: '',
    skuType:'',
    firstLoad:false,
    seckillList:[],
    timeList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //秒杀和闪购tab的数据初始化方法
    intData:function(){
      let that=this;
      let total=this.properties.skuInfo.total?this.properties.skuInfo.total:0;
      let skuList=this.properties.skuInfo.data?this.properties.skuInfo.data:[];
      let imgListWidth=0;
      let length=0;
      let moreInfo=false;//是否显示查看更多按钮
      //这一步是因为total的数据有可能是大于实际下发的商品个数的，因为有的下架和过期的被屏蔽掉了
      if(skuList.length<total){
        length=skuList.length
      }else{
        length=total
      }
      if(length<=10){
        imgListWidth = (length * 280+68) + 'rpx';
      }else{
        imgListWidth = (10 * 280+99) + 'rpx';
        skuList=skuList.slice(0,10);
        moreInfo=true;        
      }
      if(length===1){
        that.setData({
          commodityInfo:skuList[0]
        })
      }else{
        that.setData({
          skuList:skuList,
          imgListWidth:imgListWidth,
          moreInfo:moreInfo
        })
      }
      that.countDown(skuList);
    },
    //秒杀和数据列表页的数据初始化方法
    initSecList:function(){
      let that=this;
      let secList=this.properties.secList.data?this.properties.secList.data:[];
      that.setData({
        skuList:secList
      })
      that.countDown(secList);
    },
    //点击查看更多的跳转方法
    checkMoreInfo: function(){
      wx.navigateTo({
        url: "./shopSecKill/shopSecKill?type=" + this.data.skuType,
      })
    },
    //秒杀和闪购tab滑动到最右边的时候触发的方法，大于10个才会跳转落地页
    goCheckMore:function(){
      if(!this.data.moreInfo){
        return
      }
      this.checkMoreInfo();
    },
    /**
	 * [countDown 倒计时]
	 * @param  {[type]} remainTime [时间]
	 * @return {[type]}            []
	 */
    countDown: function(list) {
      let that=this;
      if (!list||!list.length) {
          return false;
      }
      list.map(function (item, index) {
          that.initListInfo(item)
      })
      //将时间单拿出来作倒计时，而不是整个list都隔一秒渲染一下，防止卡顿，优化性能。
      let timeList=list.map(item => {
        return {
          startTime:item.startTime,
          endTime:item.endTime
        }
      })
      timeList.map(function (item, index) {
        that.initRemainTime(item)
      })
      that.setData({timeList})
      if (this.data.countDownTimer != '') {
        clearInterval(this.data.countDownTimer)
        this.data.countDownTimer = ''
      }
      if(list.length>1){
        //初始化使用
        that.setData({
          skuList:list
        })
      }else if(list.length==1){
        //初始化
        that.setData({
          commodityInfo:list[0]
        })
      }
      //倒计时
      that.data.countDownTimer = setInterval(function () {
        timeList.map(function (item, index) {
            that.countDownItem(item)
        })
        that.setData({
          timeList:timeList
        })
      },1000)
    },
    //单个商品的倒计时方法
    countDownItem: function(item){
      let that=this;
      let seconds = parseInt(item.remainTime);
      if(seconds>0){
        if (seconds === 1) {
          if(item.msState==='未开始'){
            item.msState='进行中';
            item.remainTime=that.getRemainTime(item);
            let seconds = parseInt(item.remainTime);
            item.countTimeObj = that.formatSeconds(seconds);
            return item;
          }else if(item.msState==='进行中'){
            seconds--;
            item.msState='已结束';
            item.countTimeObj = that.formatSeconds(seconds);
            return item;
          }
        }else{
          seconds--;
          item.countTimeObj = that.formatSeconds(seconds);
          item.remainTime = seconds;
          return item;
        }
      }
    },
    initListInfo:function(item){
      this.formatJDPrice(item);
    },
    //格式化价格
    formatJDPrice:function (item) {
      let that=this;
      if (that.checkPrice(item.miaoShaPrice)) {
          item.preMSPrice = item && item.miaoShaPrice && item.miaoShaPrice.toString().split(".")[0];
          item.sufMSPrice = item && item.miaoShaPrice && item.miaoShaPrice.toString().split(".")[1]||'00';
      } else if(that.checkPrice(item.redPrice)){
          item.preMSPrice = item && item.redPrice && item.redPrice.toString().split(".")[0];
          item.sufMSPrice = item && item.redPrice && item.redPrice.toString().split(".")[1]||'00';
      }else {
          item.isMSPrice = item && item.miaoShaPrice && false;
      }

      return item;
    },
    //格式校验
    checkPrice:function (me) {
      if ((/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(me))) {
          return true;
      }
          return false;
    },
    //初始化倒计时时间，商品的状态
    initRemainTime:function(item) {
      // let currentTimeStr=new Date().getTime()
       let startDateStr=item.startTime
       let endDateStr=item.endTime
       var totalSeconds=0
       // 开始时间
       var startTime = new Date(startDateStr.replace(/-/g,"/"));
       // 结束时间
       var endTime = new Date(endDateStr.replace(/-/g,"/"));
       // 当前服务器时间
       var currentTime = this.data.currentTime;
       if(currentTime>=startTime&&currentTime<endTime){
           //秒杀进行中
           item.msState='进行中'
           totalSeconds=parseInt((endTime - currentTime) / 1000);
       }else if(currentTime<startTime){
           //未开始
           item.msState='未开始'
           totalSeconds=parseInt((startTime - currentTime) / 1000);
       }else if(currentTime>=endTime){
           //已结束
           item.msState='已结束'
       }
       item.remainTime=totalSeconds;
       item.countTimeObj = this.formatSeconds(totalSeconds);
       return item;
    },
    //获取倒计时时间
    getRemainTime:function(item){
      let startDateStr=item.startTime
      let endDateStr=item.endTime
      // 开始时间
      var startTime = new Date(startDateStr.replace(/-/g,"/"));
      // 结束时间
      var endTime = new Date(endDateStr.replace(/-/g,"/"));
      return parseInt((endTime - startTime) / 1000);
    },
    /**
	 * [formatSeconds 倒计时]
	 * @param  {[type]} seconds [秒数]
	 * @return {[type]}         {天、时、分、秒}
	 */
    formatSeconds:function (seconds) {
      //var days = Math.floor(seconds / 86400)
      var hours = Math.floor(seconds / 3600)
      var minutes = Math.floor(seconds % 3600 / 60)
      var sec = seconds % 3600 % 60
      return {
        //days: days,
        hours: hours < 10 ? '0' + hours : hours,
        minutes: minutes < 10 ? '0' + minutes : minutes,
        sec: sec < 10 ? '0' + sec : sec
      }
    },
    //跳转商详
    goProductInfo:function(e){
      let wareId = e.currentTarget.dataset.id;
      let state=e.currentTarget.dataset.state
      //埋点方法。
      if(state=="未开始"){
        state=1
      }else if(state=="进行中"){
        state=2
      }
      let shopID = wx.getStorageSync('shopID')
      var eid=""
      if(this.data.moduleType=="tab"){
        if(this.data.skuType=='MS'){
          eid='KMiniAppShop_SecondKillFloor'
        }else if(this.data.skuType=='SG'){
          eid='KMiniAppShop_FlashFloor'
        }
      }else if(this.data.moduleType=="list"){
        if(this.data.skuType=='MS'){
          eid='Wshop_SecondKillList_Product'
        }else if(this.data.skuType=='SG'){
          eid='Wshop_FlashList_Product'
        }
      }
      var param = {
        "eid":eid,
        "eparam":`${shopID}_${wareId}_${state}`,
        "target":"/pages/product/product?wareId=" + wareId,
        "ev": e
      }
      this.triggerEvent('clickFunc', param)
      wx.navigateTo({
        url: "/pages/product/product?wareId=" + wareId,
      })
    }
  },
 
})
