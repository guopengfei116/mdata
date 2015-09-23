var tooltip = require('Tooltip');

/*
 *  account edit控制器
 * */
oasgames.mdataControllers.controller('AccountEditCtrl', [
    '$scope',
    '$cacheFactory',
    '$route',
    'Account',
    'Application',
    'MdataVerify',
    function ($scope, $cacheFactory, $route, Account, Application, MdataVerify) {

        // 所有的app列表
        $scope.appsData = [];

        // 所有已选的app列表
        $scope.selectedAppids = [];

        // 当前account的数据
        $scope.accountSourceData = {};

        // 初始account的email值
        $scope.accountEmail = "";

        // 当前编辑的accountId
        $scope.accountId = $route.current.params.accountId;

        /*
         * 如果有id，则说明是编辑状态
         * accountId先写死方便调试获取json-data
         * */
        if($scope.accountId) {
            $scope.accountId = 'account_info';
            initAccountData();
        }else {
            initSelectData();
        }

        // getAccount数据
        function initAccountData () {
            Account.get(
                {accountId: $scope.accountId},
                function (result) {
                    if(result && result.code == 200) {
                        $scope.accountSourceData = result.data;
                        $scope.accountEmail = result.data.username;
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
            if(!$scope.accountSourceData['as_report_admin']) {
                $scope.accountSourceData['as_report_admin'] = [];
            }
            if(!$scope.accountSourceData['as_report_viewer']) {
                $scope.accountSourceData['as_report_viewer'] = [];
            }
        }

        // getApp列表数据
        (function () {
            var AppCache = $cacheFactory.get('app');
            if(AppCache && AppCache.get('list')) {
                $scope.appsData = AppCache.get('list');
            }else {
                AppCache = $cacheFactory('app');
                // 异步获取
                Application.query().$promise.then(
                    function (result) {
                        if(result && result.code == 200) {
                            $scope.appsData = result.data;
                            AppCache.put('list', result.data);
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

            // 调试期只能暂用get方法，测试期需要修改method方法为对应fn
            var submitMethod = 'get';

            //表单失去焦点时错误提示
            $scope.blur = function(type, $errors){

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
             * 提交
             * 创建提交的数据中id为空，
             * 编辑提交的数据不为空
             * */
            $scope.submit = function () {
                //判断邮箱
                if(!MdataVerify.submit('email', $scope['accountForm']['email'].$error,$scope)){
                    return;
                }
                //判断用户名
                if(!MdataVerify.submit('accountName', $scope['accountForm']['accountName'].$error,$scope)){
                    return;
                }
                //判断密码
                if(!MdataVerify.submit('acountPassword', $scope['accountForm']['acountPassword'].$error,$scope)){
                    return;
                }
                Account[submitMethod](
                    {accountId: $scope.accountId},
                    $scope.accountSourceData,
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
