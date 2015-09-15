
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