function getCustomerinfo() {
    let customerinfoVal = '';
    let extuserid = wx.getStorageSync('extuserid');
    let customerinfo = wx.getStorageSync('customerinfo');
    customerinfoVal = extuserid ? extuserid : customerinfo;
    return customerinfoVal;
}

function getExtuserid() {
    let scene = wx.getStorageSync('sceneCode')||'NA';
    return scene;
}

module.exports = {
    getCustomerinfo,
    getExtuserid
}