
/*
 *  account manage控制器
 * */
oasgames.mdataControllers.controller('AccountManageCtrl', [
    '$rootScope',
    '$scope',
    'CACHE_SETTINGS',
    'Filter',
    'OrderHandler',
    'AccountCache',
    'Http',
    function ($rootScope, $scope, CACHE_SETTINGS, Filter, OrderHandler, AccountCache, Http) {

        // 定义default数据
        $scope.searchPlaceholder = 'Search Name Email...';
        $scope.sourceData = [];
        $scope.viewData = [];

        // getAccount列表数据
        var accountListCache = AccountCache.get();
        if(accountListCache && $rootScope.accountListCache && CACHE_SETTINGS.accountListCache) {
            $scope.sourceData = accountListCache;
            $scope.viewData = accountListCache;
        }else {
            Http.userIndex(function (data) {
                $scope.sourceData = data;
                $scope.viewData = data;
            });
        }

        // 搜索自定义处理函数
        $scope.searchHandler = function (searchVal) {
            $scope.viewData = Filter($scope.sourceData, {nickname : searchVal, username : searchVal});
        };

        // 排序数据模型
        $scope.sort = {
            appList : {
                filter : '',
                orderKey : 'username',
                isDownOrder : false
            },
            adminReports : {
                orderKey : 'appname',
                isDownOrder : false
            },
            viewerReports : {
                orderKey : 'appname',
                isDownOrder : false
            }
        };

        // 修改排序规则
        $scope.changeSort = function (type, orderKey) {
            OrderHandler.change($scope.sort, type, orderKey);
        };

        // 删除account
        $scope.delete = function (accountId, username) {
            Ui.confirm('Do you want to delete this account?', function () {
                Http.userDelete({
                    uid : accountId,
                    username : username
                }, function () {
                    AccountCache.deleteItem(accountId);
                    Ui.alert('success');
                });
            });
        };
    }
]);
