
/*
 *  report view控制器
 * */
oasgames.mdataControllers.controller('reportViewCtrl', [
    '$scope',
    '$route',
    'REPORT_DATE_RANGE',
    'Report',
    'OrderHandler',
    function ($scope, $route, reportDateRanges, Report, OrderHandler) {

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
                    require('reportViewDate')($scope.reportSourceData['date_begin'], $scope.reportSourceData['date_end'], $scope.reportSourceData['create_time']);
                }else {
                    Ui.alert(result.msg);
                }
            },
            function () {
                Ui.alert('网络错误');
            }
        );

        // 排序数据模型
        $scope.sort = {
            reportTable : {
                filter : '',
                orderKey : 0,
                isDownOrder : false
            }
        };

        // 修改排序规则
        $scope.changeSort = function (type, orderKey) {
            console.log(orderKey);
            OrderHandler.change($scope.sort, type, orderKey);
        };

        // load report
        (function () {

            // 获取一组checkbox的值
            function getCheckedBoxValue (wrapSelector) {
                var val = [];
                var $checkboxs = $(wrapSelector).find('.checkbox');
                $checkboxs.each(function () {
                    var $this = $(this);
                    if($this.attr('checked')) {
                        val.push($this.data("value"));
                    }
                });
                return val;
            }

            // 重新加载report—view
            $scope.loadReport = function () {
                Report.get(
                    {
                        reportId : $scope.reportId,
                        dimension : getCheckedBoxValue('.field-dimension'),
                        filter : getCheckedBoxValue('.field-filter')
                    },
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
            };
        })();
    }
]);
