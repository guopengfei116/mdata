/*
 *  report manage控制器
 * */
oasgames.mdataPanelControllers.controller('reportManageCtrl', [
    '$scope',
    'Report',
    function ($scope, Report) {
        var searchTimer = null;

        //数据默认值
        $scope.searchPlaceholder = 'Search report...';
        $scope.sourceData = [];
        $scope.viewData = [];

        //展示列表数据初始化
        $scope.sourceData = Report.query().$promise.then(function (data) {
            $scope.sourceData = data.data;
            $scope.viewData = $scope.sourceData;
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