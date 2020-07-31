Page({
    data: {

    },
    onLoad: function (options) {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    screenHeight: res.windowHeight,
                    screenWidth: res.windowWidth,
                });
            }
        });
    },

    onShow: function () {

    },
    gotoNewAddress: function (ev) {
      wx.redirectTo({
        url: '../address/address?addressId=0&addressType=add'
      });
    },
})