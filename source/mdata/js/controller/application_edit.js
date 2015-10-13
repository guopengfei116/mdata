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
    function ($rootScope, $scope, $cacheFactory, $route, $http, $location, processors, timeZone, Account, Filter, MdataVerify,ApiCtrl) {

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
        var httpAppId = $scope.appId = $route.current.params.applicationId;

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
            $http({
                url: ApiCtrl.get('appIndex'),
                method: 'GET',
                params : {
                        appid : httpAppId,
                        time: new Date().getTime()
                    },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (result) {
                var tempName = '', tempEvent = '';
                if(result && result.code == 200) {
                    $scope.appSourceData = result.data[0];
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
                }else {
                    console.log(result);
                    Ui.alert(result.msg);
                }
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
        (function () {
            var accountCache = $cacheFactory.get('account');
            // if(accountCache && accountCache.get('list')) {
            //     $scope.accountsData = accountCache.get('list');
            // }else {
            if(accountCache){

            }else{
                accountCache = $cacheFactory('account');
            }
        
            $http({
                url: ApiCtrl.get('appUserList'),
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (result) {
                if(result && result.code == 200) {
                    $scope.accountsData = result.data;
                    accountCache.put('list', result.data);
                }else {
                    console.log(result);
                    Ui.alert(result.msg);
                }
            });
        })();

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
                var httpApp = {}, submitApi = ApiCtrl.get('appCreate');
                httpApp.timezone = $(".field-app-zone .app-zone").data('value');
                if($scope.appId) {
                    httpApp.appid = $scope.appId;
                    submitApi = ApiCtrl.get('appUpdate');
                    httpApp.timezone = $scope.appSourceData.timezone;
                }
                httpApp.appname = $scope.appSourceData.appname;                
                httpApp.appadmin = $(".field-account").data('value');
                httpApp.appuser = $(".field-account").next().data('value');
                httpApp.proce = $(".field-account").next().next().data('value');

                $http({
                    url: submitApi,
                    method: 'POST',
                    data: httpApp
                }).success(function (result) {
                    if(result && result.code == 200) {
                        Ui.alert('success', function () {
                            $scope.$apply(function () {
                                $location.path('/application/manage');
                            });
                        });
                    }else {
                        console.log(result);
                        Ui.alert(result.msg);
                    }
                });
            };
        })();
    }
]);
