/*
 *  system log控制器
 * */
oasgames.mdataPanelControllers.controller('systemLogCtrl', [
    '$scope',
    '$http',
    '$timeout',
    'ApiCtrl',
    'Filter',
    'OrderHandler',
    function ($scope, $http, $timeout, ApiCtrl, Filter, OrderHandler) {

        //定义default数据
        $scope.searchPlaceholder = 'Search Account Operation...';
        $scope.sourceData = [];
        $scope.viewData = [];

        //展示列表数据初始化
        $http({
            method: 'GET',
            url : ApiCtrl.get('systemLog')
        }).success(function (result) {
            if(result.code == 200) {
                $scope.sourceData = result.data;
                $scope.viewData = $scope.sourceData;
            }else {
                Ui.alert(result.msg);
            }
        }).error(function () {
            Ui.alert('数据获取失败，请稍后再试！');
        });

        //搜索自定义处理函数
        $scope.searchHandler = function (searchVal) {
            $scope.viewData = Filter($scope.sourceData, {email : ['account', 'email', searchVal], operation : searchVal});
        };

        //排序数据模型
        $scope.sort = {
            systemList : {
                filter : '',
                orderKey : 'time',
                isDownOrder : false
            }
        };

        //修改排序规则
        $scope.changeSort = function (type, orderKey) {
            OrderHandler.change($scope.sort, type, orderKey);
        };
    }
]);
