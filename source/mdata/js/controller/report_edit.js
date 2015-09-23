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

        // 日期范围可选列表
        $scope.reportDateRanges = reportDateRanges;

        // dimension可选列表
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
