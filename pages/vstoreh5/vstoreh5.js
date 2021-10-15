var plugin = requirePlugin("myPlugin");
var log = plugin.log.init()
var app = getApp()

Page({
    data: {
        venderStoreUrl_h5: ''
    },
    onLoad: function (options) {
        let locUrlStr = 'https://md-mobile.jd.com/virtualstore/storeinfolistview?storelistparam='+options.params;
        console.log(locUrlStr)
        var _that = this,
            newLocUrl = '',
            locUrl = encodeURIComponent(locUrlStr);
        plugin.promiseGentoken().then(function(res){
            console.log(res)

            if(res.data.err_code==0){
                newLocUrl = res.data.url+'?to='+locUrl+'&tokenkey='+res.data.tokenkey;
                console.log(newLocUrl)
                _that.setData({venderStoreUrl_h5:newLocUrl});
            }
        })
    },
    onShow: function () {

    }
})