var tooltip = require('Tooltip');

/*
 *  application create控制器
 * */
oasgames.mdataControllers.controller('ApplicationEditCtrl', [
    '$scope',
    '$cacheFactory',
    '$route',
    'PROCESSOR',
    'TIME_ZONE',
    'Application',
    'Account',
    'Filter',
    'MdataVerify',
    function ($scope, $cacheFactory, $route, processors, timeZone, Application, Account, Filter, MdataVerify) {

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
        var httpAppid = $scope.appId = $route.current.params.applicationId;

        /*
         * 如果有id，则说明是编辑状态
         * accountId先写死方便调试获取json-data
         * */
        if($scope.appId) {
            initAppData();
        }else {
            initSelectData();
        }

        // getApp数据
        function initAppData () {
            // Application.get(
            //     {appId: $scope.appId},
            //     function (result) {
            //         if(result && result.code == 200) {
            //             $scope.appSourceData = result.data;
            //             initSelectData();
            //         }else {
            //             Ui.alert(result.msg);
            //         }
            //     },
            //     function () {
            //         Ui.alert('网络错误');
            //     }
            // );
            $http({
                url: ApiCtrl.get('appIndex')+'?uid='+httpAppid,
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            }).success(function (result) {
                if(result && result.code == 200) {
                    $scope.appSourceData = result.data;
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
            if(accountCache && accountCache.get('list')) {
                $scope.accountsData = accountCache.get('list');
            }else {
                if(accountCache){

                }else{
                    accountCache = $cacheFactory('account');
                }
                
                // 异步获取
                Account.query().$promise.then(
                    function (result) {
                        if(result && result.code == 200) {
                            $scope.accountsData = result.data;
                            accountCache.put('list', result.data);
                        }else {
                            Ui.alert(result.msg);
                        }
                    },
                    function () {
                        Ui.alert('网络错误');
                    }
                );
            }
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
                if($.trim($('.select.app-zone').data('value')) == ""){
                    Ui.alert('Time Zone must not be empty');
                    return;
                }
                if($scope.appSourceData.proce.length == 0){
                    Ui.alert("Processor must not be empty");
                    return;
                }
                $scope.appSourceData.timezone = $('.select.app-zone').data('value');
                $scope.appSourceData["appadmin"] = $(".field-account").data('value');
                $scope.appSourceData["appuser"] = $(".field-account").next().data('value');
                $scope.appSourceData["proce"] = $(".field-account").next().next().data('value');
                if($scope.appId){
                    httpAppUp.appid = $scope.appId;
                    $http({
                        url: ApiCtrl.get('appUpdate'),
                        method: 'POST',
                        data: httpAppUp,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function(data){
                            return $.param(data);
                        }
                    }).success(function (result) {
                        if(result && result.code == 200) {
                            Ui.alert('success', function () {
                                history.back();
                            });
                        }else {
                            Ui.alert(result.msg);
                        }
                    }).error(function (status) {
                        Ui.alert('网络错误！');
                    });
                }else{
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
                                history.back();
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
