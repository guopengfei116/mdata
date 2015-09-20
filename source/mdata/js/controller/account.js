var tooltip = require('Tooltip');
/*
 *  account manage控制器
 * */
oasgames.mdataControllers.controller('AccountManageCtrl', [
    '$scope',
    '$timeout',
    '$cacheFactory',
    'Account',
    'Filter',
    'OrderHandler',
    function ($scope, $timeout, $cacheFactory, Account, Filter, OrderHandler) {

        // 定义default数据
        $scope.searchPlaceholder = 'Search Name Email...';
        $scope.sourceData = [];
        $scope.viewData = [];

        // getAccount列表数据
        var accountCache = $cacheFactory.get('account');
        if(accountCache && accountCache.get('list')) {
            $scope.sourceData = accountCache.get('list');
            $scope.viewData = $scope.sourceData;
        }else {
            accountCache = $cacheFactory('account');
            // 异步获取
            Account.query().$promise.then(
                function (result) {
                    if(result && result.code == 200) {
                        $scope.sourceData = result.data;
                        $scope.viewData = result.data;
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

        // 搜索自定义处理函数
        $scope.searchHandler = function (searchVal) {
            $scope.viewData = Filter($scope.sourceData, {nickname : searchVal, username : searchVal});
        };

        // 排序数据模型
        $scope.sort = {
            appList : {
                filter : '',
                orderKey : 'username',
                isDownOrder : false
            },
            adminReports : {
                orderKey : 'appname',
                isDownOrder : false
            },
            viewerReports : {
                orderKey : 'appname',
                isDownOrder : false
            }
        };

        // 修改排序规则
        $scope.changeSort = function (type, orderKey) {
            OrderHandler.change($scope.sort, type, orderKey);
        };

        // 删除account
        $scope.delete = function (accountId) {
            Ui.confirm('确定要删除这个账号吗', function () {
                Account.save(
                    {accountId : accountId},
                    {accountId : accountId},
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
    }
]);


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
        
        $scope.tooltip = new tooltip({'position':'rc'}).getNewTooltip();
        // 所有的app列表
        $scope.appsData = [];
        $scope.selectedAppids = [12];

        // 当前account的数据
        $scope.accountSourceData = {};

        // 当前编辑的accountId
        $scope.accountId = $route.current.params.accountId;

        /*
        * 如果有id，则说明是编辑状态
        * accountId先写死方便调试获取json-data
        * */
        if($scope.accountId) {
            $scope.accountId = 'account_info';
            initAccountData();
        }

        // getAccount数据
        function initAccountData () {
            Account.get(
                {accountId: $scope.accountId},
                function (result) {
                    if(result && result.code == 200) {
                        $scope.accountSourceData = result.data;
                    }else {
                        Ui.alert(result.msg);
                    }
                },
                function () {
                    Ui.alert('网络错误');
                }
            );
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
