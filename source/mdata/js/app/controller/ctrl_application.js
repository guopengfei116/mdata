/*
 *  application manage控制器
 * */
oasgames.mdataPanelControllers.controller('ApplicationManageCtrl', [
    '$scope',
    'Application',
    'Filter',
    'OrderHandler',
    function ($scope, Application, Filter, OrderHandler) {

        //定义default数据
        $scope.searchPlaceholder = 'Search AppName AppId...';
        $scope.sourceData = [];
        $scope.viewData = [];

        //展示列表数据初始化
        $scope.sourceData = Application.query().$promise.then(function (data) {
            $scope.sourceData = data.data;
            $scope.viewData = $scope.sourceData;
        });

        //搜索自定义处理函数
        $scope.searchHandler = function (searchVal) {
            $scope.viewData = Filter($scope.sourceData, {name : searchVal, id : searchVal});
        };

        //排序规则
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
    }
]);

/*
 *  application create控制器
 * */
oasgames.mdataPanelControllers.controller('ApplicationCreateCtrl', [
    '$scope',
    function ($scope) {

    }
]);

/*
 *  application edit控制器
 * */
oasgames.mdataPanelControllers.controller('ApplicationEditCtrl', [
    '$scope',
    function ($scope) {

    }
]);