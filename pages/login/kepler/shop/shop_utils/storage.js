/*****
 * 同步获取值，异步赋值，一次读写，提升性能
 * ①现在用微信本地存储赋值，太耗性能，一次同步读写，大概10ms
 * ②统一管理项目缓存值
 * ③添加缓存有效期配置,比如跟单、登录态等
 */

/****
 * 所有缓存值，统一在这里处理
 * 初始值统一 undefined
 */
function getData() {
    const app = getApp({allowDefault: true})
    let data = null;
    //如果存在直接用，不再声明
    if (app.storage) {
        data = app.storage
    } else {
        //使用map提高读取速度
        data = new Map([
            ['userInfo', undefined],
            ['shopId', undefined],
            ['storageExp', undefined],//过期时间
        ]);
        app.storage = data
    }
    return data;
}

/****
 * 获取值
 * @param key
 * @param isExp 是否是有效期缓存
 * @returns {any | string}
 */
function get(key,isExp) {
    let data = getData()
    let val = data.get(key);
    //默认值为undefined，其他为就是有值
    if (val === undefined) {
        val = wx.getStorageSync(key);
        // 本身就是undefined时，赋值为null,下次不再从缓存中读取
        if(val === undefined){
            val = null;
        }
        data.set(key, val);
    }
    //有效期缓存
    if(isExp){
        if(!checkExp(key)){
            return undefined;
        }
    }
    return val;
}

/****
 * 检测有效期字段,是否过期
 * @param key
 */
function checkExp(key) {
    let storageExp = get('storageExp') || {};
    let expireMil = storageExp[key]
    if(typeof expireMil == 'number' && Date.now() > expireMil){
        //数据过期
        remove(key);
        delete storageExp[key]
        set('storageExp', storageExp);
        return undefined;
    }
    return true;
}

/****
 * 检测所有有效期字段,并移除失效字段,可以在项目启动时检测，
 * 兜底某些字段在get时，没有加有效期标识问题
 */
function checkExpAll() {
    let storageExp = get('storageExp') || {};
    let expArr = Object.keys(storageExp);
    let temp = [];
    //获取所有过期字段
    expArr.map((key)=>{
        let expireMil = storageExp[key]
        if(typeof expireMil == 'number' && Date.now() > expireMil){
            //数据过期
            temp.push(key)
        }
    })
    let tempLen = temp.length
    if(tempLen){
        for(let i=0;i<temp.length;i++){
            let key = temp[i]
            //数据过期
            remove(key);
            delete storageExp[key]
        }
        set('storageExp', storageExp);
    }
}

/****
 * 赋值
 * @param key
 * @param val
 * @param expireSec 有效时间(s)
 */
function set(key, val, expireSec) {
    let data = getData()
    data.set(key, val);
    wx.setStorage({
        key: key,
        data: val
    })
    //有效时间
    if(typeof expireSec == 'number'){
        let storageExp = get('storageExp') || {};
        storageExp[key] = expireSec*1000 + Date.now();
        set('storageExp', storageExp);
    }
}

/****
 * 移除缓存
 * @param key
 * @param val
 */
function remove(key) {
    let data = getData()
    data.delete(key)
    wx.removeStorage({
        key: key
    })
}

module.exports = {
    set,
    get,
    remove,
    checkExp,
    checkExpAll
}
