
/*
 *  application manage控制器
 * */
oasgames.mdataControllers.controller('ApplicationManageCtrl', [
    '$rootScope',
    '$scope',
    'CACHE_SETTINGS',
    'Filter',
    'OrderHandler',
    'ApplicationCache',
    'Http',
    function ($rootScope, $scope, CACHE_SETTINGS, Filter, OrderHandler, ApplicationCache, Http) {

        // 定义default数据
        $scope.searchPlaceholder = 'Search AppName AppId...';
        $scope.sourceData = [];
        $scope.viewData = [];

        // getApp列表数据
        var appListCache = ApplicationCache.get();
        if(appListCache && $rootScope.applicationListCache && CACHE_SETTINGS.applicationListCache) {
            $scope.sourceData = appListCache;
            $scope.viewData = appListCache;
        }else {
            Http.appIndex(function (data) {
                $scope.sourceData = data;
                $scope.viewData = data;
            });
        }

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
                Ui.alert('Please contact your administrator to remove app.');
            };
        })();
    }
]);
