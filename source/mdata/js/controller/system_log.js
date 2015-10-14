
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
    function ($scope, $http, $cacheFactory, $timeout, ApiCtrl, Filter, OrderHandler) {

        // 定义default数据
        $scope.searchPlaceholder = 'Search Account Operation...';
        $scope.sourceData = [];
        $scope.viewData = [];

        /*
        * 展示列表数据初始化
        * */
        var systemCache = $cacheFactory.get('system');
        // if(systemCache && systemCache.get('list')) {
        //     $scope.sourceData = systemCache.get('list');
        //     $scope.viewData = $scope.sourceData;
        // }else {
            if(!systemCache) {
                systemCache = $cacheFactory('system');
            }
            $http({
                method: 'GET',
                url : ApiCtrl.get('systemLog')
            }).success(function (result) {
                if(result && result.code == 200) {
                    $scope.sourceData = result.data;
                    $scope.viewData = result.data;
                    systemCache.put('list', result.data);
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
