
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
 * 过滤掉对象key == xxx的对象, 返回一个新数组
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