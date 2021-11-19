// 地址全站化统一方法调用
// import { getGlobalData } from '../globalData'
// 全站地址存储
let sitesAddress = null
/**
 * @method 存储全站地址
 * @param {String} regionIdStr 四级地址拼接串
 * @param {Number} addressId 用户常用地址id
 * @param {Number} fullAddress 用户详细地址
 * @param {Boolean} isPrompted 当前地址是否已弹框提示过用户去更新
 * 更新四级地址只一参数有值：regionIdStr=xxx addressId='' fullAddress=''
 * 更新常用地址三参数都有值：regionIdStr=xxx addressId=xxx fullAddress=xxx
 */
function setSitesAddress ({regionIdStr = '', addressId = '', fullAddress = '', commonTude = '', isPrompted = false}) {
    regionIdStr = encodeURIComponent(regionIdStr)
    if (regionIdStr || addressId || fullAddress || commonTude) {
        sitesAddress = {
            regionIdStr,
            addressId,
            fullAddress,
            commonTude,
            isPrompted
        }
        wx.setStorageSync('sitesAddress', sitesAddress)
    }
}

// 将缓存地址的isPrompted参数更新
function setSitesAddressState(isPrompted) {
    let curAddress = getSitesAddress()
    curAddress.isPrompted = !!isPrompted
    if(curAddress.regionIdStr) curAddress.regionIdStr = decodeURIComponent(curAddress.regionIdStr)
    setSitesAddress(curAddress)
}

/**
 * 比对四级地址：
 * 1.当前缓存为常用地址，返回false
 * 2.当前缓存为四级地址，将当前地址和缓存的地址做对比，判断是否一致，返回值true/false
 */
function compareAddress(regionIdStr) {
    let curAddress = getSitesAddress()
    if(!curAddress) return false
    if(curAddress.addressId || curAddress.fullAddress || curAddress.commonTude) return false//当前缓存为常用地址, 返回false
    return curAddress.regionIdStr == encodeURIComponent(regionIdStr) //即将缓存的新地址和当前缓存的地址四级地址一致
}

/**
 * @method 获取全站地址
 */
function getSitesAddress () {
    return wx.getStorageSync('sitesAddress')
}
/**
 * @method 清除全站地址
 * @param {boolean} allClear 清除所有地址信息（默认保留regionIdStr）
 */
function clearSitesAddress (allClear) {
    const addr = getSitesAddress()
    if (addr) {
        addr.regionIdStr = allClear ? '' : addr.regionIdStr
        addr.addressId = ''
        addr.fullAddress = ''
        addr.commonTude = ''
        addr.isPrompted = false
    }
    sitesAddress = addr
    addr && wx.setStorageSync('sitesAddress', addr)
    !addr && wx.removeStorageSync('sitesAddress')
}
export { 
    setSitesAddress,
    setSitesAddressState,
    getSitesAddress,
    clearSitesAddress,
    compareAddress
}