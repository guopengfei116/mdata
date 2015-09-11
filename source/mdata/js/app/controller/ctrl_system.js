/*
 *  system log控制器
 * */
oasgames.mdataPanelControllers.controller('systemLogCtrl', [
    '$scope',
    '$http',
    '$timeout',
    'ApiCtrl',
    'Filter',
    function ($scope, $http, $timeout, ApiCtrl, Filter) {
        var searchTimer = null;

        //数据模型
        $scope.dataLogs = [];
        //数据模型模板动态映射
        $scope.logs = [];

        //数据初始化
        $http({
            method: 'GET',
            url : ApiCtrl.get('systemLog')
        }).success(function (result) {
            if(result.code == 200) {
                $scope.dataLogs = result.data;
                $scope.logs = $scope.dataLogs;
            }else {
                Ui.alert(result.msg);
            }
        }).error(function () {
            Ui.alert('数据获取失败，请稍后再试！');
        });

        //排序数据模型
        $scope.sort = {
            systemList : {
                filter : '',
                orderKey : 'time',
                isDownOrder : false
            }
        };

        // 修改排序规则
        $scope.changeListSort = function (type, orderKey) {
            if($scope.sort[type].orderKey == orderKey) {
                $scope.sort[type].isDownOrder = !$scope.sort[type].isDownOrder;
            }else {
                $scope.sort[type].orderKey = orderKey;
            }
        };

        //搜索
        $scope.search = function () {
            $timeout.cancel(searchTimer);
            searchTimer = $timeout(function () {
                var searchVal = searchForm.searchInput.value;

                // searchVal == null || searchVal == ' '
                if(!searchVal || !searchVal.trim()) {
                    $scope.logs = $scope.dataLogs;
                }else {
                    $scope.logs = Filter($scope.dataLogs, {account : searchVal, operation : searchVal});
                }
            }, 200);
        }
    }
]);
