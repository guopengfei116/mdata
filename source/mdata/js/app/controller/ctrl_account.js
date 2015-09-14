/*
 *  account manage控制器
 * */
oasgames.mdataPanelControllers.controller('AccountManageCtrl', [
    '$scope',
    '$timeout',
    'Account',
    'Filter',
    'OrderHandler',
    function ($scope, $timeout, Account, Filter, OrderHandler) {

        //定义default数据
        $scope.searchPlaceholder = 'Search Name Email...';
        $scope.sourceData = [];
        $scope.viewData = [];

        //展示列表数据初始化
        $scope.sourceData = Account.query().$promise.then(function (data) {
            $scope.sourceData = data.data;
            $scope.viewData = $scope.sourceData;
        });

        //搜索自定义处理函数
        $scope.searchHandler = function (searchVal) {
            $scope.viewData = Filter($scope.sourceData, {name : searchVal, email : searchVal});
        };

        //排序数据模型
        $scope.sort = {
            appList : {
                filter : '',
                orderKey : 'email',
                isDownOrder : false
            },
            adminReports : {
                orderKey : 'name',
                isDownOrder : false
            },
            viewerReports : {
                orderKey : 'name',
                isDownOrder : false
            }
        };

        //修改排序规则
        $scope.changeSort = function (type, orderKey) {
            OrderHandler.change($scope.sort, type, orderKey);
        };
    }
]);

/*
 *  account create控制器
 * */
oasgames.mdataPanelControllers.controller('AccountCreateCtrl', [
    '$scope',
    function ($scope) {

    }
]);

/*
 *  account edit控制器
 * */
oasgames.mdataPanelControllers.controller('AccountEditCtrl', [
    '$scope',
    function ($scope) {

    }
]);