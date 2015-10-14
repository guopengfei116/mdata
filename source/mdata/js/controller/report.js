
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

        // report权限
        $scope.permission = $rootScope.user['authority'] == 1 ? 1 : $rootScope.reportPermission && $rootScope.reportPermission[$scope.reportId];

        // 日期组件
        var dataInstance = null;

        // get report数据
        $http({
            method : "POST",
            url : ApiCtrl.get('reportView'),
            data : {
                reportId : $scope.reportId
            }
        }).success(function (result) {
            if(result && result.code == 200) {
                $scope.reportSourceData = result.data;

                // 初始化日期插件
                var dataComponent = require('reportViewDate');
                var config = {}, tempConfig = {};
                tempConfig.startTime = $scope.reportSourceData['date_begin'];
                tempConfig.endTime = $scope.reportSourceData['date_end'];

                // time == null
                for(var timeK in tempConfig) {
                    if(tempConfig[timeK]) {
                        config[timeK] = parseInt(tempConfig[timeK]) * 1000; // 服务端传回数值为秒
                    }
                }
                dataInstance = new dataComponent(config);
            }
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
            OrderHandler.change($scope.sort, type, orderKey);
        };

        // 日期select与input联动更新
        (function () {
            $('.select-data').on('click', '.select_content_list_value', function () {
                var val = $(this).data('value');
                dataInstance.changeData(val);
            });
        })();

        // load report
        (function () {

            /*
            * @method 获取含有checked属性值的checkbox的值
            * @param {Selector} wrapSelector checkbox的作用域Dom选择器
            * @return {Array}
            * */
            function getCheckedBoxValue (wrapSelector) {
                var val = [];
                var $checkboxs = $(wrapSelector).find('.checkbox');
                $checkboxs.each(function () {
                    var $this = $(this);
                    if($this.attr('checked')) {
                        val.push($this.data("value"));
                    }
                });
                if(!val.length) {
                    val = 0;
                }
                return val;
            }

            // 重新加载report—view
            $scope.loadReport = function () {
                $http({
                    method : "POST",
                    url : ApiCtrl.get('reportView'),
                    data : {
                        reportId : $scope.reportId,
                        dimension : getCheckedBoxValue('.field-dimension'),
                        filter : getCheckedBoxValue('.field-filter'),
                        date_begin : new Date($('#reportStartDate').val()).getTime() / 1000,
                        date_end : new Date($('#reportEndDate').val()).getTime() / 1000
                    }
                }).success(function (result) {
                    if(result && result.code == 200) {
                        $scope.reportSourceData['table_list'] = result.data['table_list'];
                    }
                });
            };
        })();

        // export Excel
        (function () {

            var exportExcel = function () {
                var FileSaveAs = require('FileSaveAs').saveAs;
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
