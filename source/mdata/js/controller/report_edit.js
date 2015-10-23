var tooltip = require('Tooltip');

/*
 *  report edit控制器
 * */
oasgames.mdataControllers.controller('reportEditCtrl', [
    '$rootScope',
    '$scope',
    '$route',
    '$location',
    'REPORT_DATE_RANGE',
    'REPORT_DIMENSION',
    'FILTER',
    'FILTER_COMPUTE_SIGN',
    'VALUE_TYPE',
    'VALUE_ARITHMETIC',
    'MdataVerify',
    'ReportCache',
    'Http',
    function ($rootScope, $scope, $route, $location, REPORT_DATE_RANGE, REPORT_DIMENSION, FILTER, FILTER_COMPUTE_SIGN, VALUE_TYPE, VALUE_ARITHMETIC, MdataVerify, ReportCache, Http) {

        /*
        * 常量
        * */
        (function () {
            // 日期范围可选列表-常量
            $scope.reportDateRanges = REPORT_DATE_RANGE;

            // dimension可选列表-常量
            $scope.reportDimensions = REPORT_DIMENSION;

            // report_filter可选列表-常量
            $scope.filters = FILTER;

            // report_filter支持的运算符-常量
            $scope.filterComputeSigns = FILTER_COMPUTE_SIGN;

            // report_value支持的类型-常量
            $scope.valueTypes = VALUE_TYPE;

            // report_value支持的算法-常量
            $scope.valueArithmetics = VALUE_ARITHMETIC;
        })();

        // 当前编辑的reportId
        $scope.reportId = $route.current.params.reportId;

        // 用于区分创建和编辑状态
        $scope.reportIsExisting = false;

        // 编辑report获取到的所有数据
        $scope.reportSourceData = {};

        /*
        * 可选列表初始化
        * */
        (function () {

            // 已选的guest_user数据列表
            $scope.selectedGuestUids = [];

            /*
             * 如果有id，则说明是编辑状态
             * */
            if($scope.reportId) {
                $scope.reportIsExisting = true;
                initReportData($scope.reportId);
            }else {
                initAppData();
            }

            /*
            * 编辑Report时获取某report的数据
            * */
            function initReportData (reportId) {
                Http.reportUpdate({
                    reportId : reportId
                }, function (data) {
                    $scope.reportSourceData = data;
                    $scope.appData = data['appDataList'];
                    $scope.guestUserValue = data['guestUserValue'];
                    $scope.guestUsers = data['guestUser'];
                    $scope.valueList = $scope.appData['val_list'];
                    $scope.reportName = data['reportData']['report_name'];
                    initSelectData();
                });
            }

            /*
             * 创建report时所需的数据，
             * 包含可选的app列表和app数据，
             * 这些app都是当前用户有管理权限的app。
             * 同时含有第一个app对应的guest_account可选列表数据
             * */
            function initAppData () {
                Http.reportCreate(function (data) {
                    $scope.appDataList = data['appDataList'];
                    $scope.appData = data['appDataList'][0];
                    $scope.guestUsers = data['guestUser'];
                    $scope.valueList = $scope.appData['val_list'];
                    initSelectData();
                });
            }

            /*
            * 初始化空值
            * */
            function initSelectData () {
                // 当前编辑的report数据信息
                if(!$scope.reportSourceData['reportData']) {
                    $scope.reportSourceData['reportData'] = {};
                }
                // 已选的value数据
                if(!$scope.reportSourceData['reportData']['values']) {
                    $scope.reportSourceData['reportData']['values'] = [];
                }
                // 已选的guest用户数据
                if(!$scope.reportSourceData['reportData']['guestUserValue']) {
                    $scope.reportSourceData['reportData']['guestUserValue'] = [];
                }
                // 已选的dimension数据
                if(!$scope.reportSourceData['reportData']['dimension']) {
                    $scope.reportSourceData['reportData']['dimension'] = []
                }
                // 已选的filter数据
                if(!$scope.reportSourceData['reportData']['filter']) {
                    $scope.reportSourceData['reportData']['filter'] = []
                }
                // 可选的app列表及其数据,当前用户可支配的app列表,创建report所需信息
                if(!$scope.appDataList) {
                    $scope.appDataList = [];
                }
                // 可选的app列表的部分数据
                $scope.appDataListInApp = [];
                for(var i = 0; i < $scope.appDataList.length; i++) {
                    $scope.appDataListInApp.push($scope.appDataList[i]['app']);
                }
                // report关联的app数据
                if(!$scope.appData) {
                    $scope.appData = {};
                }
                if(!$scope.appData['app']) {
                    $scope.appData['app'] = {};
                }
                // 可选的value
                if(!$scope.valueList) {
                    $scope.valueList = {};
                }
                // 已选的guest账号列表
                if(!$scope.guestUserValue) {
                    $scope.guestUserValue = [];
                }
                // 可选的guest账号列表
                if(!$scope.guestUsers) {
                    $scope.guestUsers = [];
                }
                // 已选的date值
                $scope.selectedDateValue = $scope.reportSourceData['reportData']['date'] || '';
                if($scope.selectedDateValue) {
                    $scope.selectedDateValue = $scope.reportDateRanges[$scope.selectedDateValue];
                }
            }
        })();

        // 选择application
        (function () {
            // getGuestUser数据
            function upGuestUserData (data) {
                Http.guestUser(data, function (data) {
                    $scope.guestUsers = data;
                });
            }

            /*
            * 根据选择的appId更新valueList和guestUser
            * */
            $('.report-page').on('click', '.select_content_list_value-select-app', function () {
                $scope.selectedAppId = $(this).data('value');
                $scope.$apply(function () {
                    if(!$scope.selectedAppId && !$scope.appDataList.length) {
                        console.log('无法更新valueList，selectedAppId：' + $scope.selectedAppId + ',appDataList：' + $scope.appDataList);
                        return;
                    }
                    upGuestUserData({ appid : $scope.selectedAppId });
                    for(var i = 0; i < $scope.appDataList.length; i++) {
                        if($scope.selectedAppId == $scope.appDataList[i]['app'].appid) {
                            $scope.valueList = $scope.appDataList[i]['val_list'];
                            break;
                        }
                    }
                });
            });
        })();

        // dimension拖拽
        $scope.$on('dimensionRenderFinished', function (e) {
            var sortableContainer = $('.dimension-sortable');
            sortableContainer.sortable().bind('sortupdate', function () {
                var flagText = sortableContainer.find('.flag-text');

                // 重构resultValue值
                console.log($scope.reportSourceData['reportData']['dimension']);
                flagText.each(function (i, e) {
                    var val = $(this).data('value');
                    $scope.reportSourceData['reportData']['dimension'][i] = val;
                });
                console.log($scope.reportSourceData['reportData']['dimension']);

                $('.field-common-dimension').data('value', $scope.reportSourceData['reportData']['dimension']);
            });
        });

        // 事件处理、表单效验
        (function () {
            //判断report_name重复 1为重复
            var flag = 1;

            /*
            * @method reportName表单验证
            * @* 1.验证app是否选取
            * @* 2.验证reportName是否填写
            * @* 3.接口验证
            * */
            $scope.blur = function(type, $errors){
                if(MdataVerify.blur(type, $errors, $scope)){
                    var app_id = $scope.selectedAppId || $scope.reportSourceData['reportData']['appid'];
                    if(!app_id) {
                        Ui.alert('Application Name must not be empty');
                        return;
                    }
                    var report_name = $scope.reportSourceData['reportData']['report_name'];
                    if($scope.reportName === report_name) {
                        flag = 0;
                        return;
                    }
                    Http.checkReportName({
                        'appId' : app_id,
                        'report_name' : report_name
                    }).success(function (result) {
                        if(result && result.code == 200) {
                            flag = 0;
                        }else {
                            flag = 1;
                            Ui.alert("Report Name Repeat!");
                        }
                    });
                }
            };

            /*
            * 编辑提交
            * */
            $scope.submit = function () {

                //判断app Name，只在创建report时进行判断
                if(!$scope.selectedAppId && !$scope.reportId){
                     Ui.alert("Application Name must not be empty");
                     return false;
                }

                //判断Report Name
                if(!MdataVerify.submit('reportName', $scope["reportFrom"]["reportName"].$error, $scope)){
                    return false;
                }

                //判断Column
                if($.trim( $('.field-common-value').data('value')) == ""){
                     Ui.alert("Value group must not be empty");
                     return;
                }

                //判断name重复
                if(flag == 1){
                    Ui.alert("Report Name Repeat!");
                    return false;
                }
                
                // 提交数据
                var result = {};
                result.appid = $scope.selectedAppId;
                if($scope.reportId) {
                    result.id = $scope.reportId;
                    result.appid = $scope.reportSourceData['reportData']['appid'];
                }
                result.report_name = $scope.reportSourceData['reportData']['report_name'];
                result.describe = $scope.reportSourceData['reportData']['describe'];
                result.dimension = $('.field-common-dimension').data('value');
                result.filter = $('.field-common-filter').data('value');
                result.guest_uid = $('.field-common-guest').data('value');
                result.values = $('.field-common-value').data('value');
                result.date = $('.select-date').data('value');

                Http.reportSave(result, function (data) {
                    result.id = data.reportId || result.id;
                    if($rootScope.reportListCache) {
                        if(!ReportCache.addItem(result)) {
                            $rootScope.reportListCache = false;
                        }
                    }
                    Ui.alert('success', function () {
                        $scope.$apply(function () {
                            $location.path('/report/manage/view/' + result.id);
                        });
                    });
                });
            };

            /*
             * 取消提交
             * 返回report管理页面，
             * */
            $scope.cancel = function(){
                Ui.confirm('Confirm to cancel the operation？', function () {
                    $scope.$apply(function () {
                        $location.path('/report/manage');
                    });
                });
            }
        })();
    }
]);
