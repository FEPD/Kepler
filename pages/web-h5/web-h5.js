var plugin = requirePlugin("myPlugin");
var log = plugin.log.init()
var app = getApp()

Page({
    data: {
        h5Url: ''
    },
    onLoad: function (options) {
        if(!options.url) {
            return;
        }   
        if (options.title) {
            wx.setNavigationBarTitle({
                title: options.title
            })
        }     
        let _h5Url = decodeURIComponent(options.url);
        var _that = this,
            _newUrl = '',
            _url = encodeURIComponent(_h5Url);
        plugin.promiseGentoken().then(function(res){
            console.log(res)
            if(res.data.err_code==0){
                _newUrl = res.data.url+'?to='+_url+'&tokenkey='+res.data.tokenkey;
                _that.setData({h5Url:_newUrl});
            }
        })
    },
    onShow: function () {

    }
})