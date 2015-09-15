
/*
*   输出html文档
* */
oasgames.mdataPanelFilter.filter('to_trusted', [
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
oasgames.mdataPanelFilter.filter('capitalize', [
    function () {
        return function (text) {
            if(text) {
                return text[0].toUpperCase() + text.slice(1);
            }
        }
    }
]);