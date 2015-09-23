var tooltip = require('Tooltip');

/*
 *  report edit控制器
 * */
oasgames.mdataControllers.controller('reportEditCtrl', [
    '$scope',
    '$route',
    '$cacheFactory',
    'REPORT_DATE_RANGE',
    'REPORT_DIMENSION',
    'FILTER',
    'FILTER_COMPUTE_SIGN',
    'VALUE_TYPE',
    'VALUE_ARITHMETIC',
    'Report',
    'ApiCtrl',
    'MdataVerify',
    function ($scope, $route, $cacheFactory, reportDateRanges, reportDimensions, filters, filterComputeSigns, valueTypes, valueArithmetics, Report, ApiCtrl, MdataVerify) {

        // 日期范围可选列表-常量
        $scope.reportDateRanges = reportDateRanges;

        // dimension可选列表-常量
        $scope.reportDimensions = reportDimensions;

        // report_filter可选列表-常量
        $scope.filters = filters;

        // report_filter支持的运算符-常量
        $scope.filterComputeSigns = filterComputeSigns;

        // report_value支持的类型-常量
        $scope.valueTypes = valueTypes;

        // report_value支持的算法-常量
        $scope.valueArithmetics = valueArithmetics;

        // 无该report管理权限的账户
        $scope.guestUsers = [];

        // 当前report的信息
        $scope.reportSourceData = {};

        // 当前编辑的reportId
        $scope.reportId = $route.current.params.reportId;

        /*
         * 如果有id，则说明是编辑状态
         * accountId先写死方便调试获取json-data
         * */
        if($scope.reportId) {
            $scope.reportId = 'report_info';
            initReportData();
        }else {
            initGuestUserData();
        }

        // getReport数据
        function initReportData () {
            Report.get(
                {reportId: $scope.reportId},
                function (result) {
                    if(result && result.code == 200) {
                        $scope.reportSourceData = result.data;
                        $scope.guestUsers = result.data['guestUser'];
                        initSelectData();
                    }else {
                        Ui.alert(result.msg);
                    }
                },
                function () {
                    Ui.alert('网络错误');
                }
            );
        }

        // getGuestUser数据
        function initGuestUserData () {
            $http({
                method : "GET",
                url : ApiCtrl.get('guestUser')
            }).success(function (result) {
                if(result.code == 200) {
                    $scope.guestUsers = result.data;
                    initSelectData();
                }else {
                    Ui.alert(result.msg);
                }
            }).error(function () {
                Ui.alert('网络错误');
            });
        }

        // 排除空值
        function initSelectData () {
            if(!$scope.reportSourceData['appDataList']) {
                $scope.reportSourceData['appDataList'] = {};
            }
            if(!$scope.reportSourceData['appDataList']['app']) {
                $scope.reportSourceData['appDataList']['app'] = {};
            }
            if(!$scope.reportSourceData['appDataList']['val_list']) {
                $scope.reportSourceData['appDataList']['val_list'] = {};
            }
            if(!$scope.reportSourceData['reportData']) {
                $scope.reportSourceData['reportData'] = {};
            }
            if(!$scope.reportSourceData['reportData']['values']) {
                $scope.reportSourceData['reportData']['values'] = [];
            }
            if(!$scope.reportSourceData['reportData']['guestUserValue']) {
                $scope.reportSourceData['reportData']['guestUserValue'] = [];
            }
            if(!$scope.guestUsers) {
                $scope.guestUsers = [];
            }
        }

        // 事件处理、表单效验
        (function () {
            $scope.tooltip = new tooltip({'position':'rc'}).getNewTooltip();

            //表单失去焦点时错误提示
            $scope.blur = function(type, $errors){
                console.log($errors);
                MdataVerify.blur(type, $errors, $scope);
            };

            //表单焦点时清除错误提示
            $scope.focus = function (type) {
                $scope[type + 'Error'] = false;
                if($scope.tooltip.errorType == type) {
                    $scope.tooltip.hide();
                }
            };
            /*
            * 编辑提交
            * */
            $scope.submit = function () {
                //判断Report Name
                if(!MdataVerify.submit('accountName', $scope['reportFrom']['accountName'].$error,$scope)){
                    return;
                }
                //判断Column
                if($.trim($(".teatarea-column").html()) == ""){
                     Ui.alert("Column must not be empty");
                     return;
                }

            };

        })();
    }
]);
