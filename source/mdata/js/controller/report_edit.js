var tooltip = require('Tooltip');

/*
 *  report edit控制器
 * */
oasgames.mdataControllers.controller('reportEditCtrl', [
    '$scope',
    'REPORT_DATE_RANGE',
    'REPORT_DIMENSION',
    'COMPUTE_SIGN',
    'MdataVerify',
    function ($scope, reportDateRanges, reportDimensions, computeSigns, MdataVerify) {

        // report日期范围
        $scope.reportDateRanges = reportDateRanges;

        // report可选dimension
        $scope.reportDimensions = reportDimensions;

        // report_filter支持的运算符
        $scope.computeSigns = computeSigns;

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

        })();
    }
]);
