/* 匹配{xxx} */
const objectFieldRegExp = /^\{(\w+)\}$/;
/* 匹配[123] [?] */
const arrayFieldRegExp = /^\[([\d|\?]+)\]$/;

const GRAVITY_LEFT_TOP = 1;
const GRAVITY_CENTER_TOP = 2;
const GRAVITY_RIGHT_TOP = 3;
const GRAVITY_LEFT_CENTER = 4;
const GRAVITY_CENTER_CENTER = 5;
const GRAVITY_RIGHT_CENTER = 6;
const GRAVITY_LEFT_BOTTOM = 7;
const GRAVITY_CEITER_BOTTOM = 8;
const GRAVITY_RIGHT_BOTTOM = 9;

const LINE_TYPE_NONE = 0;
const LINE_TYPE_CENTER = 2;
const LINE_TYPE_BOTTOM = 3;

// editProperty 普通取值
function execStr(dataMapChain, key) {

    var result;
    if (dataMapChain == undefined || dataMapChain == null) {
        result = key;
    }
    else if (key == undefined || key == null) {
        result = undefined;
    } else {
        if ("string" == typeof key) {
            if (key[0] == "$") {
                let va = variant(dataMapChain, key);
                if (va) {
                    result = va;
                    //node = va.node;
                }
            } else {
                result = key
            }
        } else {
            result = key
        }
    }

    return result;

}

/**
 * 处理$开头的表达式
 * 从dataMapChain中处理表达式
 **/
function variant(dataMapChain, str) {
    if (!dataMapChain) {
        return null;
    }

    for (var i = 0, len = dataMapChain.length; i < len; i++) {
        let dataMap = dataMapChain[i];
        if (dataMap) {
            let value = variantOfDataMap(str, dataMap);

            if (value) {
                return value;
            }
        }
    }
}

/**
 *从一个dataMap中解析表达式
 **/
function variantOfDataMap(str, dataMap) {
    // console.log('this');
    // console.log(this);
    let fields = str.split(".");
    if ((!fields) || fields.length <= 0) {
        return undefined;
    }

    /* 去掉开头的$ */
    fields[0] = fields[0].substring(1, fields[0].length)

    let value = dataMap;
    let nodeText = undefined;
    let node = '';
    let type = undefined;
    for (var i = 0, leni = fields.length; i < leni; i++) {
        if (!value) {
            break;
        }

        let field = fields[i];
        var fieldKey;
        var objectMatchResult = field.match(objectFieldRegExp);
        if (objectMatchResult != null) {
            fieldKey = objectMatchResult[1];
        } else {
            var arrayMatchResult = field.match(arrayFieldRegExp);
            if (arrayMatchResult != null) {
                /* for-each中使用当前index代替? */
                /* ?只能代替数字 */
                if ("?" == arrayMatchResult[1] && (typeof arrayMatchResult.index != 'undefined')) {
                    fieldKey = arrayMatchResult.index;
                } else {
                    fieldKey = arrayMatchResult[1];
                }
            } else {
                fieldKey = field;
            }
        }

        if (i == 0) {
            let nameMatched = false;

            //第一级，遍历dataDefines[],找name等于field的项
            for (var j = 0, lenj = fields.length; j < lenj; j++) {
                let name = value.name;

                if (fieldKey == name) {
                    nameMatched = true;
                    node = value;
                    type = value.type;
                    nodeText = value.nodeText;//字典取值？？

                    if (nodeText) {
                        switch (type) {
                            case 'jsonArray':
                                value = nodeText.data;
                                break;
                            case 'sku':
                                value = nodeText.data;
                                break;
                            case 'image':
                                value = nodeText;
                                break;
                            case 'radio':
                                value = nodeText;
                                break;
                            case 'text':
                                value = nodeText;
                                break;
                            case 'simpleTab':
                                value = nodeText.data;
                                break;
                            case 'video':
                                value = nodeText;
                                break;
                            case 'hotArea':
                                value = nodeText;
                                break;
                        }
                    } else {
                        value = undefined;
                    }

                    break;
                }
            }

            if (!nameMatched) {
                value = null;
                break;
            }
        } else if ('_size_' == fieldKey) {
            if (i == fields.length - 1 && '[object Array]' == Object.prototype.toString.call(value)) {
                value = value.length;
            } else {
                value = null;
                break;
            }
        } else {
            value = value[fieldKey];
        }

        if (!value) {
            break;
        }
    }

    if (nodeText && value) {
        switch (type) {
            case 'text':
                if (leni == 1) {
                    value = nodeText.text;
                }
                break;
            case 'image':
                if (leni == 1) {
                    value = nodeText.imageUrl;
                }
                break;
            case 'radio':
                if (leni == 1) {
                    value = nodeText.data.value;
                } else if (leni == 2) {
                    if (value && value == nodeText.data) {
                        value = nodeText.data.value;
                    }
                }
                break;
            case 'video':
                value = nodeText;
                break;
            case 'hotArea':
                if (leni == 1) {
                    value = nodeText.data;
                }
                break
        }
    }

    return value;
}


// editProperty 过滤 foreach
function filterForEach(dataMapChain, childrenFil) {

    var children = childrenFil;
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.containerType == 'image') {
            var urlRefer = child.urlRefer;
            var urlReferFiltered = execFilterStr(dataMapChain, urlRefer);
            child.urlRefer = urlReferFiltered;

        }
        else if (child.containerType == 'text') {
            var valueRefer = child.valueRefer;
            var valueReferFiltered = execFilterStr(dataMapChain, valueRefer);
            child.valueRefer = valueReferFiltered;
            child.jdPrice = execFilterStr(dataMapChain, child.jdPrice);
            child.prefixRefer = execFilterStr(dataMapChain, child.prefixRefer);
        }
        else if (child.containerType == 'container') {


            var subChildren = child.children;
            if(subChildren instanceof Array){
                for (var j = 0; j < subChildren.length; j++) {
                    var subChild = subChildren[j];
                    if (subChild.containerType == 'image') {
                        var urlRefer = subChild.urlRefer;
                        var urlReferFiltered = execFilterStr(dataMapChain, urlRefer);
                        subChild.urlRefer = urlReferFiltered;

                    }
                    else if (subChild.containerType == 'text') {
                        var valueRefer = subChild.valueRefer;
                        var valueReferFiltered = execFilterStr(dataMapChain, valueRefer);
                        subChild.valueRefer = valueReferFiltered;
                        subChild.jdPrice = execFilterStr(dataMapChain, subChild.jdPrice);
                        subChild.prefixRefer = execFilterStr(dataMapChain, subChild.prefixRefer);
                    }// 三级 child
                    else if (subChild.containerType == 'container') {

                        var thirdChildren = subChild.children;
                        if(thirdChildren instanceof Array){
                            for (var k = 0; k < thirdChildren.length; k++) {
                                var thirdChild = thirdChildren[k];
                                if (thirdChild.containerType == 'image') {
                                    var urlRefer = thirdChild.urlRefer;
                                    var urlReferFiltered = execFilterStr(dataMapChain, urlRefer);
                                    thirdChild.urlRefer = urlReferFiltered;

                                }
                                else if (thirdChild.containerType == 'text') {
                                    var valueRefer = thirdChild.valueRefer;
                                    var valueReferFiltered = execFilterStr(dataMapChain, valueRefer);
                                    thirdChild.valueRefer = valueReferFiltered;
                                    thirdChild.jdPrice = execFilterStr(dataMapChain, thirdChild.jdPrice);
                                    thirdChild.prefixRefer = execFilterStr(dataMapChain, thirdChild.prefixRefer);
                                }

                                if (thirdChild.style["gravity"]) {
                                    var subStyle = thirdChild.style;
                                    var textAlign = _getGravityStyle(subStyle);
                                    subStyle["textAlign"] = textAlign;
                                    thirdChild.style = subStyle;
                                }

                                if (thirdChild.style["backgroundColor"]) {
                                    var subStyle = thirdChild.style;
                                    var bgColor = thirdChild.style["backgroundColor"];
                                    if (bgColor.length == 9) {
                                        var alpha = parseInt(bgColor.slice(1, 3), 16)
                                        var r = parseInt(bgColor.slice(3, 5), 16)
                                        var g = parseInt(bgColor.slice(5, 7), 16)
                                        var b = parseInt(bgColor.slice(7, 9), 16)
                                        var a = alpha / 255

                                        var newColor = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'
                                        subStyle["backgroundColor"] = newColor
                                        console.log('textBGCO')
                                        console.log(newColor)
                                        thirdChild.style = subStyle
                                    }
                                }

                                thirdChildren[k] = thirdChild;

                            }
                        }
                        subChild.children = thirdChildren;

                    }
                    //三级child 结束

                    if (subChild.style["textColor"]) {
                        var subStyle = subChild.style;
                        subStyle["textColor"] = execFilterStr(dataMapChain, subStyle["textColor"]);
                        subChild.style = subStyle;
                    }
                    if (subChild.style["fontSize"]) {
                        var subStyle = subChild.style;
                        subStyle["fontSize"] = execFilterStr(dataMapChain, subStyle["fontSize"]);
                        subChild.style = subStyle;
                    }
                    if (subChild.style["height"]) {
                        var subStyle = subChild.style;
                        subStyle["height"] = execFilterStr(dataMapChain, subStyle["height"]);
                        subChild.style = subStyle;
                    }
                    if (subChild.style["width"]) {
                        var style = subChild.style;
                        style["width"] = execFilterStr(dataMapChain, subStyle["width"]);
                        subChild.style = subStyle;
                    }
                    if (subChild.style["marginLeft"]) {
                        var subStyle = subChild.style;
                        subStyle["marginLeft"] = execFilterStr(dataMapChain, subStyle["marginLeft"]);
                        subChild.style = subStyle;
                    }
                    if (subChild.style["marginTop"]) {
                        var subStyle = subChild.style;
                        subStyle["marginTop"] =  execFilterStr(dataMapChain, subStyle["marginTop"]);
                        subChild.style = subStyle;
                    }
                    if (subChild.style["gravity"]) {
                        var subStyle = subChild.style;
                        var textAlign = _getGravityStyle(subStyle);
                        subStyle["textAlign"] = textAlign;
                        subChild.style = subStyle;
                    }

                    if (subChild.style["backgroundColor"]) {
                        var subStyle = subChild.style;
                        var bgColor = subChild.style["backgroundColor"];
                        if (bgColor.length == 9) {
                            var alpha = parseInt(bgColor.slice(1, 3), 16)
                            var r = parseInt(bgColor.slice(3, 5), 16)
                            var g = parseInt(bgColor.slice(5, 7), 16)
                            var b = parseInt(bgColor.slice(7, 9), 16)
                            var a = alpha / 255

                            var newColor = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'
                            subStyle["backgroundColor"] = newColor
                            subChild.style = subStyle
                        }
                    }

                    subChildren[j] = subChild;

                }
            }
            child.children = subChildren;

        }

        if (child.style["height"]) {
            var style = child.style;
            var childHeight = execFilterStr(dataMapChain, child.style["height"]);
            style["height"] = childHeight;
            child.style = style;
        }
        if (child.style["width"]) {
            var style = child.style;
            var childwidth = execFilterStr(dataMapChain, child.style["width"]);
            style["width"] = childwidth;
            child.style = style;
        }
        if (child.style["marginLeft"]) {
            var style = child.style;
            var childMarginLeft = execFilterStr(dataMapChain, child.style["marginLeft"]);
            style["marginLeft"] = childMarginLeft;
            child.style = style;
        }
        if (child.style["marginTop"]) {
            var style = child.style;
            var childmarginTop = execFilterStr(dataMapChain, child.style["marginTop"]);
            style["marginTop"] = childmarginTop;
            child.style = style;
        }
        if (child.style["gravity"]) {
            var style = child.style;
            var textAlign = _getGravityStyle(style);
            style["textAlign"] = textAlign;
            child.style = style;
        }

        if (child.style["backgroundColor"]) {
            var style = child.style;
            var bgColor = child.style["backgroundColor"];
            var len = bgColor.length;
            console.log('bgColor len');
            console.log(len)
            if (bgColor.length == 9) {
                var alpha = parseInt(bgColor.slice(1, 3), 16)
                var r = parseInt(bgColor.slice(3, 5), 16)
                var g = parseInt(bgColor.slice(5, 7), 16)
                var b = parseInt(bgColor.slice(7, 9), 16)
                var a = alpha / 255

                var newColor = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'
                style["backgroundColor"] = newColor
                child.style = style
            }
        }

        children[i] = child;
    }


    return children;
}

function execFilterStr(dataMapChain, key) {

    var result;
    if (dataMapChain == undefined || dataMapChain == null) {
        result = key;
    }
    else if (key == undefined || key == null) {
        result = undefined;
    } else {
        if ("string" == typeof key) {
            if (key[0] == "$") {
                let va = variantFilter(dataMapChain, key);
                if (va) {
                    result = va;
                    //node = va.node;
                }
            } else {
                result = key
            }
        } else {
            result = key
        }
    }

    return result;

}

/**
 * 处理$开头的表达式 filter foreach
 * 从dataMapChain中处理表达式
 **/
function variantFilter(dataMapChain, str) {
    if (!dataMapChain) {
        return null;
    }

    for (var i = 0, len = dataMapChain.length; i < len; i++) {
        let dataMap = dataMapChain[i];
        if (dataMap) {
            let value = variantOfDataMapFiltered(str, dataMap);

            if (value) {
                return value;
            }
        }
    }
}


/**
 *从一个dataMap中解析表达式. filter foreach
 **/
function variantOfDataMapFiltered(str, dataMap) {
    let fields = str.split(".");
    if ((!fields) || fields.length <= 0) {
        return undefined;
    }
    if (fields.length == 3) {
        return fields[2];
    }

    /* 去掉开头的$ */
    fields[0] = fields[0].substring(1, fields[0].length)

    let value = dataMap;
    let nodeText = undefined;
    let node = '';
    let type = undefined;
    for (var i = 0, leni = fields.length; i < leni; i++) {
        if (!value) {
            break;
        }

        let field = fields[i];
        var fieldKey;
        var objectMatchResult = field.match(objectFieldRegExp);
        if (objectMatchResult != null) {
            fieldKey = objectMatchResult[1];
        } else {
            var arrayMatchResult = field.match(arrayFieldRegExp);
            if (arrayMatchResult != null) {
                /* for-each中使用当前index代替? */
                /* ?只能代替数字 */
                // console.log(arrayMatchResult[1]);
                if ("?" == arrayMatchResult[1] && (typeof arrayMatchResult.index != 'undefined')) {
                    fieldKey = arrayMatchResult.index;
                } else {
                    fieldKey = arrayMatchResult[1];

                }
            } else {
                fieldKey = field;
            }
        }

        if (i == 0) {
            let nameMatched = false;

            //第一级，遍历dataDefines[],找name等于field的项
            let name = value.name;

            if (fieldKey == name) {
                nameMatched = true;
                node = value;
                type = value.type;
                nodeText = value.nodeText;//字典取值？？

                if (nodeText) {
                    switch (type) {
                        case 'jsonArray':
                            value = nodeText.data;
                            break;
                        case 'sku':
                            value = nodeText.data;
                            break;
                        case 'image':
                            value = 'http:' + nodeText;
                            break;
                        case 'radio':
                            value = nodeText;
                            break;
                        case 'text':
                            value = nodeText;
                            break;
                        case 'simpleTab':
                            value = nodeText.data;
                            break;
                        case 'video':
                            value = nodeText;
                            break;
                        case 'hotArea':
                            value = nodeText;
                            break;
                    }
                } else {
                    value = undefined;
                }
            }

            if (!nameMatched) {
                value = null;
                break;
            }
        } else if ('_size_' == fieldKey) {
            if (i == fields.length - 1 && '[object Array]' == Object.prototype.toString.call(value)) {
                value = value.length;
            } else {
                value = null;
                break;
            }
        } else {
            value = value[fieldKey];
        }

        if (!value) {
            break;
        }
    }

    if (nodeText && value) {
        switch (type) {
            case 'text':
                if (leni == 1) {
                    value = nodeText.text;
                }
                break;
            case 'image':
                if (leni == 1) {
                    value = 'http:' + nodeText.imageUrl;
                }
                break;
            case 'radio':
                if (leni == 1) {
                    value = nodeText.data.value;
                } else if (leni == 2) {
                    if (value && value == nodeText.data) {
                        value = nodeText.data.value;
                    }
                }
                break;
            case 'video':
                value = nodeText;
                break;
            case 'hotArea':
                if (leni == 1) {
                    value = nodeText.data;
                }
                break
        }
    }

    return value;
}


/**
 *从一个dataMap中解析 ForSkuKey.
 **/

function execStrForSkuKey(dataMapChain, key) {

    var result;
    if (dataMapChain == undefined || dataMapChain == null) {
        result = key;
    }
    else if (key == undefined || key == null) {
        result = undefined;
    } else {
        if ("string" == typeof key) {
            if (key[0] == "$") {
                let va = variantForSkuKey(dataMapChain, key);
                if (va) {
                    result = va;
                    //node = va.node;
                }
            } else {
                result = key
            }
        } else {
            result = key
        }
    }

    return result;

}

/**
 * 处理$开头的表达式
 * 从dataMapChain中处理表达式 ForSkuKey
 **/
function variantForSkuKey(dataMapChain, str) {
    if (!dataMapChain) {
        return null;
    }

    for (var i = 0, len = dataMapChain.length; i < len; i++) {
        let dataMap = dataMapChain[i];
        if (dataMap) {
            let value = variantOfDataMapForSkuKey(str, dataMap);

            if (value) {
                return value;
            }
        }
    }
}

/**
 *从一个dataMap中解析表达式 ForSkuKey
 **/
function variantOfDataMapForSkuKey(str, dataMap) {
    let fields = str.split(".");
    if ((!fields) || fields.length <= 0) {
        return undefined;
    }

    /* 去掉开头的$ */
    fields[0] = fields[0].substring(1, fields[0].length)

    let value = dataMap;
    let nodeText = undefined;
    let node = '';
    let type = undefined;
    for (var i = 0, leni = fields.length; i < leni; i++) {
        if (!value) {
            break;
        }

        let field = fields[i];
        var fieldKey;
        var objectMatchResult = field.match(objectFieldRegExp);
        if (objectMatchResult != null) {
            fieldKey = objectMatchResult[1];
        } else {
            var arrayMatchResult = field.match(arrayFieldRegExp);
            if (arrayMatchResult != null) {
                /* for-each中使用当前index代替? */
                /* ?只能代替数字 */
                if ("?" == arrayMatchResult[1] && (typeof arrayMatchResult.index != 'undefined')) {
                    fieldKey = arrayMatchResult.index;
                } else {
                    fieldKey = arrayMatchResult[1];
                }
            } else {
                fieldKey = field;
            }
        }

        if (i == 0) {
            let nameMatched = false;

            //第一级，遍历dataDefines[],找name等于field的项
            for (var j = 0, lenj = fields.length; j < lenj; j++) {
                let name = value.name;

                if (fieldKey == name) {
                    nameMatched = true;
                    node = value;
                    type = value.type;
                    nodeText = value.nodeText;//字典取值？？

                    if (nodeText) {
                        switch (type) {
                            case 'jsonArray':
                                value = nodeText.data;
                                break;
                            case 'sku':
                                value = nodeText.key;
                                break;
                            case 'image':
                                value = nodeText;
                                break;
                            case 'radio':
                                value = nodeText;
                                break;
                            case 'text':
                                value = nodeText;
                                break;
                            case 'simpleTab':
                                value = nodeText.data;
                                break;
                            case 'video':
                                value = nodeText;
                                break;
                            case 'hotArea':
                                value = nodeText;
                                break;
                        }
                    } else {
                        value = undefined;
                    }

                    break;
                }
            }

            if (!nameMatched) {
                value = null;
                break;
            }
        } else if ('_size_' == fieldKey) {
            if (i == fields.length - 1 && '[object Array]' == Object.prototype.toString.call(value)) {
                value = value.length;
            } else {
                value = null;
                break;
            }
        } else {
            value = value[fieldKey];
        }

        if (!value) {
            break;
        }
    }

    if (nodeText && value) {
        switch (type) {
            case 'text':
                if (leni == 1) {
                    value = nodeText.text;
                }
                break;
            case 'image':
                if (leni == 1) {
                    value = nodeText.imageUrl;
                }
                break;
            case 'radio':
                if (leni == 1) {
                    value = nodeText.data.value;
                } else if (leni == 2) {
                    if (value && value == nodeText.data) {
                        value = nodeText.data.value;
                    }
                }
                break;
            case 'video':
                value = nodeText;
                break;
            case 'hotArea':
                if (leni == 1) {
                    value = nodeText.data;
                }
                break
        }
    }

    return value;
}


////
function _getGravityStyle(style) {
    var textAlign;

    let gravity = style["gravity"] || GRAVITY_LEFT_TOP;

    switch (Number(gravity)) {
        case GRAVITY_LEFT_TOP:
        case GRAVITY_LEFT_CENTER:
        case GRAVITY_LEFT_BOTTOM:
            textAlign = "left";
            break;

        case GRAVITY_CENTER_TOP:
        case GRAVITY_CENTER_CENTER:
        case GRAVITY_CEITER_BOTTOM:
            textAlign = "center";
            break;

        case GRAVITY_RIGHT_TOP:
        case GRAVITY_RIGHT_CENTER:
        case GRAVITY_RIGHT_BOTTOM:
            textAlign = "right";
            break;

        default:
            textAlign = "left";
            break;
    }

    return textAlign;

}


module.exports = {
    execStr: execStr,
    filterForEach: filterForEach,
    execStrForSkuKey: execStrForSkuKey,
};
