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
        var httpApp = $scope.appSourceData = {};
        var httpAppUp = $scope.appSourceData;
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
                if(result && result.code == 200) {
                    $scope.appSourceData = result.data[0];
                    var proce = [];
                    for(var i=0; i< $scope.appSourceData.proce.length; i++){
                        proce.push($scope.appSourceData['proce'][i].name +"#@DELIMITER@#" +$scope.appSourceData['proce'][i].event);
                    }
                    $scope.appSourceData['proce'] = proce;
                    initSelectData();
                }else {
                    Ui.alert(result.msg);
                }
            }).error(function (status) {
                Ui.alert('网络错误！');
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
                    Ui.alert(result.msg);
                }
            }).error(function (status) {
                Ui.alert('网络错误');
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
                
                
                $scope.appSourceData["appadmin"] = $(".field-account").data('value');
                $scope.appSourceData["appuser"] = $(".field-account").next().data('value');
                $scope.appSourceData["proce"] = $(".field-account").next().next().data('value');

                if($.trim($(".field-account").next().next().data('value')) == ""){
                    Ui.alert("Processor must not be empty");
                    return;
                }

                if($scope.appId){  //编辑
                    httpApp = $scope.appSourceData;
                    console.log(httpApp);
                    $http({
                        url: ApiCtrl.get('appUpdate'),
                        method: 'POST',
                        data: httpApp
                    }).success(function (result) {
                        if(result && result.code == 200) {
                            Ui.alert('success', function () {
                                $location.path('/application/manage');
                                $rootScope.$apply();
                            });
                        }else {
                            Ui.alert(result.msg);
                        }
                    }).error(function (status) {
                        Ui.alert('网络错误！');
                    });
                }else{ //创建
                    $scope.appSourceData.timezone = $('.select.app-zone').data('value');
                    httpApp = $scope.appSourceData;
                    if($.trim($scope.appSourceData.timezone) == ""){
                        Ui.alert('Time Zone must not be empty');
                        return;
                    }
                    $http({
                        url: ApiCtrl.get('appCreate'),
                        method: 'POST',
                        data: httpApp,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function(data){
                            return $.param(data);
                        }
                    }).success(function (result) {
                        if(result && result.code == 200) {
                            Ui.alert('success', function () {
                                $location.path('/application/manage');
                                $rootScope.$apply();
                            });
                        }else {
                            Ui.alert(result.msg);
                        }
                    }).error(function (status) {
                        Ui.alert('网络错误！');
                    });
                }
            };
        })();
    }
]);
