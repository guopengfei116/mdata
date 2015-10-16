
/*
 *  system log控制器
 * */
oasgames.mdataControllers.controller('systemLogCtrl', [
    '$scope',
    '$http',
    '$cacheFactory',
    '$timeout',
    'ApiCtrl',
    'Filter',
    'OrderHandler',
    'Http',
    function ($scope, $http, $cacheFactory, $timeout, ApiCtrl, Filter, OrderHandler, Http) {

        // 定义default数据
        $scope.searchPlaceholder = 'Search Account Operation...';
        $scope.sourceData = [];
        $scope.viewData = [];

        /*
        * 展示列表数据初始化
        * */
        $http({
            method: 'GET',
            url : ApiCtrl.get('systemLog')
        }).success(function (result) {
            if(result && result.code == 200) {
                $scope.sourceData = result.data;
                $scope.viewData = result.data;
            }
        });

        // 搜索自定义处理函数
        $scope.searchHandler = function (searchVal) {
            $scope.viewData = Filter($scope.sourceData, {username : searchVal, operaevents : searchVal});
        };

        // 排序数据模型
        $scope.sort = {
            systemList : {
                filter : '',
                orderKey : 'date',
                isDownOrder : true
            }
        };

        // 修改排序规则
        $scope.changeSort = function (type, orderKey) {
            OrderHandler.change($scope.sort, type, orderKey);
        };
    }
]);
