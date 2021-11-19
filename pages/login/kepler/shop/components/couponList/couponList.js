var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    couponInfo: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        if (!newVal) {
          return;
        }
        this.intData();
      }
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    couponList: [],//用于存放折扣券列表
    couponUseList:{},//用于控制折扣券的说明的展开折叠
    moreInfo:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 优惠券信息初始化
    intData:function(){
      let that=this;
      let couponList=this.properties.couponInfo?this.properties.couponInfo:[];
      var moreInfo=false;
      if(couponList.length>3){
        moreInfo=true;
        couponList=couponList.slice(0,3);
      }
      couponList.map(function (item, index) {
        item.beginTime = item && item.beginTime.split(" ")[0].split("-").join(".");
        item.endTime = item && item.endTime.split(" ")[0].split("-").join(".");
        let minDiscount=item.minDiscount&&item.minDiscount.toString()
        if(minDiscount&&minDiscount.indexOf(".")!=-1){
          item.minInt=minDiscount.split(".")[0]
          item.minDot=minDiscount.split(".")[1]
        }
        let maxDiscount=item.maxDiscount&&item.maxDiscount.toString()
        if(maxDiscount&&maxDiscount.toString().indexOf(".")!==-1){
          item.maxInt=maxDiscount.split(".")[0]
          item.maxDot=maxDiscount.split(".")[1]
        }
        if(item.couponFaceDescription){
          item.couponFaceDescription=parseDescFunc(item.couponFaceDescription)
        }
      })
      that.setData({
        couponList:couponList,
        moreInfo:moreInfo
      })
    },
    // 优惠券使用说明的显示隐藏方法
    toggleDiscountInfo:function(e){
      var that=this;
      var index = e.currentTarget.dataset.id;
      if(that.data.couponUseList[index]==undefined||that.data.couponUseList[index]==false){
        that.data.couponUseList[index]=true
      }else{
        that.data.couponUseList[index]=false
      }
      that.setData({
        couponUseList:that.data.couponUseList
      })
    },
    //优惠券点击方法
    couponClick:function(e){
      console.log(e);
      let that=this;
      let index = e.currentTarget.dataset.id;
      let enable = e.currentTarget.dataset.enable;
      let state = e.currentTarget.dataset.state;
      let type = e.currentTarget.dataset.type;
      if(!enable){
        return;
      }
      if(state){
        console.log("去领取券")
       // that.getCoupon()
      }else{
        console.log("去使用")
        that.goToUse(type)
      }
    },
    // 去使用券
    goToUse (type) {
      if(type!= 0){
        if (type == 1) {
          var homePath = app.globalData.idxPagePath;
          if (homePath) {
            wx.switchTab({
              url: homePath
            })
          }
        } else if (type == 2||type == 4) {
          wx.navigateTo({
            url: '../piecelist/piecelist?source=coupon&couponbatch=' + e.currentTarget.dataset.batchid + "&activitySTip=" + e.currentTarget.dataset.activetips
          })
        }else {
          var homePath = app.globalData.homePath;
          if (homePath) {
            wx.switchTab({
              url: homePath
            })
          }
        }
      }
    },
     // 去领券
  getCoupon: function () {
    var that = this;
    var obj={};
    if(!param){
      obj = {
        shopId: that.data.shopId,
      }
    }else{
      obj=param;
    }
    var body = JSON.stringify(obj)
    var url=app.globalRequestUrl + '/shopwechat/shophomesoa/receiveCoupon';
    url = url + "?body=" + body;
    var that = this;
    utils.request({
        url: url,
        method: 'post',
        success: function (res) {
          var code = res.data.code;
          if (parseInt(code) == 0) {
            console.log(res);
            
          }
        },
        complete: () => {
          that.setData({ loadnone: true })
        },
        fail: (e) => {
          utils.reportErr("#requestFail#couponList.js getCoupon：", e);
        }
    });
  },
  }
});
//处理优惠券已享用优惠的折扣标红方法
function parseDescFunc(str){
  var strArr=str.split("");
  var siteArr=[];
  for(let i=0;i<strArr.length;i++){
    if(strArr[i]=="@"){
      siteArr.push(i)
    }
  }
  siteArr.reverse();
  if(siteArr.length>0){
    for (let i = 0;i<siteArr.length;i+=2){
      // var firstIndex = indexArry[i+1];
      // var secIndex = parseInt(firstIndex) + parseInt(indexArry[1]);
      var delLength=siteArr[i]-siteArr[i+1]+1
      var item = str.slice(siteArr[i+1]+1, siteArr[i]);
      var itemEdit ='<span style="color:#F0250F;">'+item+'</span>';
      strArr.splice(siteArr[i+1],delLength,itemEdit)
    }
  }
  return strArr.join("");
}
