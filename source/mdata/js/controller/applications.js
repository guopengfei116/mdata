
/*
 *  application manage控制器
 * */
oasgames.mdataControllers.controller('ApplicationManageCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$cacheFactory',
    'Filter',
    'OrderHandler',
    'ApiCtrl',
    function ($rootScope, $scope, $http, $cacheFactory, Filter, OrderHandler, ApiCtrl) {

        // 定义default数据
        $scope.searchPlaceholder = 'Search AppName AppId...';
        $scope.sourceData = [];
        $scope.viewData = [];

        // getApp列表数据
        var appCache = $cacheFactory.get('app');
        // if(appCache && appCache.get('list')) {
        //     $scope.sourceData = appCache.get('list');
        //     $scope.viewData = $scope.sourceData;
        // }else {
            if(appCache) {
                console.log(appCache);
            }else {
                appCache = $cacheFactory('app');
            }
            // 异步获取
            $http({
                url: ApiCtrl.get('appIndex'),
                method: 'GET'
            }).success(function (result) {
                if(result && result.code == 200) {
                    $scope.sourceData = result.data;
                    $scope.viewData = result.data;
                    appCache.put('list', result.data);
                }
            });

        // 搜索自定义处理函数
        $scope.searchHandler = function (searchVal) {
            $scope.viewData = Filter($scope.sourceData, {appname : searchVal, appid : searchVal});
        };

        // 排序规则
        $scope.sort = {
            appList : {
                orderKey : 'appname',
                isDownOrder : false
            },
            adminUsers : {
                orderKey : 'nickname',
                isDownOrder : false
            },
            viewerUsers : {
                orderKey : 'nickname',
                isDownOrder : false
            }
        };

        // 修改排序规则
        $scope.changeSort = function (type, orderKey) {
            OrderHandler.change($scope.sort, type, orderKey);
        };

        // 事件处理
        (function () {
            // 删除app
            $scope.delete = function (appId) {
                Ui.alert('请联系系统管理员进行删除app操作');
            };
        })();
    }
]);
