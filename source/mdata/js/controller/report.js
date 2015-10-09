
/*
 *  report view控制器
 * */
oasgames.mdataControllers.controller('reportViewCtrl', [
    '$rootScope',
    '$scope',
    '$route',
    '$http',
    'REPORT_DATE_RANGE',
    'ApiCtrl',
    'Report',
    'OrderHandler',
    function ($rootScope, $scope, $route, $http, reportDateRanges, ApiCtrl, Report, OrderHandler) {

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

        // report权限
        $scope.permission = $rootScope.reportPermission && $rootScope.reportPermission[$scope.reportId];

        // 日期组件
        var dataComponent = require('reportViewDate');

        // get report数据
        $http({
            method : "GET",
            url : ApiCtrl.get('reportView'),
            data : {
                reportId : $scope.reportId,
            }
        }).success(function (result) {
            if(result && result.code == 200) {
                $scope.reportSourceData = result.data;
                dataComponent = new dataComponent({
                    startTime : $scope.reportSourceData['date_begin'],
                    endTime : $scope.reportSourceData['date_end'],
                    minTime : $scope.reportSourceData['create_time']
                });
            }else {
                Ui.alert(result.msg);
            }
        }).error(function () {
            Ui.alert('网络错误');
        });

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

        // 事件绑定
        (function () {
            $('.select-data').on('click', '.select_content_list_value', function () {
                var val = $(this).data('value');
                dataComponent.changeData(val);
                console.log(typeof val);
            });
        })();

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
                $http({
                    method : "GET",
                    url : ApiCtrl.get('reportView'),
                    data : {
                        reportId : $scope.reportId,
                        dimension : getCheckedBoxValue('.field-dimension').join('&'),
                        filter : getCheckedBoxValue('.field-filter').join('&'),
                        date_begin : new Date($('#reportStartDate').val()).getTime(),
                        date_end : new Date($('#reportEndDate').val()).getTime()
                    }
                }).success(function (result) {
                    if(result && result.code == 200) {
                        $scope.reportSourceData = result.data;
                    }else {
                        Ui.alert(result.msg);
                    }
                }).error(function () {
                    Ui.alert('网络错误');
                });
            };
        })();

        // export Excel
        (function () {
            var FileSaveAs = require('FileSaveAs').saveAs;
            var exportExcel = function () {
                FileSaveAs(
                    new Blob(
                        getVal(),
                        {type: "text/plain;charset=utf8"}
                    ),
                    'ReportTable.xls'
                );
            };
            var getVal = function () {
                var result = [], val = "\ufeff";   // \ufeff防止utf8 bom防止中文乱码
                var dataSource = $scope.reportSourceData['table_list'];
                var temp = null;
                for(var i = 0; i < dataSource.length; i++) {
                    console.log(dataSource[i]);
                    if(Object.prototype.toString.call(dataSource[i]) === '[object Array]') {
                        for(var j = 0; j < dataSource[i].length; j++) {
                            if(dataSource[i][j] == null) {  // 排空
                                dataSource[i][j] = '-';
                            }
                            if(j !== 0) {  // 非第一次
                                val += ',' + dataSource[i][j];
                                continue;
                            }
                            val += dataSource[i][j];
                        }
                    }else {
                        temp = 1;
                        for(var k in dataSource[i]) {
                            if(dataSource[i][k] == '') {  // 排空
                                dataSource[i][k] = '-';
                            }
                            if(temp !== 1) {  // 非第一次
                                val += ',' + dataSource[i][k];
                                continue;
                            }
                            val += dataSource[i][k];
                            temp++
                        }
                    }
                    val += ',\r\n';
                }
                result.push(val);
                return result;
            };
            $scope.reportExport = function () {
                exportExcel();
            };
        })();
    }
]);
