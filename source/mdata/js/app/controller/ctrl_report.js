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
        $scope.searchPlaceholder = 'Search AppName ReportName...';
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

        //删除account
        $scope.delete = function (reportId) {
            Ui.confirm('确定要删除这个report吗', function () {
                Report.save(
                    {reportId : reportId},
                    {reportId : reportId},
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