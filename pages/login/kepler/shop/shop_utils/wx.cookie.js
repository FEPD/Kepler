//cookie的模拟实现以及内部接口
//root -> cookieItem
// name value domain path expires httponly secure samesite

//对线上版本的切换，数据结构不一致
//不使用domain
//只关注过期时间的控制
//具有内存缓存层和微信存储层
//特点是读取频繁但是写入比较少，因此写入直接写到缓存层和微信存储层，暂时不做节流控制
//读取一律读取缓存

function CookieItem(opt) {
	this.key = opt.key;
	this.value = opt.value;
	this.expires = opt.expires || getExpires();//session时关闭应用就应该消失，可以用cookie初始化时清除所有expires为session的cookie来实现，其余时间都作为未过期cookie
}
var cookie = (function(){
	console.info('初始化cookie，应只在启动应用时执行一次');
	var _cookie;
	try{
		_cookie = wx.getStorageSync('cookies');
	}catch(e){
		console.error('cookie初始化读取失败:',e);
	}
	if(_cookie){
		_cookie = convert(_cookie);//转换版本
		//clean(_cookie);
		toLocal(_cookie,(err,info)=>{console.log('toLocal',err,info)});
	}
	return _cookie || {};
})()
//console.info('缓存中的cookie',cookie)
//遍历cookie树 traversal
//清除上一次的session,并且将cookie格式化成可用的形态
function clean (obj) {
	Object.keys(obj).forEach((key)=>{
		if(obj[key].expires === 'session') return delete obj[key]
		obj[key].path = path;
		obj[key].domain = domain;
	})
}

//为了防止意外退出，每次保存cookie都要同步到storage里
//保存一个cookieItem到指定位置
function saveItem (obj) {
	//此处不做检查，内部方法
	cookie[obj.key] = JSON.parse(JSON.stringify(new CookieItem(obj)))
}
//合并一个对象到cookie
function merge(obj){
	//此处不作检查，内部方法
	Object.keys(obj).forEach(key=>{
		saveItem(obj[key])
	})
}
//每次获取都要做过期检查
function getItem(key){
	//内部不做防御性检查
	var ret;
	if(!cookie[key])return
	cleanItem(key)
	ret = cookie[key];
	return ret
}
function cleanItem(key){
	//遍历或者获取时发现过期，则清除掉
	var item = cookie[key];
	//console.log('检查key',key)
	if(isExpired(item.expires)){
		console.log('发现过期的key',key)
		delete cookie[key]
		toLocal(cookie)
	}
}
function isExpired(expires){
	//过期时间只能是日期或者session
	if(expires==='session')return false;//只在初始化时清除session
	console.log(expires,new Date(expires),new Date(),new Date(expires)<=new Date())
	if(new Date(expires)<=new Date())return true;

}
function toLocal(cookie,cb){
	console.info('toLocal',cookie)
	wx.setStorage({
		key:'cookies',
		data:cookie,
		success:function(res){
			if(cb)cb(null,res)
		},
		fail:function(res){
			console.error('保存cookie出错',res)
			if(cb)cb(res)
		}
	})
}

//将旧版本cookie转换成新版本,转换后
//旧版的cookie第一层是域名，有.号
//新版本key不能带.
function convert(cookie){
	var isOldVersion = false;
	Object.keys(cookie).forEach(key=>{
		if(key.match(/\./))isOldVersion = true;
	})
	if(!isOldVersion)return cookie
	var ret = {};
	Object.keys(cookie).forEach(domain=>{
		Object.keys(cookie[domain]).forEach(cookieName=>{
			var o = cookie[domain][cookieName];
			if(new Date(o.date) == 'Invalid Date')console.warn('cookie convert warning-->',domain,cookieName,o);
			ret[cookieName] = {
				key:cookieName,
				expires:o.date,
				value:o.value
			}
		})
	})
	console.log('转换后的新版本cookie',ret);
	return ret;
}
function getExpires(num){
	//目前的默认cookie是保存1年,注意这里的num应该是毫秒！！
	var t = num || 1000 * 3600 * 24 * 365;
	return new Date(new Date().getTime()+t).toGMTString()
}

//和解码有关的cookie字段 __jdv PPRD_P __wga
function checkAndFormat(obj){
	//在这里做解码工作，如果item里有解码要求，就进行解码
	var ret = {},failFlag = false;
	function fail(info){
		failFlag = true;
		console.error(info);
	}
	Object.keys(obj).forEach(field=>{
		var item = obj[field];
		if(field.match(/\./))return fail(`cookie字段名不合法:${field}`)
		if(item.value === undefined)return fail(`cookie值为undefined:${field}`)
		if(item.decode)item.value =  decodeURIComponent(item.value);
		if(!item.expires)item.expires = getExpires();
		if(new Date(item.expires)=='Invalid Date')return fail(`cookie的过期时间格式错误:${field}`);
		if(item.maxAge&&(typeof item.maxAge == 'number'||item.maxAge.match(/\d+/)))item.expires = getExpires(item.maxAge*1000);
		var o = {};
		o['key'] = field;
		o['value'] = item.value;
		o['expires'] = new Date(item.expires).toGMTString();
		if(o['value']){
			ret[field] = o;
		}else{
			console.warn('cookie checkAndFormat error,cookie值为空字符串',o['key'],o['value'])
		}

	})
	if(!failFlag) return ret;//只在检查通过时才能存入缓存
}

function getCookieStr(cookie){
	var ret = [];
	Object.keys(cookie).forEach(field=>{
		ret.push(`${field}=${encodeURIComponent(cookie[field].value)}`)
	})
	return ret.join(';');
}
function fastFormat(obj){
	//这里要过滤掉非法对象
	var ret = {};
	Object.keys(obj).forEach(field=>{
		var item = obj[field];
		if(typeof item !== 'string'&&typeof item !== 'number') console.warn('setCookie fastFormat error 非法value',item)
		else {
			var o = {};
			o['key'] = field;
			o['value'] = item;
			o['expires'] = getExpires();
			ret[field] = o;
		}
	})
	return ret;
}
/*************************************************************/

//对外接口
var EX = {};
//如果没有参数，则返回全部cookie，全部走缓存
//不能返回原始的缓存对象，防篡改
//EX.getCookie('field') EX.getCookie({format:'object||string'})

EX.getCookie = function(params){
	//console.info('EXX',params,cookie);
	if(!params) {
		var ret = getCookieStr(cookie);
		//console.log(ret);
		return ret
	}
	if(typeof params == 'string'){
		var r = getItem(params);
		if(r){
			//console.log('EX',r)
			return r.value;
		}else{
			console.info('获取的cookie字段不存在或已过期:',params);
			return '';//cookie不存在时返回空字符串
		}
	}
}
//存储cookie
//对要存储的对象做严格的格式化和检查
//参数: cb data
EX.setCookie = function(params){
	//console.log('EX setCookie',params)
	if(!params||!params.data)return console.error('setCookie 参数错误:没有数据');
	var re;
	if(params.defaultExpires){
		re = fastFormat(params.data);
	}else{
		re = checkAndFormat(params.data);
	}
	if(!re)return console.error('setCookie数据错误,数据不合法');
	merge(re);
	toLocal(cookie,params.cb);
}
//EX.setCookie({data:{PPRD_P:{value:'LOGID.1486464442157.1204395636'}}})
EX.setCookieInHeader = function(obj){
	console.log('-----------------------------setCookieInHeader',obj)
    //console.log(obj.header)
    //if(!obj.url)return console.error('Param error in setCookieInHeader');

    if(!obj.header||!obj.header['set-cookie']||!obj.header['set-cookie'].length)return
    //根据Set-Cookie的标准格式解析cookie
    //https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
    //第一部分固定是键值对<cookie-name>=<cookie-value>
    var ret = {};
    obj.header['set-cookie'].forEach(function(cookieStr){
        var segs = cookieStr.split(';');
        var cookieObj = {};
        cookieObj.kvs = segs.shift();
        var pair = cookieObj.kvs.split('=');
        if(pair.length!=2)return console.error('cookie value error ',cookieObj.kvs);
        segs.forEach(function(seg){
            if(seg.match(/^\s*Expires=/i))return cookieObj.expires = new Date(seg.split('=')[1]);
            if(seg.match(/^\s*Max-age=/i))return cookieObj.maxAge = seg.split('=')[1];
            //if(seg.match(/^\s*Domain=/i))return cookieObj.domain = seg.split('=')[1];
            //if(seg.match(/^\s*Path=/i))return cookieObj.path = seg.split('=')[1];
            // if(seg.match(/^\s*Secure$/i))return cookieObj.secure = true;
            // if(seg.match(/^\s*HttpOnly$/i))return cookieObj.httponly = true;
        })
        //console.log('<cookieObj>',cookieObj,pair)
        ret[pair[0]] = {
        	key:pair[0],
        	value:pair[1],
        	expires:cookieObj.expires,
        	maxAge:cookieObj.maxAge
        }
    })
    EX.setCookie({data:ret,cb:obj.cb})
}
/**
 * 删除cookie
 * @param keys array
 */
EX.removeCookie = function(keys){
    keys.forEach(function (obj) {
        delete cookie[obj]
    })
    toLocal(cookie);
}
module.exports = EX;
