/*
 * 过滤器排序方法
 * */
oasgames.mdataPanelServices.factory('OrderHandler', [
    function ($resource, ApiCtrl) {
        return {
            up : function (key) {

            },

            down : function (key) {

            },

            change : function (sortCfg, type, orderKey) {
                if(sortCfg[type].orderKey == orderKey) {
                    sortCfg[type].isDownOrder = !sortCfg[type].isDownOrder;
                }else {
                    sortCfg[type].orderKey = orderKey;
                }
            },

            //排序取反
            negate : function (key) {
                console.log();
                if(Object.prototype.toString.call(key) == 'Object') {
                    for(var keyword in key) {
                        return key[keyword];
                    }
                }else {
                    if(/^\w+$/.test(key)) {
                        var result = {};
                        result[key] = true;
                        return result;
                    }
                }

                /*
                 var match = key.match(/^(\w+)(:true)?$/);

                 if(match) {
                 if(match && match[2]) {
                 return match[1];
                 }else {
                 return key + ':' + 'true';
                 }
                 }else {
                 throw new Error('orderHandle 错误的orderKey');
                 }
                 */
            }
        }
    }
]);

/*
 *
 * @return {Function} filter方法
 * */
oasgames.mdataPanelServices.factory('Filter', [
    function () {

        /*
        * 暴漏方法
        * @parm {Array} data
        * @parm {Object} config
        * config：其每个属性值必须为String||Array，如果为arr，则认为比较的是一个深度嵌套对象，会依次向下找，直到倒数第二项作为比较值，最后一项作为正则条件
        * */
        var filter = function (data, config) {
            var result = [], tempReg = null, tempResultObj, tempObj = null, tempVal = '';

            //  data != [] || data = []
            if(Object.prototype.toString.call(data) != '[object Array]' || !data.length) {
                throw new Error('Filter需要一个Array数据类型进行后续操作');
            }

            // config != {}
            if(Object.prototype.toString.call(config) != '[object Object]') {
                throw new Error('Filter需要一个Object配置filter条件');
            }

            //过滤数据
            for(var i = data.length - 1; i >= 0; i-- ) {

                // !{}
                if(Object.prototype.toString.call(data[i]) != '[object Object]') {
                    result.push(data[i]);
                    continue;
                }

                tempResultObj = data[i];

                /*
                * 查找符合过滤条件的对象
                * */
                for(var key in config) {

                    // config[key] == array
                    if(Object.prototype.toString.call(config[key]) == '[object Array]') {

                        tempVal = tempResultObj;
                        for (var j = 0; j < config[key].length; j++) {

                            //最后一个值作为过滤条件
                            if(j == config[key].length - 1) {
                                tempReg = new RegExp(config[key][j]);
                                break;
                            }

                            //向下依次查找判断源数据
                            tempVal = tempVal[config[key][j]];
                        }

                    // config[key] == string
                    }else if(Object.prototype.toString.call(key) == '[object String]'){
                        tempVal = tempResultObj[key];
                        tempReg = new RegExp(config[key]);
                    }else {
                        throw new Error('不合法的Filter过滤条件');
                    }

                    //符合条件则push到result
                    if(tempVal && tempReg) {
                        if(tempReg.test(tempVal)) {
                            result.push(tempResultObj);
                            break;
                        }
                    }else {
                        throw new Error('Filter发生数据错误');
                    }
                }
            }
            return result;
        };

        return filter;
    }
]);