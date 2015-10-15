
/*
 *  account manage控制器
 * */
oasgames.mdataControllers.controller('AccountManageCtrl', [
    '$scope',
    '$timeout',
    '$cacheFactory',
    '$http',
    'Filter',
    'OrderHandler',
    'ApiCtrl',
    function ($scope, $timeout, $cacheFactory, $http, Filter, OrderHandler, ApiCtrl) {

        // 定义default数据
        $scope.searchPlaceholder = 'Search Name Email...';
        $scope.sourceData = [];
        $scope.viewData = [];

        // getAccount列表数据
        var accountCache = $cacheFactory.get('account');
        // if(accountCache && accountCache.get('list')) {
        //     $scope.sourceData = accountCache.get('list');
        //     $scope.viewData = $scope.sourceData;
        // }else {
            if(accountCache) {
                console.log(accountCache);
            }else {
                accountCache = $cacheFactory('account');
            }
            
        // 异步获取
        $http({
            url: ApiCtrl.get('userIndex'),
            method: 'GET'
        }).success(function (result) {
            if(result && result.code == 200) {
                $scope.sourceData = result.data;
                $scope.viewData = result.data;
                accountCache.put('list', result.data);
            }
        });

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
                $http({
                    url:  ApiCtrl.get('userDelete'),
                    method: 'POST',
                    data: {uid : accountId},
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function(data){
                        return $.param(data);
                    }
                }).success(function (result) {
                    if(result && result.code == 200) {
                        Ui.alert('删除成功');
                    }else {
                        Ui.alert('删除失败');
                    }
                });
            });
        };
    }
]);
