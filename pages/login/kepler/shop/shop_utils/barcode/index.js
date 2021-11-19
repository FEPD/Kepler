var barcode = require('./barcode');
var qrcode = require('./qrcode');

function convert_length(length) {
	return Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
}

function barc(id, code, width, height, that=null) {
	barcode.code128(wx.createCanvasContext(id, that), code, convert_length(width), convert_length(height))
}

/**
 * 
 * @param {*} id 
 * @param {*} code 
 * @param {*} width 
 * @param {*} height 
 * @param {*} that 注意：createCanvasContext方法是有两个参数，在page页面默认传了一个this，在组件里面需要手动传this
 */
function qrc(id, code, width, height, that=null) {
	qrcode.api.draw(code, {
		ctx: wx.createCanvasContext(id, that),
		width: convert_length(width),
		height: convert_length(height)
	})
}

module.exports = {
	barcode: barc,
	qrcode: qrc
}