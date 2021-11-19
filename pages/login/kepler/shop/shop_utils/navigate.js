//页面跳转优化
//兼容tab页和非tab页
//fail里是否有报错信息，根据报错来跳转

//防止同一时间，同一路由，重复跳转
let cacheUrl = ''

//跳页面
function navigateTo(jumpUrl) {
    //检测页面栈，>=10时页面会报错
    let pages = getCurrentPages()
    if(pages.length >= 8){
        reLaunch(jumpUrl)
        return;
    }
    wx.navigateTo({
        url: jumpUrl,
        fail: function () {
            //尝试navigate，如果失败，尝试switchTab
            wx.switchTab({
                url: jumpUrl,
                fail: function () {
                    wx.showToast({
                        title: '该页面不存在!',
                        icon: "none",
                        duration: 2500
                    })
                },
                complete(){
                    resetCacheUrl()
                }
            })
        },
        success(){
            resetCacheUrl()
        }
    })
}

//关闭当前页面，跳转到应用内的某个页面
function redirectTo(jumpUrl) {
    wx.redirectTo({
        url: jumpUrl,
        fail: function () {
            wx.reLaunch({
                url: jumpUrl,
                fail: function () {
                    wx.showToast({
                        title: '该页面不存在!',
                        icon: "none",
                        duration: 2500
                    })
                },
                complete(){
                    resetCacheUrl()
                }
            })
        },
        success(){
            resetCacheUrl()
        }
    })
}

//关闭所有页面，打开到应用内的某个页面
function reLaunch(jumpUrl) {
    wx.reLaunch({
        url: jumpUrl,
        fail: function () {
            wx.showToast({
                title: '该页面不存在!',
                icon: "none",
                duration: 2500
            })
        },
        complete(){
            resetCacheUrl()
        }
    })
}

function handleUrl(url) {
    // 如果不是绝对路径，则修改成绝对
    !(/^\//.test(url)) && (url = '/' + url)
    // 检测是否以 /pages 开头, 不是则加上
    //这样简化写跳转路由，不用带pages前缀
    // !(/^\/pages/.test(url)) && (url = '/pages' + url)
    return url
}

function resetCacheUrl(){
    if(!cacheUrl) return;
    setTimeout(function () {
        cacheUrl = ''
    },800)
}
//返回页面
//参数 ： {delta:1}
function navigateBack(obj) {
    cacheUrl = ''
    wx.navigateBack(obj)
}

const jumpObj = {
    navigateTo,
    redirectTo,
    reLaunch,
    navigateBack
}

const jumpTo = function (obj) {
    if (!obj) return;
    //字符串默认跳转
    if (typeof obj == 'string') {
        if(cacheUrl == obj){
            return;
        }
        cacheUrl = obj
        let url = handleUrl(obj)
        jumpObj.navigateTo(url);
        return;
    }
    //navigateBack
    if (obj.delta && obj.type == 'navigateBack') {
        jumpObj[obj.type](obj);
        return;
    }
    //传递类型错误
    if (typeof obj != 'object' || !jumpObj[obj.type] || !obj.url) {
        console.error('跳转失败，请检查参数类型')
        return;
    }
    if(cacheUrl == obj.url){
        return;
    }
    cacheUrl = obj.url
    let url = handleUrl(obj.url)
    jumpObj[obj.type](url);
}
/****
 * 入参
 * ①传递对象： {url:'/pages/index/index',type:'navigateTo | redirectTo | reLaunch | navigateBack'}
 * ②传递字符串： '/pages/index/index' 默认navigateTo
 * ③ navigateBack 用原生就可以，这里封装只是为了统一
 * @type {{jumpTo: jumpTo}}
 */
module.exports = jumpTo
