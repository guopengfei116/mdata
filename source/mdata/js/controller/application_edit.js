var tooltip = require('Tooltip');

/*
 *  application create控制器
 * */
oasgames.mdataControllers.controller('ApplicationEditCtrl', [
    '$rootScope',
    '$scope',
    '$cacheFactory',
    '$route',
    '$http',
    '$location',
    'PROCESSOR',
    'TIME_ZONE',
    'Account',
    'Filter',
    'MdataVerify',
    'ApiCtrl',
    'ApplicationCache',
    'Http',
    function ($rootScope, $scope, $cacheFactory, $route, $http, $location, processors, timeZone, Account, Filter, MdataVerify, ApiCtrl, ApplicationCache, Http) {

        // processor可选列表-常量
        $scope.processors = processors;

        // 时区可选列表-常量
        $scope.timeZones = timeZone;

        // 所有的account列表
        $scope.accountsData = [];

        // 所有已选的account列表
        $scope.selectedAccountuids = [];

        // 当前app的信息
        $scope.appSourceData = {};

        // 当前编辑的appId
        $scope.appId = $route.current.params.applicationId;

        // 用于区分创建和编辑状态
        $scope.appIsExisting = false;

        /*
         * 如果有id，则说明是编辑状态
         * accountId先写死方便调试获取json-data
         * */
        if($scope.appId) {
            $scope.appIsExisting = true;
            initAppData();
        }else {
            initSelectData();
        }

        // getApp数据
        function initAppData () {
            Http.appIndex({
                appid : $scope.appId
            }, function (data) {
                $scope.appSourceData = data[0];
                var proce = [];
                for(var i=0; i< $scope.appSourceData.proce.length; i++){
                    tempName = $scope.appSourceData['proce'][i].name;
                    tempEvent = $scope.appSourceData['proce'][i].event;
                    if(tempName && tempEvent) {
                        proce.push(tempName + "#@DELIMITER@#" + tempEvent);
                    }
                }
                $scope.appSourceData['proce'] = proce;
                initSelectData();
            });
        }

        // 排除空值
        function initSelectData () {
            if(!$scope.appSourceData['appadmin']) {
                $scope.appSourceData['appadmin'] = [];
            }
            if(!$scope.appSourceData['appuser']) {
                $scope.appSourceData['appuser'] = [];
            }
            if(!$scope.appSourceData['proce']) {
                $scope.appSourceData['proce'] = [];
            }
        }

        // getAccount列表数据
        Http.appUserList(function (data) {
            $scope.accountsData = data;
        });

        // 事件处理、表单效验
        (function () {
            $scope.tooltip = new tooltip({'position':'rc'}).getNewTooltip();

            // 表单失去焦点时错误提示
            $scope.blur = function(type, $errors){
                MdataVerify.blur(type, $errors, $scope);
            };

            // 表单焦点时清除错误提示
            $scope.focus = function (type) {
                $scope[type + 'Error'] = false;
                if($scope.tooltip.errorType == type) {
                    $scope.tooltip.hide();
                }
            };

            /*
             * 提交
             * 创建提交的数据中id为空，
             * 编辑提交的数据不为空
             * */
            $scope.submit = function () {

                if(!MdataVerify.submit('appName',$scope["appCreate"]["appName"].$error,$scope)){
                    return;
                }

                if($.trim($(".field-account").next().next().data('value')) == ""){
                    Ui.alert("Processor must not be empty");
                    return;
                }

                // 提交数据
                var httpApp = {}, subMethod = 'appCreate';
                httpApp.timezone = $(".field-app-zone .app-zone").data('value');
                if($scope.appId) {
                    httpApp.appid = $scope.appId;
                    subMethod = 'appUpdate';
                    httpApp.timezone = $scope.appSourceData.timezone;
                }
                httpApp.appname = $scope.appSourceData.appname;                
                httpApp.appadmin = $(".field-account").data('value');
                httpApp.appuser = $(".field-account").next().data('value');
                httpApp.proce = $(".field-account").next().next().data('value');

                Http[subMethod](result, function (data) {
                    delete httpApp.proce;
                    result.appid = $scope.appId || data.appid;
                    httpApp.appadmin = $(".field-account").data('cacheValue');
                    httpApp.appuser = $(".field-account").next().data('cacheValue');
                    if(ApplicationCache.addItem(httpApp)) {
                        $rootScope.applicationListCache = true;
                    }else {
                        $rootScope.applicationListCache = false;
                    }
                    Ui.alert('success', function () {
                        $scope.$apply(function () {
                            $location.path('/application/manage');
                        });
                    });
                });
            };

            /*
             * 取消提交
             * 返回application管理页面，
             * */
            $scope.cancel = function(){
                Ui.confirm('Confirm to cancel the operation？', function () {
                    $scope.$apply(function () {
                        $location.path('/application/manage');
                    });
                });
            }
        })();
    }
]);
