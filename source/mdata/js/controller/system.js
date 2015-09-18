
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
        if(systemCache && systemCache.get('list')) {
            $scope.sourceData = systemCache.get('list');
            $scope.viewData = $scope.sourceData;
        }else {
            systemCache = $cacheFactory('system');
            $http({
                method: 'GET',
                url : ApiCtrl.get('systemLog')
            }).success(function (result) {
                if(result.code == 200) {
                    $scope.sourceData = result.data;
                    $scope.viewData = result.data;
                    systemCache.put('list', result.data);
                }else {
                    Ui.alert(result.msg);
                }
            }).error(function () {
                Ui.alert('数据获取失败，请稍后再试！');
            });
        }

        // 搜索自定义处理函数
        $scope.searchHandler = function (searchVal) {
            $scope.viewData = Filter($scope.sourceData, {email : ['account', 'email', searchVal], operation : searchVal});
        };

        // 排序数据模型
        $scope.sort = {
            systemList : {
                filter : '',
                orderKey : 'time',
                isDownOrder : false
            }
        };

        // 修改排序规则
        $scope.changeSort = function (type, orderKey) {
            OrderHandler.change($scope.sort, type, orderKey);
        };
    }
]);
