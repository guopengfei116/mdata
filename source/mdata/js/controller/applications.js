
/*
 *  application manage控制器
 * */
oasgames.mdataControllers.controller('ApplicationManageCtrl', [
    '$scope',
    '$cacheFactory',
    'Application',
    'Filter',
    'OrderHandler',
    function ($scope, $cacheFactory, Application, Filter, OrderHandler) {

        // 定义default数据
        $scope.searchPlaceholder = 'Search AppName AppId...';
        $scope.sourceData = [];
        $scope.viewData = [];

        // getApp列表数据
        var appCache = $cacheFactory.get('app');
        if(appCache && appCache.get('list')) {
            $scope.sourceData = appCache.get('list');
            $scope.viewData = $scope.sourceData;
        }else {
            appCache = $cacheFactory('app');
            // 异步获取
            Application.query().$promise.then(
                function (result) {
                    if(result && result.code == 200) {
                        $scope.sourceData = result.data;
                        $scope.viewData = result.data;
                        appCache.put('list', result.data);
                    }else {
                        Ui.alert(result.msg);
                    }
                },
                function () {
                    Ui.alert('网络错误');
                }
            );
        }

        // 搜索自定义处理函数
        $scope.searchHandler = function (searchVal) {
            $scope.viewData = Filter($scope.sourceData, {name : searchVal, appid : searchVal});
        };

        // 排序规则
        $scope.sort = {
            appList : {
                orderKey : 'name',
                isDownOrder : false
            },
            adminUsers : {
                orderKey : 'name',
                isDownOrder : false
            },
            viewerUsers : {
                orderKey : 'name',
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
                Ui.confirm('确定要删除这个app吗', function () {
                    Application.save(
                        {appId : appId},
                        {appId : appId},
                        function (result) {
                            if(result && result.code == 200) {
                                Ui.alert('删除成功');
                            }else {
                                Ui.alert('删除失败');
                            }
                        },
                        function () {
                            Ui.alert('网络错误');
                        }
                    );
                });
            };
        })();
    }
]);
