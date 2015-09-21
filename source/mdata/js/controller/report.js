var tooltip = require('Tooltip');
/*
 *  report manage控制器
 * */
oasgames.mdataControllers.controller('reportManageCtrl', [
    '$rootScope',
    '$scope',
    '$cacheFactory',
    'Report',
    'Filter',
    function ($rootScope, $scope, $cacheFactory, Report, Filter) {

        // 权限
        $scope.authority = $rootScope.user['authority'];

        // 定义default数据
        $scope.searchPlaceholder = 'Search AppName ReportName...';
        $scope.sourceData = [];
        $scope.viewData = [];

        // 用于存储每个report默认展示状态
        $scope.reportsShow = [];

        // 展示列表数据初始化
        $scope.sourceData = Report.query().$promise.then(function (data) {
            $scope.sourceData = data.data;
            $scope.viewData = $scope.sourceData;

            // 初始化展示状态
            upReportsListShow();
        });

        /*
        * 更新report列表的展示状态，
        * 一个app时展开，多个app时合并列表
        * */
        function upReportsListShow (reportsList) {
            var reportsList = reportsList || $scope.viewData;
            if(reportsList && reportsList.length > 1) {
                for(var i = 0; i < reportsList.length; i++) {
                    $scope.reportsShow[i] = false;
                }
            }else {
                for(var i = 0; i < reportsList.length; i++) {
                    $scope.reportsShow[i] = true;
                }
            }
        }

        /*
        * @暴漏的搜索处理函数
        * @param {String} searchVal
        * */
        $scope.searchHandler = function (searchVal) {

            // 依据appName匹配到的apps
            var matchedApps = Filter($scope.sourceData, {appname : searchVal});
            // 依据appName匹配到的apps
            var unmatchedApps = [];
            // 用于临时存放依据reportsName匹配到的reports
            var tmpMatchedReports = null;
            // 用于临时创建新的匹配对象，以避免修改源对象属性
            var tmpMatchedApps = null;

            /*
            * 得到未匹配的apps
            * */
            if(matchedApps && matchedApps.length) {
                for(var j = 0; j < $scope.viewData.length; j++) {
                    for(var i = 0; i < matchedApps.length; i++) {
                        if($scope.viewData[j] === matchedApps[i]) {
                            break;
                        }
                        if(j == $scope.sourceData.length - 1) {
                            unmatchedApps.push($scope.sourceData[j]);
                        }
                    }
                }
            }else {
                unmatchedApps = $scope.sourceData;
            }

            /*
            * 遍历未匹配的apps，查找其匹配的reports,
            * 如果有匹配的reports，则重置该app的reports属性，并添加至匹配的apps
            * */
            if(unmatchedApps && unmatchedApps.length) {
                for(var i = 0; i < unmatchedApps.length; i++) {
                    var tmpMatchedReports = Filter(unmatchedApps[i]['reports'], {report_name : searchVal});

                    // 为匹配到的reports重新创建一个app对象存储
                    if(tmpMatchedReports && tmpMatchedReports.length) {
                        if(Object.prototype.toString.call(matchedApps) !== '[object Array]') {
                            matchedApps = [];
                        }

                        // 初始化空对象
                        tmpMatchedApps = {};
                        $.extend(tmpMatchedApps, unmatchedApps[i]);
                        tmpMatchedApps['reports'] = tmpMatchedReports;
                        matchedApps.push(tmpMatchedApps);
                    }
                }
            }

            upReportsListShow(matchedApps);
            $scope.viewData = matchedApps;
        };

        // 事件处理
        (function () {
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
        })();
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
    'MdataVerify',
    function ($scope,MdataVerify) {
        $scope.tooltip = new tooltip({'position':'rc'}).getNewTooltip();

        // 事件处理、表单效验
        (function () {

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
        $scope.reportDateRanges = {};

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