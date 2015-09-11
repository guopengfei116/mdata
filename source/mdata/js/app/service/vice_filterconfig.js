/*
 * 获取过滤器语法的正反排序
 * */
oasgames.mdataPanelServices.factory('OrderHandle', [
    function ($resource, ApiCtrl) {
        return {
            up : function (key) {

            },
            down : function (key) {

            },

            //排序取反
            negate : function (key) {
                console.log()
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

        //暴漏方法
        var filter = function (data, config) {
            var result = [], tempReg = null, tempObj = null,  tempKey = '';

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

                tempObj = data[i];

                //正则效验
                for(var key in config) {

                    // key == array
                    if(Object.prototype.toString.call(key) == '[object Array]') {
                        for (var j = key.length - 1; j >= 0; j--) {
                            tempObj = tempObj[key[j]];
                        }
                    }else {
                        if(tempObj[key]) {
                            tempReg = new RegExp(config[key]);

                            //符合条件则push到result
                            if(tempReg.test(tempObj[key])) {
                                result.push(tempObj);
                                break;
                            }
                        }
                    }
                }
            }
            return result;
        };

        return filter;
    }
]);