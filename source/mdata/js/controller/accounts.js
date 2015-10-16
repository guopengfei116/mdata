
/*
 *  account manage控制器
 * */
oasgames.mdataControllers.controller('AccountManageCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    'Filter',
    'OrderHandler',
    'ApiCtrl',
    'AccountCache',
    'Http',
    function ($rootScope, $scope, $http, Filter, OrderHandler, ApiCtrl, AccountCache, Http) {

        // 定义default数据
        $scope.searchPlaceholder = 'Search Name Email...';
        $scope.sourceData = [];
        $scope.viewData = [];

        // getAccount列表数据
        var accountListCache = AccountCache.get();
        if(accountListCache && $rootScope.accountListCache) {
            $scope.sourceData = accountListCache;
            $scope.viewData = accountListCache;
        }else {
            Http.userIndex(function (data) {
                AccountCache.set(data);
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
        $scope.delete = function (accountId) {
            Ui.confirm('确定要删除这个账号吗', function () {
                Http.userDelete({
                    uid : accountId
                }, function () {
                    AccountCache.deleteItem(accountId);
                    Ui.alert('success');
                });
            });
        };
    }
]);
