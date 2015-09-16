/*
 *  report manage控制器
 * */
oasgames.mdataControllers.controller('reportManageCtrl', [
    '$rootScope',
    '$scope',
    'Report',
    'Filter',
    function ($rootScope, $scope, Report, Filter) {

        // 权限
        $scope.authority = $rootScope.user['authority'];

        // 定义default数据
        $scope.searchPlaceholder = 'Search AppName ReportName...';
        $scope.sourceData = [];
        $scope.viewData = [];

        // 分类提取app和report，便于搜索操作
        var apps = [], reports = [];
        function classify (data) {
            for(var i = 0; i < data.length - 1; i++) {
                apps.push(data[i]['app']);
                for(var j = 0; j < data[i]['reports'].length - 1; j++) {
                    reports.push(data[i]['reports'][j]);
                }
            }
        }

        // 展示列表数据初始化
        $scope.sourceData = Report.query().$promise.then(function (data) {
            $scope.sourceData = data.data;
            $scope.viewData = $scope.sourceData;
            classify($scope.viewData);
        });

        // 搜索自定义处理函数
        $scope.searchHandler = function (searchVal) {
            var matchedApps = Filter(apps, {name : searchVal});
            var matchedReports = Filter(reports, {name : searchVal});
        };

        // 删除account
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
oasgames.mdataControllers.controller('reportCreateCtrl', [
    '$scope',
    function ($scope) {

    }
]);

/*
 *  report edit控制器
 * */
oasgames.mdataControllers.controller('reportEditCtrl', [
    '$scope',
    function ($scope) {

    }
]);

/*
 *  report view控制器
 * */
oasgames.mdataControllers.controller('reportViewCtrl', [
    '$scope',
    function ($scope) {

    }
]);