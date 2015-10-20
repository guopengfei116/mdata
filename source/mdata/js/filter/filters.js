
/*
*   输出html文档
* */
oasgames.mdataFilter.filter('to_trusted', [
    '$sce',
    function ($sce) {
        return function (text) {
            if(text) {
                return $sce.trustAsHtml(text);
            }
        };
    }
]);


/*
* 首字母大写
* */
oasgames.mdataFilter.filter('capitalize', [
    function () {
        return function (text) {
            if(text) {
                return text[0].toUpperCase() + text.slice(1);
            }
        }
    }
]);

/*
 *  @filter 截取数组
 *  @param {Number} start 截取数组的起始位置
 *  @return {Array} 新数组
 * */
oasgames.mdataFilter.filter('slice', [
    function () {
        return function (text, start) {
            if(text) {
                return text.slice(start);
            }
        }
    }
]);

/*
 *  @value_group 值转换
 *  @param {String} valueGroup
 * */
oasgames.mdataFilter.filter('slice', [
    function () {
        return function (text, valueGroup, separator, valueList) {
            if(text) {
                return text.slice(start);
            }
        }
    }
]);


/*
 * @filter 通过遍历每个对象，判断其属性{key}是否满足{vals}里的任意一个值，满足则过滤掉该对象
 * @param {Array} text 待过滤的对象数组集合，数据源 [{key:1, key:2, key:3}]
 * @param {Array} vals 要过滤的数值集合，[1,2]
 * @param {String} key 过滤对象的参考属性值，过滤的关键字 key
 * @return {Array} 返回一个新数组 [{key:3}]
 * */
oasgames.mdataFilter.filter('exclude', [
    function () {
        return function (text, vals, key) {
            var result = [];
            var temO;
            if(text && text.length && vals && vals.length && key) {
                Periphery:
                    for(var i = 0; i < text.length; i++) {
                        temO = text[i][key];
                        for(var j = 0; j < vals.length; j++) {
                            if(temO == vals[j]) {
                                continue Periphery;
                            }
                        }
                        result.push(text[i]);
                    }
            }else {
                return text;
            }
            return result;
        }
    }
]);