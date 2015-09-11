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