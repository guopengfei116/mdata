var tooltip = require('Tooltip');

/*
 *  application create控制器
 * */
oasgames.mdataControllers.controller('ApplicationEditCtrl', [
    '$scope',
    '$cacheFactory',
    '$route',
    'Application',
    'Account',
    'Filter',
    'MdataVerify',
    'TIME_ZONE',
    function ($scope, $cacheFactory, $route, Application, Account, Filter, MdataVerify, timeZone) {

        // 所有的account列表
        $scope.accountsData = [];

        // 所有已选的account列表
        $scope.selectedAccountuids = [];

        // 当前app的信息
        $scope.appSourceData = {};

        // 当前编辑的appId
        $scope.appId = $route.current.params.applicationId;

        //时区内容
        $scope.timeZones = timeZone;

        /*
         * 如果有id，则说明是编辑状态
         * accountId先写死方便调试获取json-data
         * */
        if($scope.appId) {
            $scope.appId = 'application_info';
            initAppData();
        }else {
            initSelectData();
        }

        // getApp数据
        function initAppData () {
            Application.get(
                {appId: $scope.appId},
                function (result) {
                    if(result && result.code == 200) {
                        $scope.appSourceData = result.data;
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

        // 排除空值
        function initSelectData () {
            if(!$scope.appSourceData['reportAdmin']) {
                $scope.appSourceData['reportAdmin'] = [];
            }
            if(!$scope.appSourceData['reportViewer']) {
                $scope.appSourceData['reportViewer'] = [];
            }
        }

        // getAccount列表数据
        (function () {
            var accountCache = $cacheFactory.get('account');
            if(accountCache && accountCache.get('list')) {
                $scope.accountsData = accountCache.get('list');
            }else {
                accountCache = $cacheFactory('account');
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

            // 调试期只能暂用get方法，测试期需要修改method方法为对应fn
            var submitMethod = 'get';

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
                if($.trim($(".fieldset-processor").html()) == ""){
                    Ui.alert("Processor must not be empty");
                    return;
                }
                console.log($scope.appSourceData);
                $scope.appSourceData.timeZone = $('.select.app-zone').data('value');
                $scope.appSourceData["reportAdmin"] = $(".field-account").data('value');
                $scope.appSourceData["reportViewer"] = $(".field-account").next().data('value');
                Application[submitMethod](
                    {appId: $scope.appId},
                    $scope.appSourceData,
                    function (result) {
                        if(result && result.code == 200) {
                            Ui.alert('success', function () {
                                history.back();
                            });
                        }else {
                            Ui.alert(result.msg);
                        }
                    },
                    function () {
                        Ui.alert('网络错误');
                    }
                )
            };
        })();
    }
]);
