/*
 *  report manage控制器
 * */
oasgames.mdataPanelControllers.controller('reportManageCtrl', [
    '$rootScope',
    '$scope',
    'Report',
    'Filter',
    function ($rootScope, $scope, Report, Filter) {
        //权限
        $scope.authority = $rootScope.user['authority'];

        //定义default数据
        $scope.searchPlaceholder = 'Search appName appId...';
        $scope.sourceData = [];
        $scope.viewData = [];

        //展示列表数据初始化
        $scope.sourceData = Report.query().$promise.then(function (data) {
            $scope.sourceData = data.data;
            $scope.viewData = $scope.sourceData;
        });

        //搜索自定义处理函数
        $scope.searchHandler = function (searchVal) {
            $scope.viewData = Filter($scope.sourceData, {appName : searchVal});
        };
    }
]);

/*
 *  report create控制器
 * */
oasgames.mdataPanelControllers.controller('reportCreateCtrl', [
    '$scope',
    function ($scope) {

    }
]);

/*
 *  report edit控制器
 * */
oasgames.mdataPanelControllers.controller('reportEditCtrl', [
    '$scope',
    function ($scope) {

    }
]);

/*
 *  report view控制器
 * */
oasgames.mdataPanelControllers.controller('reportViewCtrl', [
    '$scope',
    function ($scope) {

    }
]);