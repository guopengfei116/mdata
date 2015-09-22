
/*
 *  report view控制器
 * */
oasgames.mdataControllers.controller('reportViewCtrl', [
    '$scope',
    '$route',
    'REPORT_DATE_RANGE',
    'Report',
    function ($scope, $route, reportDateRanges, Report) {

        // report日期范围
        $scope.reportDateRanges = reportDateRanges;

        // 当前report的数据
        $scope.reportSourceData = {};

        // 当前编辑的reportId
        $scope.reportId = $route.current.params.reportId;

        // 当前编辑的reportId
        $scope.reportId = $route.current.params.reportId;

        if($scope.reportId) {
            $scope.reportId = 'report_view';
        }

        // get report数据
        Report.get(
            {reportId: $scope.reportId},
            function (result) {
                if(result && result.code == 200) {
                    $scope.reportSourceData = result.data;
                }else {
                    Ui.alert(result.msg);
                }
            },
            function () {
                Ui.alert('网络错误');
            }
        );
    }
]);
